import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CafeEmployee } from '../cafe-employee/cafe-employee.entity';

@Entity('cafes')
export class Cafe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  logo: string | null;

  @Column({ length: 255 })
  location: string;

  @OneToMany(() => CafeEmployee, (cafeEmployee) => cafeEmployee.cafe)
  cafeEmployees: CafeEmployee[];
}
