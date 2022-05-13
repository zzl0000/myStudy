<template>
  <div style="display:flex;">
    <div class="item">
       <!-- <h5 class="title">处方设置（选填）</h5> -->
      <div class="title">处方设置（选填）</div>
    </div>
    <div class="item" style="margin-right:50px;"> 
       <!-- 患者是否可见处方： -->
      <a-form-item label="患者是否可见处方：" :label-col="{ style: {width: '130px',},}">
        <a-select style="width: 190px" placeholder="请输入" v-model:value="formState.pres_visible">
          <a-select-option v-for="item in prescriptionVisible" :key="item.id" :value="item.id">
            {{ item.title }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </div>
    <div class="item">
       <a-form-item label="诊金" labelAlign="left" :label-col="{ style: {width: '45px',},}">
        <a-input
          v-model:value="formState.consultation_fee"
          type="number"
          :min="0"
          :max="99999"
          style="width: 100px"
        ></a-input>
        <span class="pl-3">元</span>
      </a-form-item>
    </div>
  </div>

</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';

  export default defineComponent({
    props: {
      formState: <any>Object,
    },
    setup(props) {
      const prescriptionVisible = computed(() => {
        if (props.formState.drugType === 1) {
          return [
            {
              id: 1,
              title: '购药前后均可见',
            },
            {
              id: 2,
              title: '购药前后均不可见',
            },
            {
              id: 3,
              title: '购药前后只可见药材名',
            },
            {
              id: 4,
              title: '仅购药后可见药材名',
            },
            {
              id: 5,
              title: '仅购药后可见药材名和克数',
            },
          ];
        } else {
          return [
            {
              id: 1,
              title: '购药前后均可见',
            },
            {
              id: 2,
              title: '购药前后均不可见',
            },
            {
              id: 6,
              title: '仅购药后可见',
            },
          ];
        }
      });
      return { prescriptionVisible };
    },
  });
</script>

<style lang="less" scoped>
.title{
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
  margin-top: 4px;
  font-size: 14px;
}
.setting /ddep/ .ant-form-item{
  .ant-form-item-label{
    width: 100px !important;
  }
}
 
</style>
