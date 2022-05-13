/**
 * @description: 周组织排班模型
 */
export interface WeekSchedulingModel {
  did: number;
  doctor_id: number;
  doctor_title: string;
  column: boolean;
  monday: string | SchedulingModel[] | null;
  tuesday: string | SchedulingModel[] | null;
  wednesday: string | SchedulingModel[] | null;
  thursday: string | SchedulingModel[] | null;
  friday: string | SchedulingModel[] | null;
  saturday: string | SchedulingModel[] | null;
  sunday: string | SchedulingModel[] | null;
}

/**
 * @description: 用户天排班模型
 */
export interface SchedulingModel {
  day_available_num: number;
  day_already_num: number;
  day_video_num: number;
  day_voice_num: number;
  disabled: boolean;
  video?: HourSchedulingModel[];
  voice: HourSchedulingModel[];
}

/**
 * @description: 用户小时排班模型
 */
export interface HourSchedulingModel {
  id: number;
  start_time: string;
  end_time: string;
  available_num: number;
  already_num: number;
  type: string;
}
