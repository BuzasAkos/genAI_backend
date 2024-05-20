import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { InjectRepository } from '@nestjs/typeorm';
import { BarchobaRepository } from './barchoba.repository';
import { HttpException, HttpStatus } from '@nestjs/common';


@Injectable()
export class BarchobaService {

    private openai: OpenAI;
    private model: string;

    constructor(
        @InjectRepository(BarchobaRepository)
        private readonly barchobaRepository: BarchobaRepository
    ) {
        // Initialize OpenAI model
        this.openai = new OpenAI();
        this.model = "gpt-4-turbo-preview";
    }

    async getSecret() {
        const pastGames: string[] = await this.barchobaRepository.getLastSolutions(50);
        const pastList = 'Jesus Christ, Santa Claus, Albert Einstein, ' + pastGames.join(', ');
        console.log(pastList)
        const hint = this.getRndHint();
        console.log(hint);
        
        const messages: any = [
            { role: "system", content: "You are a barchoba game master, you need to specify a secret that a player will find out." },
            { role: "user", content: `Give the name of a famous person (dead or alive, real or imaginary), that everyone knows. 
            It cannot be part of this list: ${pastList}. ${hint} Answer with the name only.` }
        ]
        const model = this.model;
        const temperature = 1.9;
        const top_p = 0.9;

        const completion = await this.openai.chat.completions.create({ messages, model, temperature, top_p });
        let secret = completion.choices[0].message.content.trim().replaceAll('.','');
        
        console.log(secret);
        return secret;
    }

    getRndHint(): string {
        const randomSelect = Math.floor(Math.random() * 4);
        switch (randomSelect) {
            case 1: return 'For example, select a star from film industry.';
            case 2: return 'For example, select a star from music industry.';
            default: return '';
        }
    }

    async startRound(solution: string) {
        const messages = [{ 
            role: "system", 
            content: `You are a barchoba game master, the player has to find out this person: ${solution}. 
            Answer only with yes or no.
            Guesssing the exact name of the person is not allowed, in this case say that you cannot answer. 
            But provide answer to any other question about the person, if it is a yes or no question.` 
        }];
        const active = true;
        return await this.barchobaRepository.createGame( solution, active, messages );
    }

    async sendQuestion(id: string, question: string) {
        let game = await this.barchobaRepository.getGameById(id);
        if (!game) {
            return new HttpException('Barchoba game not found with this id', HttpStatus.NOT_FOUND);
        }

        if ( !game.active ) {
            return new HttpException('The specified game is not active, no more questions are accepted', HttpStatus.NOT_ACCEPTABLE);
        }

        if (!question || question.length < 3) {
            return new HttpException('Invalid question', HttpStatus.NOT_ACCEPTABLE);
        }

        game.messages.push({
            role: "user", content: question
        });

        const messages: any = game.messages;
        const completion = await this.openai.chat.completions.create({ 
            messages: messages, 
            model: this.model 
        });
        game.messages.push(completion.choices[0].message);
        console.log(question, completion.choices[0].message.content);

        await this.barchobaRepository.updateGame(game);
        return completion.choices[0].message;
    }

    async closeRound(id: string, question: string) {
        let game = await this.barchobaRepository.getGameById(id);

        if (!game) {
            return new HttpException('Barchoba game not found with this id', HttpStatus.NOT_FOUND);
        }

        if ( !game.active ) {
            return new HttpException('The specified game is not active, no more questions are accepted', HttpStatus.NOT_ACCEPTABLE);
        }

        const countQ = game.messages.filter( (item) => item.role === 'user' ).length;
        const solution = game.solution;
        const model = this.model;
        
        game.active = false;
        await this.barchobaRepository.updateGame(game);

        if (!question || question.length < 3) {
            return { guess: question, solution: solution, successful: false, countQ: countQ };
        }

        const messages: any = [
            { 
                role: "system", 
                content: `You are a barchoba game master, the player has to find out this secret person: ${solution}. 
                The user will guess the name of the person. If this is in line with the secret person, say Yes, otherwise say No. 
                Disregard minor typos, uppercase or lowercase letters, question marks, etc.` 
            },
            {
                role: 'user',
                content: `${solution.toLowerCase()}?`
            },
            {
                role: 'assistant',
                content: 'Yes'
            },
            {
                role: 'user',
                content: question
            }
        ];

        const completion: any = await this.openai.chat.completions.create({ messages, model });
        const answer: string = completion.choices[0].message.content;
        console.log(answer);

        if ( answer.trim().includes('Yes') ) {    
            return { guess: question, solution: solution, successful: true, countQ: countQ }
        }

        return { guess: question, solution: solution, successful: false, countQ: countQ }
    }

    async getChatHistory(id: string) {
        const game = await this.barchobaRepository.getGameById(id);
        console.log(game);
        if (!game) {
            return null;
        }
        if (!game.active || game.messages.length <= 1) {
            return null;  
        }
        const chatHistory = game.messages.filter((item) => item.role === 'user' || item.role === 'assistant');
        return chatHistory;
    }

}
