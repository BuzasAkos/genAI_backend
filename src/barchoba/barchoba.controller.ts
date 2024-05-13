import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { BarchobaService } from './barchoba.service';

@Controller('barchoba')
export class BarchobaController {

    constructor(private readonly barchobaService: BarchobaService) {}

    @Post("new")
    async startRound() {
        const secret = await this.barchobaService.getSecret();
        const createdGame = await this.barchobaService.startRound(secret);
        return {id: createdGame.id}
    }
    
    @Post("ask")
    async processQuestion(@Body() data: {gameID: string, question: string}) {
        const response = await this.barchobaService.sendQuestion(data.gameID, data.question);
        return response;
    }

    @Post("guess")
    async processGuess(@Body() data: {gameID: string, question: string}) {
        const response = await this.barchobaService.closeRound(data.gameID, data.question);
        return response;
    }

    @Get(":id")
    async loadGame(@Param() params: {id: string}) {
        console.log(params.id);
        const response = await this.barchobaService.getChatHistory(params.id);
        return response;
    }

}
