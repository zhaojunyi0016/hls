import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ElectionEntity} from "../../entities/election.entity";
import {CandidateEntity} from "../../entities/candidate.entity";
import {CreaterElectionDto} from "../../dto/createrElectionDto";
import {AddCandidateDto} from "../../dto/addCandidateDto";
import {OpenOrCloseDto} from "../../dto/openOrCloseDto";
import {GetInfoDto} from "../../dto/getInfoDto";
import {VoteEntity} from "../../entities/vote.entity";
import {GetChooseInfoDto} from "../../dto/getChooseInfoDto";
import {InjectRedis, Redis} from "@svtslv/nestjs-ioredis";
import {GetFinalDto} from "../../dto/getFinalDto";
import {FinalResultVO} from "../../vo/finalResultVO";


/**
 * 管理用户服务类
 */
@Injectable()
export class AdminService {

    constructor(
        @InjectRepository(ElectionEntity)
        private electionRepository: Repository<ElectionEntity>,

        @InjectRepository(CandidateEntity)
        private candidateRepository: Repository<CandidateEntity>,

        @InjectRepository(VoteEntity)
        private voteRepository: Repository<VoteEntity>,

        @InjectRedis()
        private redis: Redis,
    ) {

    }


    /**
     * 创建一个选举, 提供后续添加候选人,并且开启/传播选举
     * @param param
     */
    async createrElection(param: CreaterElectionDto) {

        //先查询这个选举有没有重复
        const exist = await this.electionRepository.createQueryBuilder("election")
            .where("election.name = :name ", {name: param.name})
            .getOne();
        //存在则返回提示
        if (exist) {
            throw new HttpException('该选举已存在', 401);
        }

        //不存在着创建选举,并返回Id给前端, 后续添加选举人使用
        const electionEntity = new ElectionEntity();
        electionEntity.name = param.name;
        electionEntity.updateTime = new Date();
        electionEntity.createTime = new Date();
        const electionEntityPromise = await this.electionRepository.save(electionEntity);
        return electionEntityPromise.id;
    }


    /**
     * 添加候选人
     * step1 先查询选举状态,如果开启了,就不能继续添加候选人,再判断选举状态是否开启
     * step2 查询已经添加过的候选人, 对比入参候选人数组, 找出未添加到, 做保存入库
     * @param param
     */
    async addCandidate(param: AddCandidateDto) {
        //先查询选举状态, 如果开启了, 就不能继续添加候选人
        const election = await this.electionRepository.createQueryBuilder("election")
            .where("election.id = :id ", {id: param.electionId})
            .getOne();

        if (!election) {
            throw new HttpException('该选举id并未查到对应选举', 401);
        } else if (election.state == 1) {
            throw new HttpException('选举已开始,不能添加候选人', 401);
        }

        //查询已经添加的候选人sql
        let queryExistSql = "SELECT name as name FROM candidate where name in ( ";
        for (let i = 0; i < param.names.length; i++) {
            queryExistSql = queryExistSql + "'" + param.names[i] + "', ";
        }
        queryExistSql = queryExistSql.substring(0, queryExistSql.lastIndexOf(",")) + " )"
        const exist = await this.candidateRepository.query(queryExistSql);

        //查询结果添加到数组中
        const existDB: string[] = [];
        for (let i = 0; i < exist.length; i++) {
            //添加进 已存在数组中
            existDB.push(exist[i].name);
        }
        const reqNames: string[] = param.names;
        //从已经入库的数据中 和 入参数据比较  过滤出没有添加进候选人的数据,生成新数组
        const result = reqNames.filter(e => !existDB.includes(e)).concat(existDB.filter(e => !reqNames.includes(e)))


        //不存在需要保存的数据 则不执行以下代码
        if (result.length > 0) {
            //定义保存对象数组
            var sites: CandidateEntity[] = [];
            for (let i = 0; i < result.length; i++) {
                const string = result[i];
                const candidateEntity = new CandidateEntity();
                candidateEntity.electionId = param.electionId;
                candidateEntity.createTime = new Date();
                candidateEntity.updateTime = new Date();
                candidateEntity.name = string;
                sites.push(candidateEntity);
            }
            //保存数组数据
            await this.candidateRepository.save(sites);
            return result;
        }
        throw new HttpException('对应候选人已添加过,请勿重复添加', 401);
    }


    /**
     * 管理員⽤⼾可以控制選舉的開始和結束
     * @param param
     */
    async openOrClose(param: OpenOrCloseDto) {

        //先查看状态是否是2(已结束), 则不能再操作
        const election = await this.electionRepository.createQueryBuilder("election")
            .where("election.id = :id ", {id: param.electionId})
            .getOne();
        if (election) {
            if (2 == election.state) {
                throw new HttpException('选举已经结束', 401);
            }
        }


        //1:开启  2:关闭
        if (param.state != 0) {
            const result = await this.candidateRepository.createQueryBuilder("candidate")
                .where("candidate.election_id = :id ", {id: param.electionId})
                .getMany();
            //如果是开始,则需要判断人数是否超过2个
            if (!result.length) {
                throw new HttpException('暂时候选人,请添加候选人', 401);
            } else if (result.length && result.length < 2) {
                throw new HttpException('选举候选人低于2人,不能开启选举', 401);
            }
            const updateSql = "UPDATE election SET state = " + param.state + " where id = " + param.electionId;
            await this.electionRepository.query(updateSql);

            //如果是结束状态.则计算得票最多的候选人, 入库保存胜选方信息(name,id,对应票数)
            // 提供后续定时任务把对应选举查询出来给对应投票人发邮件通知结果
            if (param.state == 2) {
                const candidateEntities = await this.candidateRepository.query("select * from candidate where election_id = " + param.electionId);
                if (!candidateEntities[0]) {
                    throw new HttpException('选举不存在', 401);
                }

                let sql = "  select  count(candid_id) as count  , candid_name as candidName  , candid_id as candidId   from vote where candid_id in (";
                for (const element of candidateEntities) {
                    sql = sql + "'" + element.id + "', ";
                }
                sql = sql.substring(0, sql.lastIndexOf(",")) + " )  GROUP BY candid_id  ORDER BY count  desc limit 1 "
                console.log("sql===", sql);
                const result = await this.voteRepository.query(sql);

                console.log(result[0]);
                console.log(result[0].candidId);
                console.log(result[0].candidName);
                await this.electionRepository.createQueryBuilder()
                    .update(ElectionEntity)
                    .set({winer: result[0].candidName, winerId: result[0].candidId, count: result[0].count})
                    .where("id = :id", {id: param.electionId})
                    .execute();
            }
        }
    }


    /**
     * 管理员查看实时情况接口
     * @param param
     */
    async getInfo(param: GetInfoDto) {
        //查询选举存不存在
        const candidateEntities = await this.candidateRepository.query("select * from candidate where election_id = " + param.electionId);
        if (!candidateEntities[0]) {
            throw new HttpException('选举不存在', 401);
        }

        //查询该选举一共多少个候选人,  每个候选人分别查count多少
        //组合 查询sql
        let sql = "select count(candid_id) as count , candid_name   as candidName  from vote where candid_id in (";
        for (const element of candidateEntities) {
            sql = sql + "'" + element.id + "', ";
        }
        sql = sql.substring(0, sql.lastIndexOf(",")) + " )  GROUP BY candid_id"

        const result = await this.voteRepository.query(sql);
        return result;
    }

    /**
     * 查看指定候选人的投票用户情况
     * @param param
     */
    async getChooseInfo(param: GetChooseInfoDto) {
        const result = await this.voteRepository.createQueryBuilder("vote")
            .where("vote.election_id = :electionId ", {electionId: param.electionId})
            .andWhere("vote.candid_id = :candidId ", {candidId: param.candidId})
            .skip(param.pageSize * (param.pageNumber - 1))
            .take(param.pageSize)
            .getManyAndCount();
        return result;
    }

    async getFinal(param: GetFinalDto) {
        //redisKey
        const key = "final:" + param.electionId;
        let finalString = "";
        //先查缓存, 有缓存直接返回, 没有就查DB
        finalString = await this.redis.get(key);
        if (finalString) {
            return finalString;
        }

        //查询选举
        const result = await this.electionRepository.createQueryBuilder("election")
            .where("election.id = :id ", {id: param.electionId})
            .getOne();

        //组装返回结果, 并且缓存redis
        if (result && result.state == 2) {
            const final = new FinalResultVO();
            final.count = result.count;
            final.candidName = result.winer;
            final.candidName = result.name;
            finalString = JSON.stringify(final);
            await this.redis.set(key, finalString);
            return finalString;
        }else if(result &&  result.state!=2) {
            throw new HttpException('选举未结束', 401);
        }else {
            throw new HttpException('选举不存在', 401);
        }
        return finalString;
    }
}



