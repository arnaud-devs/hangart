export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImage?: string;
  phone?: string;
  dateOfBirth?: string | Date;
  isActive: boolean;
  lastLogin?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}