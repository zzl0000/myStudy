<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { permissionFormSchema } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { getPermissionList, createPermission, editPermission } from '/@/api/sys/permission';
  import { useMessage } from "/@/hooks/web/useMessage";

  export default defineComponent({
    name: 'PermissionDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { createMessage,createSuccessModal, createWarningModal } = useMessage();
      const { info, success, warning, error } = createMessage;

      const isUpdate = ref(true);

      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 150,
        schemas: permissionFormSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 23, md: 24 },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          setFieldsValue({...data.record,});
        }

        const treeData = await getPermissionList();
        treeData.unshift({
          id: 0,
          title: '请选择(默认第1级权限)',
        });

        updateSchema({
          field: 'parent_id',
          componentProps: { treeData },
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增权限' : '编辑权限'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });

          if (!unref(isUpdate)) {
            await createPermission(values);
          } else {
            await editPermission(values.id, values);
          }

          console.log(values);
          closeDrawer();
          const successMessage = (unref(isUpdate) ? '更新' : '创建') + '菜单成功!';
          success(successMessage);
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { registerDrawer, registerForm, getTitle, handleSubmit };
    },
  });
</script>
