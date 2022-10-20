import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';


export class ResultDto {

    data: String;
    resultCode: number;


    constructor(data: string, number: number) {
        this.data = data;
        this.resultCode = number;
    }


}