import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {JobApplication} from "./entities/job-application.entity";

@Module({
  imports: [TypeOrmModule.forFeature([JobApplication])],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService], //Wird später vom Interview-Modul benötigt
})
export class JobsModule {}
