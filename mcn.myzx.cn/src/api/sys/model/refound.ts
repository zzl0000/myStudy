export interface RefundModel {
  id: number;
  order_sn: string | null;
  type: string | null;
  dial_time: string | null;
  order_status: string | null;
  apply_refund_time: string | null;
  doctor_name: string | null;
  ks1name: string | null;
  ks2name: string | null;
  patient_name: string | null;
  patient_phone: string | null;
  pay_money: string | number | null;
  refund_reason: string | null;
  audit_status: string | null;
  refund_status: string | null;
}

export type RefundListModel = RefundModel[];
