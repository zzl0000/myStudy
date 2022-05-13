export interface RegisterModel {
  id: number;
  order_no: string | null;
  patient_name: string | null;
  patient_mobile: string | null;
  money: string | null;
  pay_time: string | null;
  waiter_name: string | null;
  pay_status: string | null;
  doctor_info: string | null;
  order_sn: string | null;
}

export type RegisterListModel = RegisterModel[];
