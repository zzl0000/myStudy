import { Persistent, BasicKeys } from '/@/utils/cache/persistent';
import { CacheTypeEnum } from '/@/enums/cacheEnum';
import projectSetting from '/@/settings/projectSetting';
import {
  TOKEN_KEY,
  PATIENT_STATUS_KEY,
  DOCTOR_STATUS_KEY,
  VIDEO_TAB_KEY,
  CONSULTING_ROOM_STATUS_KEY,
  LEAVE_ROOM_STATUS_KEY,
  ROW_SELECT_ID_KEY,
  DOCTORE_STORE_KEY,
  TAB_KEY,
} from '/@/enums/cacheEnum';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

export function getToken() {
  return getAuthCache(TOKEN_KEY);
}

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

export function setAuthCache(key: BasicKeys, value) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true);
}

export function clearAuthCache(immediate = true) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
  return fn(immediate);
}

export const getVideoTabKey = () => {
  return localStorage.getItem(VIDEO_TAB_KEY);
};

export const setVideoTabKey = (value: string) => {
  localStorage.setItem(VIDEO_TAB_KEY, value);
  return value;
};

export const getRowSelectIdAuth = () => {
  return localStorage.getItem(ROW_SELECT_ID_KEY);
};

export const setRowSelectIdAuth = (value: any) => {
  localStorage.setItem(ROW_SELECT_ID_KEY, value);
  return value;
};

export const getTabKeyAuth = () => {
  return localStorage.getItem(TAB_KEY);
};

export const setTabKeyAuth = (value: any) => {
  localStorage.setItem(TAB_KEY, value);
  return value;
};

export const getDoctoreStoreAuth = () => {
  return localStorage.getItem(DOCTORE_STORE_KEY);
};

export const setDoctoreStoreAuth = (value: any) => {
  localStorage.setItem(DOCTORE_STORE_KEY, JSON.stringify(value));
  return value;
};

export const getConsultingRoomStatus = () => {
  return localStorage.getItem(CONSULTING_ROOM_STATUS_KEY);
};

export const setConsultingRoomStatus = (value: any) => {
  localStorage.setItem(CONSULTING_ROOM_STATUS_KEY, value);
  return value;
};

export const getLeaveRoomStatus = () => {
  return localStorage.getItem(LEAVE_ROOM_STATUS_KEY);
};

export const setLeaveRoomStatus = (value: any) => {
  localStorage.setItem(LEAVE_ROOM_STATUS_KEY, value);
  return value;
};

export const getPatientStatus = (order_sn: any) => {
  return getCacheData(PATIENT_STATUS_KEY, order_sn);
};

export const setPatientStatus = (value: string, order_sn: any) => {
  setCacheData(PATIENT_STATUS_KEY, value, order_sn);
  return value;
};

export const getDoctorStatus = (order_sn: any) => {
  return getCacheData(DOCTOR_STATUS_KEY, order_sn);
};

export const setDoctorStatus = (value: string, order_sn: any) => {
  setCacheData(DOCTOR_STATUS_KEY, value, order_sn);
  return value;
};

const getCacheData = (key: string, order_sn: any) => {
  let obj: any = localStorage.getItem(key);
  if (obj) {
    obj = JSON.parse(obj);
  }
  return obj ? obj[order_sn] : '';
};

const setCacheData = (key: string, value: string, order_sn: any) => {
  let obj: any = localStorage.getItem(key);
  obj = JSON.parse(obj);
  if (!obj) {
    obj = {};
  }
  obj[order_sn] = value;
  localStorage.setItem(key, JSON.stringify(obj));
};

export const getRoomState = (key: string, roomId: any) => {
  let obj: any = localStorage.getItem(key);
  if (obj) {
    obj = JSON.parse(obj);
  }
  console.log(obj, roomId);
  return obj ? obj[roomId] : '';
};

export const setRoomState = (key: string, value: any) => {
  let obj: any = localStorage.getItem(key);
  obj = JSON.parse(obj);
  if (!obj) {
    obj = {};
  }
  obj[value.roomId] = value.state;
  localStorage.setItem(key, JSON.stringify(obj));
};
