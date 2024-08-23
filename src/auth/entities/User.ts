import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./Role";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  surname?: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  
  constructor(username: string, passwordHash: string, email: string, role: Role, name?: string, surname?: string) {
     this.username = username;
     this.passwordHash = passwordHash;
     this.email = email;
     this.name = name; 
     this.surname = surname;
     this.role = role;
  }
}
