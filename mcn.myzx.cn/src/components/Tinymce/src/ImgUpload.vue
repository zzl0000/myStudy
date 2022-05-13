<template>
  <div :class="[prefixCls, { fullscreen }]">
    <Upload
      name="image"
      multiple
      @change="handleChange"
      :action="url"
      :showUploadList="false"
      accept=".jpg,.jpeg,.gif,.png,.webp"
    >

    <!-- <a-input type="file" @change="tirggerFile($event)" class="inputs" /> -->
    <a-button type="primary" v-bind="{ ...getButtonProps }">
      {{ t('component.upload.imgUpload') }}
    </a-button>
    </Upload>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';

import { Upload } from 'ant-design-vue';
import { useDesign } from '/@/hooks/web/useDesign';
import { useGlobSetting } from '/@/hooks/setting';
import { useI18n } from '/@/hooks/web/useI18n';
import { GetExpertAdvis, image } from '/@/api/sys/expertadvisory';

export default defineComponent({
  name: 'TinymceImageUpload',
  components: { Upload },
  props: {
    fullscreen: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['uploading', 'done', 'error'],
  setup(props, { emit }) {
    let uploading = false;

    const { apiUrl } = useGlobSetting();
    const { t } = useI18n();
    const { prefixCls } = useDesign('tinymce-img-upload');

    const getButtonProps = computed(() => {
      const { disabled } = props;
      return {
        disabled,
      };
    });
    const url = apiUrl + '/hospital-manage/mcn/sb/upload/image'
   
    function handleChange(info: Recordable) {
      const file = info.file;
      const status = file?.status;
      const url = file?.response?.data.origin;
      const name = file?.name;
      console.log(info,'---')
      if (status === 'uploading') {
        if (!uploading) {
          emit('uploading', name);
          uploading = true;
        }
      } else if (status === 'done') {
        emit('done', name, url);
        uploading = false;
      } else if (status === 'error') {
        emit('error');
        uploading = false;
      }
    }

    return {
      prefixCls,
      handleChange,
      apiUrl,
      t,
      getButtonProps,
      image,
      url
    };
  },
});
</script>
<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-tinymce-img-upload';

.@{prefix-cls} {
  position: absolute;
  top: 4px;
  right: 10px;
  z-index: 20;

  &.fullscreen {
    position: fixed;
    z-index: 10000;
  }
}
</style>
