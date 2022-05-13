export interface OperationModel {
  hospital_name: string;
  // 隶属MCN机构ID
  organization_id: number;
  name: string;
  phone: string;
  kid2: number;
  tid: number;
}

// export interface InstitutionsParams {
//   mcn_id: number;
// }

export interface OperationSeting {
  did: number;
  doctorId: number;
}
