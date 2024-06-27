import { Controller, Get, Param } from '@nestjs/common';
import { HostessService } from './hostess.service';

@Controller('hostess')
export class HostessController {

    constructor(private readonly hostessService: HostessService) {}

    @Get(":topicID")
    async getVectors(@Param() params: {topicID: string}) {
        const response = await this.hostessService.getVectorsForTopic(params.topicID);
        return response;
    }
}

