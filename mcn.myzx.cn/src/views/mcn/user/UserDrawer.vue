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
      <template #roleIds="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :replaceFields="{ title: 'title', key: 'id' }"
          checkable
          :toolbar="false"
        />
      </template>
      <template #managedDoctorIds="{ model, field }">
        <a-checkbox :checked="isAllCheck" @change="onCheckAllChange">全选</a-checkbox>
        <a-checkbox-group v-model:value="model[field]" :options="doctors" @change="onCheckChange" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { userFormSchema } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { createUser, editUser } from '/@/api/sys/user';
  import { getRoles } from '/@/api/sys/role';
  import { getOrganizationDoctorList } from '/@/api/sys/doctor';

  export default defineComponent({
    name: 'UserDrawer',
    components: { BasicDrawer, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const treeData = ref<TreeItem[]>([]);
      const doctors = ref([]);
      const isAllCheck = ref(false);
      const userStore = useUserStoreWithOut();
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        schemas: userFormSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 23, md: 24 },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });

        if (unref(treeData).length === 0) {
          treeData.value = (await getRoles(
            userStore.getUserInfo.organization_id
          )) as any as TreeItem[];
        }

        if (unref(doctors).length === 0) {
          const doctorsValue = await getOrganizationDoctorList({});
          doctors.value = doctorsValue.map((item) => {
            item.label = item.info;
            item.value = item.id;
            return item;
          });
          console.log(doctors.value);
        }

        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          data.record.userEmail = data.record.email;
          // data.record.userPassword = data.record.password;
          delete data.record.email;
          delete data.record.password;
          setFieldsValue({
            ...data.record,
          });
        }
      });

      const onCheckAllChange = () => {
        isAllCheck.value = !isAllCheck.value;
        setFieldsValue({
          managed_doctor_ids: isAllCheck.value ? doctors.value.map((item) => item.value) : [],
        });
      };

      const onCheckChange = (e) => {
        isAllCheck.value = e.length === doctors.value.length;
      };

      const getTitle = computed(() => (!unref(isUpdate) ? '新增用户' : '编辑用户'));

      async function handleSubmit() {
        try {
          const values = await validate();
          values.email = values.userEmail;
          values.password = values.userPassword;
          delete values.userEmail;
          delete values.userPassword;
          setDrawerProps({ confirmLoading: true });
          let roleIds = JSON.parse(JSON.stringify(values.role_ids));

          if (roleIds.checked != undefined && roleIds.halfChecked != undefined) {
            roleIds = roleIds.checked.concat(roleIds.halfChecked);
          }

          values.role_ids = roleIds;

          if (unref(isUpdate)) {
            await editUser(values.id, values);
          } else {
            await createUser(userStore.getUserInfo.organization_id, values);
          }

          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        onCheckAllChange,
        onCheckChange,
        isAllCheck,
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
        treeData,
        doctors,
      };
    },
  });
</script>
<style type="text/css">
  #role_ids .vben-basic-tree,
  #managed_doctor_ids .vben-basic-tree {
    height: fit-content !important;
  }
  #role_ids .scrollbar__wrap,
  #managed_doctor_ids .scrollbar__wrap {
    padding: 0px !important;
    margin-left: -24px;
    margin-top: -2px;
  }
  #role_ids .ant-tree li {
    width: 50%;
    display: inline-block;
  }
</style>
