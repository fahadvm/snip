import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './common/logger/logger.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/user/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './modules/user/url/url.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://fahadfad444:fahad888@cluster0.drrfg.mongodb.net/snip?retryWrites=true&w=majority'),
    LoggerModule,
    AuthModule,
    UrlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
