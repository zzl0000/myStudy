<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="600px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #videos="{ model, field }">
        <UploadAuth @upload="uploadVideo" />
        <video :src="VideoUrl" controls class="video" v-if="showVideo"></video>
        <div style="color: red">建议视频文件不超过100M</div>
      </template>
      <template #Picture="{ model, field }">
        <a-input type="file" @change="tirggerFile($event)" class="inputs" id="pictu" accept="image/png,image/jpeg"/>
        <plus-outlined class="uploadImg" />
        <img style="width: 100px; height: 100px" id="img1" :src="pictureUrl" alt class="image" />
        <div style="color: red">建议格式jpg/png文件,分辨率700*289,且不超过4M</div>
        <div v-if="ispicture" style="color:#ED6F6F">请上传封面图</div>
      </template>

      <template #money="{ model, field }">
        <a-input v-model:value="model[field]" addon-after="单位(元)" />
      </template>

      <template #doctor_id="{ model, field }">
        <a-select
          v-model:value="model[field]"
          show-search
          placeholder="请输入专家姓名"
          style="width: 200px"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          :options="data"
          autocomplete="off"
          @search="handleSearch"
          @change="handleChange"
        />
      </template>
      <template #timestart="{ model, field }">
        <a-date-picker
          show-time
          placeholder="Select Time"
          @change="dateChange"
          @ok="onOk"
          format="YYYY-MM-DD HH:mm:ss"
          v-model:value="model[field]"
          class="timeend"
        />
        <div v-if="endtimeShow" style="color:#ED6F6F">请选择截止日期</div>

      </template>
      <template #meetstart="{ model, field }">
        <a-range-picker
          @change="dateChangeTwo"
          show-time
          placeholder=""
          format="YYYY-MM-DD HH:mm:ss"
          v-model:value="model[field]"
        />
        <div v-if="meetingShow" style="color:#ED6F6F">请选择会议时间</div>

      </template>
      <template #adress="{ model, field }">
        <input v-model="model[field]" class="adiressinput" />
        <a-select
          v-model:value="formState.express_province"
          placeholder="省份"
          class="mr-5"
          style="width: 120px"
          @change="getcode"
        >
          <a-select-option v-for="item in provinces" v-bind:key="item.name" :label="item.name">{{
            item.name
          }}</a-select-option>
        </a-select>
        <a-select
          v-model:value="formState.express_city"
          placeholder="城市"
          class="mr-5"
          style="width: 120px"
          @change="getcitycode"
        >
          <a-select-option
            placeholder="城市"
            v-for="item in cities"
            v-bind:key="item.name"
            :label="item.name"
            >{{ item.name }}</a-select-option
          >
        </a-select>
        <a-select
          v-model:value="formState.express_area"
          placeholder="地区"
          style="width: 120px"
          @change="getdiqucode"
        >
          <a-select-option v-for="item in areas" v-bind:key="item.name" :label="item.name">{{
            item.name
          }}</a-select-option>
        </a-select>
        <a-form-item label="">
          <a-input
            style="width: 240px"
            v-model:value="formState.express_address"
            placeholder="请输入收货人详细地址"
          ></a-input>
        </a-form-item>
        <div v-if="adres" style="color:#ED6F6F">请输入地点</div>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { userFormSchema } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { createList, addList, getListTips, getDoctor } from '/@/api/sys/academicactivities';
  import citysJson from '/@/assets/json/get_citys.json';
  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import { defineComponent, ref } from 'vue';
  import type { UploadChangeParam, UploadProps, Image } from 'ant-design-vue';
  import moment from 'moment';
  import { GetExpertAdvis, image } from '/@/api/sys/expertadvisory';
  import UploadAuth from '/@/components/uploadrivew.vue';

  import 'moment/locale/zh-cn';
  moment.locale('zh-cn');
  import type { Dayjs } from 'dayjs';
  let timeout: any;
  let currentValue = '';
  function fetch(value: string, callback: any) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;
    function fake() {
      let params = {
        doctor_name: value,
      };
      getDoctor(params)
        .then((response) => response.data)
        .then((d) => {
          if (currentValue === value) {
            const result = d;
            const data: any[] = [];
            result.forEach((r: any) => {
              data.push({
                value: r.id,
                label: r.name,
              });
            });
            callback(data);
          }
        });
    }
    timeout = setTimeout(fake, 300);
  }
  export default defineComponent({
    name: 'UserDrawer',
    components: {
      BasicDrawer,
      BasicForm,
      BasicTree,
      LoadingOutlined,
      PlusOutlined,
      UploadAuth
    },
    emits: ['success', 'register'],

    setup(_, { emit }) {
      const data = ref<any[]>([]);

      const handleSearch = (val: string) => {
        fetch(val, (d: any[]) => (data.value = d,
          doctorids.value = data.value[0].value
        ));
      };
      const handleChange = (val: string) => {
        fetch(val, (d: any[]) => (data.value = d,


        ));

      };
      const formState = ref({
        express_province: undefined,
        express_city: undefined,
        express_area: undefined,
        express_address: undefined,
      });
      const cscode = ref();
      const sqcode = ref();
      const xianqucode = ref();

      const citycode = ref();
      const diqucode = ref();
      const provinces = computed(() => [...citysJson]);
      const pictureUrl = ref('');
      const videoUrl = ref('');
      const ispicture = ref(false)
      const adres = ref(false)
      //获取codee
      const getcode = (value) => {
        const city = provinces._value;
        const arr = city.filter((res) => {
          return res.name == value;
        });
        cscode.value = arr[0].code;
        if(cscode.value){
          adres.value = false
        }else{
          adres.value = true

        }
      };

      const cities = computed(() => {
        let id = formState.value.express_province;
        let _arr = [];
        provinces.value.map((m) => {
          if (id === m.name) {
            _arr = m.children;
            citycode.value = _arr;
          }
        });
        return _arr;
      });
      //获取城市code
      const getcitycode = (value) => {
        const arr = citycode.value.filter((res) => {
          return res.name == value;
        });
        sqcode.value = arr[0].code;
      };
      const momentTime = (time, format) => {
        return moment(time, format);
      };
      const areas = computed(() => {
        let id = formState.value.express_city;
        let _arr = [];
        cities.value.map((m) => {
          if (id === m.name) {
            _arr = m.children;
            diqucode.value = _arr;
          }
        });
        return _arr;
      });
      //获取地区code
      const getdiqucode = (value) => {
        const arr = diqucode.value.filter((res) => {
          return res.name == value;
        });
        xianqucode.value = arr[0].code;
      };
      const value1 = ref<Dayjs[]>([]);
      const value2 = ref<Dayjs[]>([]);
      const enter_time_start = ref();
      const meeting_time_start = ref();
      const fileList = ref([]);
      const loading = ref<boolean>(false);
      const imageUrl = ref<string>('');
      const startTimes = ref();
      const endTime = ref();
      const isUpdate = ref(true);
      const id = ref('');
      const treeData = ref<TreeItem[]>([]);
      const doctors = ref([]);
      const userStore = useUserStoreWithOut();
      const enter_time_end = ref();
      const meeting_time_starts = ref();
      const meeting_time_end = ref();
      const details = ref();
      const passTime = ref([]);
      const defaultUrl = ref();
      const alldata = ref();
      const doctorids = ref()
       const VideoUrl = ref();

      const showVideo = ref()
      const endtimeShow = ref(false)
      const meetingShow = ref(false)
      const [registerForm, { resetFields, setFieldsValue, validate,clearValidate }] = useForm({
        labelWidth: 90,
        schemas: userFormSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 23, md: 24 },
      });
      const dateChange = (date, dateString) => {
        enter_time_end.value = moment(dateString, 'YYYY-MM-DD HH:mm:ss')._i;
        if(  enter_time_end.value ){
          endtimeShow.value  = false
        }else{
          endtimeShow.value  = true

        }

      };
      const dateChangeTwo = (date, dateString) => {
        meeting_time_starts.value = moment(dateString, 'YYYY-MM-DD HH:mm:ss')._i[0];
        meeting_time_end.value = moment(dateString, 'YYYY-MM-DD HH:mm:ss')._i[1];
          if(  meeting_time_end.value ){
          meetingShow.value  = false
        }else{
          meetingShow.value  = true

        }
      };
      const recordId = ref();
      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = data.isUpdate;
        alldata.value = data.record;
        ispicture.value = false
        adres.value = false
        endtimeShow.value = false
        meetingShow.value = false
        if (isUpdate.value) {
          console.log(11111);
          recordId.value = data.record.id;
          formState.value.express_province = data.record.province.name;
          formState.value.express_city = data.record.city.name;
          formState.value.express_area = data.record.area.name;
          formState.value.express_address = data.record.address;
          await getListTips(recordId.value).then((res) => {
            pictureUrl.value = res.data.cover_img;
            details.value = res.data;
            defaultUrl.value = res.data.cover_img;
            startTimes.value = res.data.meeting_time_start;
            endTime.value = res.data.meeting_time_end;
            VideoUrl.value = res.data.video_url
            res.data.enter_fee/100
            if(res.data.video_url){
              showVideo.value = true
            }else{
               showVideo.value = false
            }
          });
          details.value.doctor = details.value.doctor.name;
          details.value.meeting_time_starts = [
            details.value.meeting_time_start,
            details.value.meeting_time_end,
          ];
          
          setFieldsValue({
            ...details.value,
          });
        } else {
          VideoUrl.value = ''
          showVideo.value = false
          pictureUrl.value = '';
          console.log( VideoUrl.value)
          formState.value.express_province = undefined;
          formState.value.express_city = undefined;
          formState.value.express_area = undefined;
          formState.value.express_address = undefined;
           ispicture.value = false
          const comment = '';
           setFieldsValue({
            comment
          });
          clearValidate()
        }
      });
        const uploadVideo = (val) =>{
      VideoUrl.value = val;
      if(val){
        showVideo.value = true
      }else{
        showVideo.value = false
      }
    }
      const getTitle = computed(() => (!isUpdate.value ? '新增' : '修改'));
      const tirggerFile = (event) => {
        console.log(event)
        console.log(898989)
        var file = event.target.files;
        var reader = new FileReader(); //读取文件
        reader.readAsDataURL(file[0]);
        const files = file[0];
        reader.onload = function () {
          document.getElementById('img1').src = reader.result;
        };
        var formdata = new FormData();
        formdata.append('image', file[0]);
        image(formdata).then((res) => {
          pictureUrl.value = res.data.origin;
            ispicture.value = false

        });
        document.getElementById('pictu').value = null
      };
      async function handleSubmit() {
        console.log(pictureUrl.value)
        if(pictureUrl.value){
            ispicture.value = false
        }else{
            ispicture.value = true
        }
         if(formState.value.express_address){
            adres.value = false
        }else{
            adres.value = true
        }
          if(enter_time_end.value){
            endtimeShow.value = false
        }else{
            endtimeShow.value = true
        }
             if(meeting_time_starts.value){
            meetingShow.value = false
        }else{
            meetingShow.value = true
        }
        try {
          const values = await validate();
          if (!isUpdate.value) {
            console.log(values);
            let params = {
              title: values.title,
              cover_img: pictureUrl.value,
              province_code: cscode.value,
              city_code: sqcode.value,
              area_code: xianqucode.value,
              address: formState.value.express_address,
              meeting_status: values.meeting_status,
              enter_time_end: enter_time_end.value,
              meeting_time_start: meeting_time_starts.value,
              meeting_time_end: meeting_time_end.value,
              doctor_id: values.doctor,
              enter_fee: Number(values.enter_fee) * 100,
              member_limit: values.member_limit,
              comment: values.comment,
              zb_url: values.zb_url,
              video_url: VideoUrl.value,
              recommend: values.recommend,
              sort: values.sort,
            };
            const data = await createList(params);
            if (data.code == 200) {
                message.success('新增活动成功');
              closeDrawer();
              emit('success');
            } else {
              message.error(data.message);
            }
          } else {
            let sf = '';
            let sq = '';
            let dq = '';
            let endtime = '';
            let meetStart = '';
            let meetEnd = '';
            let docotoid = ''
            let url = ''
            if (values.meeting_status == '报名中') {
              values.meeting_status = 1;
            }
            if (values.meeting_status == '进行中') {
              values.meeting_status = 2;
            }
            if (values.meeting_status == '已结束') {
              values.meeting_status = 3;
            }
            if (formState.value.express_province == alldata.value.province.name) {
              sf = alldata.value.province.code;
            } else {
              sf = cscode.value;
            }
            if (formState.value.express_city == alldata.value.city.name) {
              sq = alldata.value.city.code;
            } else {
              sq = sqcode.value;
            }
            if (formState.value.express_area == alldata.value.area.name) {
              dq = alldata.value.area.code;
            } else {
              dq = xianqucode.value;
            }
            if (enter_time_end.value) {
              endtime = enter_time_end.value;
            } else {
              endtime = details.value.enter_time_end;
            }
            if (meeting_time_starts.value) {
              meetStart = meeting_time_starts.value;
            } else {
              meetStart = details.value.meeting_time_start;
            }
            if (meeting_time_end.value) {
              meetEnd = meeting_time_end.value;
            } else {
              meetEnd = details.value.meeting_time_end;
            }
            if(values.doctor == alldata.value.doctor.name){
                docotoid = alldata.value.doctor.id
            }else{
                docotoid =  doctorids.value
            }
            if(VideoUrl.value ==  details.value.video_url){
              url  =  details.value.video_url
            }else{
              url = VideoUrl.value
            }
            let params = {
              title: values.title,
              cover_img: pictureUrl.value,
              province_code: sf,
              city_code: sq,
              area_code: dq,
              address: formState.value.express_address,
              meeting_status: values.meeting_status,
              enter_time_end: endtime,
              meeting_time_start: meetStart,
              meeting_time_end: meetEnd,
              doctor_id: docotoid,
              enter_fee: Number(values.enter_fee),
              member_limit: values.member_limit,
              comment: values.comment,
              zb_url: values.zb_url,
              video_url: url,
              recommend: values.recommend,
              sort: values.sort,
            };
           
            const id = recordId.value;
            const data = await addList(id, params);
            if (data.code == 200) {
                message.success('修改活动成功');
              closeDrawer();
              emit('success');
            } else {
              message.error(data.message);
            }
          }
        } finally {
          // setDrawerProps({ confirmLoading: false });
        }
      }
      return {
        tirggerFile,
        registerDrawer,
        registerForm,
        uploadVideo,
        momentTime,
        handleChange,
        handleSearch,
        getcitycode,
        getcode,
        getdiqucode,
        getDoctor,
        image,
        dateChange,
        handleSubmit,
        value1: ref<Dayjs[]>([]),
        value2: ref<Dayjs[]>([]),
        dateChangeTwo,
        getTitle,
        isUpdate,
        doctors,
        fileList,
        loading,
        imageUrl,
        meeting_time_start,
        enter_time_start,
        formState,
        provinces,
        cities,
        areas,
        startTimes,
        endTime,adres,
        moment,
        data,
        cscode,
        citycode,
        sqcode,
        diqucode,
        xianqucode,
        recordId,
        passTime,
        pictureUrl,
        defaultUrl,
        alldata,
        doctorids,
        details,
        VideoUrl,
        showVideo,
        ispicture,
        endtimeShow,
        meetingShow
      };
    },
  });
</script>
<style type="text/css">
#role_ids .vben-basic-tree,
#managed_doctor_ids .vben-basic-tree {
  height: fit-content !important;
}
#role_ids .scrollbar__wrap,
#managed_doctor_ids .scrollbar__wrap {
  padding: 0px !important;
  margin-left: -24px;
  margin-top: -2px;
}
/* .timeend {
  position: relative;
}
.time {
  position: absolute;
  top: 315px;
  left: 120px;
  z-index: 999;
  font-size: 13px;
} */
/* #role_ids .ant-tree li {
  width: 50%;
  display: inline-block;
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
} */
.inputs {
  display: block;
  position: absolute;
  height: 100px;
  opacity: 0.01;
  z-index: 999;
  left: -3px;
  width: 100px;
}
.inputss {
  display: block;
  position: absolute;
  height: 100px;
  opacity: 0.01;
  z-index: 999;
  left: -3px;
  width: 100px;
  visibility: hidden;
}
.image {
  width: 100px;
  height: 100px;
  position: relative;
  cursor: pointer;
}
.adiressinput {
  opacity: 0.001;
  position: absolute;
}
.uploadImg {
  font-size: 40px;
  color: #ccc;
  position: absolute;
  top: 30px;
  left: 30px;
  margin: 0 auto;
}
.video {
  width: 200px;
  height: 100px;
}
</style>
