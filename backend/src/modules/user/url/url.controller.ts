import { Body, Controller, Delete, Get, Inject, Param, Post, Query, Req, Res, UseGuards, Ip } from "@nestjs/common";
import type { Response } from "express";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import type { IUrlService } from "./interfaces/url.service.interface";
import { CreateUrlDto } from "./dto/create-url.dto";
import { UpdateUrlDto } from "./dto/update-url.dto";
import { UrlMapper } from "./mappers/url.mapper";

import type { RequestWithUser } from "src/common/interfaces/request-with-user.interface";

@Controller('url')
export class UrlController {

    constructor(
        @Inject('IUrlService')
        private readonly urlService: IUrlService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('list')
    async listUrls(
        @Req() req: RequestWithUser,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search?: string
    ) {
        const { data, total } = await this.urlService.listing(req.user.userId, Number(page), Number(limit), search);
        return {
            ok: true,
            data: UrlMapper.toDtoList(data),
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / limit)
            }
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('details/:id')
    async getUrlDetails(@Param('id') id: string) {
        const url = await this.urlService.getDetails(id);
        if (!url) {
            return { ok: false, message: 'URL not found' };
        }
        return {
            ok: true,
            data: UrlMapper.toDto(url)
        };
    }

    @UseGuards(JwtAuthGuard)
    @Post('shorten')
    async createShortUrl(@Body() dto: CreateUrlDto, @Req() req: RequestWithUser) {
        const url = await this.urlService.create(dto.originalUrl, req.user.userId, dto.customCode);
        return {
            ok: true,
            message: 'Short URL created successfully',
            data: UrlMapper.toDto(url)
        };
    }

    @Get('r/:code')
    async redirect(
        @Param('code') code: string,
        @Res() res: Response,
        @Req() req: any,
        @Ip() ip: string
    ) {
        const userAgent = req.headers['user-agent'];
        const originalUrl = await this.urlService.redirect(code, ip, userAgent);
        if (originalUrl) {
            return res.redirect(originalUrl);
        }
        return res.status(404).json({ ok: false, message: 'URL not found' });
    }

    @UseGuards(JwtAuthGuard)
    @Post('update/:id')
    async updateUrl(@Param('id') id: string, @Body() dto: UpdateUrlDto) {
        const url = await this.urlService.update(id, dto.originalUrl, dto.customCode);
        if (!url) {
            return { ok: false, message: 'URL not found' };
        }
        return {
            ok: true,
            data: UrlMapper.toDto(url)
        };
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteUrl(@Param('id') id: string) {
        const url = await this.urlService.delete(id);
        if (!url) {
            return { ok: false, message: 'URL not found' };
        }
        return {
            ok: true,
            message: 'URL deleted successfully'
        };
    }
    @UseGuards(JwtAuthGuard)
    @Get('analytics/:id')
    async getAnalytics(@Param('id') id: string, @Query('range') range: string = 'weekly') {
        const data = await this.urlService.getAnalytics(id, range);
        return {
            ok: true,
            data
        };
    }
}