<template>
  <a-timeline>
    <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
    <a-timeline-item>Solve initial network problems 2015-09-01</a-timeline-item>
    <a-timeline-item color="red">
      <template #dot><clock-circle-outlined style="font-size: 16px" /></template>
      Technical testing 2015-09-01
    </a-timeline-item>
    <a-timeline-item>Network problems being solved 2015-09-01</a-timeline-item>
  </a-timeline>
</template>
<script lang="ts">
  import { ClockCircleOutlined } from '@ant-design/icons-vue';
  import { defineComponent, ref, computed, unref, watch, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  export default defineComponent({
    components: {
      ClockCircleOutlined,
    },
    props: {},
    emits: [],
    setup(props, { emit }) {
      const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
        console.log(data);
      });
    },
  });
</script>
<style lang="less" scoped></style>
