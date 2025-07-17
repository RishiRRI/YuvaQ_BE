import { IsInt, Min, Max, Matches } from 'class-validator';

export class TimeWindowDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  start: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  end: string;
}
