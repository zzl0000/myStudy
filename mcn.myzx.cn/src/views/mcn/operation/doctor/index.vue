<template>
  <PageWrapper title="医生管理">
    <BasicTable @register="registerTable">
      <template #form-keshi="{ model, field }">
        <select class="ant-input" v-model="model[field]">
          <option v-for="item in keshi" :key="item" :value="item.kid2">
            {{ item.custom_keshi }}
          </option>
        </select>
      </template>

      <template #form-hospital="{ model, field }">
        <select class="ant-input" v-model="model[field]">
          <option v-for="item in hospital" :key="item" :value="item">{{ item }}</option>
        </select>
      </template>

      <template #form-tid="{ model, field }">
        <select class="ant-input" v-model="model[field]">
          <option v-for="item in tid" :key="item" :value="item.id">{{ item.name }}</option>
        </select>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              label: '基础设置',
              onClick: handleEdit.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <DoctorDrawer @register="registerDrawer" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getUserSearchFormSchema, getUserColumns } from './data';
  import { getDoctorList } from '/@/api/sys/operation';
  import { useUserStoreWithOut } from '/@/store/modules/user';

  import DoctorDrawer from './DoctorDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { ref } from 'vue';

  const keshi = ref<any>([]);
  const hospital = ref<any>([]);
  const tid = ref<any>([]);

  const userStore = useUserStoreWithOut();
  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload }] = useTable({
    api: getDoctorAction,
    columns: getUserColumns(),
    formConfig: {
      labelWidth: 80,
      schemas: getUserSearchFormSchema(),
    },
    useSearchForm: true,
    canResize: false,
    pagination: true,
    showTableSetting: true,
    bordered: false,
    showIndexColumn: false,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  async function getDoctorAction(params: any) {
      // params[''] = params.per_page;
   
    let param = {
      // page: params.current_page,
      // limit:15,
      mcn_id: userStore.getUserInfo.organization_id,
      hospital_name: params.hospital_name,
      keywords: params.keywords,
      kid2: params.kid2,
      tid: params.tid,
    };
     param['page'] = params.current_page;
    param['limit'] = params.per_page;
    delete params.per_page;
    delete params.current_page;

    const data = await getDoctorList(userStore.getUserInfo.organization_id, param);
    keshi.value = data.keshi;
    hospital.value = data.hospital_list;
    tid.value = data.titles;

    return data;
  }

  function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
    });
  }
</script>

<style></style>
