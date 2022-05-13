export interface MediumModel {
  id: number;
  title: string;
}

export interface TrackModel {
  id: number;
  organization_id: number;
  patient_name: string;
  patient_phone: string;
  sex: number;
  age: number;
  idcard?: string | null;
  wechat?: string | null;
  regions: number[];
  medium_id: number;
  medium_title: string;
  next_contact_time: string;
  disease: string;
  medical_insurance: number;
  patient_classification: number;
  intention: number;
  intention_doctor_id: number;
  order_doctor_id: number;
  description: string;
  diagnose: number;
  create_user_id: number;
  trace_user_id: number;
}
