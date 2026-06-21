import { IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApplicationStatus } from '../entities/job-application.entity';

// Abfrageparameter für Filterung und Paginierung
export class QueryJobDto {
    // Nach Status filtern
    @IsOptional()
    @IsEnum(ApplicationStatus)
    status?: ApplicationStatus;

    // Seitennummer für Paginierung
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    // Anzahl der Ergebnisse pro Seite
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit?: number = 10;
}