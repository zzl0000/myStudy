<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    :closeFunc="handleReset"
    width="690px"
  >
    <BasicForm @register="registerForm" v-show="!done" v-loading="loadingRef">
      <template #patientName="{ model, field }" @blur="patientsSearchShow = false">
        <a-input
          :disabled="true"
          v-model:value="model[field]"
          placeholder="请输入"
          @change="getPatientsAction"
          @blur="handleBlur"
        />
        <div class="search-result" v-show="patientsSearchShow">
          <div
            class="search-item"
            v-for="item in patients"
            :key="item.id"
            @click="onPatientChange(item)"
            >{{ item.name }}</div
          >
        </div>
      </template>
      <template #doctorSearch="{ model, field }">
        <a-select
          show-search
          v-model:value="model[field]"
          optionFilterProp="label"
          @change="firstOptionChange"
        >
          <a-select-option
            v-for="item in doctor.list"
            :key="item.id"
            :value="item.id"
            :label="item.info"
            >{{ item.info }}</a-select-option
          >
        </a-select>
      </template>
      <template #amount="{ model, field }">
        <a-input-number
          step="0"
          :disabled="true"
          :min="0.0"
          v-model:value="model[field]"
          style="width: 30%"
        />
      </template>
      <template #time="{ model, field }">
        <Card v-if="model.type !== '2'">
          <RadioGroup
            v-for="item in consultation.value.schedules"
            :key="item.id"
            v-model:value="model[field]"
            @change="(val) => (model[field] = val.target.value)"
          >
            <RadioButton :value="item.id"> {{ item.info }}</RadioButton>
          </RadioGroup>
        </Card>
      </template>
      <!-- <template #timer="{ model, field }">
        <div v-if="field.amount == 0">永久有效</div>
      </template> -->
    </BasicForm>
    <div v-show="done" class="divBox">
      <p class="de"> <CheckCircleTwoTone two-tone-color="#52c41a" />您已成功预约</p>
      <div class="msg" style="margin-top: 20px; color: #fffafa">{{ qrTimeMsg }}</div>
      <div class="msg" style="margin-top: 20px; font-weight: 500; font-size: 16px">{{
        nameMsg
      }}</div>

      <div
        style="
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        "
        v-if="qrCodeUrl == '/src/assets/images/rtrc/img/loding-gif.gif'"
      >
        <img
          src="../../../../assets/images/rtrc/img/loding-gif.gif"
          class="app-loading-logo"
          alt="loading"
          style="width: 70px; height: 70px"
        />
      </div>

      <img
        :src="qrCodeUrl"
        style="width: 200px; height: 200px; margin: auto; margin-top: 20px"
        v-else
      />
      <div class="msg" style="margin-top: 20px">{{ qrCodeMsg }}</div>
      <div
        class="msg"
        style="
          margin-top: 20px;
          color: #f9f871;
          font-weight: 300;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <div><ScanOutlined style="font-size: 50px; margin: 0 5px 0 10px" /></div>
        <div v-html="qrtime" style="text-align: left; font-weight: 400"></div>
      </div>
    </div>
    <div v-show="done" style="margin-top: 50px" class="boxBottom">
      <!-- <Divider></Divider> -->
      <div>截图二维码，将二维码发送给用户</div>
      <div v-html="times"></div>
      <div class="ddd" style="font-size: 20px; margin-top: 30px"
        >您也可直接复制支付链接发送给患者：</div
      >

      <p id="text" class="text">{{ urls }}</p>
      <textarea id="input" class="id"></textarea>
      <div class="copy" style="color: #0e31d7; cursor: pointer" @click="copyText">复制链接</div>
    </div>
    <div style="margin-left: 20px; margin-top: 15px; color: #a3bddb">
      <div>注： 1. 号源有效时长默认永久不会失效，但会提示患者30分钟内支付</div>
      <div>2 .当选择了其它有效时长后，如患者超过有效时长未支付，订单将自动取消并释放号源</div>
    </div>
    <div style="margin-left: 20px; margin-top: 20px" v-if="showOk">支持支付宝微信支付</div>
    <!-- <div class="ddd" style="font-size:30px;">您也可直接复制支付链接发送给患者：</div>
    <div class="ddd">您也可直接复制支付链接发送给患者：</div> -->
    <SendMsgModal @register="registerSendMsgModal" @success="handleSuccess" />
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button style="margin-right: 8px" @click="handleReset">返回</a-button>
      <a-button type="primary" @click="handleSubmit" v-if="showOk">确认</a-button>
    </div>
  </BasicDrawer>
</template>
<script setup lang="ts">
  import { ref, computed, unref, reactive } from 'vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Card, Radio, Divider } from 'ant-design-vue';
  import { getOrganizationDoctorList, getConsultation } from '/@/api/sys/doctor';
  import { createAppointmentsList, getPaymentQrcode } from '/@/api/sys/appointments';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { useGo } from '/@/hooks/web/usePage';
  import { useModal } from '/@/components/Modal';
  import SendMsgModal from '../appointments/SendMsgModal.vue';
  import { getPatients } from '/@/api/sys/patient';
  import { editTrack } from '/@/api/sys/track';
  import { CheckCircleTwoTone, ScanOutlined } from '@ant-design/icons-vue';

  const go = useGo();
  let createId,
    detailData = {} as any;

  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;

  const done = ref(false);
  const loadingRef = ref(false);

  // const qrCodeUrl = ref<string>('https://wzwap.myzx.cn/static/img/myzx-qrcode.png');
  const qrCodeUrl = ref<string>('/src/assets/images/rtrc/img/loding-gif.gif');
  const qrCodeMsg = ref<string>('');
  const qrTimeMsg = ref<string>('');
  const nameMsg = ref<string>('');
  const qrtime = ref<string>('');
  const times = ref('');
  let urls = ref('');
  let newurl = ref('');
  const consultation = reactive({
    value: { amounts: { call_price: '', video_price: '', view_price: '' }, schedules: [] },
  });

  const userStore = useUserStoreWithOut();

  const formSchema: FormSchema[] = [
    {
      field: 'patient_id',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        style: { display: 'none' },
      },
    },
    {
      field: 'patient_name',
      label: '就诊人',
      component: 'Input',
      rules: [
        {
          required: true,
          // @ts-ignore
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject('必填项不能为空~!');
            }
            if (value.length < 2) {
              /* eslint-disable-next-line */
              return Promise.reject('患者姓名至少输入两个字~!');
            }
            return Promise.resolve();
          },
          trigger: 'change',
        },
      ],
      slot: 'patientName',
    },
    {
      field: 'patient_phone',
      label: '手机号',
      required: true,
      component: 'Input',
      componentProps: { disabled: true },
    },
    {
      field: 'patient_age',
      label: '年龄',
      required: true,
      component: 'InputNumber',
      componentProps: {
        min: 0,
        max: 150,
      },
    },
    {
      field: 'patient_sex',
      label: '性别',
      component: 'RadioButtonGroup',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '男', value: 1 },
          { label: '女', value: 0 },
        ],
      },
    },
    {
      field: 'id_card',
      label: '身份证号',
      component: 'Input',
    },
    {
      label: '预约医生',
      field: 'doctor_id',
      required: true,
      component: 'Input',
      slot: 'doctorSearch',
    },
    {
      label: '就诊类型',
      field: 'type',
      component: 'RadioButtonGroup',
      defaultValue: '4',
      componentProps: {
        options: [
          { label: '视频问诊', value: '4' },
          { label: '图文问诊', value: '2' },
          { label: '电话问诊', value: '3' },
        ],
        onClick: (e: any) => {
          if (e.target.value) {
            mold.value = e.target.value;
            changed();
          }
        },
      },
    },
    {
      label: '金额',
      field: 'amount',
      component: 'InputNumber',
      slot: 'amount',
      defaultValue: 0.01,
      required: true,
    },
    {
      label: '挂号时间',
      field: 'schedule_id',
      show: ({ values }) => {
        return values.type !== '2';
      },
      required: true,
      component: 'Input',
      slot: 'time',
      defaultValue: 0,
    },
    {
      label: '备注',
      field: 'desc',
      component: 'InputTextArea',
    },
    {
      field: 'expired',
      label: '有效时长',
      component: 'RadioGroup',
      defaultValue: '525600',
      // slot: 'timer',
      componentProps: {
        options: [{ label: '永久', value: '525600' }],
      },
      // show: ({ values }) => {
      //   return values.isMoney;
      // },
    },
  ];

  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const isTrack = ref(true);

  const doctorId = ref<number>(0);
  const mold = ref<string>('4'),
    showOk = ref(true);

  const keyword = ref<string>('');
  let currentDid;
  const searchParams = computed<Recordable>(() => {
    return { doctor_name: unref(keyword) };
  });

  const { createMessage } = useMessage();
  const { error, info } = createMessage;

  const changed = () => {
    if (!doctorId.value || !doctorId.value || !mold.value) return;
    /*const fields = getFieldsValue();
    const mold = fields.type;*/
    loadingRef.value = true;
    getConsultation(doctorId.value, mold.value, currentDid).then((response) => {
      consultation.value = {
        amounts: response.amounts,
        schedules: response.schedules.filter((item) => item.remain_num),
      };
      let amount = '';
      amount = datas.value.amount;
      // let amount = '';
      // if (mold.value == '4') {
      //   amount = response.amounts.video_price;
      // } else if (mold.value == '3') {
      //   amount = response.amounts.call_price;
      // } else {
      //   amount = response.amounts.view_price;
      // }
      setFieldsValue({
        amount: amount,
      });
      loadingRef.value = false;
    });
  };

  const handleReset = async () => {
    if (done.value) {
      done.value = false;
      info('您可以继续帮助患者上传病历资料');
      const path = `/customer/service/appointments/detail?id=${createId}&patient_name=${
        detailData.patient_name
      }&patient_sex=${detailData.patient_sex == 1 ? '男' : '女'}&patient_age=${
        detailData.patient_age
      }&patient_mobile=${detailData.patient_phone}&title=预约挂号`;
      go(path);
    }
    closeDrawer();
    return true;
  };

  const firstOptionChange = (id) => {
    const obj = doctor.list.find((item) => item.id == id);
    if (!obj) return;
    doctorId.value = id;
    currentDid = obj.did;
    changed();
  };

  function onDoctorSearch(value: string) {
    keyword.value = value;
  }

  async function getOrganizationDoctorListAction(params: any): Promise<any> {
    params.only_managed = 1;
    const data = await getOrganizationDoctorList(params);
    return data;
  }

  const onDoctorChange = (e: any, obj) => {
    doctorId.value = e;
    currentDid = obj.did;
    changed();
  };

  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue, updateSchema }] =
    useForm({
      labelWidth: 90,
      schemas: formSchema,
      showActionButtonGroup: false,
    });

  const doctor = reactive({
    list: [],
  });

  const handleBlur = () => {
    setTimeout(() => {
      patientsSearchShow.value = false;
    }, 300);
  };

  const datas = ref<any>({});

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    patientsSearchShow.value = false;
    patients.value = [];
    doctor.list = data.doctorList;
    resetFields();
    done.value = false;
    setDrawerProps({ confirmLoading: false });

    isUpdate.value = !!data?.isUpdate;
    isTrack.value = !!data?.isUpdate;

    consultation.value = {
      amounts: { call_price: '', video_price: '', view_price: '' },
      schedules: [],
    };

    if (unref(isUpdate)) {
      datas.value = data.record;
      const initData = {
        patient_name: data.record.patient.uname,
        patient_sex: Number(data.record.patient.sex),
        patient_phone: data.record.patient.mobile.split(',')[0],
        patient_age: data.record.patient.age,
        doctor_id: data.record.doctor_id == 0 ? '' : data.record.doctor_id,
        desc: data.record?.desc,
        id_card: data.record?.patient?.id_card,
      };
      console.log(data.record);
      firstOptionChange(initData.doctor_id);
      setFieldsValue(initData);
      // doctorId.value = 0;
    }
  });

  const getTitle = computed(() =>
    !unref(isUpdate) ? '新增预约挂号' : unref(isUpdate) ? '按线索添加预约问诊' : '编辑预约挂号'
  );

  const handleSuccess = () => {
    closeDrawer();
    emit('success');
  };

  // 发送短信弹出层
  const [registerSendMsgModal, { openModal: openSendMsgModal }] = useModal();

  const userId = ref('');
  const onPatientChange = (record) => {
    patientsSearchShow.value = false;
    setFieldsValue({
      patient_name: record.name,
      patient_age: record.age == 0 ? '' : record.age,
      patient_id: record.id,
      patient_phone: record.phone,
      patient_sex: record.sex,
      id_card: record.id_card,
    });
    userId.value = record.user_id;
  };

  const patients = ref<any>([]);
  const patientsSearchShow = ref<any>(false);
  const getPatientsAction = () => {
    const formData = getFieldsValue();
    const patientName = formData.patient_name.replace(/(^\s*)|(\s*$)/g, '');
    setFieldsValue({
      patient_age: '',
      patient_id: 0,
      patient_phone: '',
      patient_sex: 1,
      id_Card: '',
    });
    userId.value = '';
    if (patientName == '') {
      return;
    }

    getPatients({ params: patientName }).then((response) => {
      patients.value = response;
      patientsSearchShow.value = response.length > 0;
    });
  };

  async function handleSubmit() {
    console.log(done.value);
    console.log(datas.value);
    // done.value = true
    const values = await validate();
    try {
      if (done.value) {
        done.value = false;
        closeDrawer();
        return emit('success');
      }

      const values = await validate();
      console.log(values);
      detailData = values;
      setDrawerProps({ confirmLoading: true });
      values.doctor_id = doctorId.value;
      values.did = currentDid;
      values.callback_type = 'qrcode';

      if (parseInt(doctorId.value) === 0) {
        //createWarningModal({ title: '提交错误', content: '请选择预约医生!' });
        return error('请选择预约医生!');
      }
      if (parseInt(values.type) === 1) {
        values.schedule_id = 0;
      } else {
        if (values.type === '2') {
          delete values.schedule_id;
        } else {
          if (parseInt(values.schedule_id) === 0) {
            return error('请选择挂号时间!');
          }
        }
      }
      loadingRef.value = true;
      const params = {
        ...values,
        user_id: userId.value,
      };
      if (unref(isUpdate)) {
        params.patient_id = datas.value?.patient.id;
        params.user_id = datas.value?.patient.user_id;
        params.register_order_id = datas.value?.id;
      }
      const response = await createAppointmentsList(userStore.getUserInfo.organization_id, params);
      createId = response.order.order_id;

      closeDrawer();
      emit('success');

      // 关联线索
      // if (isTrack.value && datas.value.track_id) {
      //   editTrack(datas.value.track_id, { diagnose: 1, appointment_id: createId });
      // }

      // if (values.callback_type == 'qrcode') {
      //   done.value = true;
      //   setTimeout(() => {
      //     qrCodeUrl.value = response.qrcode.url;
      //   }, 1000);
      //   const time = values.expired;
      //   const amount = values.amount;
      //   const type = values.type;
      //   const name = values.patient_name;
      //   console.log(response.order, '000000000000000000');
      //   urls.value = '';
      //   urls.value =
      //     'https://cloud1-5g80ysht3e049128-1306117587.tcloudbaseapp.com/h5/jump-mp.html?sign=047e33b549a034725a9760fd3f5deebd&t=1644572774&mpUrl=';
      //   newurl.value = encodeURIComponent(`/pages/pay/purchase-service?id=${createId}`);
      //   urls.value = urls.value + newurl.value;
      //   if (amount === '0.00' || amount === 0) {
      //     (qrTimeMsg.value = `${response.order.ks1name}${response.order.doctor_name}医生的线上咨询服务`),
      //       (nameMsg.value = `${name}的挂号二维码`),
      //       (qrtime.value = `请微信识别二维码<br/>查看预约信息`),
      //       (times.value = `  用户扫码关注公众号确认挂号信息即可`);
      //   } else {
      //     qrTimeMsg.value = `${response.order.ks1name}${response.order.doctor_name}医生的线上咨询服务`;
      //     nameMsg.value = `${name}的挂号二维码`;
      //     if (time == 30 || time == 525600) {
      //       (qrtime.value = `请30分钟之内<br/>微信识别二维码完成支付`),
      //         (times.value = `用户扫码关注公众号支付即可，请提醒患者<span style="color: #FA6700;">${30}分钟之内支付</span>`);
      //     } else {
      //       (qrtime.value = `请${time / 60}小时之内<br/>微信识别二维码完成支付`),
      //         (times.value = `用户扫码关注公众号支付即可，请提醒患者<span style="color: #FA6700;">${
      //           time / 60
      //         }小时之内支付</span>`);
      //     }
      //   }

      //   showOk.value = false;
      //   return;
      // }

      // if (values.callback_type == '2') {
      //   openSendMsgModal(true, {
      //     order: response.order,
      //     sms_template: response.sms_template,
      //   });
      //   return;
      // }

      // if (values.callback_type == '3') {
      //   done.value = true;
      //   loadingRef.value = true;
      //   getPaymentQrcode(response.order.order_id, { type: 1, payer: 1 }).then((response: any) => {
      //     setTimeout(() => {
      //       qrCodeUrl.value = 'data:image/png;base64,' + response.data;
      //     }, 1000);
      //     qrCodeMsg.value = '截图二维码，将二维码发给用户，用户扫码支付即可';
      //     showOk.value = false;
      //     loadingRef.value = false;
      //   });
      //   return;
      // }

      // closeDrawer();
      // emit('success');
    } finally {
      loadingRef.value = false;
      setDrawerProps({ confirmLoading: false });
    }
  }
  function copyText() {
    // const text = urls.value; // 复制文本
    // const input = document.getElementById('input')! as any; // 承载复制内容
    // input.value = text; // 修改文本框的内容
    // input.select(); // 选中文本
    // document.execCommand('copy');
    // console.log(text)
    // info('复制成功');

    const oInput = document.createElement('input');
    oInput.value = urls.value;
    document.body.appendChild(oInput);
    oInput.select();
    console.log(oInput.value);
    document.execCommand('Copy');
    oInput.remove();
    info('复制成功');
    console.log(2);

    // alert('复制成功')
  }
</script>
<style lang="less">
  .time {
    display: inline-block;
    margin-bottom: 10px;
  }
  .search-result {
    position: absolute;
    z-index: 999;
    width: 80%;
    background: #fff;
    border: solid 1px #0960bd;
    border-top: none;
    margin-top: -1px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    padding-top: 5px;
    padding-bottom: 5px;
    cursor: pointer;
    .search-item:hover {
      background: #d9d9d9;
    }
    .search-item {
      padding: 5px 10px;
    }
  }
</style>
<style type="text/css">
  .ant-radio-button-wrapper {
    margin-bottom: 10px;
    margin-left: 10px;
  }
  .divBox {
    text-align: center;
    border: 2px solid #1890ff;
    width: 360px;
    border-radius: 5px;
    margin: 0 auto;
    background-color: #1890ff;
    color: #fff;
    font-size: 18px;
    box-sizing: border-box;
    font-weight: 600;
    padding: 20px;
    .de {
      :deep(.anticon) {
        margin-right: 3px;
        font-size: 18px;
      }
    }
  }
  .boxBottom {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }
  .text {
    position: relative;
    color: #0e31d7;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .id {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: -10;
  }
</style>
