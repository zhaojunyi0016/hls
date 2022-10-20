import {ApiProperty} from "@nestjs/swagger";
import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {IsNotEmpty, Matches} from "class-validator";
const cardreg = /^[A-Z]{1,2}[0-9]{6}\([0-9A]\)$/


export class VoteDto {
    /**
     * 投票人
     */
    @ApiProperty({description: '投票人姓名'})
    @IsNotEmpty({message: '缺少投票人姓名'})
    voteName: string;

    /**
     * 投票人身份证
     */
    @ApiProperty({description: '投票人身份证'})
    @Matches(cardreg,{message :"投票人身份证不正确,不符合香港身份证格式"})
    voteCard: string;

    /**
     * 投票人邮箱
     */
    @ApiProperty({description: '投票人登记邮箱'})
    @IsNotEmpty({message: '缺少投票人登记邮箱'})
    voteEmail: string;

    /**
     * 选举Id
     */
    @ApiProperty({description: '选举Id', required: true})
    @IsNotEmpty({message: '缺少选举Id'})
    electionId: number;

    /**
     * 被投人id
     */
    @ApiProperty({description: '被投人id'})
    @IsNotEmpty({message: '缺少被投人id'})
    candidId: number;

    /**
     * 被投人姓名
     */
    @ApiProperty({description: '被投人姓名'})
    @IsNotEmpty({message: '缺少被投人姓名'})
    candidName: string;


}