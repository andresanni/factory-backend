import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Permission } from "./Permission";

@Entity()
export class Role{
    
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({unique: true})
    name: string;
    
    @OneToMany(()=> User, (user)=> user.role)
    users: User[];

    @ManyToMany(()=> Permission, (permission)=> permission.roles)
    @JoinTable({name: "role_permissions"})
    permissions?: Permission[];

    constructor(name:string){
        this.name = name;
    }

    setUsers(users: User[]): void{
        this.users = users;
    }

    setPermissions(permissions:Permission[]):void{
        this.permissions = permissions;
    }
}