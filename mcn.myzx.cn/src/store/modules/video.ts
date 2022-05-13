import { defineStore } from 'pinia';
import { store } from '/@/store';
import {
  setPatientStatus,
  setDoctorStatus,
  getPatientStatus,
  getDoctorStatus,
  getVideoTabKey,
  setVideoTabKey,
  getConsultingRoomStatus,
  setConsultingRoomStatus,
  getLeaveRoomStatus,
  setLeaveRoomStatus,
} from '/@/utils/auth';

interface UserState {
  isConsultingRoom: any;
  isLeaveRoom: Boolean;
  patientStatus?: string;
  dictorStatus?: string;
  videoTabKey?: string | undefined;
  playList?: any;
  isLocalStream: Boolean;
}

export const useVideoStore = defineStore({
  id: 'app-video',
  state: (): UserState => ({
    isLocalStream: false,
    isLeaveRoom: false,
    isConsultingRoom: false,
    // 登录用户信息
    patientStatus: undefined,
    dictorStatus: undefined,
    videoTabKey: undefined,
    playList: [],
  }),
  getters: {
    getIsConsultingRoomStatus(): Boolean {
      return this.isConsultingRoom || getConsultingRoomStatus() == 'true' ? true : false;
    },
    getIsLeaveRoomStatus(): Boolean {
      return this.isLeaveRoom || getLeaveRoomStatus() == 'true' ? true : false;
    },

    getIsLocalStreamStatus(): Boolean {
      return this.isLocalStream;
    },
    getPatientStatus(order_sn): string {
      return this.patientStatus || getPatientStatus(order_sn);
    },
    getDictorStatus(order_sn): string {
      return this.dictorStatus || getDoctorStatus(order_sn);
    },
    getVideoTabKey() {
      return this.videoTabKey || getVideoTabKey();
    },
    getPlayList() {
      return this.playList || [];
    },
  },
  actions: {
    setIsConsultingRoomStatus(state: any) {
      this.isConsultingRoom = null;
      this.isConsultingRoom = state;
      setConsultingRoomStatus(state);
    },
    setIsLeaveRoomStatus(state: boolean) {
      this.isLeaveRoom = state;
      setLeaveRoomStatus(state);
    },
    setIsLocalStreamStatus(state: boolean) {
      this.isLocalStream = state;
    },
    setPatientStatusActions(val: string, order_sn: any) {
      this.patientStatus = val;
      setPatientStatus(val, order_sn);
    },
    setDoctorStatusActions(val: string, order_sn: any) {
      this.dictorStatus = val;
      setDoctorStatus(val, order_sn);
    },
    setVideoTabKeyActions(val: string) {
      this.videoTabKey = val;
      setVideoTabKey(val);
    },
    setPlayListActions(arr: any) {
      console.log(arr);
      this.playList = arr;
    },
  },
});

// Need to be used outside the setup
export function useVideoStoreWithOut() {
  return useVideoStore(store);
}
