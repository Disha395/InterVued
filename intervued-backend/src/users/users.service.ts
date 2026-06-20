import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

// Benutzerverwaltungsservice - CRUD-Operationen für Benutzer
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    // Neuen Benutzer in der Datenbank erstellen
    async create(email: string, name: string, password: string): Promise<User> {
        const user = this.usersRepository.create({ email, name, password });
        return this.usersRepository.save(user);
    }

    // Benutzer anhand der E-Mail-Adresse suchen
    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    // Benutzer anhand der ID suchen
    async findById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    // Refresh Token des Benutzers aktualisieren oder löschen
    async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
        await this.usersRepository.update(id, { refreshToken });
    }
}