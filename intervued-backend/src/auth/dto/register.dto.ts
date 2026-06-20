import { IsEmail, IsString, MinLength } from 'class-validator';

// Registrierungsdaten vom Benutzer
export class RegisterDto {
    // Name des Benutzers
    @IsString()
    name: string;

    // E-Mail-Adresse muss gültig sein
    @IsEmail()
    email: string;

    // Passwort muss mindestens 6 Zeichen haben
    @IsString()
    @MinLength(6)
    password: string;
}