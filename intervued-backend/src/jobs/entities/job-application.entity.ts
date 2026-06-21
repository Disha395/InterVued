// Bewerbungsstatus - alle möglichen Zustände einer Bewerbung
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "../../users/entities/user.entity";

export enum ApplicationStatus {
    APPLIED = 'APPLIED',
    INTERVIEW = 'INTERVIEW',
    OFFER = 'OFFER',
    REJECTED = 'REJECTED',
}

// Entität für Jobbewerbungen - eine Bewerbung gehört immer einem Benutzer
@Entity('job_applications')
export class JobApplication {
    @PrimaryGeneratedColumn('uuid')
    id : string;

    // Beziehung zum Benutzer - jede Bewerbung gehört einem Benutzer
    @ManyToOne(() => JobApplication, { onDelete: 'CASCADE' })
    @JoinColumn({name : 'user-id'})
    user: User;

    @Column({name : 'user-id'})
    userId: string;

    //Firmenname
    @Column()
    company: string;

    //Stellenbeschreibung - für KI-Interviewvorbereitung
    @Column({type : "text", nullable: true})
    jobdescription : string | null;

    // Aktueller Status der Bewerbung
    @Column({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.APPLIED,
    })
    status : ApplicationStatus;

    // Persönliche Notizen zur Bewerbung
    @Column({ type: 'text', nullable: true })
    notes: string | null;

    // Datum der Bewerbung
    @Column({type : 'date', nullable: true})
    appliedDate : Date | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


}