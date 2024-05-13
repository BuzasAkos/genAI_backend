import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BarchobaModule } from './barchoba/barchoba.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { env } from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`../dev.env`],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mongodb',
        url: 'mongodb+srv://akosbuzas:FNojwl3I5dKrR3dq@cluster0.4hkwfd9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        // url: process.env.MONGOATLAS_URL_FULL,
        database: 'test',
        synchronize: true, // Set to false in production for safety reasons
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Point to entities directory
      }), 
    }),
    BarchobaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}

