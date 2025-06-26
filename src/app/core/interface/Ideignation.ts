export interface Designation {
  id?: number;
  designationName: string;
  departmentId: number;
  departmentName: string;
  reportTo: string;
  reportToId?: number;
}
