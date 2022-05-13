<template>
  <BasicDrawer
    :title="getTitle"
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" style="width: 90%">
      <template #pictor="{ model, field }">
        <a-input type="file" @change="tirggerFile($event)" class="inputs" accept="image/png,image/jpeg"/>
        <img style="width: 100px; height: 100px" id="img1" alt :src="defaultUrl" class="image" />
          <div style="color: red">建议格式png文件，且不超过4M</div>
        <div v-if="ispicture" style="color:#ED6F6F">请上传封面图</div>
      </template>

      <template #hid="{ model, field }">
        <a-select
          v-model:value="model[field]"
          show-search
          placeholder="请输入医院名称"
          style="width: 200px"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          :options="data"
          @search="handleSearch"
          @change="handleChange"
        />
        
      </template>
      <template #department_1_id="{ model, field }">
        <a-cascader
          v-model:value="model[field]"
          :fieldNames="{ label: 'name', value: 'kid', children: 'subclass' }"
          :options="treeData"
          placeholder="请输入文章关联的科室"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
// import { defineComponent, ref } from 'vue';
import { defineComponent, ref, h, unref, computed } from 'vue';

import { BasicForm, useForm } from '/@/components/Form/index';
import { expertFormSchema, num } from './data';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
import { GetExpertsNews } from '/@/api/sys/experts';
import {
  GetExpertAdvis,
  search,
  keshi,
  creeatd,
  detail,
  image,
  update,
} from '/@/api/sys/expertadvisory';
import { message } from 'ant-design-vue';

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
      name: value,
    };
    search(params)
      .then((response) => response.data)
      .then((d) => {
        if (currentValue === value) {
          const result = d;
          const data: any[] = [];
          result.forEach((r: any) => {
            data.push({
              value: r.hid,
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
  name: 'expertDrawer',
  components: { BasicDrawer, BasicForm },
  emits:['success'],

  setup(_, { emit }) {
    const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
      labelWidth: 120,
      schemas: expertFormSchema,
      showActionButtonGroup: false,
    });
    const isUpdate = ref();
    const treeData = ref<[]>([]);
    const details = ref();
    const defaultUrl = ref();
    const newurl = ref();
    const newurlId = ref();
    const filterArray = ref();
    const ksarray = ref();
    const hidd = ref();
    const hosids = ref()
    const ispicture = ref(false)
    const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
      isUpdate.value = data.isUpdate;
      ispicture.value = false
      resetFields();
      setDrawerProps({ confirmLoading: false });

      ispicture.value = false

      if (unref(treeData.value).length === 0) {
        await keshi().then((res) => {
          treeData.value = res.data.items;
        });

      }
      if (!isUpdate.value) {
        let parms = {
          id: data.record.id,
        };
        await detail(parms).then((res) => {
          details.value = res.data;
          defaultUrl.value = res.data.avatar;
          hidd.value = details.value.hid;
          details.value.hid = details.value.hospital_name;
          console.log(details.value);
          details.value['department_1_id'] = [
            String(details.value.kid1),
            String(details.value.kid2),
          ];
        });
        setFieldsValue({
          ...details.value,
        });
      } else {
        defaultUrl.value = '';
        ispicture.value = false
      }
    });
    const getTitle = computed(() => (isUpdate.value ? '添加专家' : '修改专家'));

    const data = ref<any[]>([]);
    const handleSearch = (val: string) => {
      fetch(val, (d: any[]) => {
        data.value = d;

        filterArray.value = d;
      });
    };
    const handleChange = (val: string) => {
      fetch(val, (d: any[]) => {
        data.value = d;
        console.log(val,'-----')
        hosids.value = val
      });
    };

    async function handleSubmit() {
      if(defaultUrl.value){
        ispicture.value = false
      }else{
        ispicture.value = true

      }
      const titieName = ref();
      try {
        const values = await validate();
        let alcode = values.tags.replace(/，/ig,',')
        if (values.expert_type_id == 2) {
          values.expert_type_name = '专家';
        }
        if (values.expert_type_id == 1) {
          values.expert_type_name = '顾问';
        }
        if (values.tid == 22) {
          titieName.value = '主任医师';
        } else if (values.tid ==72) {
          titieName.value = '副主任医师';
        } else if (values.tid == 48) {
          titieName.value = '主治医师';
        } else if (values.tid == 62) {
          titieName.value = '住院医师';
        } else if (values.tid == 68) {
          titieName.value = '其他';
        }
        const ksi = treeData.value.filter((res) => {
          return values.department_1_id[0] == res.kid;
        });
        const ksname1 = ksi[0].name;

        const sk2 = ksi[0].subclass;
        const kse = sk2.filter((res) => {
          return values.department_1_id[1] == res.kid;
        });
        const ksname2 = kse[0].name;
        if (isUpdate.value) {
          const idname = filterArray.value.filter((res) => {
            return res.value == values.hid;
          });
          let params = {
            name: values.name,
            sex: values.sex,
            hid: values.hid,
            kid1: Number(values.department_1_id[0]),
            kid2: Number(values.department_1_id[1]),
            tid: Number(values.tid),
            title: titieName.value,
            avatar: defaultUrl.value,
            avatar_id: newurlId.value,
            ks1name: ksname1,
            ks2name: ksname2,
            hospital_name: idname[0].label,
            expert_type_id: Number(values.expert_type_id),
            expert_type_name: values.expert_type_name,
            disease: values.disease,
            tags: alcode,
            toped: values.toped,
            good_at: values.good_at,
            desc: values.desc,
            scientific_result: values.scientific_result,
            honor: values.honor,
            apprentice: Number(values.apprentice),
            apprentice_topic: values.apprentice_topic,
            reco: Number(values.reco),
            sort: values.sort,
          };
          creeatd(params).then((res) => {
            if (res.code == 200) {
                message.success('新增成功');

              // setDrawerProps({ confirmLoading: true });
              closeDrawer();
              emit('success');
            }else{
               message.error(res.message);
            }
          });
        } else {
          let url = '';
          let urlid = ''
          let hosid = ''
          let kid11 = ''
          let kid22 = ''
          let text = ''
          if (defaultUrl.value == details.value.avatar) {
            url = details.value.avatar;
          } else {
            url = defaultUrl.value;
          }
          if(newurlId.value ){
            urlid = newurlId.value
          }else{
            urlid = details.value.avatar_id
          }

          if(hosids.value){
              hosid = hosids.value
          }else{
            hosid = hidd.value
          }
          if(values.department_1_id[0] == details.value.kid1){
            kid11 = details.value.kid1
          }else{
             kid11 = values.department_1_id[0]
          }
           if(values.department_1_id[1] === details.value.kid2){
            kid22 = details.value.kid22
          }else{
             kid22 = values.department_1_id[1]
          }
          if( details.value.apprentice_topic == values.apprentice_topic){
              text = details.value.apprentice_topic 
          }else{
             text = values.apprentice_topic 
          }
          let params = {
            id: details.value.id,
            name: values.name,
            sex: values.sex,
            avatar: url,
            hid: hosid,
            kid1: String(kid11),
            kid2: kid22,
            tid: values.tid,
            title: titieName.value,
            expert_type_id: values.expert_type_id,
            expert_type_name: values.expert_type_name,
            disease: values.disease,
            tags: alcode,
            good_at: values.good_at,
            desc: values.desc,
            scientific_result: values.scientific_result,
            honor: values.honor,
            apprentice: values.apprentice,
            apprentice_topic: text,
            reco: values.reco,
            avatar_id: urlid,
            sort:values.sort
          };

          update(params).then((res) => {
            if(res.code == 200){
                message.success('编辑成功');
              //  setDrawerProps({ confirmLoading: true });
              closeDrawer();
              emit('success');
              hosid = ''
               hosids.value = ''
            }else{
               message.error(res.message);
            }
          });

          if (defaultUrl.value == values.cover_img) {
            newurl.value = defaultUrl.value;
          } else {
            newurl.value = defaultUrl.value;
          }
        }
      } finally {
        setDrawerProps({ confirmLoading: false });
      }
    }

    const tirggerFile = (event) => {
      var file = event.target.files;
      var reader = new FileReader(); //读取文件
      reader.readAsDataURL(file[0]);
      const files = file[0];
      reader.onload = function () {
        document.getElementById('img1').src = reader.result;
      };
      var formdata = new FormData();
      formdata.append('image', file[0]);
      // let params = {
      //   image:formdata
      // }
      image(formdata).then((res) => {
        defaultUrl.value = res.data.origin;
        newurlId.value = res.data.id;
        ispicture.value = false
      });
    };
    return {
      tirggerFile,
      registerDrawer,
      registerForm,
      handleSubmit,
      num,
      handleSearch,
      handleChange,
      data,
      isUpdate,
      treeData,
      keshi,
      getTitle,
      detail,
      image,
      defaultUrl,
      newurl,
      newurlId,
      filterArray,
      hidd,
      hosids,
      ispicture
    };
  },
});
</script>
<style type="text/css" scoped>
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
</style>
