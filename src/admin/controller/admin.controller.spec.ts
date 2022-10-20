import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import {GetFinalDto} from "../../dto/getFinalDto";
import {AdminService} from "../service/admin.service";
import {CreaterElectionDto} from "../../dto/createrElectionDto";
import {AddCandidateDto} from "../../dto/addCandidateDto";
import {OpenOrCloseDto} from "../../dto/openOrCloseDto";
import {GetInfoDto} from "../../dto/getInfoDto";
import {GetChooseInfoDto} from "../../dto/getChooseInfoDto";
import {CommonModule} from "../../module/common.module";

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers :[ AdminService] ,
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });


  /**
   * 创建选举
   */
  describe('createrElection', () => {
    it('should return string', async () => {
      const result = ['test'];
      // @ts-ignore
      jest.spyOn(service, 'createrElection').mockImplementation(() => result);

      const  req = new CreaterElectionDto();
      req.name = "第一场选举";
      expect(await controller.createrElection(req)).toBe(result);
    });
  });


  /**
   * 添加候选人
   */
  describe('addCandidate', () => {
    it('should return string', async () => {
      const result = ['test'];
      // @ts-ignore
      jest.spyOn(service, 'addCandidate').mockImplementation(() => result);

      const  req = new AddCandidateDto();
      req.electionId = 1;
      req.names = ["候选人1号","候选人2号"];
      expect(await controller.addCandidate(req)).toBe(result);
    });
  });


  /**
   * 开启关闭选举
   */
  describe('openOrClose', () => {
    it('should return string', async () => {
      const result = ['test'];
      // @ts-ignore
      jest.spyOn(service, 'openOrClose').mockImplementation(() => result);

      const  req = new OpenOrCloseDto();
      req.electionId = 3;
      req.state = 1; //开启
      expect(await controller.openOrClose(req)).toBe(result);
    });
  });

    /**
     * 管理员查看实时情况接口
     */
    describe('getInfo', () => {
      it('should return string', async () => {
        const result = ['test'];
        // @ts-ignore
        jest.spyOn(service, 'getInfo').mockImplementation(() => result);

        const  req = new GetInfoDto();
        req.electionId = 3;
        expect(await controller.getInfo(req)).toBe(result);
      });
    });



  /**
   * 管理员查看指定候选人详细实时情况-分页 接口
   */
  describe('getChooseInfo', () => {
    it('should return string', async () => {
      const result = ['test'];
      // @ts-ignore
      jest.spyOn(service, 'getChooseInfo').mockImplementation(() => result);

      const  req = new GetChooseInfoDto();
      req.electionId = 3;
      req.candidId = 1;
      req.pageNumber = 1;
      req.pageSize  = 10;
      expect(await controller.getChooseInfo(req)).toBe(result);
    });
  });



  /**
   * 管理员查看指定候选人详细实时情况-分页 接口
   */
  describe('getFinal', () => {
    it('should return string', async () => {
      const result = ['test'];
      // @ts-ignore
      jest.spyOn(service, 'getFinal').mockImplementation(() => result);

      const  req = new GetFinalDto();
      req.electionId = 3;
      expect(await controller.getFinal(req)).toBe(result);
    });
  });

});


