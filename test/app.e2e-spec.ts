import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {AdminService} from "../src/admin/service/admin.service";
import {CommonModule} from "../src/module/common.module";

describe('AdminController', () => {
  let app: INestApplication;
  let adminService  = { getFinal : ()=>'test'}

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CommonModule],
    }).overrideProvider(AdminService)
        .useValue(adminService)
        .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST getFinal', () => {
    return request(app.getHttpServer())
      .get('/api/admin/getFinal')
      .expect(0);
  });
});
