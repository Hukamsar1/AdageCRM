// interfaces.ts (or at the top of your component file)
export interface Designation {
  designationId: number;
  designationName: string;
  departmentId: number;
  departmentName: string;
  reportTo?: string;
  reportToId?: number;
  createdDate?: string;
  isUpdated?: string;
  isDeleted?: number;
  actionType?: string;
}

export interface DesignationForDropdown {
  id: number;
  name: string;          // For display in dropdown
  designationName: string; // Original property
  departmentId: number;
}


interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  reportToId?: number;
  isDeleted?: number;
}

interface Department {
  id: number;
  departmentName: string;
  underDepartment?: string;
}