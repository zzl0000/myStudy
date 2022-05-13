<template>
  <PageWrapper :title="getTitle" contentBackground>
    <div>
      <Consultation />
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  import { computed, defineComponent, provide, reactive, ref, unref } from 'vue';
  import { Row, Col } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { useRouter } from 'vue-router';
  import { Consultation } from '../../registration/components';

  export default defineComponent({
    components: {
      Row,
      Col,
      PageWrapper,
      Consultation,
    },
    setup() {
      const { currentRoute, replace } = useRouter();
      const { params, query } = unref(currentRoute);

      const action = query.action;
      const getTitle = '问诊订单详情';

      const props = reactive({
        data: {
          ...query,
        },
      });
      provide('data', props.data);

      return [getTitle];
    },
  });
</script>

<style scoped></style>
