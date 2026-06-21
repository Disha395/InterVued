import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApplicationStatus } from '../entities/job-application.entity';

// Validierung für neue Jobbewerbungen
export class CreateJobDto {
    // Firmenname - Pflichtfeld
    @IsString()
    company: string;

    // Stellenbezeichnung - Pflichtfeld
    @IsString()
    role: string;

    // Stellenbeschreibung - optional, wird für KI-Vorbereitung verwendet
    @IsOptional()
    @IsString()
    jobDescription?: string;

    // Status - optional, Standard ist APPLIED
    @IsOptional()
    @IsEnum(ApplicationStatus)
    status?: ApplicationStatus;

    // Notizen - optional
    @IsOptional()
    @IsString()
    notes?: string;

    // Bewerbungsdatum - optional
    @IsOptional()
    @IsDateString()
    appliedDate?: string;
}