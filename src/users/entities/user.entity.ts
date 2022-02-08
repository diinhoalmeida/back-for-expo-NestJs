import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 40})
    nome: string;
    
    @Column({ type: 'varchar', length: 40, unique: true })
    email: string;
    
    @Column({ type: 'varchar' })
    idade: number;
    
    @Column({ type: 'varchar', unique: true })
    telefone: string;
  
}
