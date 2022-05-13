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
          @search="handleSearch"
          @change="handleChange"
        />
        <div style="color: #ed6f6f; margin-top: 5px" v-if="isShow">请输入专家姓名</div>
      </template>

      <template #department_1_id="{ model, field }">
        <a-cascader
          v-model:value="model[field]"
          :fieldNames="{ label: 'name', value: 'kid' }"
          :options="treeData"
          :allowClear="false"
          placeholder="请输入文章关联的科室"
          @change="handelTreeData"
        />
        <div style="color: #ed6f6f; margin-top: 5px" v-if="isShow1">请输入文章关联的科室</div>
      </template>

      <template #disease_id="{ model, field }">
        <a-select
          v-model:value="model[field]"
          show-search
          placeholder="请输入文章关联的疾病名称"
          style="width: 200px"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          :options="data1"
          @search="handleSearch1"
          @change="handleChange1"
        />
        <div style="color: #ed6f6f; margin-top: 5px" v-if="isShow2">请输入文章关联的疾病名称</div>
      </template>

      <template #upload_ppt_id="{ model, field }">
        <UploadPdf @onSuccess="onSuccess" :name="model[field]" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, h, unref, computed } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Tinymce } from '/@/components/Tinymce/index';
  import { FormSchema } from '/@/components/Table';
  import { UploadPdf } from '/@/components/UploadPdf/index';
  import { GetExpertAdvis } from '/@/api/sys/expertadvisory';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message } from 'ant-design-vue';
  import {
    GetExpertsNews,
    GetDepartments,
    GetDiseases,
    GetPaperId,
    GetPaperInfo,
  } from '/@/api/sys/experts';
  import { createList, addList, getListTips, getDoctor } from '/@/api/sys/academicactivities';

  let timeout: any;
  let timeout1: any;
  let currentValue = '';
  let currentValue1 = '';

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

  function fetch1(value: string, callback: any) {
    if (timeout1) {
      clearTimeout(timeout1);
      timeout1 = null;
    }
    currentValue1 = value;

    function fake1() {
      let params = {
        keywords: value,
      };
      GetDiseases(params)
        .then((response) => response)
        .then((d) => {
          if (currentValue1 === value) {
            const result = d;
            const data1: any[] = [];
            result.forEach((r: any) => {
              data1.push({
                value: r.id,
                label: r.name,
              });
            });
            callback(data1);
          }
        });
    }

    timeout1 = setTimeout(fake1, 300);
  }

  export default defineComponent({
    name: 'ExpertDrawer',
    components: { BasicDrawer, BasicForm, UploadPdf },
    emits: ['success', 'register'],

    setup(_, { emit }) {
      const treeData = ref<[]>([]);
      const diseases = ref<[]>([]);
      const Info = ref();
      const InfoBlooe = ref();
      const Blooe = ref(false);

      const expertFormSchema: FormSchema[] = [
        {
          field: 'title',
          component: 'Input',
          required: true,
          label: '文章标题',
          componentProps: {
            placeholder: '请输入文章标题',
          },
        },
        {
          field: 'category_id',
          component: 'Select',
          required: true,
          label: '类型',
          componentProps: {
            options: [
              { label: '论文精选', value: 1 },
              { label: '百家讲坛', value: 2 },
              { label: '病案分享', value: 3 },
              // { label: '专家文章', value: 4 },
            ],
            // onChange: (value) => {
            //   num.value = value;
            // },
          },
          colProps: {
            span: 14,
          },
        },
        {
          field: 'doctor_name',
          component: 'Input',
          required: true,
          slot: 'doctor_id',
          label: '主讲专家',
          rules: [
            {
              required: true,
              validator: async (rule, value) => {},
            },
          ],
        },
        {
          field: 'content',
          component: 'Input',
          required: true,
          label: '内容描述',
          rules: [{ required: true }],
          render: ({ model, field }) => {
            return h(Tinymce, {
              value: model[field],
              onChange: (value: string) => {
                model[field] = value;
              },
            });
          },
        },
        {
          field: 'department_1_title',
          component: 'Input',
          // required: true,
          label: '关联科室',
          // ifShow: () => {
          //   return num.value === 3;
          // },
          rules: [
            {
              required: true,
              validator: async (rule, value) => {},
            },
          ],
          slot: 'department_1_id',
        },
        {
          field: 'disease_title',
          component: 'Input',
          // required: true,
          label: '关联疾病',
          // ifShow: () => {
          //   return num.value === 3;
          // },
          rules: [
            {
              required: true,
              validator: async (rule, value) => {},
            },
          ],
          slot: 'disease_id',
        },
        {
          field: 'view_count_basic',
          component: 'Input',
          label: '阅读人数',
          componentProps: {
            placeholder: '请输入阅读人数',
          },
        },
        {
          field: 'attachment',
          component: 'Input',
          slot: 'upload_ppt_id',
          label: '附件',
        },
        {
          field: 'status',
          component: 'RadioGroup',
          required: true,
          label: '状态',
          componentProps: {
            options: [
              { label: '正常', value: 1 },
              { label: '下架', value: 0 },
            ],
          },
        },
        {
          field: 'recommended',
          component: 'RadioGroup',
          label: '推荐首页',
          required: true,
          componentProps: {
            options: [
              { label: '推荐', value: 1 },
              { label: '不推荐', value: 0 },
            ],
          },
        },
        {
          field: 'toped',
          component: 'RadioGroup',
          label: '置顶',
          required: true,
          componentProps: {
            options: [
              { label: '置顶', value: 1 },
              { label: '不置顶', value: 0 },
            ],
          },
        },
      ];
      const isShow = ref(false);
      const isShow1 = ref(false);
      const isShow2 = ref(false);

      const { createMessage } = useMessage();
      const { success } = createMessage;
      const [registerForm, { resetFields, setFieldsValue, validate, clearValidate }] = useForm({
        labelWidth: 90,
        schemas: expertFormSchema,
        showActionButtonGroup: false,
      });

      const isUpdate = ref(true);
      const doctorId = ref();
      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });

        isUpdate.value = !data?.isUpdate;
        doctorId.value = data.record;

        isShow.value = false;
        isShow1.value = false;
        isShow2.value = false;

        if (unref(treeData.value).length === 0) {
          treeData.value = await GetDepartments();
        }
        if (unref(!isUpdate.value)) {
          const content = '';
          setFieldsValue({
            content,
          });
          clearValidate();
        }

        if (unref(isUpdate.value)) {
          InfoBlooe.value = true;
          Blooe.value = true;
          Info.value = await GetPaperInfo(doctorId.value.id);
          let arr = [Info.value.department_1_id, Info.value.department_2_id];
          Info.value.department_1_title = arr;
          setFieldsValue({
            ...Info.value,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '创建文章' : '编辑文章'));

      const TreeData = ref();
      const handelTreeData = (val) => {
        if (val) {
          isShow1.value = false;
          TreeData.value = val;
        }
      };

      const changeData = ref();
      const changeData2 = ref();

      const data = ref<any[]>([]);
      const data1 = ref<any[]>([]);
      const handleSearch = (val: string) => {
        fetch(val, (d: any[]) => {
          data.value = d;
        });
      };
      const handleChange = (val: string) => {
        fetch(val, (d: any[]) => {
          data.value = d;
          changeData.value = val;
          isShow.value = false;
        });
      };

      const handleSearch1 = (val: string) => {
        fetch1(val, (d: any[]) => {
          data1.value = d;
        });
      };
      const handleChange1 = (val: string) => {
        fetch1(val, (d: any[]) => {
          data1.value = d;
          changeData2.value = val;
          isShow2.value = false;
        });
      };

      // 上传成功
      const attachmentData = ref('');
      const onSuccess = (val: any) => {
        attachmentData.value = JSON.stringify(val);
      };

      async function handleSubmit() {
        if (unref(!isUpdate.value)) {
          if (changeData.value) {
            isShow.value = false;
          } else {
            isShow.value = true;
          }

          if (TreeData.value) {
            isShow1.value = false;
          } else {
            isShow1.value = true;
          }

          if (changeData2.value) {
            isShow2.value = false;
          } else {
            isShow2.value = true;
          }
        }
        try {
          const values = await validate();

          // console.log(values);
          if (values.view_count_basic) {
            values.view_count_basic;
          } else {
            values.view_count_basic = '';
          }

          if (unref(!isUpdate.value)) {
            let params = {
              category_id: values.category_id,
              title: values.title,
              content: values.content,
              doctor_id: Number(values.doctor_name),
              view_count_basic: Number(values.view_count_basic),
              status: values.status,
              recommended: values.recommended,
              toped: values.toped,
              disease_id: values.disease_title,
              attachment: attachmentData.value,
            };

            params['department_1_id'] = Number(values.department_1_title[0]);
            params['department_2_id'] = Number(values.department_1_title[1]);
            // console.log(params);
            await GetExpertsNews(params).then((res) => {
              if (res.id) {
                setDrawerProps({ confirmLoading: true });
                success('创建成功');
                attachmentData.value = '';
                closeDrawer();
                emit('success');
              } else {
                message.error(res.message);
              }
            });
          }
          if (unref(isUpdate.value)) {
            if (values.doctor_name === Info.value.doctor_name) {
              values.doctor_name = Info.value.doctor_id;
            }
            if (values.disease_title === Info.value.disease_title) {
              values.disease_title = Info.value.disease_id;
            }
            let params = {
              category_id: values.category_id,
              title: values.title,
              content: values.content,
              doctor_id: Number(values.doctor_name),
              view_count_basic: Number(values.view_count_basic),
              status: values.status,
              recommended: values.recommended,
              toped: values.toped,
              disease_id: values.disease_title,
              attachment: attachmentData.value || values.attachment,
            };
            params['department_1_id'] = Number(values.department_1_title[0]);
            params['department_2_id'] = Number(values.department_1_title[1]);
            await GetPaperId(Info.value.id, params).then((res) => {
              if (res.id) {
                setDrawerProps({ confirmLoading: true });
                success('编辑成功');
                attachmentData.value = '';
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
        handleSearch,
        handleChange,
        handleSearch1,
        handleChange1,
        data,
        data1,
        getTitle,
        GetDepartments,
        treeData,
        diseases,
        isShow,
        isShow1,
        isShow2,
        handelTreeData,
        attachmentData,
        onSuccess,
      };
    },
  });
</script>
<style type="text/css" scoped></style>
