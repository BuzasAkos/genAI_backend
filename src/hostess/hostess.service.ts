import { Injectable } from '@nestjs/common';
import { VectorRepository } from './vectors.repository';
import { InjectRepository } from '@nestjs/typeorm';
import OpenAI from 'openai';


@Injectable()
export class HostessService {

    private openai: OpenAI;
    private embedModel: string;
    private chatModel: string;

    constructor(
        @InjectRepository(VectorRepository)
        private readonly vectorRepository: VectorRepository
    ) {
        // Initialize OpenAI model
        this.openai = new OpenAI();
        this.chatModel = "gpt-4o";
        this.embedModel = 'text-embedding-3-small';
    }

    cosineSimilarity(a: number[], b: number[]): number {
        const product = a.map((value, index) => value * b[index]).reduce((a, b) => a + b, 0);
        const aMagnitude = Math.sqrt(a.map(value => Math.pow(value, 2)).reduce((a, b) => a + b, 0));
        const bMagnitude = Math.sqrt(b.map(value => Math.pow(value, 2)).reduce((a, b) => a + b, 0));
        return product / (aMagnitude * bMagnitude);
    }

    async generateEmbeddings(input: string | string[]){
        const response = await this.openai.embeddings.create({
            input: input,
            model: this.embedModel
        });
        return response;
    }

    async getVectorsForTopic(topicID: string) {
        const vectors = await this.vectorRepository.getAllVectors(topicID);
        return vectors
    }

    async extractRelatedText(topicID: string, question: string): Promise<string> {
        
        // embed question as vector
        const questionEN = await this.translateToEnglish(question);
        const vectorQ = (await this.generateEmbeddings(questionEN)).data[0].embedding;
        
        // load vectors from db and calculate similarities
        const similarities: {text: string, similarity: number}[] = [];
        const vectors = await this.getVectorsForTopic(topicID);
        vectors.forEach(vector => {
            let text = vector.text;
            let similarity = this.cosineSimilarity(vectorQ, vector.embedding);
            similarities.push({ text, similarity });
        });

        // select top similarities and compose output text
        const topCount = 4;
        similarities.sort((a, b) => b.similarity - a.similarity);
        console.log(similarities.slice(0, topCount));
        let output: string = similarities.map(item => item.text).slice(0, topCount).join(' ');    
    
        return output;
    }

    async getAnswer(context: string, question: string) {
        const messages: any = [
            { role: "system", content: `You are a helpful assistant at the customer service of the organizer of a Coldplay concert. Answer the question based on the following information: ${context}` },
            { role: "user", content: question }
        ];
        const model = this.chatModel;
        const completion = await this.openai.chat.completions.create({ messages, model });
        return completion.choices[0].message.content;
    }

    async translateToEnglish(text: string) {
        const messages: any = [
            { role: "system", content: `You are a precise translator, who translates everything to English. You will receive sentences (questions). Please, provide the exact English version as answer. If the input is in English, then echo the sentence exactly.` },
            { role: "user", content: 'Mennyi az idő?' },
            { role: "assistant", content: 'What is the time?' },
            { role: "user", content: 'How is the weather?' },
            { role: "assistant", content: 'How is the weather?' },
            { role: "user", content: text }
        ];
        const model = this.chatModel;
        const completion = await this.openai.chat.completions.create({ messages, model });
        return completion.choices[0].message.content || text;
    }

    async insertVector(topicID: string, text: string) {
        const embedding = (await this.generateEmbeddings(text)).data[0].embedding;
        const insertedVector = await this.vectorRepository.createVector(topicID, text, embedding);
        console.log(insertedVector);
        return insertedVector;
    }

    async deleteVector(id: string) {
        await this.vectorRepository.deleteVector(id);
    }

}
