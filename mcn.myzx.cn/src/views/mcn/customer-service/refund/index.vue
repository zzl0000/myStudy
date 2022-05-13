<template>
  <PageWrapper title="退款审核">
    <BasicTable @register="registerTable" v-loading="tableLoading">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '问诊详情',
              icon: 'ant-design:pic-left-outlined',
              onClick: handleDetail.bind(null, record),
            },
            {
              label: '通过',
              icon: 'clarity:note-edit-line',
              color: 'success',
              popConfirm: {
                title: '是否确认通过?',
                confirm: handleAudit.bind(null, record, 'pass'),
              },
              ifShow: record.audit_status == '---' || record.audit_status == '待审核',
            },
            {
              label: '拒绝',
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认拒绝?',
                confirm: handleAudit.bind(null, record, 'refuse'),
              },
              ifShow: record.audit_status == '---' || record.audit_status == '待审核',
            },
          ]"
        />
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema } from './refund.data';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { getRefundsList, editRefundsStatus } from '/@/api/sys/refund';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo } from '/@/hooks/web/usePage';
  import { ref } from 'vue';

  const userStore = useUserStoreWithOut();
  const { createMessage } = useMessage();
  const { success } = createMessage;
  const go = useGo();

  const [registerTable, { reload }] = useTable({
    title: '',
    api: getRefundsListAction,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: false,
    showIndexColumn: false,
    actionColumn: {
      width: 200,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: 'right',
      align: 'left',
    },
  });

  const tableLoading = ref(false);

  async function getRefundsListAction(params: any) {
    const orgId = userStore.getUserInfo.organization_id;
    const data = await getRefundsList(orgId, params);
    return data;
  }

  function handleSearch() {
    reload();
  }

  function handleDetail(record: Recordable) {
    // const path = '/customer/service/consultation/detail?id=' + record.id;
    const path = `/customer/service/appointments/detail?id=${record.id}&patient_name=${
      record.patient_name
    }&patient_sex=${record.patient_sex == 1 ? '男' : '女'}&patient_age=${
      record.patient_age
    }&patient_mobile=${record.patient_phone}`;
    go(path);
  }

  function handleAudit(record: Recordable, status: string) {
    tableLoading.value = true;
    editRefundsStatus(record.id, status)
      .then(() => {
        const message = status === 'pass' ? '审核通过成功' : '审核通过拒绝';
        setTimeout(() => {
          success(message);
          tableLoading.value = false;
          reload();
        }, 2000);
      })
      .catch(() => {
        tableLoading.value = false;
      });
  }
</script>
