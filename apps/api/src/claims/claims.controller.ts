import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { ClaimDto } from './dto/claim.dto';

@Controller()
export class ClaimsController {
  constructor(private readonly claims: ClaimsService) {}

  @Get('events')
  listEvents() {
    return this.claims.getEvents();
  }

  @Get('events/:id')
  getEvent(@Param('id') id: string) {
    const n = Number(id);
    if (!Number.isInteger(n)) {
      throw new NotFoundException(`Event ${id} not found`);
    }

    return this.claims.getEventById(n);
  }

  @Post('claims')
  claim(@Body() dto: ClaimDto) {
    return this.claims.createClaim(dto.eventId, dto.attendee);
  }
}
