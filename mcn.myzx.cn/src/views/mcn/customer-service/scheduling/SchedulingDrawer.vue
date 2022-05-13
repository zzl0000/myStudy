<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="排班管理"
    width="500px"
    @ok="handleSubmit"
  >
    <Tabs v-model:activeKey="activeKey" @change="handleChange">
      <TabPane key="1" tab="视频排班">

      </TabPane>
      <TabPane key="2" tab="电话排班">

      </TabPane>
    </Tabs>

    <h1 class="title">
      <span>{{record && record.doctor_title}}医生</span>
      <span>{{scheduling && scheduling.week}} {{scheduling && scheduling.date}}</span>
    </h1>

    <Form ref="formRef" :model="formState" :label-col="{span: 6}" :wrapper-col="{span: 18}">
      <template v-for="(domain, index) in formState.domains" :key="domain.key">
        <FormItem
          label="坐诊时间"
          class="enter-x"
        >
          <TimePicker 
            v-model:value="domain.startTime"
            format="HH:mm"
            valueFormat="HH:mm"
            placeholder="开始时间"
            :minute-step="30"
            :disabledHours="startTimeDisabledHours"
            :disabledMinutes="startTimeDisabledMinutes"
            @change="(time) => onStartTimeChange(time, index)"
          />
          <span style="margin: 0 8px;">-</span>
          <TimePicker 
            v-model:value="domain.endTime"
            format="HH:mm"
            valueFormat="HH:mm"
            placeholder="结束时间"
            :minute-step="30"
            :disabledHours="endTimeDisabledHours"
            :disabledMinutes="endTimeDisabledMinutes"
            @change="(time) => onEndTimeChange(time, index)"
            name="end-time"
          />
          <MinusCircleOutlined
            class="dynamic-delete-button"
            @click="removeDomain(domain)"
            style="margin-left: 8px;"
          />
        </FormItem>
         <FormItem
          label="号源数"
          class="enter-x"
        >
          <InputNumber 
            v-model:value="domain.availableNum"
            :min="1"
            :precision='0'
          />
          <span class="reg-num">
            <span>已预约号源: {{ domain.alreadyNum }}</span>
            <span>剩余号源: {{ domain.availableNum - domain.alreadyNum }} </span>
          </span>
        </FormItem>
        <Divider></Divider>
      </template>
      <FormItem class="enter-x">
        <a-button type="dashed" style="width: 82%;margin-left:118px" @click="addDomain">
          <PlusOutlined />
          添加
        </a-button>
      </FormItem>
    </Form>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, unref, reactive } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Tabs, Form, TimePicker, Divider, InputNumber } from 'ant-design-vue';
  import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import {useMessage} from "/@/hooks/web/useMessage";
  import { createScheduling } from '/@/api/sys/scheduling';

  const TabPane = Tabs.TabPane ;
  const FormItem = Form.Item;

  interface Domain {
    id: string;
    startTime: any;
    endTime: any;
    availableNum: number;
    alreadyNum: number;
    key: number;
  }

  const emit = defineEmits(['success', 'register']);
  const { createMessage,createSuccessModal, createWarningModal } = useMessage();
  const { info, success, warning, error } = createMessage;

  const isUpdate = ref(true);
  const record = ref();
  const formRef = ref();
  const scheduling = ref();

  const formState =reactive({
    domains: [{startTime: '', endTime: '', availableNum: 1, alreadyNum: 0, key: Date.now()}]
  });

  const video = ref( [{startTime: null, endTime: null, availableNum: 1, alreadyNum: 0, key: Date.now()}]);
  const voice =ref( [{startTime: null, endTime: null, availableNum: 1, alreadyNum: 0, key: Date.now()}]);

  /*const state = reactive({
    video: [{startTime: null, endTime: null, availableNum: 0, alreadyNum: 0, key: Date.now()}],
    voice: [{startTime: null, endTime: null, availableNum: 0, alreadyNum: 0, key: Date.now()}]
  })*/

  const activeKey = ref('1');

  var videoDeleteIds = [];
  var voiceDeleteIds = [];

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetForm();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    record.value = data.record;
    scheduling.value = data.scheduling;

    video.value.splice(0);
    voice.value.splice(0);
    videoDeleteIds = [];
    voiceDeleteIds = [];

    if (data.scheduling.video.length > 0) {
      initVideo(data.scheduling.video);
    }
    if (data.scheduling.voice.length > 0) {
      initVoice(data.scheduling.voice);
    }

    if (unref(activeKey) === '1') {
      formState.domains = video;
    } else {
      formState.domains = voice;
    }

  });

  const getInitParams = (scheduling: any) => {
    return {
      id: String(scheduling.id),
      startTime: scheduling.start_time,
      endTime: scheduling.end_time,
      availableNum: scheduling.available_num,
      alreadyNum: scheduling.already_num,
      key: Date.now()+Math.round(Math.random()*1000000+10),
    };
  };

  const initVideo = (schedulingList: any) => {
    for(const scheduling of schedulingList) {
      video.value.unshift(getInitParams(scheduling));
    }
    if (video.value.length === 0) {
      video.value.push({
        id: "",
        startTime: null,
        endTime: null,
        availableNum: 1,
        alreadyNum: 0,
        key: Date.now()+Math.round(Math.random()*100000+10),
      });
    }
  };

  const initVoice = (schedulingList: any) => {
    for(const scheduling of schedulingList) {
      voice.value.unshift(getInitParams(scheduling));
    }
    if (voice.value.length === 0) {
      voice.push({
        id: "",
        startTime: null,
        endTime: null,
        availableNum: 1,
        alreadyNum: 0,
        key: Date.now()+Math.round(Math.random()*100000+10),
      });
    }
  };

  const handleChange = () => {
    if (unref(activeKey) === '1') {
      formState.domains = video;
    } else {
      formState.domains = voice;
    }
  };

  const handleSubmit = () => {
    formRef.value.validate().then(async () => {
      for(const item of video.value) {
        if ((item.startTime != null && item.endTime == null)) {
          error('视频坐诊开始时间'+item.startTime+'必须设置相应的结束时间!');
          return;
        }
        if ((item.startTime == null && item.endTime != null)) {
          error('视频坐诊结束时间'+item.endTime+'必须设置相应的开始时间!');
          return;
        }
        if (item.availableNum != null) {
          if ((item.startTime == null && item.endTime == null)) {
            error('请对设置了号源数的视频排班设置坐诊开始和结束时间!');
            return;
          }
        }
        const start = parseInt(item.startTime.replace('00:', '24').replace(':', ''));
        const end = parseInt(item.endTime.replace('00:', '24').replace(':', ''));
        if (start >= end) {
          error('视频排班设置'+item.startTime+'-'+item.endTime+'设置错误，起始时间不能大于等于结束时间');
          return;
        }
      }

      for(const item of voice.value) {
        if ((item.startTime != null && item.endTime == null)) {
          error('电话问诊开始时间'+item.startTime+'必须设置相应的结束时间!');
          return;
        }
        if ((item.startTime == null && item.endTime != null)) {
          error('电话问诊坐诊结束时间'+item.endTime+'必须设置相应的开始时间!');
          return;
        }
        if (item.availableNum != null) {
          if ((item.startTime == null && item.endTime == null)) {
            error('请对设置了号源数的电话问诊排班设置坐诊开始和结束时间!');
            return;
          }
        }
        const start = parseInt(item.startTime.replace('00:', '24').replace(':', ''));
        const end = parseInt(item.endTime.replace('00:', '24').replace(':', ''));
        if (start >= end) {
          error('电话问诊排班设置'+item.startTime+'-'+item.endTime+'设置错误，起始时间不能大于等于结束时间');
          return;
        }
      }

      // const checks = state.video.concat(voice);

      setDrawerProps({ confirmLoading: true });

      const params = {
        did: record.value.did,
        mold: unref(activeKey),
        dates: scheduling.value.date,
        delete_ids: [voiceDeleteIds, videoDeleteIds],
        schedules: [voice.value, video.value],
      };
      console.log(params);

      await createScheduling(record.value.doctor_id, params)

      success(record.value.doctor_title + ' ' +scheduling.value.date+ '排班编辑成功');
      closeDrawer();
      emit('success');
    }).catch((error) => {
      console.log(error)
      setDrawerProps({ confirmLoading: false });
    });
  };

  const resetForm = () => {
    formRef.value.resetFields();
  };

  const addDomain = () => {
    formState.domains.push({
      id: 0,
      startTime: null,
      endTime: null,
      availableNum: 1,
      alreadyNum: 0,
      key: Date.now()+Math.round(Math.random()*100000+10),
    });
  };

  const removeDomain = (item: Domain) => {
    console.log(item);
    if (item?.alreadyNum > 0 || item?.already_num > 0) {
      error('已有预约挂号,无法删除此时间段排班!');
      return;
    }
    let index = formState.domains.indexOf(item)
    if (index !== -1) {
      formState.domains.splice(index, 1);
    }

    if (unref(activeKey) === '1') { // 视频问诊
      videoDeleteIds.push(item.id);
    } else { //电话问诊
      voiceDeleteIds.push(item.id);
    }
  };

  const startTimeDisabledHours = () => {
    return [0, 1,2,3,4,5,6];
  };

  const startTimeDisabledMinutes = (selectedHour) => {

  };

  const endTimeDisabledHours = () => {
    return [1,2,3,4,5,6];
  };

  const endTimeDisabledMinutes = (selectedHour) => {
    if (selectedHour === 0) {
      return [30];
    }
  };

  const onStartTimeChange = (time: string, index: number) => {
    const end = formState.domains[index].endTime;
    if (end === null || end === '') {
      return;
    }
    const endTime = parseInt(end.replace('00:','24').replace(':', ''));
    const startTime = parseInt(time.replace('00:','24').replace(':', ''));
    if (endTime <= startTime) {
      formState.domains[index].startTime = null;
      warning('排班结束时间应大于开始时间!');
    }
  };

  const onEndTimeChange = (time: string, index: number) => {
    const start = formState.domains[index].startTime;
    if (start === null || start === '') {
      return;
    }
    const startTime = parseInt(start.replace('00:','24').replace(':', ''));
    let endTime = parseInt(time.replace('00:','24').replace(':', ''));
    if (endTime <= startTime) {
      formState.domains[index].endTime = null;
      warning('排班结束时间应大于开始时间!');
    }
  };

</script>
<style lang="less" scoped>
.title {
  font-size: 18px;
  text-align: center;
  padding: 20px 0;
  & span {
    padding: 0 20px;
  }
}

.reg-num {
  & span {
    padding-left: 20px;
  }
  & span:first-child {
    color: #faad14;
  }
  & span:last-child {
    color: #52c41a;
  }
}
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
FormItem {
  display: block;
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
}
</style>
