import { defHttp } from '/@/utils/http/axios';
import { getPatientListResultModel } from './model/patientModel';

enum Api {
  GetPatientList = '/getPatientList',
  CreatePatient = '/createPatient',
  UpdatePatient = '/updatePatient',
  DeletePatient = '/deletePatient',
}

export const getPatientList = () => {
  return defHttp.get<getPatientListResultModel>({ url: Api.GetPatientList });
};

export const createPatient = () => {
  return defHttp.post<getPatientListResultModel>({ url: Api.CreatePatient });
};

export const updatePatient = () => {
  return defHttp.post<getPatientListResultModel>({ url: Api.UpdatePatient });
};

export const deletePatient = () => {
  return defHttp.post<getPatientListResultModel>({ url: Api.DeletePatient });
};
