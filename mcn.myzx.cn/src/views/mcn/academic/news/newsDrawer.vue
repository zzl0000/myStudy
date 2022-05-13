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
      <template #UP="{ model, field }">
        <!-- <span v-model:value="model[field]"></span> -->
        <a-input
          type="file"
          @change="tirggerFile($event)"
          class="inputs"
          accept="image/png,image/jpeg"
        />
        <img style="width: 100px; height: 100px" id="img1" :src="defaultUrl" alt="" />
        <div style="color: red"> 封面格式JPG、JPEG、PNG，文件≤5MB，建议参考为1920*1080</div>
        <div v-if="ispicture" style="color: #ed6f6f">请上传封面图</div>
      </template>

      <template #source="{ model, field }">
        <!-- <span v-model:value="model[field]"></span> -->
        <a-input v-model="sources" autocomplete="off" placeholder="请输入来源" />
      </template>
    </BasicForm>

    <!-- <BasicForm @register="registerForm" style="width: 90%">
      <template #UP="{ model, field }">
        <span v-model:value="model[field]"></span>
        <a-input type="file" @change="tirggerFile($event)" v-model:value="model[field]" />
        <img style="width: 100px; height: 100px; margin-left: 105px" id="img1" alt />
      </template>
    </BasicForm> -->
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { expertFormSchema } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { GetNewsCreate, GetNewsId, bianjis } from '/@/api/sys/news';
  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
  import { image } from '/@/api/sys/userslist';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'newsDrawer',
    components: { BasicDrawer, BasicForm, LoadingOutlined, PlusOutlined },
    emits: ['success', 'register'],

    setup(_, { emit }) {
      const isUpdate = ref(true);
      const selfieId = ref();
      const defaultP = ref();
      const ids = ref();
      const defaultUrl = ref();
      const newurl = ref();
      const sources = ref();
      const ispicture = ref(false);

      const [registerForm, { resetFields, setFieldsValue, validate, clearValidate }] = useForm({
        labelWidth: 90,
        schemas: expertFormSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        ispicture.value = false;

        isUpdate.value = data.isUpdate;
        if (unref(!isUpdate.value)) {
          console.log(sources.value);
          ispicture.value = false;

          const content = '';
          setFieldsValue({
            content,
          });
          clearValidate();
        }

        if (unref(isUpdate.value)) {
          ids.value = data.record.id;

          await GetNewsId(data.record.id).then((res) => {
            if (res.code == 200) {
              console.log(res);
              defaultUrl.value = res.data.cover_img;
              sources.value = res.data.sources;
              setFieldsValue({
                ...res.data,
              });
            }
          });
        } else {
          defaultUrl.value = '';
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增资讯' : '编辑资讯'));

      const tirggerFile = (event) => {
        var file = event.target.files;

        if (!(file[0].type === 'image/jpeg' || file[0].type === 'image/png')) {
          return message.error('只能上传jpg和png格式');
        }
        if (file[0].size / 1024 / 1024 > 5) {
          return message.error('图片必须小于5M!');
        }

        var reader = new FileReader(); //读取文件
        reader.readAsDataURL(file[0]);
        const files = file[0];
        reader.onload = function () {
          document.getElementsByClassName('img1').src = reader.result;
        };
        var formdata = new FormData();
        formdata.append('image', file[0]);

        image(formdata).then((res) => {
          selfieId.value = res.data.origin;
          defaultUrl.value = res.data.origin;
          ispicture.value = false;
        });
        document.getElementsByClassName('inputs').value = null;
      };

      async function handleSubmit() {
        if (defaultUrl.value) {
          ispicture.value = false;
        } else {
          ispicture.value = true;
        }
        try {
          const values = await validate();
          console.log(defaultUrl.value);

          if (!unref(isUpdate)) {
            let params = {
              title: values.title,
              cover_img: selfieId.value,
              source: values.source,
              view_count_basic: Number(values.view_count_basic),
              content: values.content,
              status: values.status,
              is_recommend: values.is_recommend,
              is_top: values.is_top,
            };
            console.log(params);
            await GetNewsCreate(params).then((res) => {
              if (res.code == 200) {
                setDrawerProps({ confirmLoading: true });
                closeDrawer();
                emit('success');
              } else {
                message.error(res.message);
              }
            });
          } else {
            if (defaultUrl.value == values.cover_img) {
              newurl.value = defaultUrl.value;
            } else {
              newurl.value = defaultUrl.value;
            }
            // console.log(defaultUrl.value)
            // console.log(values.cover_img)
            // else{
            //    defaultUrl.value
            // }
            let params = {
              title: values.title,
              cover_img: newurl.value,
              source: values.source,
              view_count_basic: Number(values.view_count_basic),
              content: values.content,
              status: values.status,
              is_recommend: values.is_recommend,
              is_top: values.is_top,
            };
            await bianjis(ids.value, params).then((res) => {
              if (res.code == 200) {
                message.success('修改成功');
                setDrawerProps({ confirmLoading: true });
                closeDrawer();
                emit('success');
              } else {
                message.error(res.message);
              }
            });
          }
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        registerDrawer,
        registerForm,
        handleSubmit,
        tirggerFile,
        selfieId,
        getTitle,
        image,
        defaultP,
        bianjis,
        defaultUrl,
        newurl,
        ispicture,
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
