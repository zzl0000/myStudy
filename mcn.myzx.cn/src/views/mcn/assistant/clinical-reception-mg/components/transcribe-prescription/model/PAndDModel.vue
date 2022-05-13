<template>
<div class="con-pand">
   <div class="title">选择药房和剂型：</div>
   <div>
      <a-form-item label="" name="pharmacy_id" style="display:inline-block;margin-right:18px;">
        <a-select
          v-model:value="formState.pharmacy_id"
          placeholder="请选择"
          @change="getDosageList"
          style="width: 250px;"
        >
          <a-select-option
            v-for="item in pharmacyLists"
            :key="item.pharmacy_id"
            :value="item.pharmacy_id"
          >
            {{ item.pharmacy_sub_name ? item.pharmacy_sub_name : item.pharmacy_name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="" name="dosage_form" style="display:inline-block;margin-right:18px;">
        <a-select
          v-model:value="formState.dosage_form"
          placeholder="请选择"
          @change="handleChangeDosage"
          style="width: 110px"
        >
          <a-select-option :value="item.title" v-for="item in dosageForm.list" :key="item.id">
            {{ item.title }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <div style="display:inline-block;font-weight:700;letter-spacing: 2px;line-height: 32px;">
        <span v-if="formState.drugType == 1">共:{{ medicineNumber }}味药,</span>
        <span v-if="formState.drugType == 1">每剂{{ grammage }}克,</span>
        <span>
          每剂药费:
          <span style="color: red">{{
            totalDrugCost === -1
              ? '计算中...'
              : totalDrugCost == 0
              ? '0.00'
              : Math.ceil10(totalDrugCost.toFixed(6), -2)
          }}</span>
        </span>
      </div>
   </div>
  </div>
  <!-- <a-row> -->
  <!-- <div class="con">
   <div class="title">选择药房和剂型：</div>
   <div>zhongjian</div>
   <div>youbian</div>
  </div> -->

    <!-- <a-col span="14">
      <a-row style="">
        <a-col span="14">
          <a-form-item label="" name="pharmacy_id">
            <a-select
              v-model:value="formState.pharmacy_id"
              placeholder="请选择"
              @change="getDosageList"
              style="width: 90%;"
            >
              <a-select-option
                v-for="item in pharmacyLists"
                :key="item.pharmacy_id"
                :value="item.pharmacy_id"
              >
                {{ item.pharmacy_sub_name ? item.pharmacy_sub_name : item.pharmacy_name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col span="12">
          <a-form-item label="" name="dosage_form">
            <a-select
              v-model:value="formState.dosage_form"
              placeholder="请选择"
              @change="handleChangeDosage"
              style="width: 110%"
            >
              <a-select-option :value="item.title" v-for="item in dosageForm.list" :key="item.id">
                {{ item.title }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-col> -->

    <!-- <a-col span="24" style="font-size: 16px; margin: 0 0 20px 20px">
      <span v-if="formState.drugType == 1">共:{{ medicineNumber }}味药,</span>
      <span v-if="formState.drugType == 1">每剂{{ grammage }}克</span>
      <span>
        每剂药费:
        <span style="color: red">{{
          totalDrugCost === -1
            ? '计算中...'
            : totalDrugCost == 0
            ? '0.00'
            : Math.ceil10(totalDrugCost.toFixed(6), -2)
        }}</span>
      </span>
    </a-col> -->
  <!-- </a-row> -->
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, watch, nextTick, inject, computed } from 'vue';
  import { getDosageListApi, getPharmacyListApi, getChineseDrug } from '/@/api/sys/prescription';
  import { useClinicalReceptionStore } from '/@/store/modules/clinical-reception';
  import Events from '/@/utils/events';
  export default defineComponent({
    props: {
      formState: <any>Object,
    },
    emits: ['processingFee','pharmacyLists'],
    setup(props, { emit }) {
      const dosageForm = reactive({
        list: [] as any,
      });
      const pharmacyLists = ref<any>([]);
      const totalDrugCost = inject('totalDrugCost');
    
      const medicineNumber = computed(() => {
        let num = 0;
        if (props.formState.drugType == 1) {
          num = useClinicalReceptionStore().CMedicineList.length;
        }
        return num;
      });
      const grammage = computed(() => {
        let num: any = 0;
        if (props.formState.drugType == 1) {
          let list = useClinicalReceptionStore().CMedicineList;
          list.map((m) => {
            num = parseFloat(num + Number(m.number) * Number(m.weight));
          });
          // num
        }
        return num.toFixed(2);
      });

      watch(
        () => {
          return props.formState.did;
        },
        (state) => {
          // console.log(state);
          nextTick(() => {
            getPharmacyList(props.formState.did);
          });
        }
      );

      // let isFrist = true;

      // 获取药房列表
      const getPharmacyList = (id: any) => {
        let params = {
          // doctor_id: id,
        };
        getPharmacyListApi(id, params).then((res) => {
          if (res.list.length) {
            
            pharmacyLists.value = res.list.map((item) => {
              item.pharmacy_id = String(item.pharmacy_id);
              return item;
            });
            emit('pharmacyLists',pharmacyLists)
          } else {
            return [];
          }
          const defaultArr = res.list.filter((item) => {
            return item.isdefault == 1;
          });
          props.formState.pharmacy_id = defaultArr[0] ? String(defaultArr[0].pharmacy_id) : '';
          props.formState.free_delivery = res.deliveries.free_delivery;
          props.formState.free_delivery_limit = res.deliveries.free_delivery_limit;
          if (defaultArr[0]) {
            getDosageList();
          } else {
            props.formState.pharmacy_id = '';
            props.formState.dosage_form = '';
            props.formState.dosage_id = '';
            dosageForm.list = [];
          }
        });
      };

      // 获取剂型列表
      const getDosageList = () => {
        getDosageListApi(props.formState.pharmacy_id).then((res: any) => {
          dosageForm.list = res.list;
          if (res.list?.length) {
            handleChangeDosage(res.list[0].title);
            props.formState.dosage_form = res.list[0].title;
            props.formState.dosage_id = res.list[0].id;
            emit('processingFee');
          }
        });
      };

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

      const handleChangeDosage = (e) => {
        const obj = dosageForm.list.find((item) => e.indexOf(item.title) !== -1);
        props.formState.dosage_form = e;
        props.formState.dosage_id = obj.id;
        if (obj.id == 2) {
          props.formState.tisanes_way = '自煎';
        } else {
          props.formState.tisanes_way = '代煎';
        }
        props.formState.drugType = e === '西药与中成药' ? 2 : 1;

        // 默认 “购药后可见药材名和克数”、“仅购药后可见”
        props.formState.pres_visible = props.formState.drugType === 1 ? 5 : 6;
        // options.value = [];
        if (props.formState.drugType === 1) {
          let list = useClinicalReceptionStore().CMedicineList;
          list.map((m) => {
            m.isLack = true;
          });
          let arr = list.map((item) => {
            return getChineseDrug({
              pharmacy_id: props.formState.pharmacy_id,
              doctor_id: props.formState.doctor_id,
              name: item.name,
            });
          });
          if (arr.length) {
            Promise.all(arr).then((res) => {
              // console.log(arr);
              res.map((item: any) => {
                list.filter((j) => {
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
            });
          }
          // console.log(list);
          useClinicalReceptionStore().setCMedicineListSync(list);
        } else {
          useClinicalReceptionStore().setWMedicineListSync([]);
        }
        Events.trigger('updatePM', '');
        emit('processingFee');
      };

      return {
        dosageForm,
        pharmacyLists,
        getDosageList,
        handleChangeDosage,
        totalDrugCost,
        medicineNumber,
        grammage,
      };
    },
  });
</script>

<style lang="less" scoped>
.con-pand{
  display: flex;
  width: 100%;
}
.title{
  display: inline-block;
  width: 150px;
  height: 32px;
  background: rgba(75, 163, 255, 0.1);
  opacity: 1;
  border: 1px solid #007CFF;
  text-align: center;
  line-height: 32px;
  margin-left: 10px;
  color: #1084FF;
  letter-spacing: 2px;
  margin-right: 17px;
  border-radius: 5px;
  font-size: 14px;
}
</style>
