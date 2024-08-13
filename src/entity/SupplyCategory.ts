import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Supply } from "./Supply";

@Entity("supply_category")
export class SupplyCategory {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @OneToMany(() => Supply, (supply) => supply.category)
  supplies?: Supply[];

  constructor(name:string){
    this.name = name;
  }
}
