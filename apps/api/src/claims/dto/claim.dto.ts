import { IsInt, IsString, IsNotEmpty, Min } from 'class-validator';

export class ClaimDto {
  @IsInt()
  @Min(1)
  eventId!: number;

  @IsString()
  @IsNotEmpty()
  attendee!: string;
}
