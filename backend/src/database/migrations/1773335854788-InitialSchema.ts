import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1773335854788 implements MigrationInterface {
    name = 'InitialSchema1773335854788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cafes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text NOT NULL, "logo" character varying, "location" character varying(255) NOT NULL, CONSTRAINT "PK_1e8e00a60bc4dd368d8d55a1d7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cafe_employees" ("cafe_id" uuid NOT NULL, "employee_id" character varying(9) NOT NULL, "start_date" date NOT NULL, CONSTRAINT "PK_8e5775223fb33174c06b9d97f17" PRIMARY KEY ("cafe_id", "employee_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."employees_gender_enum" AS ENUM('Male', 'Female')`);
        await queryRunner.query(`CREATE TABLE "employees" ("id" character varying(9) NOT NULL, "name" character varying(255) NOT NULL, "email_address" character varying NOT NULL, "phone_number" character varying(8) NOT NULL, "gender" "public"."employees_gender_enum" NOT NULL, CONSTRAINT "UQ_589863617aaee6817a766a23687" UNIQUE ("email_address"), CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cafe_employees" ADD CONSTRAINT "FK_2a597856679c65f9ab4988d40e2" FOREIGN KEY ("cafe_id") REFERENCES "cafes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cafe_employees" ADD CONSTRAINT "FK_6577e4f71edb842c4acbebd0e7a" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cafe_employees" DROP CONSTRAINT "FK_6577e4f71edb842c4acbebd0e7a"`);
        await queryRunner.query(`ALTER TABLE "cafe_employees" DROP CONSTRAINT "FK_2a597856679c65f9ab4988d40e2"`);
        await queryRunner.query(`DROP TABLE "employees"`);
        await queryRunner.query(`DROP TYPE "public"."employees_gender_enum"`);
        await queryRunner.query(`DROP TABLE "cafe_employees"`);
        await queryRunner.query(`DROP TABLE "cafes"`);
    }

}
