<template>
  <BasicDrawer
    :title="getTitle"
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    width="45%"
    @ok="handleSubmit"
  >
    <!-- <a-image style="width: 150px; height: 130px" :src="item" class="image" /> -->
    <!-- <BasicForm @register="registerForm" style="width: 85%" v-if="isNew">
      <template #phones="{ model, field }">
        <a-input v-model:value="model[field]" />
      </template>
      <template #UP="{ model, field }">
        <a-input type="file" @change="tirggerFile($event)" class="inputs" />
        <img style="width: 100px; height: 100px" id="img1" src alt class="image" />
      </template>

      <template #sfz="{ model, field }">
        <a-input type="file" @change="tirggerFile2($event)" class="inputs" />
        <img style="width: 100px; height: 100px" id="img2" src alt />

        <a-input type="file" @change="tirggerFile3($event)" class="inputs" />
        <img style="width: 100px; height: 100px" id="img3" src alt />
      </template>

      <template #zy="{ model, field }">
        <a-input type="file" @change="tirggerFile4($event)" class="inputs" />
        <img style="width: 100px; height: 100px" id="img4" src alt />
        <a-input type="file" @change="tirggerFile5($event)" class="inputs" />
        <img style="width: 100px; height: 100px" id="img5" src alt />
      </template>

      <template #zg="{ model, field }">
        <a-input type="file" @change="tirggerFile6($event)" class="inputs" />
        <img style="width: 100px; height: 100px" id="img6" src alt />
        <a-input type="file" @change="tirggerFile7($event)" class="inputs" />
        <img style="width: 100px; height: 100px" id="img7" src alt />
      </template>

      <template #zs="{ model, field }">
        <a-input type="file" @change="tirggerFile8($event)" class="inputs" />
        <img style="width: 100px; height: 100px" id="img8" src alt />
      </template>

      <template #hospital_id="{ model, field }">
        <a-select
          v-model:value="model[field]"
          show-search
          placeholder="请输入医院"
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

      <template #kid1="{ model, field }">
        <a-cascader
          v-model:value="model[field]"
          :fieldNames="{ label: 'name', value: 'kid', children: 'subclass' }"
          :options="treeData"
          placeholder="请选择科室"
        />
      </template>

      <template #selectstatus v-if="!isNew">
        <a-select
          v-model:value="value2"
          :options="selects"
          mode="multiple"
          :size="size"
          placeholder="请选择"
          style="width: 200px"
          @popupScroll="popupScroll"
        ></a-select>
      </template>
    </BasicForm> -->

    <BasicForm @register="registerForm" style="width: 85%" v-if="isUpdate">
      <template #phones="{ model, field }" disabled>
        <a-input v-model:value="model[field]" disabled />
      </template>

      <template #names="{ model, field }">
        <a-input v-model:value="model[field]" disabled />
      </template>

      <template #sexs="{ model, field }">
        <a-input v-model:value="model[field]" disabled />
      </template>

      <template #tids="{ model, field }">
        <a-input v-model:value="zc" disabled />
      </template>

      <template #id_card="{ model, field }">
        <a-input v-model:value="model[field]" disabled />
      </template>
      <template #zigecard_number="{ model, field }">
        <a-input v-model:value="model[field]" disabled />
      </template>
      <template #disease_pros="{ model, field }">
        <a-textarea v-model:value="model[field]" disabled />
      </template>
      <template #diseases="{ model, field }">
        <a-textarea v-model:value="model[field]" disabled />
      </template>
      <template #descs="{ model, field }">
        <a-textarea v-model:value="model[field]" disabled />
      </template>

      <template #UP="{ model, field }">
        <a-image :width="200" :src="tx" />
      </template>

      <template #sfz="{ model, field }">
        <div>
          <a-image :width="200" :src="id_card_zs" class="images" />
          <a-image :width="200" :src="id_card_fs" />
        </div>
      </template>
      <template #zy="{ model, field }">
        <div>
          <a-image :width="200" :src="cop_img11" />
          <a-image :width="200" :src="cop_img22" />
        </div>
      </template>

      <template #zg="{ model, field }">
        <div>
          <a-image :width="200" :src="seniority11" />
          <a-image :width="200" :src="seniority22" />
        </div>
      </template>

      <template #zs="{ model, field }">
        <a-image :width="200" :src="title_imgs" />
      </template>

      <template #hospital_id="{ model, field }">
        <a-select
          v-model:value="model[field]"
          show-search
          placeholder="请输入医院"
          style="width: 200px"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          :options="data"
          @search="handleSearch"
          @change="handleChange"
          disabled
        />
      </template>

      <template #kid1="{ model, field }">
        <a-input v-model:value="ks" disabled />
        <!-- <a-cascader
          v-model:value="model[field]"
          :fieldNames="{ label: 'name', value: 'kid', children: 'subclass' }"
          :options="treeData"
          placeholder="请选择科室"
        /> -->
      </template>
      <template #selectstatus="{ model, field }">
        <a-select
          v-model:value="model[field]"
          :size="size"
          style="width: 200px"
          :options="selects"
          @change="getstatus"
          placeholder="请选择"
        ></a-select>
      </template>
      <template #text="{ model, field }">
        <a-textarea v-model:value="model[field]" @change="getcont" />
      </template>
    </BasicForm>

    <BasicForm @register="registerForm" style="width: 85%" v-else disabled>
      <template #phones="{ model, field }" disabled>
        <a-input v-model:value="model[field]" disabled />
      </template>

      <template #names="{ model, field }">
        <a-input v-model:value="model[field]" disabled />
      </template>

      <template #sexs="{ model, field }">
        <a-input v-model:value="model[field]" disabled />
      </template>

      <template #tids="{ model, field }">
        <a-input v-model:value="zc" disabled />
      </template>

      <template #id_card="{ model, field }">
        <a-input v-model:value="model[field]" disabled />
      </template>
      <template #zigecard_number="{ model, field }">
        <a-input v-model:value="model[field]" disabled />
      </template>
      <template #disease_pros="{ model, field }">
        <a-textarea v-model:value="model[field]" disabled />
      </template>
      <template #diseases="{ model, field }">
        <a-textarea v-model:value="model[field]" disabled />
      </template>
      <template #descs="{ model, field }">
        <a-textarea v-model:value="model[field]" disabled />
      </template>

      <template #UP="{ model, field }">
        <a-image :width="200" :src="tx" />
      </template>

      <template #sfz="{ model, field }">
        <div>
          <a-image :width="200" :src="id_card_zs" class="images" />
          <a-image :width="200" :src="id_card_fs" />
        </div>
      </template>
      <template #zy="{ model, field }">
        <div>
          <a-image :width="200" :src="cop_img11" />
          <a-image :width="200" :src="cop_img22" />
        </div>
      </template>

      <template #zg="{ model, field }">
        <div>
          <a-image :width="200" :src="seniority11" />
          <a-image :width="200" :src="seniority22" />
        </div>
      </template>

      <template #zs="{ model, field }">
        <a-image :width="200" :src="title_imgs" />
      </template>

      <template #hospital_id="{ model, field }">
        <a-select
          v-model:value="model[field]"
          show-search
          placeholder="请输入医院"
          style="width: 200px"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          :options="data"
          @search="handleSearch"
          @change="handleChange"
          disabled
        />
      </template>

      <template #kid1="{ model, field }">
        <a-input v-model:value="ks" disabled />
        <!-- <a-cascader
          v-model:value="model[field]"
          :fieldNames="{ label: 'name', value: 'kid', children: 'subclass' }"
          :options="treeData"
          placeholder="请选择科室"
        /> -->
      </template>
      <template #selectstatus="{ model, field }">
        <a-select
          v-model:value="model[field]"
          :size="size"
          style="width: 200px"
          :options="selects"
          disabled
          @change="getstatus"
        ></a-select>
      </template>
      <template #text="{ model, field }">
        <a-textarea v-model:value="model[field]" @change="getcont" disabled />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, unref, computed } from 'vue';
import { BasicForm, useForm } from '/@/components/Form/index';
import { expertFormSchema } from './data';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
import {
  GetUpLoadImg,
  GetHospitalSearch,
  GetDepartment,
  GetUserDetail,
  image,
  create,
  shenhe,
} from '/@/api/sys/userslist';

import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';

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
    GetHospitalSearch(params)
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
  name: 'userlistDrawer',
  components: { BasicDrawer, BasicForm, LoadingOutlined, PlusOutlined },

  setup(_, { emit }) {
    const treeData = ref([]);
    const isUpdate = ref(true);
    const record = ref();
    const selfieId = ref();
    const id_card_z = ref();
    const id_card_f = ref();
    const cop_img1 = ref();
    const cop_img2 = ref();
    const seniority1 = ref();
    const seniority2 = ref();
    const title_img = ref();
    const isNew = ref(true);
    const selects = ref([
      { label: '审核通过', value: 1 },
      { label: '审核失败', value: 2 },
    ]);
    const ishow = ref(1);
    const imgarray = ref();
    const tx = ref();
    const id_card_zs = ref();
    const id_card_fs = ref();
    const cop_img11 = ref();
    const cop_img22 = ref();
    const seniority11 = ref();
    const seniority22 = ref();
    const title_imgs = ref();
    const opp = ref([
      { label: '主任医师 ', value: 22 },
      { label: '副主任医师', value: 72 },
      { label: '主治医师', value: 48 },
      { label: '住院医师', value: 62 },
      { label: '其他', value: 68 },
    ]);

    const zc = ref();
    const ks = ref();
    const audit_status = ref();
    const audit_status_reason = ref();
    const ischeck = ref();
    // const userid = ref()
    const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
      labelWidth: 110,
      schemas: expertFormSchema,
      showActionButtonGroup: false,
    });

    const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
      resetFields();
      setDrawerProps({ confirmLoading: false });
      // userid.value = data.
      isUpdate.value = data.isUpdate;
      ischeck.value = data.ischeck;
      record.value = data.record;
      isNew.value = data.isNew;
      ishow.value = data.ishow;
      console.log(data);
      if (unref(treeData.value).length === 0) {
        await GetDepartment().then((res) => {
          treeData.value = res.data.items;
        });
      }
      if (unref(isUpdate.value) || ischeck.value) {
        const { data } = await GetUserDetail({ did: record.value.did });

        if (data.tid == 22) {
          zc.value = '主任医师';
        } else if (data.id == 72) {
          zc.value = '主任医师';
        } else if (data.id == 48) {
          zc.value = '主治医师';
        } else if (data.id == 62) {
          zc.value = '住院医师';
        } else if (data.id == 68) {
          zc.value = '其他';
        }
        ks.value = data.kid1_name + '/' + data.kid2_name;
        data.hospital_id = data.hospital_name;
        let arr = [data.kid1, data.kid2];
        const arrs = data.image_address;
        let sss = 'id_' + data.selfie;
        let aaa = 'id_' + data.id_card_z;
        let bbb = 'id_' + data.id_card_f;
        let ccc = 'id_' + data.cop_img1;
        let ddd = 'id_' + data.cop_img2;
        let eee = 'id_' + data.seniority1;
        let qqq = 'id_' + data.seniority2;
        let uuu = 'id_' + data.title_img;
        console.log(sss);
        //大头照
        tx.value = arrs[sss].middle;
        id_card_zs.value = arrs[aaa].middle;
        id_card_fs.value = arrs[bbb].middle;
        cop_img11.value = arrs[ccc].middle;
        cop_img22.value = arrs[ddd].middle;
        seniority11.value = arrs[eee].middle;
        seniority22.value = arrs[qqq].middle;
        title_imgs.value = arrs[uuu].middle;
        data.kid1 = arr;
        console.log(data);
        setFieldsValue({
          ...data,
        });
      }
    });

    const getTitle = computed(() => (isNew.value ? '新增用户' : isUpdate.value ? '审核' : '查看'));

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
        selfieId.value = res.data.id;
      });
    };
    const tirggerFile2 = (event) => {
      var file = event.target.files;
      var reader = new FileReader(); //读取文件
      reader.readAsDataURL(file[0]);
      const files = file[0];
      reader.onload = function () {
        document.getElementById('img2').src = reader.result;
      };
      var formdata = new FormData();
      formdata.append('image', file[0]);
      // let params = {
      //   image:formdata
      // }
      image(formdata).then((res) => {
        id_card_z.value = res.data.id;
      });
    };
    const tirggerFile3 = (event) => {
      var file = event.target.files;
      var reader = new FileReader(); //读取文件
      reader.readAsDataURL(file[0]);
      const files = file[0];
      reader.onload = function () {
        document.getElementById('img3').src = reader.result;
      };
      var formdata = new FormData();
      formdata.append('image', file[0]);
      // let params = {
      //   image:formdata
      // }
      image(formdata).then((res) => {
        id_card_f.value = res.data.id;
      });
    };
    const tirggerFile4 = (event) => {
      var file = event.target.files;
      var reader = new FileReader(); //读取文件
      reader.readAsDataURL(file[0]);
      const files = file[0];
      reader.onload = function () {
        document.getElementById('img4').src = reader.result;
      };
      var formdata = new FormData();
      formdata.append('image', file[0]);
      // let params = {
      //   image:formdata
      // }
      image(formdata).then((res) => {
        cop_img1.value = res.data.id;
      });
    };
    const tirggerFile5 = (event) => {
      var file = event.target.files;
      var reader = new FileReader(); //读取文件
      reader.readAsDataURL(file[0]);
      const files = file[0];
      reader.onload = function () {
        document.getElementById('img5').src = reader.result;
      };
      var formdata = new FormData();
      formdata.append('image', file[0]);
      // let params = {
      //   image:formdata
      // }
      image(formdata).then((res) => {
        cop_img2.value = res.data.id;
      });
    };
    const tirggerFile6 = (event) => {
      var file = event.target.files;
      var reader = new FileReader(); //读取文件
      reader.readAsDataURL(file[0]);
      const files = file[0];
      reader.onload = function () {
        document.getElementById('img6').src = reader.result;
      };
      var formdata = new FormData();
      formdata.append('image', file[0]);
      // let params = {
      //   image:formdata
      // }
      image(formdata).then((res) => {
        seniority1.value = res.data.id;
      });
    };
    const tirggerFile7 = (event) => {
      var file = event.target.files;
      var reader = new FileReader(); //读取文件
      reader.readAsDataURL(file[0]);
      const files = file[0];
      reader.onload = function () {
        document.getElementById('img7').src = reader.result;
      };
      var formdata = new FormData();
      formdata.append('image', file[0]);
      // let params = {
      //   image:formdata
      // }
      image(formdata).then((res) => {
        seniority2.value = res.data.id;
      });
    };
    const tirggerFile8 = (event) => {
      var file = event.target.files;
      var reader = new FileReader(); //读取文件
      reader.readAsDataURL(file[0]);
      const files = file[0];
      reader.onload = function () {
        document.getElementById('img8').src = reader.result;
      };
      var formdata = new FormData();
      formdata.append('image', file[0]);
      // let params = {
      //   image:formdata
      // }
      image(formdata).then((res) => {
        title_img.value = res.data.id;
      });
    };
    const data = ref<any[]>([]);
    const handleSearch = (val: string) => {
      fetch(val, (d: any[]) => (data.value = d));
    };
    const handleChange = (val: string) => {
      fetch(val, (d: any[]) => (data.value = d));
    };
    const getstatus = (val) => {
      console.log(val);
      audit_status.value = val;
    };
    const getcont = (val) => {
      console.log(val);
      audit_status_reason.value = val.target._value;
    };

    async function handleSubmit() {
      try {
        const values = await validate();
        console.log(values);
        console.log(audit_status_reason.value);
        console.log(audit_status.value);

        let params = {
          did: record.value.did,
          audit_status: audit_status.value,
          audit_status_reason: audit_status_reason.value,
        };
        shenhe(params).then((res) => {
          if (res.code == 200) {
            setDrawerProps({ confirmLoading: true });
            closeDrawer();
            emit('success');
          }
        });
        // let params = {
        //   phone: values.phone,
        //   name: values.name,
        //   sex: values.sex,
        //   tid: values.tid,
        //   hospital_id: values.hospital_id,
        //   kid1: values.kid1[0],
        //   kid2: values.kid1[1],
        //   selfie: selfieId.value,
        //   id_card_z: id_card_z.value,
        //   id_card_f: id_card_f.value,
        //   cop_img1: cop_img1.value,
        //   cop_img2: cop_img2.value,
        //   seniority1: seniority1.value,
        //   seniority2: seniority2.value,
        //   title_img: title_img.value,
        //   id_card: values.id_card,
        //   zigecard_number: values.zigecard_number,
        //   disease_pro: values.disease_pro,
        //   disease: values.disease,
        //   desc: values.desc,
        // };
        // console.log(params);

        // create(params).then((res) => {
        //   if (res.code == 200) {
        //     setDrawerProps({ confirmLoading: true });
        //     closeDrawer();
        //     emit('success');
        //   }
        // });
      } finally {
        setDrawerProps({ confirmLoading: false });
      }
    }

    return {
      create,
      registerDrawer,
      registerForm,
      handleSubmit,
      handleSearch,
      handleChange,
      tirggerFile,
      image,
      tirggerFile8,
      tirggerFile7,
      tirggerFile6,
      tirggerFile5,
      tirggerFile4,
      tirggerFile3,
      tirggerFile2,
      getstatus,
      getcont,
      shenhe,
      getTitle,
      data,
      treeData,
      selfieId,
      id_card_z,
      id_card_f,
      cop_img1,
      cop_img2,
      seniority1,
      seniority2,
      title_img,
      selects,
      isNew,
      imgarray,
      tx,
      id_card_zs,
      cop_img11,
      cop_img22,
      seniority11,
      seniority22,
      title_imgs,
      isUpdate,
      opp,
      zc,
      ks,
      audit_status,
      audit_status_reason,
      ischeck
    };
  },
});
</script>
<style type="text/css" scoped>
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
}

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
/* .images{
  width: 100px;
  width: 150px;
} */
</style>
