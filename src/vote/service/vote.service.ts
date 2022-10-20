import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {VoteEntity} from "../../entities/vote.entity";
import {VoteDto} from "../../dto/voteDto";
import {CandidateEntity} from "../../entities/candidate.entity";
import {ElectionEntity} from "../../entities/election.entity";


/**
 * 投票服务类
 */
@Injectable()
export class VoteService {
    constructor(
        @InjectRepository(VoteEntity)
        private voteRepository: Repository<VoteEntity>,

        @InjectRepository(CandidateEntity)
        private candidateRepository: Repository<CandidateEntity>,

        @InjectRepository(ElectionEntity)
        private electionRepository: Repository<ElectionEntity>,
    ) {
    }

    /**
     * 普通用户投票
     * step1 : 普通⽤⼾可以在驗證⾝分證後進⾏投票  身份证在validator验证
     * step2 : 校验选举状态是否是 1:开始状态
     * step3 : 查询已经投票的人中， 存不存在当前投票人,如果存在,提示已经投过票 , 不存在则继续投票
     * step4 : 查询投票的实施情况, 返回给当前投票用户查看(一次性);
     * @param param
     */
    async voting(param: VoteDto) {
        //校验选举状态是否是 1:开始状态
        const election = await this.electionRepository.createQueryBuilder("election")
            .where("election.id = :id ", {id: param.electionId})
            .getOne();
        if (election) {
            if (election.state != 1) {
                throw new HttpException('选举未开始,请等待', 401);
            }
        } else {
            throw new HttpException('该选举不存在', 401);
        }

        //每個合法⽤⼾在每次選舉限投票⼀次  通过身份证查询已经投票的人中， 存不存在当前投票人
        const query = await this.voteRepository.createQueryBuilder("vote")
            .where("vote.vote_card = :card ", {card: param.voteCard})
            .getOne();
        //如果已存在,不允许再投票
        if (query) {
            throw new HttpException('该身份证用户已经投过票,只能投票一次', 401);
        }


        //保存投票信息
        const entity = new VoteEntity();
        entity.voteName = param.voteName;
        entity.voteCard = param.voteCard;
        entity.voteEmail = param.voteEmail;
        entity.candidId = param.candidId;
        entity.candidName = param.candidName;
        entity.electionId = param.electionId;
        entity.createTime = new Date();
        entity.updateTime = new Date();
        entity.deleted = 0;
        await this.voteRepository.save(entity);

        // ⽤⼾在投票之後可以⼀次性⾒到當時的選舉實時狀態
        //查询该选举一共多少个候选人,  每个候选人分别查count多少
        const candidateEntities = await this.candidateRepository.query("select * from candidate where election_id = " + param.electionId);

        //组合 查询sql
        let sql = "select count(candid_id) as count , candid_name   as candidName  from vote where candid_id in (";
        for (const element of candidateEntities) {
            sql = sql + "'" + element.id + "', ";
        }
        sql = sql.substring(0, sql.lastIndexOf(",")) + " )  GROUP BY candid_id"

        const result = await this.voteRepository.query(sql);
        return result;
    }
}
