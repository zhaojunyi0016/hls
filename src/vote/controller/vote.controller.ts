import {Body, Controller, Post,} from '@nestjs/common';
import {VoteService} from "../service/vote.service";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {VoteDto} from "../../dto/voteDto";


@Controller('vote')
@ApiTags('投票')
export class VoteController {
    constructor(private voteService: VoteService) {
    }


    /**
     * 投票接口
     * @param param
     */
    @ApiOperation({summary: '投票接口'})
    @Post('voting')
    async voting(@Body() param: VoteDto): Promise<void> {
        return await this.voteService.voting(param);
    }
}
