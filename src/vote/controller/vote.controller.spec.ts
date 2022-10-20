import { Test, TestingModule } from '@nestjs/testing';
import { VoteController } from './vote.controller';
import {VoteService} from "../service/vote.service";
import {VoteDto} from "../../dto/voteDto";

describe('VoteController', () => {
  let controller: VoteController;
  let service : VoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoteController],
      providers: [VoteService],
    }).compile();

    controller = module.get<VoteController>(VoteController);
    service = module.get<VoteService>(VoteService);
  });


  describe('voting', () => {
    it('should return string ', async () => {
      const result = ['test'];
      // @ts-ignore
      jest.spyOn(service, 'voting').mockImplementation(() => result);
      const  req = new VoteDto();
      req.electionId = 3;
      req.candidId = 1;
      req.candidName = "候选人1号";
      req.voteName ="投票人1";
      req.voteCard = "身份证";
      expect(await controller.voting(req)).toBe(result);
    });
  });


});
