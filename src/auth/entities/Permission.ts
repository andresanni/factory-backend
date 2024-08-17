import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./Role";

@Entity()
export class Permission{
    @PrimaryGeneratedColumn()
    id?:number;

    @Column({unique: true})
    description: string;

    @ManyToMany(()=>Role, (role)=> role.permissions)
    roles: Role[];
}