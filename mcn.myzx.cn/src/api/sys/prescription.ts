import { defHttp, expressHttp } from '/@/utils/http/axios';
import { PrescriptionModel } from './model/prescriptionModel';
import { useUserStoreWithOut } from '/@/store/modules/user';

const userStore = useUserStoreWithOut();

enum Api {
  GetPrescriptions = '/organization/orgId/prescript',
  GetPrescription = '/prescript/id',
  editPrescriptionAddres = `/prescript/address`,
  GetChineseDrug = '/prescription/chineseDrug',
  GetWesterDrug = '/prescription/westernDrug',
  GetBasics = '/prescription/basics',
  CreatePrescriptions = '/prescripts',
  processingFee = `/prescription/pharmacyId/processing-fee`,
  prescriptSave = `/prescript/save`,
  pharmacyDesc = `/prescript/prescriptId/pharmacy-desc`,
  GetPrescriptionExpress = '/prescript-express',
  prescriptIcd = `/hospital-manage/prescript/icd`,
  getPharmacyList = `/doctor/doctorId/pharmacy`,
  getDosageList = `/pharmacy/pharmacy_id/dosage`,
  getPrescriptList = `/hospital-manage/prescript/common-list`,
  getPrescriptAdd = `/hospital-manage/prescript/common-add`,
  getPrescriptSave = `/hospital-manage/prescript/save`,
  getPrescriptRefundLog = `/organization/orgId/prescript`,
  getIdentificationAddress = '/baidu/address',
  getJournaList = '/prescript/log/id',
}

/**
 * @description: 获取权限列表
 */
export const getPrescriptionList = (params: any) => {
  return defHttp.get<PrescriptionModel[]>({
    url: Api.GetPrescriptions.replace('orgId', String(userStore.getUserInfo.organization_id)),
    params,
  });
};

/**
 * @description: 获取处方订单详情
 */
export const getPrescription = (id: string | number) => {
  return defHttp.get<PrescriptionModel>({ url: Api.GetPrescription.replace('id', String(id)) });
};
/**
 * @description: 获取修改日志列表
 */
export const getJournaList = (id: string | number) => {
  return defHttp.get<PrescriptionModel>({ url: Api.getJournaList.replace('id', String(id)) });
};

/**
 * @description: 获取处方订单详情 物流信息
 */

export const getPrescriptionExpress = (params: any) => {
  return expressHttp.get<any>({
    url: 'https://qyexpress.market.alicloudapi.com/composite/queryexpress',
    params,
  });
};

/**
 * @description: 修改处方订单收货地址
 */
export const editPrescriptionAddres = (params: any) => {
  return defHttp.post<any>({ url: Api.editPrescriptionAddres, params });
};

export const getChineseDrug = (params: any) => {
  return defHttp.get<any>({ url: Api.GetChineseDrug, params });
};

export const getWesterDrug = (params: any) => {
  return defHttp.get<any>({ url: Api.GetWesterDrug, params });
};

export const getBasics = (params: any) => {
  return defHttp.get<any>({ url: Api.GetBasics, params });
};

// 药房加工费接口
export const getProcessingFee = (pharmacyId: string | number, dosage_id) => {
  return defHttp.get<any>({
    url: Api.processingFee.replace('pharmacyId', String(pharmacyId)),
    params: { dosage_id },
  });
};

export const createPrescription = (params: any) => {
  return defHttp.post<PrescriptionModel[]>({ url: Api.CreatePrescriptions, params });
};

export const prescriptSave = (params: any) => {
  return defHttp.post<PrescriptionModel[]>({ url: Api.prescriptSave, params });
};

// 药房加工费接口
export const editPharmacyDesc = (prescriptId: string | number, make) => {
  return defHttp.post<any>({
    url: Api.pharmacyDesc.replace('prescriptId', String(prescriptId)),
    params: { make },
  });
};

// 获取诊断列表
export const getPrescriptIcd = (params) => {
  return defHttp.get<any>({ url: Api.prescriptIcd, params });
};

// 获取药房列表
export const getPharmacyListApi = (doctorId, params) => {
  return defHttp.get<any>({ url: Api.getPharmacyList.replace('doctorId', doctorId), params });
};

// 获取剂型列表
export const getDosageListApi = (pharmacy_id) => {
  return defHttp.get<any>({ url: Api.getDosageList.replace('pharmacy_id', pharmacy_id) });
};

// 保存模板方
export const getPrescriptAddApi = (params: any) => {
  return defHttp.post<any>({ url: Api.getPrescriptAdd, params });
};

//获取历史方、模版方
export const getPrescriptListApi = (params: any) => {
  return defHttp.get<any>({ url: Api.getPrescriptList, params });
};

//超量与配伍药剂判断
export const getPrescriptSave = (params: any) => {
  return defHttp.post<any>({ url: Api.getPrescriptSave, params });
};

// 百度Ai智能识别地址

export const getIdentificationAddress = (params: any) => {
  return defHttp.post<any>({
    url: `${Api.getIdentificationAddress}`,
    params,
  });
};
