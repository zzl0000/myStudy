<template>
  <PageWrapper title="医生排班">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="link" @click="handlePrev"> 上一周 </a-button>
        <a-button type="link" @click="handleNext"> 下一周 </a-button>
        <a-button type="primary" @click="handleCopy" v-if="0"> 复制上一周排班 </a-button>
      </template>
      <template #doctor="{ record, index, text }">
        <div :class="index === 0 ? 'column' : ''">
          {{ text }}
        </div>
      </template>
      <template #week="{ record, index, text }">
        <template v-if="index === 0">
          <div class="column">
            {{ text }}
          </div>
        </template>
        <div
          v-else
          :class="text.disabled ? 'disabled' : 'ndisabled'"
          @click="handleRecordClick(record, text)"
        >
          <div v-if="!text.none" style="height: 100%">
            <h2 class="title"
              >号源数(<span class="red">{{ text.day_already_num }}</span
              >/{{ text.day_available_num }})</h2
            >
            <Space>
              <span>视频{{ text.day_video_num }}</span>
              <span>电话{{ text.day_voice_num }}</span>
            </Space>
          </div>
          <div v-else>
            <h2 class="title">&nbsp;</h2>
            <Space>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
            </Space>
          </div>
        </div>
      </template>
      <template #action="{ record, index }">
        <TableAction
          :actions="[
            {
              icon: 'ant-design:export-outlined',
              label: '复制上一周排班',
              onClick: handleCopyRecord.bind(null, record),
            },
          ]"
          v-if="index > 0"
        />
      </template>
    </BasicTable>
    <SchedulingDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ApiSelect } from '/@/components/Form/index';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import SchedulingDrawer from './SchedulingDrawer.vue';
  import { columns, searchFormSchema } from './scheduling.data';
  import { Space } from 'ant-design-vue';
  import { getWeekSchedulingList, createWeeklyScheduling } from '/@/api/sys/scheduling';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'Scheduling',
    components: { PageWrapper, BasicTable, SchedulingDrawer, TableAction, Space, ApiSelect },
    setup() {
      const { createMessage, createSuccessModal, createWarningModal } = useMessage();
      const { info, success, warning, error } = createMessage;
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload, getRawDataSource }] = useTable({
        title: '',
        api: getWeekSchedulingListAction,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        canResize: false,
        pagination: true,
        showTableSetting: true,
        bordered: false,
        showIndexColumn: false,
        striped: false,
        actionColumn: {
          width: 140,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      });

      let week: number = 0;
      async function getWeekSchedulingListAction(params: any) {
        params.week = week;
        params.a = 1;
        const data = await getWeekSchedulingList(params);
        return data;
      }

      function handleSuccess() {
        reload();
      }

      function handlePrev() {
        week--;
        reload();
      }

      function handleNext() {
        week++;
        reload();
      }

      async function handleCopy() {
        await createWeeklyScheduling({});
        success('复制成功!');
        reload();
      }

      async function handleCopyRecord(record: Recordable) {
        const data = getRawDataSource();
        const params = {
          did: record.did,
          doctor_id: record.doctor_id,
          start_date: data.data[0].monday,
          end_date: data.data[0].sunday,
        };
        await createWeeklyScheduling(params);
        success('复制成功!');
        reload();
      }

      const handleRecordClick = (record: Recordable, scheduling: Recordable) => {
        //console.log(JSON.stringify(scheduling));
        if (scheduling.disabled) {
          return;
        }
        openDrawer(true, {
          record,
          scheduling,
          isUpdate: true,
        });
      };

      return {
        registerTable,
        registerDrawer,
        handleSuccess,
        handlePrev,
        handleNext,
        handleCopy,
        handleCopyRecord,
        handleRecordClick,
      };
    },
  });
</script>

<style scoped>
  .title {
    font-size: 16px;
    padding-bottom: 5px;
    margin-bottom: 0px;
  }

  .red {
    color: red;
  }

  .disabled {
    opacity: 0.5;
    background: #ddd;
    cursor: not-allowed;
    padding: 15px 8px;
    font-size: 12px;
  }
  .ndisabled {
    padding: 15px 8px;
    font-size: 12px;
    background: #fcfaf1;
  }

  .column {
    padding: 15px 8px;
    font-size: 16px;
  }
  .ant-table-row td {
    padding: 0px !important;
  }
</style>

<style type="text/css">
  .vben-basic-table-row__striped td {
    background-color: #fff !important;
  }
  .vben-basic-table-form-container {
    padding: 0 !important;
  }
  .vben-basic-form .ant-form-item {
    margin-bottom: 10px !important;
  }
</style>
