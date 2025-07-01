// ideignation.ts
export interface Designation {
  id: number;
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
  name: string;
  designationName: string;
  departmentId: number;
}

export interface Department {
  id: number;
  departmentName: string;
  underDepartment?: string;
}

export interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  dob: Date | string;
  departmentId: number;
  designationId: number;
  reportToId?: number;
  areaId: number;
  countryId: number;
  stateId: number;
  cityId: number;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  bankAddress: string;
  documents?: EmployeeDocuments;
  isDeleted?: number;
  aadharFilePath?: string;
  resumeFilePath?: string;
  appointmentLetterFilePath?: string;
}

export interface BankDetails {
  accountHolder: string;
  accountNumber: string;
  IFSC: string;
  bankAddress: string;
}

export interface EmployeeDocuments {
  aadhar?: File;
  resume?: File;
  appointmentLetter?: File;
}

export interface EmployeeDropdown {
  id: number;
  firstName: string;
  lastName: string;
  reportToId?: number;
}


export interface EnquirySource {
  enquirySourceId?: number;
  enquirySourceName: string;
  isDeleted?: number;
  actionType?: string;
  createdDate?: string;
  isUpdated?: string;
}
