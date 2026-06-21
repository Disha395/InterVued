import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplication } from './entities/job-application.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { QueryJobDto } from './dto/query-job.dto';

// Bewerbungsservice - verwaltet alle CRUD-Operationen
@Injectable()
export class JobsService {
    constructor(
        @InjectRepository(JobApplication)
        private jobsRepository: Repository<JobApplication>,
    ) {}

    // Neue Bewerbung erstellen
    async create(userId: string, createJobDto: CreateJobDto): Promise<JobApplication> {
        const job = this.jobsRepository.create({
            ...createJobDto,
            userId,
        });
        return this.jobsRepository.save(job);
    }

    // Alle Bewerbungen des Benutzers abrufen mit Filterung und Paginierung
    async findAll(userId: string, query: QueryJobDto) {
        const { status, page = 1, limit = 10 } = query;

        const queryBuilder = this.jobsRepository
            .createQueryBuilder('job')
            // Nur Bewerbungen des aktuellen Benutzers abrufen
            .where('job.user_id = :userId', { userId })
            .orderBy('job.createdAt', 'DESC');

        // Nach Status filtern wenn angegeben
        if (status) {
            queryBuilder.andWhere('job.status = :status', { status });
        }

        // Paginierung anwenden
        const total = await queryBuilder.getCount();
        const jobs = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();

        return {
            data: jobs,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // Einzelne Bewerbung abrufen
    async findOne(userId: string, id: string): Promise<JobApplication> {
        const job = await this.jobsRepository.findOne({ where: { id } });

        if (!job) {
            throw new NotFoundException('Bewerbung nicht gefunden');
        }

        // Sicherstellen dass die Bewerbung dem Benutzer gehört
        if (job.userId !== userId) {
            throw new ForbiddenException('Zugriff verweigert');
        }

        return job;
    }

    // Bewerbung aktualisieren
    async update(userId: string, id: string, updateJobDto: UpdateJobDto): Promise<JobApplication> {
        const job = await this.findOne(userId, id);
        Object.assign(job, updateJobDto);
        return this.jobsRepository.save(job);
    }

    // Bewerbung löschen
    async remove(userId: string, id: string): Promise<void> {
        const job = await this.findOne(userId, id);
        await this.jobsRepository.remove(job);
    }
}