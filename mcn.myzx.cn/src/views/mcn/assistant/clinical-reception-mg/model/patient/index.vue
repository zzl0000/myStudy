<template>
  <div class="container">
    <BasicForm ref="formRef" @register="registerSearchFrom" />
    <div class="card-container">
      <!-- :tabBarGutter="20" -->
      <a-tabs :activeKey="status" @change="tabChange">
        <a-tabPane key="1">
          <template #tab>
            <span>待看诊</span>
            <!-- padding-left: 5px -->
            <span style="color: red">{{ counts.waitTreatment }}</span>
          </template>
        </a-tabPane>
        <a-tabPane key="3">
          <template #tab>
            <span>问诊中</span>
            <!-- padding-left: 5px -->
            <span style="color: red">{{ counts.treatments }}</span>
          </template>
        </a-tabPane>
        <a-tabPane key="2">
          <template #tab>
            <span>待开方</span>
            <!-- padding-left: 5px -->
            <!-- <span style="color: red">{{ counts.waitPrescript }}</span> -->
          </template>
        </a-tabPane>
        <a-tabPane key="0">
          <template #tab>
            <span>全部</span>
            <!-- <span style="color: red; padding-left: 5px">{{ counts.all }}</span> -->
          </template>
        </a-tabPane>
      </a-tabs>
    </div>

    <BasicTable ref="tabElRef" @register="registerTreatmentsTable">
      <template #patient="{ record }">
        <span :title="record.patient_name === '' ? '未填写' : record.patient_name">
          {{ record.patient_name === '' ? '未填写' : record.patient_name }}
        </span>
      </template>
      <template #date="{ record }">
        <span
          :title="record.dial_time ? formatToDate(record.dial_time.split(' ')[0], 'MM-DD') : '无'"
          v-html="record.dial_time ? formatToDate(record.dial_time.split(' ')[0], 'MM-DD') : '无'"
        ></span>
      </template>
      <template #dateTime="{ record }">
        <span
          :title="record.dial_time ? record.dial_time.split(' ')[1] : '无'"
          v-html="record.dial_time ? record.dial_time.split(' ')[1] : '无'"
        ></span>
      </template>
      <template #type="{ record }">
        <span :title="TypeEnums[Number(record.type)]">{{ TypeEnums[Number(record.type)] }}</span>
      </template>

      type

      <template #payStatus="{ record }">
        {{ record.pay_state }}
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, reactive, ref, unref } from 'vue';
  import { BasicForm, useForm, FormActionType } from '/@/components/Form/index';
  import { BasicTable, useTable } from '/@/components/Table';
  //data
  import { getTreamentList, GetTreatmentsCounts } from '/@/api/sys/treatment';
  import { columns, TypeEnums } from './patient.data';
  // store
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { useClinicalReceptionStore } from '/@/store/modules/clinical-reception';
  import { FormSchema } from '/@/components/Table';
  import { formatToDate } from '/@/utils/dateUtil';
  import { useVideoStore } from '/@/store/modules/video';
  import { message } from 'ant-design-vue';
  import { getRoomState } from '/@/utils/auth';

  export default defineComponent({
    components: { BasicForm, BasicTable },
    setup() {
      const formRef = ref<Nullable<FormActionType>>(null);
      const status: any = computed(() => _status.value || ClinicalReceptionStore.getTabKey || '1');
      const _status = ref();

      const schemas: FormSchema[] = [
        {
          field: 'appointment_date',
          component: 'RangePicker',
          label: '就诊日期:  ',
          colProps: {
            span: 8,
          },
          componentProps: {
            style: { width: '100%' },
            onChange: () => {
              searchChange();
            },
          },
        },
        {
          field: 'keywords',
          component: 'Input',
          label: '患者信息:  ',
          colProps: {
            span: 8,
          },
          componentProps: {
            placeholder: '按患者姓名、手机号搜索',
            onChange: () => {
              searchChange();
            },
          },
        },
      ];

      const [registerSearchFrom, { setProps }] = useForm({
        labelWidth: 80,
        schemas,
        baseColProps: {
          lg: 24,
          md: 24,
        },
        showActionButtonGroup: false,
        fieldMapToTime: [
          ['appointment_date', ['appointment_start', 'appointment_end'], 'YYYY-MM-DD'],
        ],
      });

      const upConfig = (_record: any) => {
        // console.log(_record)
        // 更新订单信息
        ClinicalReceptionStore.setOrderIdSync(_record.id);
        ClinicalReceptionStore.setOrderSnSync(_record.order_sn);
        // 更新订单支付状态
        ClinicalReceptionStore.setPayStatus(_record.pay_status);
        // 更新患者信息
        ClinicalReceptionStore.setPatientStoreSync(_record);
        //更新医生信息
        ClinicalReceptionStore.setDoctoreStoreSync(_record);
        // useVideoStore().setIsConsultingRoomStatus(false);
        // setIsLoad
        ClinicalReceptionStore.setIsLoad(true);
      };

      const userStore = useUserStoreWithOut();
      const orgId = userStore.getUserInfo.organization_id;
      const getTreatmentsAsync = async function (source: any) {
        const params = {
          keywords: formRef.value.formModel.keywords,
          appointment_date: formRef.value.formModel.appointment_date,
          status: status.value,
          ...source,
        };
        const lists: any = await getTreamentList(orgId, params);

        if (lists.current_page === 1 && lists?.data !== undefined && lists.data.length > 0) {
          // console.log(ClinicalReceptionStore.getRowSelectId);
          if (ClinicalReceptionStore.getRowSelectId == null) {
            ClinicalReceptionStore.setRowSelectId(lists.data[0].id);
            upConfig(lists.data[0]);
          } else {
            lists.data.map((m) => {
              if (m.id == ClinicalReceptionStore.getRowSelectId) {
                console.log(11);
                upConfig(m);
              }
            });
          }
        }
        return lists;
      };

      const counts = reactive({
        all: 0,
        treatments: 0,
        waitPrescript: 0,
        waitTreatment: 0,
      });

      GetTreatmentsCounts().then((res: any) => {
        console.log(res);
        counts.all = res.all;
        counts.treatments = res.treatments;
        counts.waitPrescript = res.waitPrescript;
        counts.waitTreatment = res.waitTreatment;
      });

      const ClinicalReceptionStore = useClinicalReceptionStore();
      const rowSelectId = computed(() => ClinicalReceptionStore.getRowSelectId);

      const [registerTreatmentsTable, { reload }] = useTable({
        title: '',
        api: getTreatmentsAsync,
        columns,
        useSearchForm: false,
        showTableSetting: false,
        // showTableSetting: true,
        bordered: false,
        showIndexColumn: true,
        canResize: false,
        striped: false,
        customRow: function (record, index) {
          return {
            style: {
              'background-color': record.id == rowSelectId.value ? 'rgba(59, 130, 246, 0.5)' : '',
            },
            onClick: (e: Event) => {
              // console.log(getRoomState('roomState', record.doctor_id));
              if (
                useVideoStore().isConsultingRoom &&
                !getRoomState('roomState', record.doctor_id)
              ) {
                message.warning('你正在其它诊室中，请先退出上一个诊室再进入');
                return;
              }

              const defDoctorId: any = ClinicalReceptionStore.doctoreStore.doctor_id;
              if (defDoctorId != record.doctor_id) {
                useVideoStore().setIsConsultingRoomStatus(false);
                useVideoStore().setIsLocalStreamStatus(false);
              }
              //
              ClinicalReceptionStore.setRowSelectId(record.id);
              ClinicalReceptionStore.setTabKey(_status.value || '1');
              const _record = unref(record);
              upConfig(_record);
            },
          };
        },
      });

      const searchChange = function () {
        setTimeout(function () {
          reload();
        }, 200);
      };

      const tabChange = function (key) {
        _status.value = key;
        reload();
      };

      return {
        counts,
        upConfig,
        status,
        formRef,
        registerSearchFrom,
        registerTreatmentsTable,
        searchChange,
        tabChange,
        TypeEnums,
        formatToDate,
      };
    },
  });
</script>

<style lang="less">
  .container {
    padding: 20px 0px;
    height: calc(100vh - 100px);
    overflow: scroll;
    border-right: 1px solid #dedede;
    .card-container {
      overflow: hidden;
    }
    .card-container > .ant-tabs-card > .ant-tabs-content {
      height: 120px;
      margin-top: -16px;
    }

    .card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
      background: #fff;
      padding: 10px;
    }

    .card-container > .ant-tabs-card > .ant-tabs-bar {
      border-color: #fff;
    }

    .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
      border-color: transparent;
      background: transparent;
    }

    .card-container .ant-tabs-nav .ant-tabs-tab {
      margin-right: 10px;
      padding: 12px 0;
      // width: 61px;
      display: inline-flex;
      justify-content: center;
    }

    .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
      border-color: #fff;
      background: #fff;
    }
  }
</style>
