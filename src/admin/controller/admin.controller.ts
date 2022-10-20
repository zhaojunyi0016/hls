import {Body, Controller, Get, Post,} from '@nestjs/common';
import {AdminService} from '../service/admin.service';
import {CreaterElectionDto} from "../../dto/createrElectionDto";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {AddCandidateDto} from "../../dto/addCandidateDto";
import {OpenOrCloseDto} from "../../dto/openOrCloseDto";
import {GetInfoDto} from "../../dto/getInfoDto";
import {GetChooseInfoDto} from "../../dto/getChooseInfoDto";
import {VoteEntity} from "../../entities/vote.entity";
import {GetFinalDto} from "../../dto/getFinalDto";

/**
 * 系統管理員 controller
 */
@Controller('admin')
@ApiTags('系統管理員')
export class AdminController {
    constructor(private adminService: AdminService) {
    }


    /**
     * 创建选举
     * @param param
     */
    @ApiOperation({summary: '创建选举'})
    @Post('createrElection')
    async createrElection(@Body() param: CreaterElectionDto): Promise<number> {
        return await this.adminService.createrElection(param);
    }

    /**
     * 添加候选人
     *
     * @param params
     */
    @ApiOperation({summary: '添加候选人'})
    @Post('addCandidate')
    async addCandidate(@Body() param: AddCandidateDto): Promise<string[]> {
        return await this.adminService.addCandidate(param);
    }

    /**
     * 开启/结束 选举
     * @param params
     */
    @Post('openOrClose')
    @ApiOperation({summary: '开启/结束 选举'})
    async openOrClose(@Body() param: OpenOrCloseDto): Promise<void> {
        return await this.adminService.openOrClose(param);

    }


    /**
     * 管理员查看选举得票实时情况接口
     * @param param
     */
    @ApiOperation({summary: '管理员查看选举得票实时情况接口'})
    @Get('getInfo')
    async getInfo(@Body() param: GetInfoDto): Promise<void> {
        return await this.adminService.getInfo(param);
    }


    /**
     * 管理员查看指定候选人详细实时情况-分页 接口
     * @param param
     */
    @ApiOperation({summary: '管理员查看指定候选人详细实时情况-分页 接口'})
    @Get('getChooseInfo')
    async getChooseInfo(@Body() param: GetChooseInfoDto): Promise<[VoteEntity[], number]> {
        return await this.adminService.getChooseInfo(param);
    }


    /**
     * 管获取最终投票情况(第一次查DB,后续查询缓存) 接口
     * @param param
     */
    @ApiOperation({summary: '获取最终投票情况(后续查询缓存)'})
    @Get('getFinal')
    async getFinal(@Body() param: GetFinalDto): Promise<string> {
        return await this.adminService.getFinal(param);
    }
}
