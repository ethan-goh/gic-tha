import { BeforeInsert, Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { CafeEmployee } from '../cafe-employee/cafe-employee.entity';

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

@Entity('employees')
export class Employee {
  @PrimaryColumn({ length: 9 })
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true })
  email_address: string;

  @Column({ length: 8 })
  phone_number: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @OneToOne(() => CafeEmployee, (cafeEmployee) => cafeEmployee.employee)
  cafeEmployee: CafeEmployee;

  @BeforeInsert()
  generateId() {
    // generates UIXXXXXXX — UI prefix + 7 alphanumeric characters
    if (!this.id) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = 'UI';
      for (let i = 0; i < 7; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.id = result;
    }
  }
}
