<template>
  <!--  -->
  <PageWrapper contentBackground :title="getTitle">
    <div>
      <TranscribePrescriptionItem />
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  import { computed, defineComponent, provide, reactive, ref, unref } from 'vue';
  import { Row, Col } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { useRouter } from 'vue-router';
  import { TranscribePrescriptionItem } from '../../registration/components';

  export default defineComponent({
    components: {
      Row,
      Col,
      PageWrapper,
      TranscribePrescriptionItem,
    },
    setup() {
      const { currentRoute, replace } = useRouter();
      const { params, query } = unref(currentRoute);

      const action = query.action;
      const getTitle = computed(() =>
        action == 'creates' ? '抄录处方' : action == 'again' ? '再次开方' : ''
      );

      const props = reactive({
        data: {
          ...query,
        },
      });
      // console.log(props.data);
      provide('record', props.data);

      return {
        getTitle,
      };
    },
  });
</script>

<style scoped></style>
