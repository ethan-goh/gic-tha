export interface Cafe {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  location: string;
  employees: number;
}

export interface Employee {
  id: string;
  name: string;
  email_address: string;
  phone_number: string;
  gender: 'Male' | 'Female';
  days_worked: number;
  cafe: string;
  cafeId: string | null;
}

export interface CreateCafeDto {
  name: string;
  description: string;
  logo?: string;
  location: string;
}

export interface UpdateCafeDto {
  name?: string;
  description?: string;
  logo?: string;
  location?: string;
}

export interface CreateEmployeeDto {
  name: string;
  email_address: string;
  phone_number: string;
  gender: 'Male' | 'Female';
  cafeId?: string;
}

export interface UpdateEmployeeDto {
  name?: string;
  email_address?: string;
  phone_number?: string;
  gender?: 'Male' | 'Female';
  cafeId?: string;
}
