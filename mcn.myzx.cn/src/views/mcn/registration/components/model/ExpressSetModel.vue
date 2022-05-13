<template>
  <div class="wrap">
    <div class="item">
      <div class="title">快递设置（选填）</div>
      <!-- <h5 class="title">快递设置（选题）</h5> -->
    </div>

    <div class="item1">
      <div class="item1top">
        <div class="label">快递类型：</div>
        <div class="select">
          <a-select
            style="width: 70px"
            placeholder=""
            v-model:value="formState.express_type"
            class="setting-select"
            @change="handleChangeType"
          >
            <a-select-option v-for="item in expressList" :key="item.value" :value="item.value">
              {{ item.title }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="item1bottom">
        <span class="tips-color">*顺丰特快为航运，请谨慎选择。</span>
      </div>
    </div>

    <div class="item2">
      <div class="item2top">
        <div class="label">快递支付方式：</div>
        <div class="aa">
          <a-select
            style="width: 100px"
            placeholder=""
            class="setting-select"
            v-model:value="type"
            @change="handleChangeExpressType"
            :disabled="istype == true ? istype : disableType"
          >
            <a-select-option v-for="item in expressType" :key="item.value" :value="item.value">
              {{ item.title }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="item2bottom">
        <view class="tips-color">
          <div>*1.未选择快递支付方式时，患者自己可以修改在线支付或者到付</div>
          <div>*2.您选择快递支付方式后，患者不可修改快递支付方式</div>
        </view>
      </div>
    </div>

    <div class="item3">
      <div class="item3top">
        <div> 自定义快递费： </div>
        <div>
          <a-input
            v-model:value="express_total"
            type="number"
            :min="0"
            :max="99999"
            style="width: 125px"
            placeholder="请输入快递费"
            :disabled="formState.orderType == 'updata' && formState.status_name =='审核不通过'?true:disable == true ? disable : disableds"
            @change="handlechangeExpressTotal"
          ></a-input>
        </div>
      </div>
      <div class="item3bottom">
        <view v-if="disable" class="tips-color">
          <view>*到付的处方无需自定义快递费</view>
        </view>
        <view v-else-if="!disabled" class="tips-color">
          <div>*自定义快递费后患者将按照自定义的快递费支付</div>
          <div>*饮片代煎时请注意实际的处方重量。</div>
          <div>*当快递费设置为0时则代表免邮</div></view
        >
        <view v-else class="tips-color">
          <view>*该医生的处方药费满足包邮条件</view>
        </view>
      </div>
      <!-- <a-form-item label="" :label-col="{ style: {width: '100px',},}">
       
        
      </a-form-item> -->
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, watch, nextTick, computed, onMounted } from 'vue';
  import { number } from 'vue-types';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    props: {
      formState: <any>Object,
      comMedicalFee: <any>String,
      tisanes_type: <any>Number, //判断是否修改处方进入的页面
    },
    setup(props, { emit }) {
      const expressList = ref([
        { title: '标快', value: '1' },
        { title: '特快', value: '2' },
      ]);
      const expressType = ref([
        { title: '在线支付', value: 1 },
        { title: '到付', value: 2 },
      ]);
      const express_total = ref('');
      const doctor_express_type = ref();
      const { createMessage } = useMessage();
      const { success, error } = createMessage;
      const disable = ref(false);
      const disableType = ref(false);
      // const type = props.formState.doctor_express_type
      const type = ref(props.formState.doctor_express_type || '');
      const disableds = computed(() => {
        return props.formState.free_delivery == 1 &&
          Number(props.comMedicalFee) > Number(props.formState.free_delivery_limit)
          ? true
          : false;
      });
      const istype = computed(() => {
        return props.formState.free_delivery == 1 &&
          Number(props.comMedicalFee) > Number(props.formState.free_delivery_limit)
          ? true
          : false;
      });

      watch(
        () => {
          return props.formState.set_express_total;
        },
        (state: any) => {
          if (state) {
            express_total.value = state;
          }
        }
      );
      onMounted(() => {
        express_total.value == props.formState.set_express_total_copy.value;
        if (props.formState.set_express_total_copy.value == '0.00') {
          express_total.value == '0';
        }
        if (type == 0) {
          type.value = '';
        } else {
          type.value = type.value;
        }
        if (props.formState.express_total >= 0) {
          disableType.value = true;
        } else {
          disableType.value = false;
        }
      });
      const handleChangeType = (v) => {};
      // function deleteprice(e, a) {
      //   console.log(e);
      //   emit('delet', { e, a });
      // }
      const handleChangeExpressType = (v) => {
        v == 1 ? 1 : v == 2 ? 2 : 0;
        if (v == 2) {
          disable.value = true;
          props.formState.set_express_total = '';
          express_total.value = '';
        } else {
          express_total.value = '';
          disable.value = false;
          props.formState.set_express_total = express_total.value;
        }
        props.formState.doctor_express_type = v;
      };
      function clear() {
        type.value = '';
        express_total.value = '';
        disableType.value = false;
        disable.value = false;
      }

      function getType() {
        type.value = props.formState.doctor_express_type;
        if (props.formState.express_total == '0.00') {
          express_total.value == '0';
        }
        if (props.formState.doctor_express_type == 0) {
          type.value = '';
        } else {
          type.value = props.formState.doctor_express_type;
        }

        if (props.formState.doctor_express_type == 2) {
          disable.value = true;
        } else {
          disable.value = false;
        }
      }
      const handlechangeExpressTotal = () => {
        console.log(props.comMedicalFee, props.formState.free_delivery_limit);
        if (express_total.value == '') {
          disableType.value = false;
        } else if (Number(express_total.value) == 0) {
          disableType.value = true;
        } else {
          disableType.value = false;
        }
        if (Number(express_total.value) > 0) {
          if (props.formState.free_delivery == 1) {
            if (Number(props.comMedicalFee) < Number(props.formState.free_delivery_limit)) {
              props.formState.set_express_total = express_total.value;
            } else {
              props.formState.set_express_total = '';
              error('该医生的处方已设置免邮');
            }
          }
          if (props.formState.free_delivery == 2) {
            props.formState.set_express_total = express_total.value;
          }
        } else {
          if (express_total.value == '0.00') {
            props.formState.set_express_total = 0;
          } else {
            props.formState.set_express_total = express_total.value == '0' ? 0 : '';
          }
        }
      };
      function getexpress() {
        express_total.value = props.formState.set_express_total_copy;
        if (props.formState.orderType != 'updata') {
          express_total.value = '';
        }
        if (props.formState.express_total >= 0) {
          disableType.value = true;
        } else {
          disableType.value = false;
        }
        if (disableds) {
          express_total.value = '';
        }
      }
      return {
        express_total,
        disableds,
        disableType,
        getType,
        handlechangeExpressTotal,
        type,
        istype,
        expressList,
        expressType,
        handleChangeType,
        handleChangeExpressType,
        clear,
        doctor_express_type,
        disable,
        getexpress,
      };
    },
  });
</script>

<style lang="less" scoped>
  .wrap {
    width: 100%;
    height: 200px;
    display: flex;
    // justify-content: center;
    align-items: center;
  }
  .tips-color {
    color: #cccccc;
  }
  .item {
    height: 150px;
    display: flex;
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .item1 {
    height: 100px;
    display: flex;
    width: 200px;
    flex-wrap: wrap;
    margin-left: 50px;
    margin-top: 35px;
    display: flex;
  }
  .item1 .item1top {
    display: flex;
    width: 200px;
    align-items: center;
  }
  .item2 {
    display: flex;
    height: 100px;
    width: 400px;
    margin-left: 50px;
    flex-wrap: wrap;
    margin-top: 35px;
    display: flex;
  }
  .item2 .item2top {
    display: flex;
    width: 400px;
    align-items: center;
  }
  .item3 {
    display: flex;
    height: 100px;
    width: 400px;
    flex-wrap: wrap;
    margin-top: 35px;
    margin-left: 50px;
    display: flex;
  }
  .item3 .item3top {
    display: flex;
    width: 400px;
    align-items: center;
  }
  .item3bottom {
    height: 103px;
  }

  .title {
    width: 133px;
    height: 26px;
    background: rgba(75, 163, 255, 0.1);
    border: 1px solid #007cff;
    text-align: center;
    line-height: 26px;
    margin-left: 10px;
    margin-right: 10px;
    color: #1084ff;
    letter-spacing: 2px;
    border-radius: 5px;
    font-size: 14px;
  }
</style>
