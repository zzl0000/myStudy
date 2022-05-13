<template>
  <PageWrapper title="患者线索收集">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 添加线索 </a-button>
      </template>

      <template #form-medium="{ model, field }">
        <select class="ant-input" v-model="model[field]">
          <option value="">请选择</option>
          <option v-for="item in mediums" :key="item" :value="item.id">{{ item.title }}</option>
        </select>
      </template>
      <template #description="{ record }">
        <div class="ellipsis-3">{{ record.description }}</div>
      </template>
      <template #intention="{ record }">
        <span v-if="record.intention == 1">成交</span>
        <span v-if="record.intention == 2" style="color: #cf1322">意向</span>
        <span v-if="record.intention == 3" style="color: #389e0d">考虑</span>
        <span v-if="record.intention == 4" style="color: #ddd">无意向</span>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'ant-design:appstore-add-outlined',
              label: '预约挂号',
              color: 'warning',
              onClick: handleAdvance.bind(null, record),
            },
            {
              icon: 'clarity:note-edit-line',
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              label: '删除',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <PatientDrawer @register="registerTrackDrawer" @success="handleSuccess" />
    <RegDrawer @register="registerRegDrawer" @success="handleRegSuccess" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import PatientDrawer from './PatientDrawer.vue';
  import { columns, searchFormSchema } from './patient.data';
  import { getTrackList, destroyTrack, getMediumList } from '/@/api/sys/track';
  import { useMessage } from '/@/hooks/web/useMessage';
  import RegDrawer from '/@/views/mcn/customer-service/appointments/RegDrawer.vue';
  import { getOrganizationDoctorList } from '/@/api/sys/doctor';

  export default defineComponent({
    name: 'PatientManagement',
    components: { PageWrapper, BasicTable, PatientDrawer, RegDrawer, TableAction },
    setup() {
      const { createMessage } = useMessage();
      const { success } = createMessage;
      const [registerTrackDrawer, { openDrawer: openTrackDrawer }] = useDrawer();
      const [registerRegDrawer, { openDrawer: openRegDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        title: '',
        api: getTrackListAction,
        // api: getTrackList,
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
          width: 220,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
          align: 'left',
        },
      });

      async function getTrackListAction(params: any) {
        if (params.NextTime) {
          params.next_contact_time_start = params.NextTime[0];
          params.next_contact_time_end = params.NextTime[1];
          delete params.NextTime;
        }
        const data = await getTrackList(params);
        return data;
      }

      let doctorList = [] as any[];

      function handleCreate() {
        openTrackDrawer(true, {
          isUpdate: false,
          doctorList,
        });
      }

      function handleEdit(record: Recordable) {
        console.log(record);
        openTrackDrawer(true, {
          record,
          isUpdate: true,
          doctorList,
        });
      }

      function handleDelete(record: Recordable) {
        destroyTrack(record.id).then(() => {
          success('线索删除成功!');
          reload();
        });
      }

      function handleSuccess() {
        reload();
      }

      function handleRegSuccess(e: any) {
        console.log(e);
        reload();
      }

      function handleAdvance(record: Recordable) {
        const data = {
          track_id: record.id,
          patient: {
            uname: record.patient_name,
            mobile: record.patient_phone,
            age: record.age,
            sex: record.sex,
          },
          doctor_id: record.intention_doctor_id,
          desc: '疾病:' + record.disease + '  备注:' + record.description,
          id_card: record.idcard,
        };

        openRegDrawer(true, {
          isUpdate: true,
          isTrack: true,
          doctorList,
          record: {
            ...data,
            time: '',
            money: '',
          },
        });
      }

      const mediums = ref<any>([]);
      getMediumList().then((response) => {
        response = response.slice(0, response.length - 1);
        mediums.value = response;
      });

      onMounted(() => {
        getOrganizationDoctorList().then((res) => {
          doctorList = res.map((item) => {
            item.id = String(item.id);
            return item;
          });
        });
      });

      return {
        registerTable,
        registerTrackDrawer,
        registerRegDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleAdvance,
        handleRegSuccess,
        mediums,
      };
    },
  });
</script>

<style type="text/css">
  .vben-basic-table-form-container {
    padding: 0 !important;
  }
  .vben-basic-form .ant-form-item {
    margin-bottom: 10px !important;
  }
</style>
