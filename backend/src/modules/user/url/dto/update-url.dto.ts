import { IsNotEmpty, IsOptional, IsString, IsUrl, Matches } from 'class-validator';

export class UpdateUrlDto {
    @IsNotEmpty()
    @IsUrl()
    originalUrl: string;

    @IsOptional()
    @IsString()
    @Matches(/^[a-zA-Z0-9_-]+$/, {
        message: 'Custom code can only contain letters, numbers, hyphens, and underscores'
    })
    customCode?: string;
}
