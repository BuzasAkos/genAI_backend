import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { Barchoba } from './barchoba.entity';

@Injectable()
export class BarchobaRepository extends Repository<Barchoba> {
    constructor(@Inject(DataSource) private readonly dataSource: DataSource) {
        super(Barchoba, dataSource.manager);
    }

    async getGameById(id): Promise<Barchoba> {
        const game: Barchoba = await this.findOne(id);
        return game;
    }

    async getAllGames(): Promise<Barchoba[]> {
        return await this.find();
    }

    async updateGame(game: Barchoba): Promise<Barchoba> {
        return await this.save(game);
    }

    async createGame(solution: string, active: boolean, messages ): Promise<Barchoba> {
        const newGame = this.create({ solution, active, messages });
        return await this.save(newGame);
    }

    async getLastSolutions(num: number): Promise<string[]> {
        const documents = await this.find();
        let solutions = documents.map(doc => doc.solution);
        console.log(solutions.length);
        solutions = solutions.slice(solutions.length - Math.min(num, solutions.length));
        return solutions;
    }
}