import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from 'class-validator';


export class CreaterElectionDto {
    /**
     * 选举名称
     */
    @ApiProperty({description: '选举名称', required: true})
    @IsNotEmpty({message: '缺少选举名称'})
    name: string;
}