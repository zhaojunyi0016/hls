import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';


/**
 * 投票实体
 */
@Entity('vote')
export class VoteEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'election_id', nullable : false  , comment : "选举Id"})
    electionId: number;

    @Column({name: 'candid_name', nullable : false  , comment : "候选人姓名"})
    candidName: string;

    @Column({name: 'candid_id', nullable : false , comment : "候选人Id"})
    candidId: number;

    @Column({name: 'vote_name', nullable : false  , comment : "投票人名称"})
    voteName: string;

    @Column({name: 'vote_card', nullable : false , unique : true , comment : "投票人登记身份证"})
    voteCard: string;

    @Column({name: 'vote_email', nullable : false , comment : "投票人登记邮箱" })
    voteEmail: string;

    @CreateDateColumn({name: 'create_time' , comment : "创建时间"})
    createTime: Date;

    @UpdateDateColumn({name: 'update_time' , comment : "更新时间"})
    updateTime: Date;

    @Column({name: 'deleted', default: "0"  , comment : "是否删除 0:没有 1:已删除"})
    deleted: number;
}
