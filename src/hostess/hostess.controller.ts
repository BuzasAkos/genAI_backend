import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { HostessService } from './hostess.service';

@Controller('hostess')
export class HostessController {

    constructor(private readonly hostessService: HostessService) {}

    @Get(":topicID")
    async getVectors(@Param() params: {topicID: string}) {
        const response = await this.hostessService.getVectorsForTopic(params.topicID);
        return response;
    }

    @Post("query")
    async getAnswerFromVectors(
      @Body() data: {topicID: string, question: string} ) {
        const { topicID, question } = data;
        const context = await this.hostessService.extractRelatedText(topicID, question);
        const answer = await this.hostessService.getAnswer(context, question);
        return { answer };
    }

    @Post("insert")
    async insertVector(
      @Body() data: {topicID: string, text: string} ) {
        const { topicID, text } = data;
        const response = await this.hostessService.insertVector(topicID, text);
        return response;
    }

    @Delete(":id")
    async removeVector(@Param() params: {id: string} ) {
        const { id } = params;
        await this.hostessService.deleteVector(id);
        return;
    }
}

