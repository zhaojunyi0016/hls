import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AdminController} from '../admin/controller/admin.controller';
import {AdminService} from '../admin/service/admin.service';
import {ElectionEntity} from "../entities/election.entity";
import {CandidateEntity} from "../entities/candidate.entity";
import {VoteEntity} from "../entities/vote.entity";
import {VoteController} from "../vote/controller/vote.controller";
import {VoteService} from "../vote/service/vote.service";
import {SendEmailJob} from "../job/sendEmailJob";


@Module({
    imports: [TypeOrmModule.forFeature([ElectionEntity, CandidateEntity, VoteEntity])],
    controllers: [AdminController, VoteController],
    providers: [AdminService, VoteService,SendEmailJob],
})
export class CommonModule {
}
