import { Controller, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";



@Controller('url')
export class urlController {

    constructor(
        @inject('IUrlService')
        private readonly urlService: IUrlService,
    ) { }

    @AuthGuard(JwtAuthGuard)
    @post('list')
    async shortUrls(@Body(): dto: CreateUrlDto, @Res({ passthrough: true }) res: Response) {
        return this.urlService.create(dto.originalUrl, req.user.id)
    }

    @AuthGuard(JwtAuthGuard)
    @post('shorten')
    async createShortUrl(@Body(): dto: CreateUrlDto, @Res({ passthrough: true }) res: Response) {
        const create = await this.urlService.create(dto.originalUrl, req.user.id)
        return { ok: true, message: 'created successfully' };
    }


}