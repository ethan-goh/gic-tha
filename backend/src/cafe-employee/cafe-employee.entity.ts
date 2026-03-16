import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { Cafe } from '../cafe/cafe.entity';
import { Employee } from '../employee/employee.entity';

@Entity('cafe_employees')
@Unique(['employeeId']) // one employee can only be assigned to one café at a time
export class CafeEmployee {
  @PrimaryColumn({ name: 'cafe_id' })
  cafeId: string;

  @PrimaryColumn({ name: 'employee_id', length: 9 })
  employeeId: string;

  @ManyToOne(() => Cafe, (cafe) => cafe.cafeEmployees, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cafe_id' })
  cafe: Cafe;

  @OneToOne(() => Employee, (employee) => employee.cafeEmployee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'date' })
  start_date: Date;
}
