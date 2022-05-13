<template>
  <BasicDrawer
    title="评论列表"
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" style="width: 90%"> </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
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
          let params = {};
          // GetExpertsNews(params).then((res) => {
          //   console.log(res);
          // });
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { registerDrawer, registerForm, handleSubmit };
    },
  });
</script>
<style type="text/css" scoped></style>
