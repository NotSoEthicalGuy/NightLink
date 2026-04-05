import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { SiteConfigService } from './site-config.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateSiteConfigDto } from './dto/update-site-config.dto';

@Controller('site-config')
@UseGuards(JwtAuthGuard)
export class SiteConfigController {
    constructor(private siteConfigService: SiteConfigService) { }

    @Get()
    getConfig(@Request() req) {
        return this.siteConfigService.getConfig(req.user.id);
    }

    @Patch()
    updateConfig(@Request() req, @Body() dto: UpdateSiteConfigDto) {
        return this.siteConfigService.updateConfig(req.user.id, dto);
    }

    @Patch('publish')
    togglePublish(@Request() req, @Body() body: { isPublished: boolean }) {
        return this.siteConfigService.togglePublish(req.user.id, body.isPublished);
    }
}
