import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';


/**
 * 候选人实体
 */
@Entity('candidate')
export class CandidateEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'name' , comment : "候选人姓名"})
    name: string;

    @Column({name: 'election_id', nullable : false , comment : "选举id"})
    electionId: number;

    @CreateDateColumn({name: 'create_time' , comment : "创建时间"})
    createTime: Date;

    @UpdateDateColumn({name: 'update_time' , comment : "更新时间"})
    updateTime: Date;

    @Column({name: 'deleted', default: "0" , comment : "是否删除 0:没有 1:已删除"})
    deleted: number;
}
