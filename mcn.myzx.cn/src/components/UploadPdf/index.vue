<template>
  <div class="upload-pdf-wrap">
    <div class="upload-pdf-name" v-if="filePptName">{{ filePptName }}</div>
    <div class="upload-pdf">
      <a-button type="primary">上传附件</a-button>
      <input type="file" @change="fileChange($event)" />
    </div>
  </div>
</template>

<script>
  import { defineComponent, ref, toRefs, watchEffect } from 'vue';
  import Oss from '/@/utils/oss/oss.js';
  import { getOssUpload } from '/@/api/sys/oss';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();

  export default defineComponent({
    name: 'UploadPdf',
    props: {
      name: {
        type: String,
        default: '',
      },
    },
    setup(props, { emit }) {
      const filePptName = ref('');
      watchEffect(() => {
        const { name } = toRefs(props);
        filePptName.value = name.value ? JSON.parse(name.value)[0].file_name : '';
      });
      const methods = {
        async fileChange(e) {
          let file = e.target.files[0];
          if (file.type !== 'application/pdf') {
            createMessage.error('请上传.pdf文件!');
            return;
          }
          filePptName.value = file.name;
          const data = await getOssUpload();
          Oss.init(data);
          Oss.upload(file)
            .then((res) => {
              if (res.res.statusCode === 200) {
                let newUrl = res.url
                  .replace('http://img-myzx-cn.oss-cn-beijing.aliyuncs.com', 'https://img.myzx.cn')
                  .replace(
                    'https://img-myzx-cn.oss-cn-beijing.aliyuncs.com',
                    'https://img.myzx.cn'
                  );
                createMessage.success('上传成功！');
                emit('onSuccess', [{ file_name: file.name, url: newUrl }]);
              } else {
                createMessage.error('上传失败！');
              }
            })
            .catch(() => {
              createMessage.error('上传失败！');
            });
        },
      };
      return {
        ...methods,
        ...toRefs,
        filePptName,
      };
    },
  });
</script>

<style lang="less">
  .upload-pdf-wrap {
    display: flex;
    align-items: center;
    width: 100%;
    .upload-pdf-name {
      margin-right: 20px;
    }
    .upload-pdf {
      position: relative;
      input {
        width: 100%;
        height: 100%;
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        cursor: pointer;
      }
    }
  }
</style>
