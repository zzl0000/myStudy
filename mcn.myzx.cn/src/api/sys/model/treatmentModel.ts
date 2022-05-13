export interface TreatmentModel {
  id: number;
  doctor_id: number;
  doctor_name: string;
  patient_id: number;
  patient_name: string;
  age: string;
  sex: number;
  patient_phone: string | null;
  doctor_phone: string | null;
  dial_time: string;
  pay_status: number;
  order_status: number;
  prescription: number;
}

