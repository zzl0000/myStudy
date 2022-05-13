/**
 * 接诊管理 状态管理机制
 *
 */

import { defineStore } from 'pinia';
import { store } from '/@/store';
import { objectMerge } from '/@/utils/index';
import Events from '/@/utils/events';

// 引入缓存机制
import {
  setRowSelectIdAuth,
  getRowSelectIdAuth,
  setDoctoreStoreAuth,
  getDoctoreStoreAuth,
  setTabKeyAuth,
  getTabKeyAuth,
} from '/@/utils/auth';

interface UserState {
  isLoad: Boolean;
  orderId: any;
  orderSn: any;
  payStatus: Number;
  patientStore: Object;
  doctoreStore: Object;
  consultingRoomStore: Object;
  videoStore: Object;
  prescriptStore: Object;
  CMedicineList: Array<any>;
  WMedicineList: Array<any>;
  rowSelectId: any;
  tabKey: any;
}

export const useClinicalReceptionStore = defineStore({
  id: 'app-clinical-reception',
  state: (): UserState => ({
    isLoad: false,
    rowSelectId: '',
    tabKey: '',
    orderId: '',
    orderSn: '',
    payStatus: 0,
    // 患者公用
    patientStore: {
      paid: '',
      patient_name: '',
      patient_sex: '',
      patient_age: '',
      patient_mobile: '',
      user_avatar: '',
    },
    doctoreStore: {
      did: '',
      doctor_id: '',
      doctor_name: '',
      doctor_title: '',
      kid1: 13,
      kid2: 46,
      ks1name: '',
      ks2name: '',
      doctor_avatar: '',
      hospital_name: '',
    },
    //诊室公用
    consultingRoomStore: {},
    //视频store
    videoStore: {},
    //处方Store
    prescriptStore: {},
    //中药材列表
    CMedicineList: [],
    //西药材列表
    WMedicineList: [
      {
        id: 0,
        drug_name: '',
        drug_type: '',
        number: 1,
        autograph: '',
        unit_price: '',
        usage: '',
        drug_id: 0,
        name: '',
        unit: '盒',
        retail_price: '0.00',
        specs: '',
        value: '',
        loading: false,
        offline_share: 0,
        online_share: 0,
        key: Date.now() + parseInt(Math.random() * (1000 + 1), 10),
      },
    ],

    // 腾讯云
  }),
  getters: {
    getIsLoad(): any {
      return this.isLoad;
    },
    getTabKey(): any {
      return this.tabKey || getTabKeyAuth();
    },
    getRowSelectId(): any {
      return this.rowSelectId || getRowSelectIdAuth();
    },
    getOrderId(): any {
      return this.orderId;
    },
    getOrderSn(): any {
      return this.orderSn;
    },
    getPayStatus(): any {
      return this.payStatus;
    },
    getPatientStore(): any {
      return this.patientStore;
    },
    getDoctorStore(): any {
      return getDoctoreStoreAuth() ? JSON.parse(getDoctoreStoreAuth()) : {};
    },
    getCMedicineList(): any {
      return this.CMedicineList;
    },
    getWMedicineList(): any {
      return this.WMedicineList;
    },
  },
  actions: {
    setIsLoad(state: boolean) {
      this.isLoad = state;
    },
    setRowSelectId(val: number) {
      console.log(val);
      this.rowSelectId = val;
      setRowSelectIdAuth(val);
    },
    setTabKey(val: string) {
      this.tabKey = val;
      setTabKeyAuth(val);
    },

    setOrderIdSync(val: number) {
      this.orderId = val;
    },
    setOrderSnSync(val: string) {
      this.orderSn = val;
    },
    setPayStatus(val: number) {
      this.payStatus = val;
    },
    setPatientStoreSync(obj: object) {
      this.patientStore = objectMerge(this.patientStore, obj);
    },
    setDoctoreStoreSync(obj: object) {
      this.doctoreStore = objectMerge(this.doctoreStore, obj);
      setDoctoreStoreAuth(this.doctoreStore);
    },
    setCMedicineListSync(arr: Array<any>) {
      // console.log(arr);
      this.CMedicineList = arr;
    },
    setWMedicineListSync(arr: Array<any>) {
      const defArr = [
        {
          id: 0,
          drug_name: '',
          drug_type: '',
          number: 1,
          autograph: '',
          unit_price: '',
          usage: '',
          drug_id: 0,
          name: '',
          unit: '盒',
          retail_price: '0.00',
          specs: '',
          value: '',
          loading: false,
          offline_share: 0,
          online_share: 0,
          key: Date.now() + parseInt(Math.random() * (1000 + 1), 10),
          usage_day: '',
          isLack: '',
        },
      ];
      arr.map((m) => {
        defArr.unshift({
          id: m.id,
          drug_name: m.drug_name,
          drug_type: m.drug_type,
          number: m.number,
          autograph: m.autograph || '',
          unit_price: m.unit_price,
          usage: m.usage,
          drug_id: m.drug_id,
          name: m.drug_name,
          unit: m.unit,
          usage_day: m.medication_days,
          retail_price: m.unit_price,
          specs: m.specs,
          value: m.drug_name,
          loading: false,
          offline_share: 0,
          online_share: 0,
          isLack: m.isLack,
          key: Date.now() + parseInt(Math.random() * (1000 + 1), 10),
        });
      });
      this.WMedicineList = defArr;
      Events.trigger('updateWMList', '');
    },
  },
});

// Need to be used outside the setup
export function useClinicalReceptionStoreWithOut() {
  return useClinicalReceptionStore(store);
}
