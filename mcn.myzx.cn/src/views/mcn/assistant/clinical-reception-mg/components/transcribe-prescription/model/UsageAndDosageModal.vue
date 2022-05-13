<template>
  <a-row v-if="formState.drugType == 1">
    <!-- 自煎 -->
    <a-col span="24" v-if="formState.tisanes_way === '自煎'">
      <div class="usage-item">
        <span class="pr-3" style="font-weight: bold; color: #000">共</span>
        <a-form-item style="display: inline-block; margin-top: -3px">
          <a-input
            v-model:value="formState.tisanes_detail.total_dosage"
            value="2"
            class="small"
            style="width: 47px; text-align: center; padding: 0px 0px; color: #1084ff"
          />
        </a-form-item>
        <span class="pl-3" style="font-weight: bold; color: #000">剂，</span>
        <span style="font-weight: bold; color: #000">每日<span class="pl-2 pr-2">1</span>剂，</span>
        <span class="pr-3" style="font-weight: bold; color: #000">1剂分</span>
        <a-form-item style="display: inline-block; margin-top: -3px">
          <a-input
            v-model:value="formState.tisanes_detail.every_dosage"
            value="2"
            class="small"
            style="width: 47px; text-align: center; padding: 0px 0px; color: #1084ff"
          />
        </a-form-item>
        <span class="pl-3" style="font-weight: bold; color: #000">次服用</span>
        <span style="color: #8f4f03; font-size: 12px; margin-left: 18px"
          >*如有特殊用量，请在医嘱里备注
        </span>
      </div>
    </a-col>
    <!-- 代煎 -->
    <a-col span="24" v-if="formState.tisanes_way === '代煎'">
      <div class="usage-item">
        <span class="pr-3" style="font-weight: bold; color: #000">共</span>
        <a-form-item style="display: inline-block; margin-top: -3px">
          <a-input
            v-model:value="formState.tisanes_detail.total_dosage"
            value="2"
            class="small"
            style="width: 47px; text-align: center; padding: 0px 0px; color: #1084ff"
          />
        </a-form-item>
        <span class="pl-3" style="font-weight: bold; color: #000">剂，</span>

        <span class="pr-3" style="font-weight: bold; color: #000">每剂</span>
        <a-form-item style="display: inline-block; margin-top: -3px">
          <a-input
            v-model:value="formState.tisanes_detail.every_dosage"
            value="2"
            class="small"
            style="width: 47px; text-align: center; padding: 0px 0px; color: #1084ff"
          />
        </a-form-item>
        <span class="pl-3" style="font-weight: bold; color: #000">袋，</span>

        <span class="pr-3" style="font-weight: bold; color: #000">每袋</span>
        <a-form-item style="display: inline-block; margin-top: -3px">
          <a-input
            v-model:value="formState.tisanes_detail.every_bag"
            value="2"
            class="small"
            style="width: 47px; text-align: center; padding: 0px 0px; color: #1084ff"
          />
        </a-form-item>
        <span class="pl-3" style="font-weight: bold; color: #000">ml，</span>

        <span class="pr-3" style="font-weight: bold; color: #000">每日</span>
        <a-form-item style="display: inline-block; margin-top: -3px">
          <a-input
            v-model:value="formState.tisanes_detail.every_day"
            value="2"
            class="small"
            style="width: 47px; text-align: center; padding: 0px 0px; color: #1084ff"
          />
        </a-form-item>
        <span class="pl-3" style="font-weight: bold; color: #000">次，</span>

        <span class="pr-3" style="font-weight: bold; color: #000">每次</span>
        <a-form-item style="display: inline-block; margin-top: -3px">
          <a-input
            v-model:value="formState.tisanes_detail.every_time"
            value="2"
            class="small"
            style="width: 47px; text-align: center; padding: 0px 0px; color: #1084ff"
          />
        </a-form-item>
        <span class="pl-3" style="font-weight: bold; color: #000">袋，</span>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      formState: Object,
    },
    setup() {},
  });
</script>
<style lang="less" scoped>
  .pr-3 .pl-3 {
  }
</style>
