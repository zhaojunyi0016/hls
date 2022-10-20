import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';


/**
 * 选举实体
 */
@Entity('election')
export class ElectionEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'name', comment : "选举名称"})
    name: string;

    @Column({name: 'state', default: "0", comment : "选举状态 0:未开始, 1:开始  2:关闭"})
    state: number;

    @Column({name: 'send_email_state', default: "0" , comment : "是否发送通知邮件 0:没有  1:已通知"})
    sendEmailState: number;

    @Column({name: 'winer', default: null, nullable : true , comment : "胜选候选人名称"})
    winer: string;

    @Column({name: 'winer_id', default: null, nullable : true, comment : "胜选候选人Id"})
    winerId: number;

    @Column({name: 'count', default: 0, nullable : true , comment : "胜选候选人总票数"})
    count: number;

    @CreateDateColumn({name: 'create_time' , comment : "创建时间"})
    createTime: Date;

    @UpdateDateColumn({name: 'update_time' , comment : "更新时间"})
    updateTime: Date;

    @Column({name: 'deleted', default: "0", nullable : false , comment : "是否删除 0:没有 1:已删除"})
    deleted: number;
}
