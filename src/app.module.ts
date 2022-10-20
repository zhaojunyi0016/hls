import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {CommonModule} from './module/common.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RedisModule} from "@svtslv/nestjs-ioredis";
import {ScheduleModule} from "@nestjs/schedule";


@Module({
    imports: [
        //定时任务
        ScheduleModule.forRoot(),
        //mysql -typrORM
        TypeOrmModule.forRoot({
            "type": "mysql",
            "host": "localhost",
            "port": 3306,
            "username": "root",
            "password": "password",
            "database": "interview_test",
            "synchronize": true,
            autoLoadEntities: true,
        }),
        //统一module
        CommonModule,
        //redis
        RedisModule.forRoot({
            config: {
                url: 'redis://localhost:6379',
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
