export interface Payment {
  paymentId: number;
  leadId: number;
  date: string;          // ISO string for simplicity
  voucherno: string;
  ledger: string;
  modeofPayment: string;
  amount: number;
  remark: string;
  isDeleted: boolean;
  isUpdated: string;
  createdDate: string;
  actionType: string;
}
