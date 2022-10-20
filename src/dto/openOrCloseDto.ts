import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class OpenOrCloseDto {
    /**
     * state 开关状态 0:关闭 1:开启
     */
    @ApiProperty({description: '开关状态 0:未开始 1:开始  2:结束 结束后不能开始', required: true})
    @IsNotEmpty({message: '开关状态不能为空'})
    state: number;

    /**
     * 选举Id
     */
    @ApiProperty({description: '选举Id', required: true})
    @IsNotEmpty({message: '缺少选举Id'})
    electionId: number;
}