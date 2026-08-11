export type Role = 'STAFF' | 'MANAGER' | 'FINANCE' | 'ADMIN' | 'SUPER_ADMIN';
export type Status = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ARCHIVED';
export type ProjectStatus = 'PLANNED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface BaseEntity {
  id?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  designation?: string;
  role: Role;
  status: Status;
}

export interface Staff extends User {
  // Staff is essentially a User in this context, alias for clarity if needed
}

export interface Client extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  status: Status;
}

export interface Project extends BaseEntity {
  name: string;
  clientId: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string | Date | any;
  endDate?: string | Date | any;
  budget?: number;
}

export interface Task extends BaseEntity {
  projectId: string;
  title: string;
  description?: string;
  assignedTo?: string; // staff ID
  status: TaskStatus;
  dueDate?: string | Date | any;
}

export interface Course extends BaseEntity {
  title: string;
  description?: string;
  duration?: string; // e.g., "3 months"
  fee?: number;
  status: Status;
}

export interface Batch extends BaseEntity {
  courseId: string;
  name: string;
  instructorId?: string; // staff ID
  startDate?: string | Date | any;
  endDate?: string | Date | any;
  status: Status;
}

export interface Student extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  enrolledBatches?: string[]; // array of batch IDs
  status: Status;
}

export interface FinanceTransaction extends BaseEntity {
  type: TransactionType;
  amount: number;
  description: string;
  date: string | Date | any;
  referenceId?: string; // could be projectId, studentId, etc.
  category?: string;
}

export interface AuditLog extends BaseEntity {
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: any;
  timestamp: string | Date | any;
}
