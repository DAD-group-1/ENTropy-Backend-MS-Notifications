import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { buildMongoUri } from './utils.js';

export const createDatabaseModule = (): DynamicModule =>
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: () => ({
      uri: buildMongoUri(),
    }),
  });

@Module({
  imports: [createDatabaseModule()],
})
export class DatabaseModule {}
