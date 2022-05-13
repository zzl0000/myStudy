export interface AppointmentsModel {
  id: number;
  type: number;
  object_id: string | null;
  order_sn: string | null;
  patient: AppointmentsPatientModel;
  doctor_name: string | null;
  amount: string | null;
  created_at: string | null;
  video_type: string | null;
  diagnosis_type: string | number | null;
  diagnosis_code: string | number | null;
  doctor_id: number;
  graphic_code: string | number | null;
  ks2name: string | number | null;
  pay_time: string | number | null;
  v3type: number | null;
  pay_status: number | null;
  refund_status: string | number | null;
  qrcode: AppointmentsQrcode;
  order_status: string | null;
  status: string | null;
  appoint_date: string | null;
  start_time: string | null;
  end_time: string | null;
  dial_time: string | null;
  buy_medicine: string | null;
  prescription: string | null;
  source: string | null;
}

export interface AppointmentsPatientModel {
  paid: number;
  user_id: number;
  uname: string | null;
  mobile: string | null;
  sex: number;
  age: number;
  age_type: number;
  relation: string | number | null;
  visit: string | null;
  disease: string | number | null;
}

interface AppointmentsQrcode {
  url: string;
}

export type AppointmentsListModel = AppointmentsModel[];
