import {ApiProperty} from "@nestjs/swagger";
import {ArrayNotEmpty, IsNotEmpty} from "class-validator";

export class AddCandidateDto {
    /**
     * 候选人名称
     */
    @ApiProperty({description: '候选人名称', required: true})
    @ArrayNotEmpty({message: '缺少候选人姓名'})
    names: string [];

    /**
     * 选举Id
     */
    @ApiProperty({description: '选举Id', required: true})
    @IsNotEmpty({message: '缺少选举Id'})
    electionId: number;
}