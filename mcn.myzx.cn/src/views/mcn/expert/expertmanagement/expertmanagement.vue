<template>
  <BasicDrawer
    title="审核"
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" style="width: 90%" v-if="isUpdate">
      <template #picture>
        <div class="comment">
          <div class="picture" v-for="(item, i) in list">
            <a-image style="width: 150px; height: 130px" :src="item" class="image" />
          </div>
        </div>
      </template>
    </BasicForm>
    <BasicForm @register="registerForm" style="width: 90%" v-else disabled>
      <template #picture>
        <div class="comment">
          <div class="picture" v-for="(item, i) in list">
            <a-image
              style="width: 150px; height: 100px; margin-left: 10px"
              :src="item"
              class="image"
            />
          </div>
        </div>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { expertFormSchema } from './data';
  import { GetConsultationId, GetConsultationIdTips } from '/@/api/sys/expertmanagement';
  import { useMessage } from '/@/hooks/web/useMessage';
  // import { GetConsultationId } from '/@/api/sys/expertmanagement';

  export default defineComponent({
    name: 'ExpertDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success'],

    setup(_, { emit }) {
      const id = ref();
      const isUpdate = ref();
      const { createMessage } = useMessage();
      const { info, success, warning, error } = createMessage;
      const list = ref([]);
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        schemas: expertFormSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = data.isUpdate;

        id.value = data.record.id;
        if (!isUpdate.value) {
          await GetConsultationIdTips(id.value).then((res) => {
            list.value = res.data.checklist;
            setFieldsValue({
              ...res.data,
            });
          });
        } else {
          await GetConsultationIdTips(id.value).then((res) => {
            list.value = res.data.checklist;
            console.log(list.value);
            console.log(res.data.checklist);
            res.data.status = '';
            setFieldsValue({
              ...res.data,
            });
          });
        }
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          console.log(values);
          if (isUpdate.value) {
            let params = {
              reason: values.reason,
              status: values.status,
            };
            GetConsultationId(id.value, params).then((res) => {
              if (res.code === 200) {
                setDrawerProps({ confirmLoading: true });
                closeDrawer();
                info('已审核');
                emit('success');
              }
            });
          } else {
            closeDrawer();
          }
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        registerDrawer,
        registerForm,
        handleSubmit,
        isUpdate,
        id,
        list,
      };
    },
  });
</script>
<style type="text/css" scoped>
  .comment {
    width: 100%;
    display: flex;
    height: auto;
    flex-wrap: wrap;
  }
  /* .picture {
  width: 100px;
  height: 100px;
} */
  .ant-image-img,
  image {
    width: 50px;
    height: 50px;
  }
</style>
