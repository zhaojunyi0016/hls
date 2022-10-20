import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class GetChooseInfoDto {


    /**
     * 选举Id
     */
    @ApiProperty({description: '选举Id', required: true})
    @IsNotEmpty({message: '缺少选举Id'})
    electionId: number;

    /**
     * 候选人Id
     */
    @ApiProperty({description: '候选人Id', required: true})
    @IsNotEmpty({message: '缺少候选人Id'})
    candidId: number;


    /**
     * 第几页
     */
    @ApiProperty({description: '第几页', required: true})
    @IsNotEmpty({message: '缺少第几页'})
    pageNumber: number;

    /**
     * 每页行数
     */
    @ApiProperty({description: '每页行数', required: true})
    @IsNotEmpty({message: '缺少每页行数'})
    pageSize: number;
}