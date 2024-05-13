import { Module } from '@nestjs/common';
import { BarchobaService } from './barchoba.service';
import { BarchobaController } from './barchoba.controller';
import { BarchobaRepository } from './barchoba.repository';


@Module({
  providers: [BarchobaService, BarchobaRepository],
  controllers: [BarchobaController]
})
export class BarchobaModule {}
