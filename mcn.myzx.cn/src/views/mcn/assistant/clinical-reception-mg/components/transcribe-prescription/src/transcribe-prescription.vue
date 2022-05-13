<template>
  <div class="t-container">
    <div>
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="labelCol"
        labelAlign="right"
        :wrapper-col="wrapperCol"
        v-loading="loading"
      >
        <div class="top">
          <div class="left" style="width: 100%; flex: 1">
            <!-- 病情 -->
            <IllnessStateModel :formState="formState" />
            <!-- 药房和剂型 -->
            <PAndDModel
              :formState="formState"
              :totalDrugCost="totalDrugCost"
              @processingFee="processingFee"
              @pharmacyLists="getpharmacyLists"
            />
            <div class="p-item">
              <!-- 中药抄方 formState.drugType == 1 -->
              <CMedicineModel
                v-if="formState.drugType == 1"
                :formState="formState"
                :modelState="modelState"
                @handleSavePrescriptionModel="handleSavePrescriptionModel"
                @handlePrescriptionModel="handlePrescriptionModel"
              />
              <!-- 西药抄方 formState.drugType == 2 -->
              <WMedicineModel
                v-if="formState.drugType == 2"
                :formState="formState"
                :modelState="modelState"
                @handleSavePrescriptionModel="handleSavePrescriptionModel"
              />
            </div>
            <div>
              <UsageAndDosageModal :formState="formState" />
            </div>
          </div>
          <!-- <div class="right" style="width: 440px">
            处方模版
            <PrescriptionModel
              :formState="formState"
              @handleUpdateMedicineList="handleUpdateMedicineList"
          /></div> -->
        </div>
        <div class="line"></div>
        <div class="bottom">
          <!-- 用药医嘱 -->
          <MedicalAdviceModel :formState="formState" />
          <!-- <div class="line"></div> -->
          <!-- 处方设置 -->
          <PrescriptionSetModel :formState="formState" />
          <!-- <div class="line"></div> -->
          <!-- 快递设置 -->
          <ExpressSetModel :formState="formState" :comMedicalFee="comMedicalFee" />
          <div class="line"></div>
          <OrderDetailModel
            :formState="formState"
            :comMedicalFee="comMedicalFee"
            :comProcessCost="comProcessCost"
            :comTotal="comTotal"
            :comConsultationFee="comConsultationFee"
          />
        </div>
      </a-form>

      <!-- <div class="line"></div> -->

      <div class="model" v-show="isshow">
        <div class="title">
          <div class="title-label">
            <div class="closes" @click="closeModel"><close-outlined style="color: #a5a3a3" /></div>
            <Divider style="font-size: 30px; font-weight: 500">超量与配伍禁忌</Divider>
          </div>
          <div class="array">
            <div v-for="(item, index) in saveArray" :key="index">
              {{ item }}
            </div>
          </div>
          <div class="size">
            <Divider class="you">请您签字确认以上药材使用无误</Divider>
            <button class="button" @click="close">医生签名</button>
          </div>
        </div>
      </div>

      <!--  提交表单-->
      <div class="mb-5 submit-group">
        <div class="btn" @click="handleReset">取消</div>
        <div class="btn btn-spc" @click="btnClick2">抄方成功</div>
        <!-- <a-button class="ml-20" @click="handleReset">取消</a-button> -->
        <!-- <a-button class="ml-10" type="primary" @click="btnClick2">抄方成功</a-button> -->
      </div>
    </div>
  </div>
  <!-- 处方确认 -->
  <a-modal
    v-model:visible="prescriptionConfirmation"
    title="处方确认"
    :closable="false"
    width="750px"
    cancelText="返回修改"
    okText="确认无误，提交处方"
    @cancel="prescriptionModalCancel"
    @ok="prescriptionModalOk"
  >
    <div style="padding: 20px; box-sizing: border-box; font-size: 16px">
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">患者信息：</span>
        <span
          >{{ formState.patient_name }}&nbsp;&nbsp;{{
            formState.patient_sex == '1' ? '男' : '女'
          }}&nbsp;&nbsp;{{ formState.patient_age == '' ? '' : formState.patient_age }}&nbsp;&nbsp;{{
            formState.patient_mobile
          }}</span
        >
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">医生信息：</span>
        <span
          >{{ formState.doctor_name }}&nbsp;&nbsp;{{ formState?.ks2name }}&nbsp;&nbsp;{{
            formState?.doctor_title
          }}&nbsp;&nbsp;{{ formState?.hospital_name }}</span
        >
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">诊断：</span>
        <span>{{ formState.icd_ids }}</span>
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">药品：</span>
        <!-- 中药 -->
        <div
          style="display: inline-block; width: 90%; vertical-align: top"
          v-if="formState.drugType == 1"
        >
          <span
            v-for="(item, index) in CMedicineListSum"
            :key="index"
            style="
              width: 22%;
              display: inline-block;
              vertical-align: top;
              margin-bottom: 5px;
              margin-right: 10px;
            "
          >
            <span>{{ item.name }}</span> <span>{{ item.number }}</span
            ><span>{{ item.unit }}</span> <span style="font-size: 14px">{{ item.autograph }}</span>
            <span style="color: #d68516; font-size: 14px" v-if="item.usage != ''">{{
              '(' + item.usage + ')'
            }}</span>
          </span>
        </div>
        <!-- 西药 -->
        <div
          style="display: inline-block; width: 90%; vertical-align: top"
          v-if="formState.drugType == 2"
        >
          <span
            v-for="(item, index) in WMedicineListSum"
            :key="index"
            style="
              width: 22%;
              display: inline-block;
              vertical-align: top;
              margin-bottom: 5px;
              margin-right: 10px;
            "
          >
            <span>{{ item.name }}</span> <span v-if="item.name != ''">{{ item.number }}</span
            ><span v-if="item.name != ''">{{ item.unit }}</span>
            <span style="font-size: 14px">{{ item.autograph }}</span>
            <span style="color: #d68516; font-size: 14px" v-if="item.usage != ''">{{
              '(' + item.usage + ')'
            }}</span>
          </span>
        </div>
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">药房及剂型：</span>
        <span
          >{{ submitPharmacy }}&nbsp;&nbsp;<span style="color: #dfa14c"
            >{{ formState.dosage_form
            }}{{
              formState.dosage_form == '颗粒剂' || formState.dosage_form == '西药与中成药'
                ? ''
                : '--' + formState.tisanes_way
            }}</span
          ></span
        >
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">用法用量：</span>
        <span>{{ formState.usage1 }}</span>
        <span v-show="formState.drugType == 1">
          ;&nbsp;{{
            formState.tisanes_way === '自煎' || formState.dosage_form == '颗粒剂'
              ? '共' +
                formState.tisanes_detail.total_dosage +
                '剂，每日1剂，1剂分' +
                formState.tisanes_detail.every_dosage +
                '次服用'
              : '共' +
                formState.tisanes_detail.total_dosage +
                '剂，每剂' +
                formState.tisanes_detail.every_dosage +
                '袋，每袋' +
                +formState.tisanes_detail.every_bag +
                'ml，每日' +
                formState.tisanes_detail.every_day +
                '次，每次' +
                formState.tisanes_detail.every_time +
                '袋'
          }}
        </span>
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">医嘱：</span>
        <span>{{ formState.times == '' ? '无' : formState.times }}</span>
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">患者是否可见处方：</span>
        <span v-show="formState.drugType == 1">{{
          formState.pres_visible == 1
            ? '购药前后均可见'
            : formState.pres_visible == 2
            ? '购药前后均不可见'
            : formState.pres_visible == 3
            ? '购药前后只可见药材名字'
            : formState.pres_visible == 4
            ? '仅购药后可见药材名'
            : formState.pres_visible == 5
            ? '仅购药后可见药材名和克数'
            : ''
        }}</span>
        <span v-show="formState.drugType == 2">{{
          formState.pres_visible == 1
            ? '购药前后均可见'
            : formState.pres_visible == 2
            ? '购药前后均不可见'
            : formState.pres_visible == 6
            ? '仅购药后可见'
            : ''
        }}</span>
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">快递类型：</span>
        <span>{{ formState.express_type == '1' ? '标快' : '特快' }}</span>
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">自定义快递费：</span>
        <span>{{
          formState.set_express_total == '0'
            ? '包邮'
            : formState.set_express_total == ''
            ? '无'
            : formState.set_express_total
        }}</span>
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">支付方式：</span>
        <span>{{
          formState.doctor_express_type == 2
            ? '到付'
            : formState.doctor_express_type == 1
            ? '在线支付'
            : '暂无'
        }}</span>
      </div>
    </div>
  </a-modal>
  <RegModal @register="registerQrcodeModal" @cancel="handleReset" />
  <PrescriptionModel
    @register="registerPrescriptionDrawer"
    @handleUpdateMedicineList="handleUpdateMedicineList"
    ref="prescription"
    :formState="formState"
  />
</template>

<script lang="ts">
  import { computed, defineComponent, reactive, ref, watch, nextTick, provide } from 'vue';
  import { formRules, labelCol, wrapperCol } from './index';
  import {
    IllnessStateModel,
    PAndDModel,
    CMedicineModel,
    WMedicineModel,
    PrescriptionModel,
    MedicalAdviceModel,
    PrescriptionSetModel,
    OrderDetailModel,
    UsageAndDosageModal,
    RegModal,
    ExpressSetModel,
  } from '../model';
  import _ from 'lodash';

  import {
    getPrescriptAddApi,
    getProcessingFee,
    createPrescription,
    prescriptSave,
    getChineseDrug,
    getWesterDrug,
  } from '/@/api/sys/prescription';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useClinicalReceptionStore } from '/@/store/modules/clinical-reception';
  import { BigNumber } from 'bignumber.js';
  import { useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import { getIdempotentToken } from '/@/api/sys/idempotent';
  import { multiply, roundSync } from '/@/utils/math';
  // import { objectMerge } from '/@/utils/index';
  export default defineComponent({
    components: {
      IllnessStateModel,
      PAndDModel,
      CMedicineModel,
      WMedicineModel,
      PrescriptionModel,
      MedicalAdviceModel,
      PrescriptionSetModel,
      OrderDetailModel,
      UsageAndDosageModal,
      RegModal,
      ExpressSetModel,
    },
    props: {
      id: Number,
    },
    emits: ['changeTab'],
    setup(props) {
      const loading = ref(false);
      const { createMessage, createConfirm } = useMessage();
      const { success, error } = createMessage;
      const saveArray = ref([]);
      const isshow = ref(false);
      const isCreate = ref(false);
      const issize = ref(true);
      const ischeck = ref(true);
      const newId = ref({});
      const formState = reactive({
        process_fee: 0,
        consultation_fee: 0,
        express_fee: 0,
        // service_fee: 0,
        service_discount: 0,
        total_fee: 0,
        medical_fee: 0,
        patient_id: 0, // 患者ID
        patient_name: '', // 患者姓名
        patient_sex: '1', // 患者性别
        patient_age: '0', // 患者年龄
        patient_descr: '', // 患者主诉
        patient_mobile: '', // 患者手机号
        did: '',
        doctor_id: '', // 医生ID
        doctor_name: '', // 医生姓名
        dosage_id: '',
        dosage_form: '', // 剂型
        pharmacy_id: '', // 药房
        usage1: '内服', // 用药方法
        tisanes_way: '代煎', // 煎药方式
        tisanes_detail: {
          // 煎药详情
          total_dosage: 14, // 剂数
          every_dosage: 2, // 每剂分多少次
          every_bag: 200,
          every_day: 2,
          every_time: 1,
        },
        icd_ids: '',
        times: '', // 服药时间
        taboos: [], // 服药禁忌
        // make: '', // 自定义医嘱
        matter: '', // 医嘱
        drugType: 1, //抄方类型 1为中药 2为西药与中成要
        order_sn: '',
        quick_id: '',
        express_type: '1', //快递类型
        set_express_total: '', //自定义快递费
        free_delivery: 2, // 是否包邮
        free_delivery_limit: '',
      }) as any;
      const modelState = reactive({
        znMedicineValue: false,
        znMedicineName: '',
        westMedicineValue: false,
        westMedicineName: '',
      });

      const idempotentToken = ref('');

      const CMedicineList = computed(() => useClinicalReceptionStore().CMedicineList);
      const WMedicineList = computed(() => useClinicalReceptionStore().WMedicineList);
      const [registerPrescriptionDrawer, { openDrawer }] = useDrawer();
      watch(
        () => {
          return props.id;
        },
        (state) => {
          // console.log(state);
          if (state) {
            nextTick(async () => {
              // getConsultationSync(props.id);
              let doctorInfo: any = useClinicalReceptionStore().doctoreStore;
              let patientInfo: any = useClinicalReceptionStore().patientStore;
              let order_sns: any = useClinicalReceptionStore().orderSn;
              let quick_ids: any = useClinicalReceptionStore().orderId;
              formState.order_sn = order_sns;
              formState.quick_id = quick_ids;
              //更新患者信息
              formState.patient_id = patientInfo.patient_id;
              formState.order_sn = order_sns;
              formState.quick_id = quick_ids;

              formState.patient_name = patientInfo.patient_name;
              formState.patient_sex = patientInfo.patient_sex;
              formState.patient_age = patientInfo.patient_age;
              formState.patient_mobile = patientInfo.patient_mobile;
              //更新医生信息
              formState.doctor_id = doctorInfo.doctor_id;
              formState.doctor_name = doctorInfo.doctor_name;
              formState.did = doctorInfo.did;
              formState.hospital_name = doctorInfo.hospital_name;
              formState.ks2name = doctorInfo.ks2name;
              formState.doctor_title = doctorInfo.doctor_title;
              formState.dept_id = doctorInfo.kid2;
              // console.log(formState);
            });
          }
        },
        {
          immediate: true,
          deep: true,
        }
      );

      // 药房改变，获取药房费用
      const processingFee = () => {
        console.log(22222, formState.pharmacy_id, formState.dosage_id);
        if (!formState.pharmacy_id || !formState.dosage_id) return;
        getProcessingFee(formState.pharmacy_id, formState.dosage_id).then((res) => {
          formState.process_fee = res.price || '0';
          loading.value = false;
        });
      };

      /**
       * @description:  动态计算药品费
       * @param {*}
       * @return {*}
       */

      // 每剂药费

      const totalDrugCost = computed(() => {
        if (formState.drugType === 1) {
          if (CMedicineList.value.length > 0) {
            let total = 0.0;
            for (const item of CMedicineList.value) {
              if (!item.number || item.number === '0' || isNaN(item.number)) {
                return (total = -1);
              }
              const price = BigNumber(item.retail_price);
              total = price.multipliedBy(item.number).plus(total);
            }
            return isNaN(total) ? 0 : total;
          }
          return 0.0;
        } else {
          if (WMedicineList.value.length > 0) {
            let total = 0.0;
            for (const item of WMedicineList.value) {
              if (!item.number || item.number === '0' || isNaN(item.number)) {
                return (total = -1);
              }
              const price = BigNumber(item.retail_price);
              total = price.multipliedBy(item.number).plus(total);
            }
            return isNaN(total) ? 0 : total;
          }
          return 0.0;
        }
      });
      provide('totalDrugCost', totalDrugCost);

      const getIdempotentTokenAction = () => {
        getIdempotentToken().then((res) => {
          idempotentToken.value = res.token;
          console.log('冪等token', idempotentToken.value);
        });
      };

      getIdempotentTokenAction();

      // 向上取整 保留两位小数
      (function () {
        /**
         * Decimal adjustment of a number.
         *
         * @param {String}  type  The type of adjustment.
         * @param {Number}  value The number.
         * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
         * @returns {Number} The adjusted value.
         */
        function decimalAdjust(type, value, exp) {
          // If the exp is undefined or zero...
          if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
          }
          value = +value;
          exp = +exp;
          // If the value is not a number or the exp is not an integer...
          if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
          }
          // Shift
          value = value.toString().split('e');
          value = Math[type](+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)));
          // Shift back
          value = value.toString().split('e');
          return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp));
        }

        // Decimal round
        if (!Math.round10) {
          Math.round10 = function (value, exp) {
            return decimalAdjust('round', value, exp);
          };
        }
        // Decimal floor
        if (!Math.floor10) {
          Math.floor10 = function (value, exp) {
            return decimalAdjust('floor', value, exp);
          };
        }
        // Decimal ceil
        if (!Math.ceil10) {
          Math.ceil10 = function (value, exp) {
            return decimalAdjust('ceil', value, exp);
          };
        }
      })();

      // 医药费
      const comMedicalFee = computed(() => {
        if (totalDrugCost.value === -1) {
          return '计算中...';
        }
        let num = 1;
        if (formState.drugType === 1) num = formState.tisanes_detail.total_dosage;

        return Math.ceil10((totalDrugCost.value * num).toFixed(6), -2);
      });
      // 加工费
      const comProcessCost = computed(() => {
        if (CMedicineList.value.length <= 0) {
          return 0;
        }

        if (totalDrugCost.value === -1) {
          return 0;
        }
        let num = 0;
        if (
          (formState.drugType === 1 && formState.tisanes_way === '代煎') ||
          formState.dosage_id === 2
        ) {
          num = formState.tisanes_detail.total_dosage;
        }
        return multiply(formState.process_fee, num);
      });
      //诊金
      const comConsultationFee = computed(() => {
        return multiply(formState.consultation_fee, 1);
      });
      //处方合计
      const comTotal = computed(() => {
        if (totalDrugCost.value === -1) {
          return '计算中...';
        }
        let total =
          Number(comMedicalFee.value) +
          Number(comProcessCost.value) +
          Number(comConsultationFee.value) +
          Number(formState.set_express_total);

        return Math.ceil10(total.toFixed(6), -2);
      });

      const handleReset = () => {
        useClinicalReceptionStore().setCMedicineListSync([]);
        useClinicalReceptionStore().setWMedicineListSync([]);
        modelState.znMedicineValue = false;
        modelState.znMedicineName = '';
        modelState.westMedicineValue = false;
        modelState.westMedicineName = '';
      };
      const formRef = ref();
      //处方确认
      const prescriptionConfirmation = ref(false);
      const submitPharmacy = ref();
      const pharmacyLists = ref<any>([]);
      const getpharmacyLists = (v) => {
        pharmacyLists.value = v.value;
      };
      const CMedicineListSum = ref<any>([]);
      const WMedicineListSum = ref<any>([]);
      const btnClick2 = _.debounce(function () {
        // console.log();
        // handleSubmit();
        formRef.value.validate().then((res) => {
          prescriptionConfirmation.value = true;
          console.log(formState);
          CMedicineListSum.value = CMedicineList.value;
          WMedicineListSum.value = WMedicineList.value;
          pharmacyLists.value.map((item) => {
            if (
              Number(formState.pharmacy_id) == item.pharmacy_id ||
              formState.pharmacy_id == item.pharmacy_id
            ) {
              if (formState.drugType == 1) {
                submitPharmacy.value = item.pharmacy_sub_name;
              }
              if (formState.drugType == 2) {
                submitPharmacy.value = item.pharmacy_name;
              }
            }
          });
        });
      }, 500);

      const prescriptionModalCancel = () => {
        prescriptionConfirmation.value = false;
      };
      const prescriptionModalOk = () => {
        prescriptionConfirmation.value = false;
        handleSubmit();
      };
      //保存处方
      const handleSubmit = () => {
        formRef.value
          .validate()
          .then(() => {
            const newFormState = JSON.parse(JSON.stringify(formState));
            newFormState.drug_type = formState.drugType;
            newFormState.patient_age_type = 1;

            if (newFormState.doctor_express_type == 2) {
              newFormState.set_express_total = '';
            }
            console.log(newFormState.free_delivery);
            console.log(Number(newFormState.medical_fee));
            console.log(Number(newFormState.free_delivery_limit));

            // if (doctor.value?.title) {
            //   newFormState.hospital_id = doctor.value?.hid || 0;
            //   newFormState.hospital_name = doctor.value?.hospital_name || '';
            //   newFormState.doctor_name = doctor.value?.title;
            //   newFormState.dept_name = doctor.value.department;
            //   newFormState.doctor_job_title = doctor.value.doctor_title;
            // }
            newFormState.dept_name = formState.ks2name;
            newFormState.doctor_job_title = formState.doctor_title;
            newFormState.dept_id = formState.dept_id;
            // newFormState.dept_id = 0;
            console.log(newFormState, '000000000000000000');
            newFormState.matter = [
              ...[formState.times],
              ...formState.taboos,
              ...[formState.matter],
            ].join(',');

            console.log(newFormState, '1111111111111111');

            if (newFormState.matter == ',') newFormState.matter = '';
            newFormState.medical_fee = comMedicalFee.value;
            // 医药费：medical_service_fee暂且用药品费用，后面说了再改！！！！！！！！！
            newFormState.medical_service_fee = newFormState.medical_fee;
            newFormState.incr_price = 0;
            newFormState.consultation_fee = comConsultationFee.value; // 诊金
            newFormState.process_fee = comProcessCost.value; // 加工费
            newFormState.total_fee = comTotal.value;
            if (
              newFormState.free_delivery == 1 &&
              Number(newFormState.medical_fee) > Number(newFormState.free_delivery_limit)
            ) {
              newFormState.doctor_express_type = 0;
            }
            if (formState.drugType === 1) {
              // 重要
              newFormState.dosage_num = formState.tisanes_detail.total_dosage;
              newFormState.tisanes_way = '';
              newFormState.tisanes_detail = {};

              let drugs = { chinese_drug: [] };
              for (const item of CMedicineList.value) {
                if (item.isLack) return error('请核对缺货药材！');
                // item.autograph = doctor.value?.title || formState.doctor_name
                item.drug_name = item.name;
                item.unit_price = item.retail_price;
                item.value = item.name;
                drugs.chinese_drug.push(item);
              }
              newFormState.chinese_drug = JSON.stringify(drugs);
              if (drugs.chinese_drug.length == 0) return error('请输入药材信息');
              newFormState.tisanes_way = formState.tisanes_way === '自煎' ? 1 : 2;
              if (newFormState.tisanes_way === 1) {
                newFormState.tisanes_detail = {
                  total_dosage: formState.tisanes_detail.total_dosage,
                  total_dosage_label: formState.tisanes_detail.total_dosage + '剂',
                  every_dosage: formState.tisanes_detail.every_dosage,
                  every_dosage_label:
                    '每日1剂，1 剂分' + formState.tisanes_detail.every_dosage + '次服用',
                };
                newFormState.tisanes_detail = JSON.stringify(newFormState.tisanes_detail);
              } else {
                newFormState.tisanes_detail = {
                  total_dosage: formState.tisanes_detail.total_dosage,
                  total_dosage_label: formState.tisanes_detail.total_dosage + '剂',
                  every_dosage: formState.tisanes_detail.every_dosage,
                  every_dosage_label: formState.tisanes_detail.every_dosage + '袋',
                  every_day: formState.tisanes_detail.every_day,
                  every_day_label: formState.tisanes_detail.every_day + '次',
                  every_bag: formState.tisanes_detail.every_bag,
                  every_bag_label: formState.tisanes_detail.every_bag + 'ml',
                  every_time: formState.tisanes_detail.every_time,
                  every_time_label: formState.tisanes_detail.every_time + '袋',
                };
                newFormState.tisanes_detail = JSON.stringify(newFormState.tisanes_detail);
              }
            } else {
              // 西药
              // newFormState.dosage_num = 1;
              newFormState.tisanes_way = '';
              newFormState.tisanes_detail = '{}';
              let drugs = { chinese_drug: [] };
              for (const item of WMedicineList.value) {
                if (item.isLack) return error('请核对缺货药材！');
                if (item.name) {
                  item.drug_name = item.name;
                  item.unit_price = item.retail_price;
                  item.value = item.name;
                  item.quantity = item.number;
                  item.medication_days = item.usage_day;
                  drugs.chinese_drug.push(item);
                }
              }
              newFormState.chinese_drug = JSON.stringify(drugs);
            }

            if (formState.drugType === 1) {
              newFormState.is_doctor_signed = !ischeck.value;
            }

            newFormState.idempotent_token = idempotentToken.value;
            // if (!updataId || query.action == 'again') {
            // 抄录处方
            createPrescript(newFormState);
            // } else {
            //   // 更新处方
            //   updatePrescript({ ...{ id: updataId }, ...newFormState });
            // }
          })
          .catch(() => {
            error('请检查必填项!');
          });
      };

      // 抄录处方
      const createPrescript = (params) => {
        getIdempotentTokenAction(); // 重新获取获取新幂等token
        createPrescription(params).then((response) => {
          if (response?.errors !== undefined && response?.data === undefined) {
            saveArray.value = response.errors;
            isshow.value = true;
          } else {
            ischeck.value = true;
            formState.patient_descr = '';
            formState.icd_ids = 0;
            formState.pay_image_base64 = response.data.image_base64;
            handlePayment(response.data.prescript_id, 'myself', 2, 1, formState);
          }
        });
      };

      // 修改处方
      const updatePrescript = (params) => {
        prescriptSave(params).then((response) => {
          if (response?.errors !== undefined && response?.data === undefined) {
            saveArray.value = response.errors;
            isshow.value = true;
          } else {
            ischeck.value = true;
            formState.patient_descr = '';
            formState.icd_ids = 0;
            formState.pay_image_base64 = response.data.image_base64;
            handlePayment(response.data.prescript_id, 'myself', 2, 1, formState);
          }
        });
      };

      const saveData = (params) => {
        prescriptSave(params).then((res: any) => {
          if (res.length > 0) {
            saveArray.value = res;
            isshow.value = true;
          } else {
            ischeck.value = true;
            success('处方抄录成功!您可以继续给下一个患者开处方');
            if (isCreate.value === true) {
              isCreate.value = false;
              getIdempotentTokenAction();
              formState.patient_descr = '';
              formState.icd_ids = 0;
            }
            handlePayment(res.prescript_id, 'myself', 2, 1, formState);
          }
        });
      };

      const close = () => {
        isshow.value = false;
        ischeck.value = false;
        handleSubmit();
      };

      const closeModel = () => {
        isshow.value = false;
        // ischeck.value = false;
        // handleSubmit();
      };
      const [registerQrcodeModal, { openModal: openQrcodeModal }] = useModal();
      function handlePayment(
        id,
        type: string,
        paymentType: number,
        paymentPayer: number,
        formState: any
      ) {
        openQrcodeModal(true, {
          type: type,
          paymentType: paymentType,
          paymentPayer: paymentPayer,
          orderId: id,
          patientName: formState.patient_name,
          record: formState,
        });
      }

      const handlePrescriptionModel = (record) => {
        // if (!formState.patient_mobile) {
        //   error('请填写患者手机号!');
        //   return;
        // }

        // if (!formState.doctor_id) {
        //   error('请先选择医生!');
        //   return;
        // }

        // if (!formState.pharmacy_id) {
        //   error('请先选择药房!');
        //   return;
        // }
        openDrawer(true, {
          doctor_id: formState.doctor_id,
          pharmacy_id: formState.pharmacy_id,
          patient_id: formState.patient_id,
          patient_mobile: formState.patient_mobile,
          drugType: formState.drugType,
        });
      };

      const handleUpdateMedicineList = (data: any) => {
        // console.log(data);
        if (data.type === 1) {
          // CMedicineList.value = data.list;
          let arr: any = [];
          data.list.map((m) => {
            // console.log(m);
            arr.push({
              id: m.id,
              value: m.drug_name,
              name: m.drug_name,
              drug_name: m.drug_name,
              drug_type: m.drug_type,
              number: m.number,
              autograph: '',
              unit: m.unit,
              unit_price: m.unit_price,
              retail_price: m.unit_price,
              usage: m.usage,
              specs: m.specs,
              drug_id: m.drug_id,
              process_cost: m.process_cost,
              stock_num: m.stock_num,
              weight: m.weight,
              isLack: true,
            });
          });
          let defArr = CMedicineList.value;
          let newArr: any = [];
          const by = (item) => item['drug_id'];
          // console.log(defArr);
          if (defArr.length > 0) {
            console.log(defArr);
            // CMedicineList.value = newArr;
            newArr = [...arr, ...defArr];
            console.log(newArr);
            const _highest = newArr.reduce((groups, item) => {
              // 获取 item 的分组的 key
              const key = by(item);
              // console.log(key, item);
              // 看看这个组是不是已经存在
              let group = groups.find((g) => {
                // console.log(g, item);
                let result = {};
                if (g.key == key) {
                  if (Number(g.number) < Number(item.number)) {
                    g.number = item.number;
                    result = g;
                  } else {
                    result = g;
                  }
                  // result = g;
                  return result;
                }
              });
              // console.log(group);
              if (!group) {
                // 不存在就创建一个新组
                group = { key, ...item };
                groups.push(group);
              }
              // item 放入组中
              group = { ...group, ...item };
              return groups;
            }, []);
            updateCmList(_highest);
          } else {
            updateCmList(arr);
          }
          modelState.znMedicineName = data.name.toString();
        }
        if (data.type === 2) {
          let arr: any = [];
          data.list.map((item) => {
            arr.push({
              id: item.id,
              drug_name: item.drug_name,
              drug_type: item.drug_type,
              number: item.number,
              autograph: item.autograph || '',
              unit_price: item.unit_price,
              usage: item.usage,
              drug_id: item.drug_id,
              name: item.drug_name,
              unit: item.unit,
              usage_day: item.medication_days,
              retail_price: item.unit_price,
              specs: item.specs,
              value: item.drug_name,
              loading: false,
              offline_share: 0,
              online_share: 0,
              isLack: true,
              key: Date.now() + parseInt(Math.random() * (1000 + 1), 10),
            });
          });

          modelState.westMedicineName = data.name.toString();
          updateWmList(arr);

          // reload();
        }
        // console.log(data, WMedicineList);
      };

      // 更新中药列表

      const updateCmList = (arr) => {
        let chechkArr = arr.map((item) => {
          // console.log(item);
          return getChineseDrug({
            pharmacy_id: formState.pharmacy_id,
            doctor_id: formState.doctor_id,
            name: item.name,
          });
        });
        // let list = useClinicalReceptionStore().CMedicineList;
        if (chechkArr.length) {
          Promise.all(chechkArr).then((res) => {
            // console.log(arr);
            res.map((item: any) => {
              arr.filter((j) => {
                undefined;
                item.find((m) => {
                  undefined;
                  if (j.name == m.name) {
                    undefined;
                    return (
                      (j.drug_id = m.drug_id),
                      (j.retail_price = m.retail_price),
                      (j.unit_price = m.retail_price),
                      (j.stock_num = m.stock_num),
                      (j.isLack = m.stock_num === 0 ? true : false)
                    );
                  }
                });
              });
            });
            // console.log(arr);
            useClinicalReceptionStore().setCMedicineListSync(arr);
          });
        } else {
          useClinicalReceptionStore().setCMedicineListSync(arr);
        }
      };
      // 更新西药列表
      const updateWmList = (arr) => {
        let chechkArr = arr.map((item) => {
          // console.log(item);
          return getWesterDrug({
            pharmacy_id: formState.pharmacy_id,
            doctor_id: formState.doctor_id,
            name: item.name,
          });
        });
        // let list = useClinicalReceptionStore().CMedicineList;
        if (chechkArr.length) {
          Promise.all(chechkArr).then((res) => {
            // console.log(res);
            res.map((item: any) => {
              arr.filter((j) => {
                undefined;
                item.find((m) => {
                  undefined;
                  if (j.name == m.name) {
                    undefined;
                    return (
                      (j.drug_id = m.drug_id),
                      (j.retail_price = m.retail_price),
                      (j.unit_price = m.retail_price),
                      (j.isLack = m.stock_num == 0 ? true : false),
                      (j.medication_days = m.medication_days),
                      (j.stock_num = m.stock_num)
                    );
                  }
                });
              });
            });
            console.log(arr);
            useClinicalReceptionStore().setWMedicineListSync(arr);
          });
        } else {
          console.log(arr);
          useClinicalReceptionStore().setWMedicineListSync(arr);
        }
      };

      // 保存处方模版
      const handleSavePrescriptionModel = async (v) => {
        // console.log(v.target.checked);
        // if (v.target.checked) {
        // let comminly_name =
        //   formState.drugType == 1 ? modelState.znMedicineName : modelState.westMedicineName;
        // if (!comminly_name) {
        //   formState.drugType == 1
        //     ? (modelState.znMedicineValue = false)
        //     : (modelState.westMedicineValue = false);
        //   error('请填写模版方名称!');
        //   return;
        // }
        // if (!formState.doctor_id) {
        //   formState.drugType == 1
        //     ? (modelState.znMedicineValue = false)
        //     : (modelState.westMedicineValue = false);
        //   error('请先选择医生!');
        //   return;
        // }
        let mList = formState.drugType == 1 ? CMedicineList.value : WMedicineList.value;
        if (mList.length <= 0) {
          formState.drugType == 1
            ? (modelState.znMedicineValue = false)
            : (modelState.westMedicineValue = false);
          error('请添加模版方药材!');
          return;
        }
        let comminly_name =
          formState.drugType == 1 ? modelState.znMedicineName : modelState.westMedicineName;
        let params = {
          drug_type: formState.drugType,
          doctor_id: formState.doctor_id,
          drug_json: JSON.stringify(mList),
          comminly_name: comminly_name,
        };
        try {
          const data = await getPrescriptAddApi(params);
          success('处方模版保存成功!');
        } catch (error) {
          formState.drugType == 1
            ? (modelState.znMedicineValue = false)
            : (modelState.westMedicineValue = false);
          console.log(error);
        }
        // }
        // modelState.znMedicine.value
        // modelState.westMedicine.value
      };

      return {
        formRef,
        formState,
        loading,
        rules: formRules,
        labelCol,
        wrapperCol,
        totalDrugCost,
        modelState,
        processingFee,
        comMedicalFee,
        comProcessCost,
        comTotal,
        comConsultationFee,
        handleSavePrescriptionModel,
        handleReset,
        handleSubmit,
        handleUpdateMedicineList,
        registerQrcodeModal,
        saveArray,
        isshow,
        close,
        issize,
        ischeck,
        btnClick2,
        submitPharmacy,
        prescriptionModalCancel,
        prescriptionModalOk,
        CMedicineListSum,
        prescriptionConfirmation,
        registerPrescriptionDrawer,
        handlePrescriptionModel,
        pharmacyLists,
        getpharmacyLists,
        WMedicineListSum,
      };
    },
  });
</script>

<style lang="less">
  .top {
    display: flex;
    justify-content: space-between;
  }
  .t-container {
    // overflow: scroll;
    position: relative;
    display: -webkit-box;
    .p-item {
      display: -webkit-box;
    }
  }
  .line {
    width: 100%;
    height: 10px;
    opacity: 1;
    background: #f0f2f5;
    margin-bottom: 20px;
  }

  .model {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.3);

    .title {
      margin: 240px auto;
      width: 480px;
      background-color: #fff;
      padding: 20px;
      text-align: center;
      border-radius: 5px;
      position: relative;

      .title-label {
        .closes {
          position: absolute;
          right: 20px;
          top: 10px;
        }
      }
      .close {
        position: absolute;
        bottom: 0;
      }
      .array {
        // flex: 1;
        min-height: 60px;
        max-height: 300px;
        overflow: auto;
        text-align: left;
        padding-left: 30px;
        font-weight: 540;
      }
      .size {
        .you {
          color: #bebbbb;
        }
        .button {
          background: skyblue;
          padding: 10px 40px 10px 40px;
          box-sizing: border-box;
          color: white;
          border-radius: 7px;
          font-size: 20px;
        }
      }
    }
  }
  .submit-group {
    position: fixed;
    right: 70px;
    bottom: 15px;
    display: flex;
    z-index: 300;
    .btn {
      width: 140px;
      height: 40px;
      border-radius: 5px;
      border: 1px solid #cccccc;
      color: #808080;
      font-size: 16px;
      line-height: 40px;
      text-align: center;
      cursor: default;
    }
    .btn-spc {
      background: #1084ff;
      border: none;
      color: #fff;
      margin-left: 16px;
    }
  }
</style>
