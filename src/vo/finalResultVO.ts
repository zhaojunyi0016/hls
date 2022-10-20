import {ApiProperty} from "@nestjs/swagger";

export class FinalResultVO {


    /**
     * 选举名称
     */
    @ApiProperty({description: '选举名称', required: true})
    electionName: string;

    /**
     * 候选人
     */
    @ApiProperty({description: '候选人名称', required: true})
    candidName: string;


    /**
     * 最终票数
     */
    @ApiProperty({description: '最终票数', required: true})
    count: number;

}