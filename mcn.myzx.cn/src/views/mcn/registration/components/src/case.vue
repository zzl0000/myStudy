<template>
  <BasicForm @register="registerForm" @submit="handleSubmit" @reset="goBack">
    <template #special_period_enum="{ model, field }">
      <a-form-item :labelCol="{ style: { width: '90px' } }" v-if="isSex != 1" label="特殊期：">
        <a-textarea :rows="4" v-model:value="special_period_enum" />
      </a-form-item>
    </template>
    <template #customOne>
      <Upload
        action="https://wzapi.myzx.cn/apps/dv2/upload/image"
        list-type="picture-card"
        v-model:fileList="tongueFileList"
        name="image"
        :data="{ debug: 1 }"
        :before-upload="beforeUpload"
        :on-preview="handlePreview"
        @change="handleTongueSuccess"
        accept="[image/*]"
      >
        <div v-if="tongueFileList.length < 16">
          <plus-outlined />
          <div class="ant-upload-text">请上传</div>
        </div>
      </Upload>
      <Modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </Modal>
    </template>
    <template #customTow>
      <Upload
        action="https://wzapi.myzx.cn/apps/dv2/upload/image"
        list-type="picture-card"
        v-model:fileList="casesFileList"
        name="image"
        :data="{ debug: 1 }"
        :before-upload="beforeUpload"
        :on-preview="handlePreview"
        @change="handleCasesSuccess"
        accept="[image/*]"
      >
        <div v-if="casesFileList.length < 16">
          <plus-outlined />
          <div class="ant-upload-text">请上传</div>
        </div>
      </Upload>
      <Modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </Modal>
    </template>
  </BasicForm>
</template>

<script lang="ts">
  import {
    defineComponent,
    ref,
    getCurrentInstance,
    inject,
    reactive,
    toRefs,
    nextTick,
  } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { schemas } from './case.data';
  import { Upload, Modal } from 'ant-design-vue';
  import { getConsultation, editConsultation } from '/@/api/sys/appointments';

  export default defineComponent({
    components: { BasicForm, useForm, Upload, Modal },
    emits: ['changeTab'],
    setup(props, { emit }) {
      const [registerForm, { setFieldsValue }] = useForm({
        labelWidth: 90,
        schemas: schemas,
        showActionButtonGroup: true,
        resetButtonOptions: {
          text: '取消',
        },
        submitButtonOptions: {
          text: '确定',
        },
      });

      const { createMessage } = useMessage();

      const previewImage = ref('');
      const previewVisible = ref(false);

      const state = reactive({
        tongueFileList: [] as any[],
        casesFileList: [] as any[],
      });

      const beforeUpload = (file) => {
        console.log(file);
        const isLt2M = file.size / 1024 / 1024 < 4;
        const isImg = file.type.indexOf('image') !== -1;
        if (!isImg) {
          createMessage.error('只能上传图片!');
          return false;
        }
        if (!isLt2M) {
          createMessage.error('上传图片大小不能超过 4MB!');
          return false;
        }

        return true;
      };

      const handlePreview = (file) => {
        // console.log(file);
        if (file.url) {
          previewImage.value = file.url;
        } else {
          previewImage.value = file.thumbUrl;
        }

        previewVisible.value = true;
      };

      const handleCancel = () => {
        previewVisible.value = false;
      };

      const handleTongueSuccess = (info: Recordable) => {
        if (!info.file?.status) {
          nextTick(() => {
            state.tongueFileList.splice(state.tongueFileList.length - 1, 1);
          });
        }
      };

      const handleCasesSuccess = (info: Recordable) => {
        if (!info.file?.status) {
          nextTick(() => {
            state.casesFileList.splice(state.casesFileList.length - 1, 1);
          });
        }
      };

      const data: any = inject('data');
      console.log('1111111111111111111111111111111111111111111111111111111111');
      console.log(data.value);
      const isSex = ref('');

      const types = ref();
      getConsultation(data.id).then((response) => {
        types.value = response?.type;
        let first = [] as any[];
        let start = 0;
        if (response?.tongue_face_imgs) {
          for (let i = 0; i < response.tongue_face_imgs.length; i++) {
            first.push({
              id: --start,
              name: response.tongue_face_imgs[i],
              url: response.tongue_face_imgs[i],
              key: start,
            });
          }
        }

        let second = [] as any[];
        start = 0;
        if (response?.cases_checkdata_imgs) {
          for (let i = 0; i < response.cases_checkdata_imgs.length; i++) {
            second.push({
              id: --start,
              name: response.cases_checkdata_imgs[i],
              url: response.cases_checkdata_imgs[i],
              key: start,
            });
          }
        }

        state.tongueFileList = first;
        state.casesFileList = second;
        isSex.value = response.sex;
        special_period_enum.value = response.special_period_enum;
        setFieldsValue({
          ...response,
        });
      });

      const { proxy } = getCurrentInstance() as any;
      const goBack = () => {
        proxy.$router.go(-1);
      };

      const goDetails = () => {
        emit('changeTab', 'Consultation');
      };

      const special_period_enum = ref('');

      return {
        special_period_enum,
        isSex,
        ...toRefs(state),
        goBack,
        previewImage,
        previewVisible,
        beforeUpload,
        handlePreview,
        registerForm,
        handleCancel,
        handleTongueSuccess,
        handleCasesSuccess,
        handleSubmit: (values: any) => {
          if (special_period_enum.value) values.special_period_enum = special_period_enum.value;
          values.order_id = values.id;
          values.cases_checkdata_imgs = state.casesFileList.map((item) => {
            if (item?.response) return item?.response?.data?.origin;
            else return item.url;
          });
          values.tongue_face_imgs = state.tongueFileList.map((item) => {
            if (item?.response) return item?.response?.data?.origin;
            else return item.url;
          });
          //delete(values.icd);
          delete values.id;
          values['type'] = types.value;
          editConsultation(values.order_id, values).then(() => {
            createMessage.success('病历收集成功!');
            goDetails();
          });
        },
      };
    },
  });
</script>

<style type="text/css">
  textarea {
    padding: 15px;
  }
  .ant-modal-close-icon {
    background: #ffffff;
    border-radius: 50%;
  }
</style>
