<template>
  <!-- 病情 -->
  <a-row>
    <a-col span="12">
      <a-form-item
        label="诊断"
        name="icd_ids"
        class="item"
        labelAlign="left"
        :label-col="{ style: { width: '50px' } }"
      >
        <a-auto-complete
          v-model:value="formState.icd_ids"
          :options="icdList"
          @search="getIcdList"
          style="width: 95%"
        >
          <a-input placeholder="请输入" class="custom" />
        </a-auto-complete>
      </a-form-item>
    </a-col>
    <a-col span="12">
      <a-form-item label="主诉" name="content">
        <a-input v-model:value="formState.patient_descr" style="width: 95%" placeholder="请输入" />
      </a-form-item>
    </a-col>
  </a-row>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, nextTick } from 'vue';
  import { getPrescriptIcd } from '/@/api/sys/prescription';
  export default defineComponent({
    props: {
      formState: Object,
    },
    setup(props) {
      const icdList = ref([]);
      // 获取诊断列表
      const getIcdList = (key = '') => {
        getPrescriptIcd({ key }).then((res) => {
          icdList.value = res.list.map((item) => {
            return {
              value: item.name,
              data: item,
            };
          });
        });
      };
      onMounted(() => {
        nextTick(() => {
          getIcdList();
        });
      });
      return {
        icdList,
        getIcdList,
      };
    },
  });
</script>

<style lang="less" scoped>
  .item {
    .ant-form-item-label {
      width: 65px !important;
    }
  }
</style>
