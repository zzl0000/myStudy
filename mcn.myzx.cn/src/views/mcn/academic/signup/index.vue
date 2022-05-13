<template>
  <PageWrapper title="报名信息">
    <BasicTable @register="registerTable">
      <template #hospital_name="{ record, field }">
        <!-- {{record.hospital_name}} -->
        <span v-if="record.enter_fee > 0">---</span>
        <span v-else>{{ record.hospital_name }}</span>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getUserSearchFormSchema, getExpertsColumns } from './data';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { CopyScheduling } from '/@/api/sys/signup';
  import { ref, unref } from 'vue';
  import { useRouter } from 'vue-router';
  const userStore = useUserStoreWithOut();

  const [registerTable, { reload }] = useTable({
    api: getExperts,
    columns: getExpertsColumns(),

    useSearchForm: true,
    pagination: true,
    showTableSetting: true,
    showIndexColumn: false,
    striped: false,
    formConfig: {
      labelWidth: 60,
      schemas: getUserSearchFormSchema(),
      fieldMapToTime: [['fieldTime', ['enroll_start', 'enroll_end'], 'YYYY-MM-DD']],
    },
  });
  const { currentRoute, replace } = useRouter();
  const { query } = unref(currentRoute);
  const action = query.id;
  console.log(action);
  // const props = reactive({
  //   data: {
  //     ...query,
  //   },
  // });

  async function getExperts(params) {
    console.log(params);
    const data = await CopyScheduling(action, params);
    console.log(data);
    return data;
  }
</script>

<style></style>
