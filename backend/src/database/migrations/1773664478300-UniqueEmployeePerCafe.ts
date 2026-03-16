import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueEmployeePerCafe1773664478300 implements MigrationInterface {
    name = 'UniqueEmployeePerCafe1773664478300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cafe_employees" ADD CONSTRAINT "UQ_cafe_employees_employee_id" UNIQUE ("employee_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cafe_employees" DROP CONSTRAINT "UQ_cafe_employees_employee_id"`);
    }
}
