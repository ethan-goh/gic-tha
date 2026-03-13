import { AppDataSource } from '../datasource';
import { Cafe } from '../../cafe/cafe.entity';
import { Employee, Gender } from '../../employee/employee.entity';
import { CafeEmployee } from '../../cafe-employee/cafe-employee.entity';

async function seed() {
  await AppDataSource.initialize();
  console.log('Connected to database');

  // clear existing data in correct order (respect foreign keys)
  await AppDataSource.query('DELETE FROM cafe_employees');
  await AppDataSource.query('DELETE FROM employees');
  await AppDataSource.query('DELETE FROM cafes');
  console.log('Cleared existing data');

  // seed cafes
  const cafeRepo = AppDataSource.getRepository(Cafe);
  const cafes = cafeRepo.create([
    {
      name: 'Brewlicious',
      description: 'Specialty coffee and artisan pastries in the heart of the city.',
      location: 'Raffles Place',
    },
    {
      name: 'The Daily Grind',
      description: 'Your neighbourhood cafe for great coffee and good vibes.',
      location: 'Tampines',
    },
    {
      name: 'Beanstalk',
      description: 'A cozy spot for remote workers and coffee enthusiasts.',
      location: 'Orchard Road',
    },
    {
      name: 'Drip & Sip',
      description: 'Minimalist cafe specialising in pour-over and cold brew.',
      location: 'Tanjong Pagar',
    },
    {
      name: 'Common Ground',
      description: 'Community-focused cafe with rotating local art exhibitions.',
      location: 'Tiong Bahru',
    },
    {
      name: 'The Roastery',
      description: 'Single-origin roasts and light bites in a warehouse setting.',
      location: 'Jurong East',
    },
    {
      name: 'Kopi Kulture',
      description: 'Modern take on traditional kopi with a contemporary twist.',
      location: 'Bugis',
    },
    {
      name: 'Sunrise Brews',
      description: 'Early morning cafe known for its breakfast sets and flat whites.',
      location: 'Bedok',
    },
  ]);
  const savedCafes = await cafeRepo.save(cafes);
  console.log(`Seeded ${savedCafes.length} cafes`);

  // seed employees
  const employeeRepo = AppDataSource.getRepository(Employee);
  const employees = employeeRepo.create([
    { name: 'Alice Tan', email_address: 'alice.tan@email.com', phone_number: '91234567', gender: Gender.FEMALE },
    { name: 'Bob Lim', email_address: 'bob.lim@email.com', phone_number: '82345678', gender: Gender.MALE },
    { name: 'Carol Ng', email_address: 'carol.ng@email.com', phone_number: '93456789', gender: Gender.FEMALE },
    { name: 'David Koh', email_address: 'david.koh@email.com', phone_number: '84567890', gender: Gender.MALE },
    { name: 'Emma Wong', email_address: 'emma.wong@email.com', phone_number: '95678901', gender: Gender.FEMALE },
    { name: 'Frank Ong', email_address: 'frank.ong@email.com', phone_number: '86789012', gender: Gender.MALE },
    { name: 'Grace Lee', email_address: 'grace.lee@email.com', phone_number: '97890123', gender: Gender.FEMALE },
    { name: 'Henry Tay', email_address: 'henry.tay@email.com', phone_number: '89012345', gender: Gender.MALE },
    { name: 'Irene Chua', email_address: 'irene.chua@email.com', phone_number: '90123456', gender: Gender.FEMALE },
    { name: 'James Yeo', email_address: 'james.yeo@email.com', phone_number: '81234567', gender: Gender.MALE },
    { name: 'Kelly Sim', email_address: 'kelly.sim@email.com', phone_number: '92345678', gender: Gender.FEMALE },
    { name: 'Leon Goh', email_address: 'leon.goh@email.com', phone_number: '83456789', gender: Gender.MALE },
    { name: 'Megan Phua', email_address: 'megan.phua@email.com', phone_number: '94567890', gender: Gender.FEMALE },
    { name: 'Nathan Soh', email_address: 'nathan.soh@email.com', phone_number: '85678901', gender: Gender.MALE },
    { name: 'Olivia Chan', email_address: 'olivia.chan@email.com', phone_number: '96789012', gender: Gender.FEMALE },
    { name: 'Peter Wee', email_address: 'peter.wee@email.com', phone_number: '87890123', gender: Gender.MALE },
  ]);
  const savedEmployees = await employeeRepo.save(employees);
  console.log(`Seeded ${savedEmployees.length} employees`);

  // assign employees to cafes with varied start dates
  // employees[14] (Olivia) and employees[15] (Peter) left unassigned intentionally
  const cafeEmployeeRepo = AppDataSource.getRepository(CafeEmployee);
  const assignments = cafeEmployeeRepo.create([
    { cafe: savedCafes[0], employee: savedEmployees[0], start_date: new Date('2022-06-01') },
    { cafe: savedCafes[0], employee: savedEmployees[1], start_date: new Date('2023-01-15') },
    { cafe: savedCafes[0], employee: savedEmployees[2], start_date: new Date('2024-03-20') },
    { cafe: savedCafes[1], employee: savedEmployees[3], start_date: new Date('2021-11-10') },
    { cafe: savedCafes[1], employee: savedEmployees[4], start_date: new Date('2023-08-25') },
    { cafe: savedCafes[2], employee: savedEmployees[5], start_date: new Date('2022-04-05') },
    { cafe: savedCafes[2], employee: savedEmployees[6], start_date: new Date('2023-07-18') },
    { cafe: savedCafes[3], employee: savedEmployees[7], start_date: new Date('2024-01-30') },
    { cafe: savedCafes[3], employee: savedEmployees[8], start_date: new Date('2022-09-14') },
    { cafe: savedCafes[4], employee: savedEmployees[9], start_date: new Date('2023-05-22') },
    { cafe: savedCafes[4], employee: savedEmployees[10], start_date: new Date('2024-06-10') },
    { cafe: savedCafes[5], employee: savedEmployees[11], start_date: new Date('2021-08-01') },
    { cafe: savedCafes[6], employee: savedEmployees[12], start_date: new Date('2023-02-28') },
    { cafe: savedCafes[7], employee: savedEmployees[13], start_date: new Date('2022-12-05') },
  ]);
  await cafeEmployeeRepo.save(assignments);
  console.log(`Seeded ${assignments.length} cafe-employee assignments`);

  await AppDataSource.destroy();
  console.log('Seed complete');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
