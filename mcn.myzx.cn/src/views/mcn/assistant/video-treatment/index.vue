<template>
  <PageWrapper title="接诊管理">
    <Row class="pager">
      <Col span="8" class="left">
        <BasicForm ref="formRef" @register="registerSearchFrom" />
        <Tabs defaultActiveKey="1" @change="tabChange">
          <TabPane tab="待看诊" key="1" />
          <TabPane tab="问诊中" key="3" />
          <TabPane tab="待开方" key="2" />
          <TabPane tab="全部" key="0" />
        </Tabs>
        <BasicTable @register="registerTreatmentsTable">
          <template #patient="{ record }">
            {{ record.patient_name === '' ? '未填写' : record.patient_name }}
            {{ record.patient_sex === 1 || record.patient_sex === '男' ? '男' : '女' }}
            <br />
            {{ record.patient_mobile === null ? '未填写' : record.patient_mobile }}
          </template>
          <template #appointment="{ record }">
            <span v-html="record.dial_time.replace(' ', '<br/>')"></span>
          </template>
          <template #payStatus="{ record }">
            {{ record.pay_status === 1 ? '已支付' : '未支付' }}
          </template>
        </BasicTable>
      </Col>
      <Col span="16">
        <Registration
          v-if="treatmentRowData?.id !== undefined"
          :treatmentData="treatmentRowData"
          :key="treatmentRowData?.id"
        ></Registration>
      </Col>
    </Row>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { BasicColumn } from '/@/components/Table/src/types/table';
  import { PageWrapper } from '/@/components/Page';
  import { Row, Col } from 'ant-design-vue';
  import { BasicForm, FormSchema, useForm, FormActionType } from '/@/components/Form/index';
  import { Tabs } from 'ant-design-vue';
  import { getTreamentList } from '/@/api/sys/treatment';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { Registration } from '/@/views/mcn/registration';

  const columns: BasicColumn[] = [
    {
      title: '就诊人',
      dataIndex: 'payment_id',
      width: 90,
      slots: { customRender: 'patient' },
      align: 'center',
    },
    {
      title: '就诊时间',
      dataIndex: 'dial_time',
      width: 90,
      slots: { customRender: 'appointment' },
      align: 'center',
    },
    {
      title: '医生',
      dataIndex: 'doctor_name',
      width: 60,
      align: 'center',
    },
    {
      title: '金额',
      dataIndex: 'pay_money',
      width: 70,
      align: 'center',
    },
    {
      title: '支付',
      dataIndex: 'pay_status',
      slots: { customRender: 'payStatus' },
      width: 70,
      align: 'center',
    },
  ];

  export default defineComponent({
    name: 'VideoTreatment',
    components: {
      BasicTable,
      PageWrapper,
      TableAction,
      Row,
      Col,
      BasicForm,
      Tabs,
      TabPane: Tabs.TabPane,
      Registration,
    },
    setup() {
      // 患者搜索表单
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
            onChange: (e: any) => {
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
            onChange: (e: any) => {
              searchChange();
            },
          },
        },
      ];

      const treatmentRowData = ref({});
      const [registerSearchFrom, { setProps }] = useForm({
        labelWidth: 80,
        schemas,
        baseColProps: { lg: 24, md: 24 },
        showActionButtonGroup: false,
        fieldMapToTime: [
          ['appointment_date', ['appointment_start', 'appointment_end'], 'YYYY-MM-DD'],
        ],
      });

      const userStore = useUserStoreWithOut();
      const orgId = userStore.getUserInfo.organization_id;

      const formRef = ref<Nullable<FormActionType>>(null);

      const status = ref(1);
      const getTreatmentsAsync = async function (source: any) {
        const params = {
          keywords: formRef.value.formModel.keywords,
          appointment_date: formRef.value.formModel.appointment_date,
          status: status.value,
          ...source,
        };
        const lists = await getTreamentList(orgId, params);

        if (lists.current_page === 1 && lists?.data !== undefined && lists.data.length > 0) {
          treatmentRowData.value = lists.data[0];
          treatmentRowData.value.assistant = 1;
          treatmentRowData.value.dept_id = treatmentRowData.value.kid2;
          treatmentRowData.value.dept_name = treatmentRowData.value.ks2name;
        }
        return lists;
      };

      const rowSelectId = ref('');
      const [registerTreatmentsTable, { reload }] = useTable({
        title: '',
        api: getTreatmentsAsync,
        columns,
        useSearchForm: false,
        showTableSetting: true,
        bordered: false,
        showIndexColumn: true,
        canResize: false,
        striped: false,
        customRow: function (record, index) {
          return {
            style: {
              'background-color': record.id === rowSelectId.value ? 'rgba(59, 130, 246, 0.5)' : '',
            },
            onClick: (e: Event) => {
              rowSelectId.value = record.id;
              e?.stopPropagation();
              function handleClick() {
                treatmentRowData.value = unref(record);
                treatmentRowData.value.title = '问诊管理';
                treatmentRowData.value.assistant = 1;
                treatmentRowData.value.dept_id = treatmentRowData.value.kid2;
                treatmentRowData.value.dept_name = treatmentRowData.value.ks2name;
                // 点击行处理
                console.log(JSON.stringify(record, index));
              }
              handleClick();
              //emit('row-click', record, index, e);
            },
          };
        },
        rowClassName: 'clickRowStyle',
      });

      const searchChange = function () {
        setTimeout(function () {
          reload();
        }, 200);
      };

      const tabChange = function (key) {
        status.value = key;
        reload();
      };

      return {
        registerSearchFrom,
        schemas,
        setProps,
        registerTreatmentsTable,
        formRef,
        tabChange,
        searchChange,
        treatmentRowData,
      };
    },
  });
</script>

<style scoped>
  .pager {
    background: #fff;
  }
  .left {
    border-right: 1px solid #999999;
    padding: 20px;
  }
  .clickRowStyle {
    background-color: red;
  }
</style>
