import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BarchobaModule } from './barchoba/barchoba.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { env } from 'process';
import { HostessModule } from './hostess/hostess.module';

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
        url: `${process.env.MONGOATLAS_URL}?retryWrites=true&w=majority&appName=Cluster0`,
        database: 'test',
        synchronize: true, // Set to false in production for safety reasons
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Point to entities directory
      }), 
    }),
    BarchobaModule,
    HostessModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}

