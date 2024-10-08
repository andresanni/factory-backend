import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SupplyCategory } from "./SupplyCategory";

@Entity()
export class Supply {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @ManyToOne(() => SupplyCategory, (category) => category.supplies, {eager:true})
  category: SupplyCategory;

constructor(name: string, category:SupplyCategory){
  this.name = name;
  this.category = category;
}
}
