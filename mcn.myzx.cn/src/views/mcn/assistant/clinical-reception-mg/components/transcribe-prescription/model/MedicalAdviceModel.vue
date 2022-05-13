<template>
  <a-row>
    <!-- 用户用量 -->
    <a-col span="4">
      <div class="title">用药医嘱（选填）</div>
      <!-- <h5 class="title">用药医嘱（选填）</h5> -->
    </a-col>
    <a-col span="3" v-if="formState.drugType === 1" class="setting">
      <!-- 用药方法 -->
      <a-form-item label="">
        <a-radio-group v-model:value="formState.usage1" button-style="outline" size="default">
          <a-radio-button value="内服">内服</a-radio-button>
          <a-radio-button value="外用">外用</a-radio-button>
        </a-radio-group>
      </a-form-item>
    </a-col>
    <a-col span="3" v-if="formState.dosage_id == 1" class="setting">
      <!-- 煎药方式 -->
      <a-form-item label="">
        <a-radio-group v-model:value="formState.tisanes_way" button-style="outline" size="default">
          <a-radio-button value="代煎">代煎</a-radio-button>
          <a-radio-button value="自煎">自煎</a-radio-button>
        </a-radio-group>
      </a-form-item>
    </a-col>

    <a-col span="8" class="setting">
      <!-- 服药时间 -->
      <a-form-item label="">
        <a-select
          style="width: 190px"
          placeholder="请输入"
          v-model:value="formState.times"
          class="setting-select"
        >
          <a-select-option v-for="item in medicamentOptionTimes" :key="item.id" :value="item.title">
            {{ item.title }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-col>

    <a-col span="16" style="display: none">
      <a-form-item label="补充说明">
        <a-input style="width: 240px" placeholder="请填写特殊医嘱或其他特殊说明" />
      </a-form-item>
    </a-col>

    <a-col span="24" style="padding-left: 10px">
      <!-- 服药禁忌 -->
      <a-form-item label="">
        <a-checkbox-group v-model:value="formState.taboos" :options="mtOptions" />
      </a-form-item>
    </a-col>
    <a-col span="24" style="padding: 0px 10px">
      <!-- 自定义医嘱 -->
      <a-form-item label="">
        <a-textarea
          style="width: 100%"
          v-model:value="formState.matter"
          rows="3"
          placeholder="请输入自定义医嘱"
          show-count
          :maxlength="200"
        />
      </a-form-item>
    </a-col>
  </a-row>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { getBasics } from '/@/api/sys/prescription';
  export default defineComponent({
    props: {
      formState: Object,
    },
    setup(props) {
      const medicamentOptionTimes = ref<any>({});
      const mtOptions = ref<any>([]);
      getBasics({ type: 3 }).then((response) => {
        medicamentOptionTimes.value = response;
        props.formState.times = response[0].title;
      });
      getBasics({ type: 4 }).then((response) => {
        let list: any = [];
        for (const item of response) {
          list.push({
            label: item.title,
            value: item.title,
          });
        }
        mtOptions.value = list;
      });
      return {
        mtOptions,
        medicamentOptionTimes,
      };
    },
  });
</script>

<style lang="less" scoped>
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
  .setting /deep/ .ant-form-item-control-input {
    min-height: 27px;
    .ant-radio-button-wrapper {
      height: 27px;
      line-height: 26px;
    }
    .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
      height: 27px;
    }
    .ant-select-single .ant-select-selector .ant-select-selection-item {
      line-height: 26px;
    }
  }
</style>
