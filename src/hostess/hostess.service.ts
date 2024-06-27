import { Injectable } from '@nestjs/common';
import { VectorRepository } from './vectors.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HostessService {

    constructor(
        @InjectRepository(VectorRepository)
        private readonly vectorRepository: VectorRepository
    ) {

    }

    async getVectorsForTopic(topicID: string) {
        const vectors = await this.vectorRepository.getAllVectors(topicID);
        return vectors
    }
}
