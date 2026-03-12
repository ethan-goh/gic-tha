import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Cafe } from '../cafe/cafe.entity';
import { Employee } from '../employee/employee.entity';

@Entity('cafe_employees')
export class CafeEmployee {
  // composite PK — enforces one employee per cafe at the DB level
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
