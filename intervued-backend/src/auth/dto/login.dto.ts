import { IsEmail, IsString } from 'class-validator';

// Anmeldedaten vom Benutzer
export class LoginDto {
    // E-Mail-Adresse
    @IsEmail()
    email: string;

    // Passwort des Benutzers
    @IsString()
    password: string;
}