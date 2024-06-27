import { Module } from '@nestjs/common';
import { HostessController } from './hostess.controller';
import { HostessService } from './hostess.service';
import { VectorRepository } from './vectors.repository';

@Module({
  controllers: [HostessController],
  providers: [HostessService, VectorRepository]
})
export class HostessModule {}
