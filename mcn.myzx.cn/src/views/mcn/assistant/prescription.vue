<template>
  <PageWrapper title="处方订单">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button @click="handleObligation('1')"> 待付款 </a-button>
        <a-button @click="handleRefundOrder('12')"> 已退回 </a-button>
        <!-- <a-button type="primary" @click="handleCreate"> 抄录处方 </a-button> -->
        <a-button type="primary" @click="handleCreateExport"> 导出 </a-button>
      </template>
      <template #patientName="{ record }">
        <span v-if="record.wechat_name == null || record.wechat_name == ''">{{
          record.patient_name
        }}</span>
        <span v-else>
          <sapn>{{ record.patient_name }}</sapn>
          <span style="color: red">{{ '(' + record.wechat_name + ')' }}</span>
        </span>
      </template>
      <template #payStatus="{ record }">
        <span :class="record.pay_status_name == '待付款' ? 'yellow' : 'green'">{{
          record.pay_status_name
        }}</span>
      </template>
      <template #orderStatus="{ record }">
        <span v-if="record.status_name === '待审核'">待审核</span>
        <span v-if="record.status_name === '审核通过'">审核通过</span>
        <span v-if="record.status_name === '已初审'">已初审</span>
        <!-- <span v-if="record.status_name === '已初审'">已初审</span> -->
        <span v-if="record.status_name === '审核不通过'" class="error">审核不通过</span>
        <span v-if="record.status_name === '待发货'">待发货</span>
        <span v-if="record.status_name === '已发货'">已发货</span>
        <span v-if="record.status_name === '已收货'">已收货</span>
        <span v-if="record.status_name === '已取消'">已取消</span>
        <span v-if="record.status_name === '已撤回'">已撤回</span>
        <span v-if="record.status_name === '待复审'">待复审</span>
        <span v-if="record.status_name === '录入中'">录入中</span>
        <span v-if="record.status_name === '已发货待签收'">已发货待签收</span>
        <span v-if="record.status_name === '退款中'" class="success">退款中</span>
        <span v-if="record.status_name === '已退款'">已退款</span>
        <span v-if="record.status_name === '部分退款'">部分退款</span>
        <!-- <span v-if="record.status_name === '已发货待签收'">已发货待签收</span> -->
        <span v-if="record.status_name === '待收货'">待收货</span>
        <!-- <span v-if="record.status_name === '复审不通过'">复审不通过</span> -->
        <!-- <span v-if="record.status_name === '已退款'">已退款</span> -->
      </template>

      <template #orderFeeGroup="{ record }">
        <div>诊金金额：{{ record?.consultation_fee }}</div>
        <div>药费：{{ record?.medical_fee }}</div>
        <div>加工费：{{ record?.process_fee }}</div>
        <div
          >快递费：<span v-if="record?.express_pay_type == 2">到付</span>
          <span v-else
            >{{ record?.set_express_total ? record?.set_express_total : record?.express_fee }}
            <span v-if="record?.set_express_total">(自定义)</span></span
          ></div
        >
        <div>订单实收：{{ record?.total_fee }}</div>
        <!-- :style="{'color':(Number(row.total_fee) != Number(row.order_fee)?'red':'')}" -->
        <div
          :style="{
            color: Number(record?.total_fee) != Number(record?.first_total_fee) ? 'red' : '',
          }"
          >订单总金额：{{ record?.first_total_fee }}</div
        >
      </template>
      <template #payment="{ record }">
        <a-button
          v-if="record?.order?.pay_status === 1"
          type="link"
          @click="handlePayment(record, 'behalf', 2, 2)"
          >{{ record.is_address == 2 ? '查看' : '填写地址' }}</a-button
        >
      </template>
      <template #paycode="{ record }">
        <a-button
          v-if="record?.order?.pay_status === 1"
          type="link"
          @click="handlePayment(record, 'myself', 2, 1)"
          >查看</a-button
        >
      </template>
      <template #action="{ record }" class="ceshi">
        <TableAction
          align="right"
          :actions="[
            {
              icon: 'ant-design:appstore-outlined',
              label: '详情',
              onClick: handleDetail.bind(null, record),
            },
            {
              icon: 'ant-design:edit-outlined',
              label: '修改地址',
              ifShow: record.status !== 7 && record.status !== 8,
              onClick: handleEditAddres.bind(null, record),
            },
            {
              icon: 'ant-design:eye',
              label: '查看地址',
              ifShow: record.status == 7 || record.status == 8,
              onClick: handleLookAddres.bind(null, record),
            },
            //
            {
              icon: 'ant-design:rollback-outlined',
              label: '修改处方',
              ifShow: record.pay_status_name == '待付款' || record.status_name == '审核不通过',
              onClick: reviseData.bind(null, record),
            },
            //{
            // icon: 'ant-design:rollback-outlined',
            //  label: '再次开方',
            //  ifShow: true,
            //  onClick: againData.bind(null, record),
            //},
            //
            {
              icon: 'ant-design:appstore-outlined',
              label: '退款日志',
              onClick: handleRefundLog.bind(null, record),
              ifShow: record.pay_status_name == '已退款' || record.pay_status_name == '部分支付',
            },
            // {
            // icon: 'ant-design:rollback-outlined',
            //  label: '快捷退款',
            //  ifShow:
            //   record.pay_status_name == '待付款' ||
            //   record.pay_status_name == '已退款' ||
            //  (record.pay_status_name == '退款中' &&
            //    record.status_name == '审核不通过' &&
            //    record.amount == '0.00')
            //   ? false
            //    : true,
            // onClick: handleRefund.bind(null, record),
            //  },
            {
              icon: 'ant-design:rollback-outlined',
              label: '快捷退款',
              ifShow:
                record.pay_status_name == '待付款' ||
                record.pay_status_name == '已退款' ||
                (record.pay_status_name == '退款中' &&
                  record.status_name == '审核不通过' &&
                  record.amount == '0.00') ||
                (record.pay_status_name == '部分支付' &&
                  record.order.refund_amount == record.order.total_fee)
                  ? false
                  : true,
              onClick: handleRefund.bind(null, record),
            },
            {
              icon: 'ant-design:edit-outlined',
              label: '修改日志',
              onClick: handleEditJournal.bind(null, record),
              ifShow: record.has_log == 1,
            },
          ]"
        />
      </template>
    </BasicTable>
    <RegModal @register="registerQrcodeModal" @success="handleSuccess" />
    <RefundModal @register="registerRefundModal" @success="handleSuccess" />
    <AddresModal @register="registerAddresModal" @success="handleSuccess" />
    <RefundLogModal @register="registerRefundLogModal" @success="handleSuccess" />
    <!-- 修改日志 -->
    <a-modal v-model:visible="JournalModal" title="修改日志" :footer="null" width="800px">
      <div style="padding: 20px; overflow-y: scroll; height: 620px">
        <a-timeline>
          <a-timeline-item v-for="(item, inx) in journalData" :key="inx">
            <div
              >{{ '日期：' + item.create_time }}&nbsp;&nbsp;{{
                '修改人：' + item.editor
              }}&nbsp;&nbsp;{{ '状态：' + item.pay_status }}</div
            >
            <!-- box-shadow: 5px 8px 24px 0px #888888; -->
            <div
              style="
                width: 685px;
                height: 100%;
                background-color: #fff;
                border: 1px solid #a9a4a4;
                margin-top: 15px;
                border-radius: 15px;
                padding: 15px 20px;
              "
            >
              <div v-if="item.addList.length !== 0">
                <!-- <div class="block-btn" style="background:#66b1ff;">新增操作</div> -->
                <div class="block-text" v-for="(item1, it) in item.addList" :key="it"
                  >{{ item1.title }}：新增内容为&nbsp;&nbsp;{{ item1.new }}</div
                >
              </div>
              <div v-if="item.editList.length !== 0">
                <!-- <div class="block-btn" style="background:#85ce61;">编辑操作</div> -->
                <div class="block-text" v-for="(item1, it) in item.editList" :key="it">
                  <span>{{ item1.title }}：</span>
                  <span>{{ item1.old }}</span
                  >&nbsp; <span style="color: red">修改为</span>&nbsp;
                  <span>{{ item1.new }}</span>
                </div>
              </div>
              <div v-if="item.deleteList.length !== 0">
                <!-- <div class="block-btn" style="background:#f78989;" >删除操作</div> -->
                <div class="block-text" v-for="(item1, it) in item.deleteList" :key="it"
                  >{{ item1.title }}：删除&nbsp;&nbsp;{{ item1.old }}</div
                >
              </div>
            </div>
          </a-timeline-item>
        </a-timeline>
      </div>
    </a-modal>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema } from './prescription.data';
  import { getPrescriptionList, getJournaList } from '/@/api/sys/prescription';
  import { useModal } from '/@/components/Modal';
  import RegModal from '../customer-service/appointments/RegModal.vue';
  import RefundModal from './QuickRefundModel.vue';
  import RefundLogModal from './RefundLogMode.vue';
  import AddresModal from './AddresModel.vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { message } from 'ant-design-vue';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { useGlobSetting } from '/@/hooks/setting';
  export default defineComponent({
    name: 'PrescriptionManagement',
    components: {
      PageWrapper,
      BasicTable,
      TableAction,
      RegModal,
      RefundModal,
      RefundLogModal,
      AddresModal,
    },
    setup() {
      const go = useGo();
      const [registerQrcodeModal, { openModal: openQrcodeModal }] = useModal();
      const [registerRefundModal, { openModal: openRefundModal }] = useModal();
      const [registerAddresModal, { openModal: openAddresModal }] = useModal();
      const [registerRefundLogModal, { openModal: openRefundLogModal }] = useModal();
      const [registerTable, { reload, getForm }] = useTable({
        title: '',
        api: getPrescriptionList,
        columns,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: false,
        showIndexColumn: false,
        actionColumn: {
          width: 360,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
          align: 'center',
        },
      });

      /*function handleCreate() {
            openTrackDrawer(true, {
              isUpdate: false,
            });
          }*/

      const handleObligation = async (status: any) => {
        getForm().setFieldsValue({ pay_status: status, status: '' });
        getForm().submit();
      };

      const handleRefundOrder = async (status: any) => {
        getForm().setFieldsValue({ status: status, pay_status: '' });
        getForm().submit();
      };

      const handleLookAddres = (record: Recordable) => {
        openAddresModal(true, {
          record,
          isUpdate: false,
        });
      };

      function handleEditAddres(record: Recordable) {
        openAddresModal(true, {
          record,
          isUpdate: true,
        });
      }
      //修改日志
      const JournalModal = ref(false);
      const journalData = ref([]);
      function handleEditJournal(record: Recordable) {
        // JournalModal.value = true;
        JournList(record.id);
      }
      async function JournList(params: any) {
        const res = await getJournaList(params);
        if (res.data.length == 0) {
          message.error('暂无修改日志');
        } else {
          let Data = res.data || [];
          console.log(Data.length);
          JournalModal.value = true;
          for (let i = 0; i < Data.length; i++) {
            let item = Data[i];
            Data[i].editList = [];
            Data[i].deleteList = [];
            Data[i].addList = [];
            if (item.change.basic) {
              for (var j = 0; j < item.change.basic.length; j++) {
                if (item.change.basic[j].type == 'edit') {
                  item.editList.push(item.change.basic[j]);
                }
                if (item.change.basic[j].type == 'delete') {
                  item.deleteList.push(item.change.basic[j]);
                }
                if (item.change.basic[j].type == 'add') {
                  item.addList.push(item.change.basic[j]);
                }
              }
            }

            if (item.change.drugs) {
              for (var m = 0; m < item.change.drugs.length; m++) {
                if (item.change.drugs[m].type == 'edit') {
                  item.editList.push(item.change.drugs[m]);
                }
                if (item.change.drugs[m].type == 'delete') {
                  item.deleteList.push(item.change.drugs[m]);
                }
                if (item.change.drugs[m].type == 'add') {
                  item.addList.push(item.change.drugs[m]);
                }
              }
            }
          }
          journalData.value = Data;
          console.log(journalData.value);
        }
      }
      /*function handleDelete(record: Recordable) {
            destroyTrack(record.id).then((response) => {
              success('线索删除成功!');
              reload();
            });
          }*/

      /*function handleSuccess() {
            reload();
          }*/
      function handleRefundLog(record: Recordable) {
        openRefundLogModal(true, {
          order: record.order,
          reason: record.order.reason,
          admin_name: record.order.refund_user,
          refund_time: record.order.refund_time,
          state: 2,
        });
      }

      function handleSuccess() {
        reload();
      }

      function handlePayment(
        record: Recordable,
        type: string,
        paymentType: number,
        paymentPayer: number
      ) {
        if (record.is_address == 1 && paymentPayer == 2) {
          handleEditAddres(record);
        } else {
          console.log(record, type, paymentType, paymentPayer);
          openQrcodeModal(true, {
            type: type,
            paymentType: paymentType,
            paymentPayer: paymentPayer,
            orderId: record.id,
            record,
            idOrOrderId: paymentPayer == 1,
            patientName: record.patient_name,
          });
        }
      }

      function handleRefund(record: Recordable) {
        console.log(record, '1111111111111111111111111');
        openRefundModal(true, {
          record,
          order_no: record.order_no,
          id: record.id,
          state: 1,
        });
      }

      function handleDetail(record: Recordable) {
        const path = '/assistant/station/prescription/detail';

        let params: string[] = [];
        params.push('id=' + record.id);

        go(path + '?' + params.join('&'));
      }

      // 抄录处方
      function handleCreate() {
        const path = '/assistant/station/prescription/creates?action=create';
        go(path);
      }
      const userStore = useUserStoreWithOut();
      // 导出
      function handleCreateExport() {
        const orgId = userStore.getUserInfo.organization_id;
        let params = getForm().getFieldsValue();
        let token = localStorage.getItem('NOT_TYPE_TOKEN');

        const apiUrl = import.meta.env.VITE_GLOB_API_URL;
        let hostUrl = '';
        const viteProxy = JSON.parse(import.meta.env.VITE_PROXY);
        viteProxy.map((item) => {
          if (item[0] == '/api') {
            hostUrl = item[1];
          }
        });
        //
        // for (let i = 0; i < viteProxy.length; i++) {
        //   console.log(viteProxy[i], viteProxy[i][0], viteProxy[i][1], '采蘑菇的小姑娘');
        //   if (viteProxy[i][0] == 'apiUrl') {
        //     hostUrl = viteProxy[i][1];
        //     break;
        //   }
        // }

        params.is_export = 1;
        console.log(hostUrl);
        // alert(hostUrl);
        // return;
        downloadByUrl({
          url: `${hostUrl}/organization/${orgId}/prescript?_t=1643003393235&token=${token}${getParams(
            params
          )}`,
          target: '_self',
        });
      }

      function getParams(obj) {
        let result = '';
        let item;
        for (item in obj) {
          if (obj[item] && String(obj[item])) {
            result += `&${item}=${obj[item]}`;
          }
        }
        if (result) {
          result = '&' + result.slice(1);
        }
        return result;
      }

      // 编辑处方
      const reviseData = (record: Recordable) => {
        let path = `/assistant/station/prescription/creates?action=updata&id=${record.id}`;
        if (record.pay_status_name === '已付款') {
          path += `&isPay=1`;
        }
        go(path);
      };

      // 再次开方
      const againData = (record: Recordable) => {
        let path = `/assistant/station/prescription/creates?action=again&id=${record.id}`;
        if (record.pay_status_name === '已付款') {
          path += `&isPay=1`;
        }
        go(path);
      };

      return {
        handleCreateExport,
        journalData,
        handleEditJournal,
        handleLookAddres,
        handleObligation,
        handleRefundOrder,
        handlePayment,
        registerTable,
        registerQrcodeModal,
        registerRefundModal,
        registerRefundLogModal,
        handleRefund,
        handleSuccess,
        handleDetail,
        handleCreate,
        registerAddresModal,
        handleEditAddres,
        reviseData,
        againData,
        handleRefundLog,
        JournList,
        JournalModal,
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
  .error {
    color: red;
  }
  .yellow {
    color: rgb(255, 145, 0);
  }
  .green {
    color: green;
  }
  .ant-table-row-cell-ellipsis,
  .ant-table-row-cell-ellipsis .ant-table-column-title {
    white-space: normal !important;
    text-overflow: fade !important;
  }
  .vben-basic-table-action {
    align-items: end !important;
  }
  .vben-basic-table-action.center {
    justify-content: left;
    flex-wrap: wrap;
  }
</style>
