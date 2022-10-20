import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class GetInfoDto {


    /**
     * 选举Id
     */
    @ApiProperty({description: '选举Id', required: true})
    @IsNotEmpty({message: '缺少选举Id'})
    electionId: number;
}