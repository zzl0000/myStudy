<template>
  <PageWrapper title="处方订单详情" contentBackground>
    <!-- 处方订单详情 -->
    <div style="padding: 10px 30px 0 30px; font-size: 15px; margin-top: 20px">
      <Row>
        <Col span="6">
          患者: {{ detail?.patient_name }} {{ detail?.patient_sex }} {{ detail?.patient_age }}
        </Col>
        <Col span="6"> 手机号: {{ detail?.patient_mobile }} </Col>
        <Col span="6"> 问诊医生: {{ detail?.doctor_name }} </Col>
      </Row>
    </div>
    <div class="step-form-form" style="padding: 30px 30px 20px 30px; width: 70%; display: none">
      <a-steps :current="current">
        <a-step title="下单成功" />
        <a-step title="已支付" />
        <a-step title="已审方" />
        <a-step title="已发药" />
        <a-step title="已收货" />
        <a-step title="已完成" />
      </a-steps>
    </div>
    <div style="padding: 10px 30px 0 30px; font-size: 15px">
      <Row>
        <Col span="6"> 收货人:&nbsp;&nbsp;{{ detail?.order?.express_name }} </Col>
        <Col span="6"> 手机号:&nbsp;&nbsp;{{ detail?.order?.express_mobile }} </Col>
        <Col span="12">
          收货地址:&nbsp;&nbsp;{{ detail?.order?.express_province }}
          {{ detail?.order?.express_city }} {{ detail?.order?.express_area }}
          {{ detail?.order?.express_address }}
        </Col>
      </Row>
    </div>

    <div style="padding: 10px 30px 0 30px; font-size: 15px">
      <Row>
        <Col span="6"> 快递公司:&nbsp;&nbsp;{{ detail?.logistics_name }} </Col>
        <Col span="6"> 快递费:&nbsp;&nbsp;{{ detail?.express_fee }} </Col>
        <Col span="4"> 快递单号:&nbsp;&nbsp;{{ detail?.logistics_no }} </Col>
        <Col span="4"> 快递类型:&nbsp;&nbsp;{{ detail?.express_type == 1 ? '标快' : '特快' }} </Col>
        <Col span="4">
          <a-button type="primary" ghost @click="editContent">药房备注</a-button>
        </Col>
      </Row>
    </div>
    <div style="padding: 10px 30px 0 30px; font-size: 15px">
      <Row>
        <Col span="6">
          药房及剂型：&nbsp;&nbsp; {{ detail.pharmacy_name }} - {{ detail.dosage_form }}
        </Col>
        <Col span="6"> 加工费：&nbsp;&nbsp; {{ detail.process_fee }} </Col>
        <Col span="6"> 订单金额：&nbsp;&nbsp; {{ detail.first_total_fee }} </Col>
        <Col span="6"> 特殊说明：&nbsp;&nbsp; {{ detail.make ? detail.make : '无' }} </Col>
      </Row>
    </div>
    <div class="detail">
      <div class="title"> 处方详情 </div>
      <div class="header">
        <table>
          <tr>
            <td></td>
          </tr>
          <tr>
            <td> <label>姓名:</label> {{ detail?.patient_name }} </td>
            <td> <label>性别:</label> {{ detail?.patient_sex }} </td>
            <td> <label>年龄:</label> {{ detail?.patient_age }} </td>
            <td> <label>开方日期:</label> {{ detail?.created_at }} </td>
          </tr>
          <tr>
            <td><label>处方编号:</label> {{ detail?.prescript_no }}</td>
            <td><label>科室:</label>{{ detail.dept_name }}</td>
            <td><label>发货类型:</label> 快递</td>
            <td v-if="detail.dosage_id"><label>加工方式:</label> {{ detail.dosage_id }}</td>
          </tr>
          <tr>
            <td></td>
          </tr>
        </table>
      </div>
      <Row>
        <Col span="3" class="left">
          <label>诊断:</label><br />
          {{ detail?.icd_ids }}
        </Col>
        <Col span="21" class="right">
          <div v-if="detail?.drug_type == 1" style="font-size: 14px">
            <Row>
              <Col span="24">
                <label>R: </label> <span class="small">({{ detail?.dosage_form }})</span>
              </Col>
              <Col span="8" v-for="item in detail?.prescript_drug" :key="item.id">
                {{ item?.drug_name }} {{ item?.number }}{{ item?.unit }}
                {{ item.usage ? `(${item.usage})` : ''
                }}<span
                  style="font-size: 12px; color: #a19797; margin-left: 10px"
                  v-if="item.autograph"
                  >{{ item.autograph }}</span
                >
                <span class="small" v-if="item?.specs"
                  >({{ item?.specs }}) <span class="doctor">{{ detail?.doctor_name }}</span>
                </span>
              </Col>
              <Col span="24" style="text-align: right">
                共{{ detail?.prescript_drug.length }}味药， 共{{ drugTotal }}g, 药费￥{{
                  detail?.medical_service_fee
                }}
              </Col>
            </Row>
          </div>
          <div v-else>
            <Col span="24"> <label>R: </label> <span class="small">西药</span> </Col>
            <Col span="24" v-for="item in detail?.prescript_drug" :key="item.id">
              <div style="font-size: 16px; font-weight: 600">
                {{ item?.drug_name }} {{ item?.quantity }}盒
              </div>
              <span class="small" v-if="item?.specs">{{ item?.specs }}</span>
              <br />
              <label>用法: </label> {{ item?.usage }} {{ item.number }}
              <!-- {{item.dose_unit}}， {{item.day_times}} -->
              。 x{{ item.medication_days }}天
            </Col>
            <Col span="24" style="text-align: right">
              共{{ detail?.prescript_drug?.length }}种药， 共{{ drugTotal }}盒, 药费￥{{
                detail?.medical_fee
              }}
            </Col>
          </div>
        </Col>
      </Row>
      <div class="bottom">
        <Row>
          <Col span="18">
            <div style="margin-bottom: 10px" v-show="detail?.drug_type == 1">
              <label>用法: </label>
              {{ detail?.usage1 }}; {{ comText }}
            </div>
            <div><label>医嘱: </label> {{ detail?.matter }} {{ detail?.prescript_mark }}</div>
          </Col>
          <Col span="6"> <label>医生签名(签章):</label> {{ detail?.doctor_name }} </Col>
        </Row>
      </div>
    </div>
    <div style="height: 30px"></div>
    <LogisticsModel :physicalInfo="physical.info" />
    <!-- 特殊说明弹框 -->
    <BasicModal
      v-bind="$attrs"
      title="备注订单"
      @register="registerModal"
      showOkBtn
      @ok="handleSubmit"
    >
      <a-textarea
        v-model:value="modifyMake"
        placeholder="此备注内容仅药房可见，患者不可见"
        :auto-size="{ minRows: 3, maxRows: 5 }"
      />
    </BasicModal>
  </PageWrapper>
</template>
<script lang="ts">
  import { BasicModal, useModal } from '/@/components/Modal';
  import { defineComponent, ref, unref, computed, provide, reactive } from 'vue';
  import { Description } from '/@/components/Description/index';
  import { BasicTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useRouter } from 'vue-router';
  import { Divider, Row, Col, Steps } from 'ant-design-vue';
  import {
    getPrescription,
    getPrescriptionExpress,
    editPharmacyDesc,
  } from '/@/api/sys/prescription';
  import { LogisticsModel } from './model';

  export default defineComponent({
    components: {
      Description,
      BasicTable,
      PageWrapper,
      [Divider.name]: Divider,
      Row,
      Col,
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,
      LogisticsModel,
      BasicModal,
    },
    setup() {
      const { currentRoute } = useRouter();
      const { query } = unref(currentRoute);
      const id = query.id;

      const title = ref<string>('处方订单详情:');

      const detail = ref<any>({});
      const current = ref(0);
      const drugTotal = ref(0);
      const pharmacy_name = ref('');

      const modifyMake = ref('');

      getPrescription(id).then((response: any) => {
        // 获取药房list
        response.patient_sex = response.patient_sex === 1 ? '男' : '女';

        let express = response?.order?.kd_information;
        express =
          express == undefined || express == null || express == '' ? {} : JSON.parse(express);

        response.created_at = response.created_at.substring(0, 10);
        if (response.dosage_form.indexOf('饮片') !== -1) {
          response.dosage_id = response.tisanes_way === 1 ? '自煎' : '代煎';
        } else {
          if (response.drug_type == 1) response.dosage_id = '无';
          else response.dosage_id = '';
        }
        response.express = express;

        for (const item of response.prescript_drug) {
          drugTotal.value +=
            response.drug_type == 1 ? (item.weight | 0) * item.number : item.quantity;
        }

        handleGetPrescriptionExpress(response);
        detail.value = response;
      });
      const [registerModal, { openModal: openQrcodeModal, closeModal }] = useModal();

      const editContent = () => {
        modifyMake.value = detail.value.make;
        openQrcodeModal(true);
      };

      const handleSubmit = () => {
        editPharmacyDesc(detail.value.id, modifyMake.value).then(() => {
          detail.value.make = modifyMake.value;
          closeModal();
        });
      };

      const physical = reactive({
        info: {},
      });

      const handleGetPrescriptionExpress = async (response: any) => {
        console.log(response);
        let params = { mobile: response?.order?.express_mobile, number: response?.logistics_no };
        try {
          if (params.number) {
            const data = await getPrescriptionExpress(params);
            physical.info = data?.data;
          }
          // console.log(physicalInfoList);
        } catch (error) {
          console.log(error);
        }
      };

      const comText = computed(() => {
        const text = detail.value?.tisanes_detail;
        if (!text) return;
        const str = [
          text.total_dosage_label,
          text.every_dosage_label,
          text.every_bag_label,
          text.every_day_label,
          text.every_time_label,
        ]
          .filter((item) => item)
          .join(', ');
        return str;
      });

      return {
        physical,
        registerModal,
        handleSubmit,
        modifyMake,
        editContent,
        pharmacy_name,
        comText,
        current,
        detail,
        title,
        drugTotal,
        handleGetPrescriptionExpress,
      };
    },
  });
</script>
<style lang="less" scoped>
  .desc-wrap {
    padding: 16px;
    background-color: @component-background;
  }
  .detail {
    padding: 10px 30px 0 30px;
    font-size: 15px;
    margin-top: 20px;
  }
  .detail .title {
    font-size: 24px;
    font-weight: 700;
  }
  .detail .header {
    margin-top: 5px;
    border: solid 1px #1c1e21;
    border-left: none;
    border-right: none;
  }
  .detail .header table {
    width: 100%;
    padding: 5px 0;
  }
  .detail .header td {
    width: 25%;
    padding: 5px 0;
  }
  .detail label {
    font-weight: 600;
  }
  .detail .left {
    border-right: solid 1px #d6d6d6;
    padding: 20px 10px 20px 0;
  }
  .detail .right {
    padding: 20px;
  }
  .detail .right .ant-col {
    padding-bottom: 10px;
  }
  .detail .bottom {
    padding: 15px 0;
    border: solid 1px #1c1e21;
    border-left: none;
    border-right: none;
  }
  .detail .sign {
    font-family: '楷体';
  }
  .detail .small {
    font-size: 13px;
    color: #000c17;
  }
  .detail .doctor {
    font-size: 11px;
    font-family: '隶书';
    color: #545454 !important;
  }
</style>
