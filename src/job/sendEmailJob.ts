import {Injectable} from '@nestjs/common';
import {Cron} from '@nestjs/schedule';
import {InjectRepository} from "@nestjs/typeorm";
import {ElectionEntity} from "../entities/election.entity";
import {Repository} from "typeorm";
import {VoteEntity} from "../entities/vote.entity";

@Injectable()
export class SendEmailJob {
    constructor(
        @InjectRepository(ElectionEntity)
        private electionRepository: Repository<ElectionEntity>,
        @InjectRepository(VoteEntity)
        private voteRepository: Repository<VoteEntity>,
    ) {

    }

    /**
     * 定时任务
     * 每分钟执行一次, 查询state =2(已经结束,并且 send_email_state = 0 未发送邮件通知的数据)
     * 循环遍历查到对应给获胜方投过票的投票人, 拿到对应email邮件, 发送通知邮件
     */
    @Cron('45 * * * * *')
    async handleCron() {
        console.log("kaishi定时任务")
        //查询state = 2 已结束选举, 并且  send_email_state = 0 未发送邮件通知的数据
        const electionEntities = await this.electionRepository.createQueryBuilder("election")
            .where("election.state = :state ", {state: 2})
            .andWhere("election.send_email_state = 0 ")
            .getMany();
        if (electionEntities.length > 0) {
            for (const element of electionEntities) {
                let id = element.id;
                let winerId = element.winerId;
                //通过选举里面胜选方的候选人id , 找到需要发送通知的投票人
                const voteEntitys = await this.voteRepository.createQueryBuilder("vote")
                    .where("vote.candid_id = :winerId ", {winerId: winerId})
                    .andWhere("vote.election_id = :id", {id: id})
                    .getMany();
                if (voteEntitys.length > 0) {
                    for (const vote of voteEntitys) {
                        //拿到投票人邮箱地址
                        const voteEmail = vote.voteEmail;
                        //发送邮箱 send email;
                    }
                }
                const updateSql = "UPDATE election SET send_email_state =1   where id = " + id;
                await this.electionRepository.query(updateSql);
            }
        }
    }
}