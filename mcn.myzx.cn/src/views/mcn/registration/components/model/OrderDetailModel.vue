<template>
  <div class="con">
    <div class="con-mb con-mb-title">处方划价</div>
    <div class="con-mb">医药费:<span>¥ {{ comMedicalFee }}</span></div>
    <div class="con-mb">加工费:<span>¥ {{ comProcessCost }}</span></div>
    <div class="con-mb">诊金:<span>¥ {{ comConsultationFee }}</span></div>
    <div class="con-mb">处方合计({{ tipsText }})<span>¥ {{ comTotal }}</span></div>
  </div>
  <!-- <a-row style="padding: 20px 20px 0 20px">
    <a-col >
      <h5 class="title">处方划价</h5>
    </a-col>
    <a-col class="mb-5"  style="margin-top: -20px">
      <div class="mt-5"><div style="display: inline-block; width: 120px">医药费:</div>¥ {{ comMedicalFee }}</div>
      <div class="mt-5"
        ><div style="display: inline-block; width: 120px">加工费:</div>¥ {{ comProcessCost }}</div
      >
      <div class="mt-5"><div style="display:inline-block;width:120px">快递费</div>￥{{ formState?.express_fee }}</div>
      <div class="mt-5"
        ><div style="display: inline-block; width: 120px">诊金:</div>¥ {{ comConsultationFee }}</div
      >
      <div class="mt-5"><div style="display:inline-block;width:120px">优惠:</div>¥ {{ formState?.service_discount }}</div>
      <div class="mt-5">
        <div style="display: inline-block; width: 160px"
          >处方合计: <span>{{ tipsText }}</span></div
        >
        ¥ {{ comTotal }}
      </div>
    </a-col>
  </a-row> -->
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';

  export default defineComponent({
    props: {
      comMedicalFee: String,
      comProcessCost: String,
      comConsultationFee: String,
      comTotal: String,
      formState: <any>Object,
    },
    setup(props) {
      const tipsText = computed(() => {
        let str = '';
        if (props.formState.set_express_total === 0) {
          str = '包含快递费';
          return str;
        }

        if (
          props.formState.set_express_total === '' ||
          props.formState.set_express_total === null
        ) {
          str = '不包含快递费';
          return str;
        }

        if (
          props.formState.free_delivery == 1 &&
          Number(props.comMedicalFee) > props.formState.free_delivery_limit
        ) {
          str = '不包含快递费';
        } else {
          str = '包含快递费';
        }
        return str;
      });
      return {
        tipsText,
      };
    },
  });
</script>

<style lang="less" scoped>
.con{
    display: flex;
    padding: 0px 20px 20px 20px;
    position: fixed;
    bottom: 22px;
    background: #fff;
    width: 65%;
    line-height: 60px;
    height: 65px;
    z-index: 200;
}
.con-mb{
  margin-right: 25px;
  span{
    margin-left: 10px;
    color: #FF0000;
    font-weight: 700;
  }
}
.con-mb-title{
  font-weight: 700;
  color: #000;
  font-size: 16px;
}
</style>
