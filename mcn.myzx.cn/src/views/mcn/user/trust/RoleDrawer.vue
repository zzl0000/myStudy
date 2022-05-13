<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="600px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #permissions="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :replaceFields="{ title: 'title', key: 'id'}"
          checkable
          :toolbar="false"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { roleFormSchema } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { createRole, editRole } from '/@/api/sys/role';
  import { getPermissionList } from '/@/api/sys/permission';

  export default defineComponent({
    name: 'RoleDrawer',
    components: { BasicDrawer, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const treeData = ref<TreeItem[]>([]);

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        schemas: roleFormSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });

        if (unref(treeData).length === 0) {
          treeData.value = (await getPermissionList()) as any as TreeItem[];
          console.log(treeData.value);
        }
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

      async function handleSubmit() {
        try {
          const values = await validate();
          const userStore = useUserStoreWithOut();
          setDrawerProps({ confirmLoading: true });
          const permissions = JSON.parse(JSON.stringify(values.permissions));

          let permissionIds = permissions;
          if (permissions.checked != undefined && permissions.halfChecked!=undefined) {
             permissions.checked.concat(permissions.halfChecked);
          }

          const params = {
            title: values.title,
            description: values.description,
            permission_ids: permissionIds,
          };

          if (!unref(isUpdate)) {
            await createRole(userStore.getUserInfo.organization_id, params);
          } else {
            await editRole(values.id, params);
          }

          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
        treeData,
      };
    },
  });
</script>
<style type="text/css">
#permissions .vben-basic-tree {
  height: fit-content !important;
  background: #fafafa;
  border-radius: 5px;
}
#permissions .scrollbar__wrap{
  margin-top: -2px;
}

</style>
