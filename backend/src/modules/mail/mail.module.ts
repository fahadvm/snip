import { Module, Global } from '@nestjs/common';
import { MailService } from './mail.service';
import { LoggerModule } from '../../common/logger/logger.module';

@Global()
@Module({
    imports: [LoggerModule],
    providers: [
        {
            provide: 'IMailService',
            useClass: MailService,
        },
    ],
    exports: ['IMailService'],
})
export class MailModule { }
