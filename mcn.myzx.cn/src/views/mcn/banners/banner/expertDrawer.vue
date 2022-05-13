<template>
  <BasicDrawer
    title="添加文章"
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" style="width: 90%">
     
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { expertFormSchema, num } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { GetExpertsNews } from '/@/api/sys/experts';

  export default defineComponent({
    name: 'expertDrawer',
    components: { BasicDrawer, BasicForm },

    setup(_, { emit }) {
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        schemas: expertFormSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          let params = {
            category_id: values.category_id,
            title: values.title,
            content: values.content,
            doctor_id: Number(values.doctor_id),
            department_1_id: Number(values.department_1_id),
            disease_id: Number(values.disease_id),
            view_count_basic: Number(values.view_count_basic),
            status: values.status,
            recommended: values.recommended,
            toped: values.toped,
          };
          GetExpertsNews(params).then((res) => {
            console.log(res);
          });
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { registerDrawer, registerForm, handleSubmit, num };
    },
  });
</script>
<style type="text/css" scoped></style>
