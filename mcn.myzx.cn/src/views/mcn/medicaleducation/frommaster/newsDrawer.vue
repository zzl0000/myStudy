<template>
  <BasicDrawer
    :title="getTitle"
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm
      @register="registerForm"
      style="width: 90%"
      v-if="isUpdate"
    >
    </BasicForm>
    <BasicForm @register="registerForm" style="width: 90%" v-else disabled>
    
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { BasicForm, useForm } from '/@/components/Form/index';
import { expertFormSchema } from './data';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
import { examine, push } from '/@/api/sys/frommaster';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
// import { message } from 'ant-design-vue';
// import type { UploadChangeParam, UploadProps } from 'ant-design-vue';

// function getBase64(img: Blob, callback: (base64Url: string) => void) {
//   const reader = new FileReader();
//   reader.addEventListener('load', () => callback(reader.result as string));
//   reader.readAsDataURL(img);
// }

export default defineComponent({
  name: 'newsDrawer',
  components: { BasicDrawer, BasicForm, LoadingOutlined, PlusOutlined },
  emits: ['success', 'register'],

  setup(_, { emit }) {
    const isUpdate = ref(true);

    const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
      labelWidth: 90,
      schemas: expertFormSchema,
      showActionButtonGroup: false,
    });
    const userid = ref();
    const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
      resetFields();
      setDrawerProps({ confirmLoading: false });

      isUpdate.value = data.isUpdate;

      console.log(data.record);
      console.log(data);
      userid.value = data.record.id;
      if (isUpdate.value) {
        let params = {
          id: data.record.id,
        };
        await examine(params).then((res) => {
          setFieldsValue({
            ...res.data,
          });
        });
      } else {
        let params = {
          id: data.record.id,
        };
        await examine(params).then((res) => {
          setFieldsValue({
            ...res.data,
          });
        });
      }
    });

    const getTitle = computed(() => (isUpdate ? '审核' : '查看'));

    async function handleSubmit() {
      try {
        const values = await validate();
        console.log(values);
        let params = {
          id: userid.value,
          status: values.status,
          reason: values.reason,
        };
        console.log(params);
        await push(params).then((res) => {
          if (res.code == 200) {
            // setDrawerProps({ confirmLoading: true });
            closeDrawer();
            emit('success');
          }
        });
        // console.log(values);
        // let params = {
        //   title: values.title,
        //   cover_img: 'https://aa.aa.com/aaaaaa.jpg',
        //   source: values.source,
        //   view_count_basic: Number(values.view_count_basic),
        //   content: values.content,
        //   status: values.status,
        //   is_recommend: values.is_recommend,
        //   is_top: values.is_top,
        // };
        // console.log(params);
        // await GetNewsCreate(params).then((res) => {
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

    // const fileList = ref([]);
    // const loading = ref<boolean>(false);
    // const imageUrl = ref<string>('');

    // const handleChange = (info: UploadChangeParam) => {
    //   if (info.file.status === 'uploading') {
    //     loading.value = true;
    //     return;
    //   }
    //   if (info.file.status === 'done') {
    //     getBase64(info.file.originFileObj, (base64Url: string) => {
    //       imageUrl.value = base64Url;
    //       console.log(info.file.originFileObj);
    //       console.log(base64Url);
    //       loading.value = false;
    //     });
    //   }
    //   if (info.file.status === 'error') {
    //     loading.value = false;
    //     message.error('upload error');
    //   }
    // };

    // const beforeUpload = (file: UploadProps['fileList'][number]) => {
    //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    //   if (!isJpgOrPng) {
    //     message.error('只能上传JPG或者PNG图片，且不超过4M');
    //   }
    //   const isLt4M = file.size / 1024 / 1024 <script 4;
    //   if (!isLt4M) {
    //     message.error('图片不能超过4M');
    //   }
    //   return isJpgOrPng && isLt4M;
    // };

    return {
      registerDrawer,
      registerForm,
      handleSubmit,
      userid,
      isUpdate,
      // fileList,
      // loading,
      // imageUrl,
      // handleChange,
      // beforeUpload,
      getTitle,
    };
  },
});
</script>

<style scoped>
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
</style>
