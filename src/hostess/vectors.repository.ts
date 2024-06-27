import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { Vector } from './vectors.entity';

@Injectable()
export class VectorRepository extends Repository<Vector> {
    constructor(@Inject(DataSource) private readonly dataSource: DataSource) {
        super(Vector, dataSource.manager);
    }

    async createVector(topicID: string, text: string, embedding: number[]) {
        const insertedVector = await this.save({ topicID, text, embedding });
        return insertedVector;
    }

    async updateVector() {

    }

    async deleteVector() {

    }

    async getAllVectors(topicID: string): Promise<Vector[]> {
        return await this.find({ where: { topicID } });
    }

}