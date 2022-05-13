export interface PrescriptionModel {
  order_no: string;
  consultation_fee: string | number | null;
  process_fee: string | number | null;
  patient_mobile: string | number | null;
  incr_price: string | number | null;
  express_fee: string | number | null;
  medical_fee: string | number | null;
  examine_status: number;
  discount: string | number | null;
  created_at: string | null;
  pay_status: number;
  first_total_fee: string | number | null;
  patient_sex: number;
  pharmacy_id: number;
  total_fee: string | number | null;
  patient_name: string | null;
  pharmacy: PharmacyModel|null;
  id: number;
  patient_age: number | null;
  doctor_name: string | null;
  prescript_no: string | null;
  status: number | null;
}

export interface PharmacyModel {
  pharmacy_name: string | null;
  id: number | null;
}
