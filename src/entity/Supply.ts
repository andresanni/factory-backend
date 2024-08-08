import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SupplyCategory } from "./SupplyCategory";

@Entity()
export class Supply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => SupplyCategory, (category) => category.supplies)
  category: SupplyCategory;
}
