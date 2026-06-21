import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';

// Alle Felder optional - Benutzer kann nur bestimmte Felder aktualisieren
export class UpdateJobDto extends PartialType(CreateJobDto) {}