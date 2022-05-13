<template>
  <div class="upload-box">
    <ul class="el-upload-list el-upload-list--picture-card">
      <li
        class="el-upload-list__item is-success"
        v-for="(item, index) in newFileList"
        :tabindex="index"
        :key="index"
        v-loading="loading"
      >
        <video
          width="100%"
          height="100%"
          :src="item.url"
          class="el-upload-list__item-thumbnail"
        ></video>
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-check"></i>
        </label>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="onVideoPreview(item)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="onRemove(item, newFileList)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </li>
    </ul>

    <a-upload
      list-type="picture-card"
      action=""
      :show-file-list="false"
      :on-change="onChange"
      :on-exceed="onExceed"
      :before-upload="onBeforeUpload"
      :http-request="onHttpRequest"
      :file-list="newFileList"
      :limit="limit"
      :data="{ token: state }"
      :accept="'.mp4, .avi'"
    >
      <i class="el-icon-video-camera"></i>
    </a-upload>

    <div class="el-upload__tip">建议视频文件不超过{{ size }}M</div>

    <a-dialog :visible.sync="dialogVisible">
      <video width="100%" :src="dialogUrl" controls> 抱歉，您的浏览器不支持播放视频。 </video>
    </a-dialog>
  </div>
</template>

<script>
  // import { getOssUpload } from '@/api/common';
  import { getOssUpload, GetVideoTicket } from '/@/api/sys/video';
  import Oss from '../../utils/oss';
  import { useUserStoreWithOut } from '/@/store/modules/user';

  export default {
    name: 'UploadVideo',
    props: {
      limit: {
        type: Number,
        default: 1,
      },
      size: {
        type: Number,
        default: 10,
      },
      fileList: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        dialogVisible: false,
        dialogUrl: '',
        videoFlag: false,
        loading: false,
        newFileList: [...this.fileList],
        state: '',
      };
    },
    watch: {
      fileList(val) {
        this.newFileList = [...val];
      },
    },
    mounted() {
      const userStore = useUserStoreWithOut();
      this.state = userStore.getToken;
    },
    methods: {
      onRemove(file, fileList) {
        this.newFileList = fileList.filter((item) => item.url !== file.url);
        this.$emit('onRemove', file, fileList);
      },
      onExceed(files, fileList) {
        this.$message.warning(`只能上传一个文件哦！`);
      },
      GetVideoTicket(file) {
        const url = URL.createObjectURL(file);
        const audioElement = new Audio(url);
        audioElement.addEventListener('loadedmetadata', () => {
          file.duration = audioElement.duration;
        });

        const isType = file.type === 'video/mp4' || file.type === 'video/mp3';
        if (!isType) {
          this.$message.error(`只能上传mp4和mp3格式的文件！`);
        }
        return isType;

        // const isLt = file.size / 1024 / 1024 < this.size;
        // if (!isLt) {
        //   this.$message.error(`上传文件大小不能超过 ${this.size}MB!`);
        // }
        // return isLt;
      },
      onChange(file, fileList) {
        // console.log("onChange: ", file, fileList);
        this.newFileList = fileList;
      },
      async onHttpRequest(options) {
        console.log('覆盖默认的上传行为，可以自定义上传的实现', options);
        this.loading = true;
        const { data } = await getOssUpload();
        Oss.init(data);
        Oss.upload(options.file)
          .then((res) => {
            console.log(res);
            this.loading = false;
            if (res.res.statusCode === 200) {
              this.$emit('onSuccess', {
                data: { url: res.url, duration: options.file.duration },
              });
              options.onSuccess(res.url);
            } else {
              this.$message.error('上传失败！');
              options.onError('上传失败！');
            }
          })
          .catch(() => {
            this.loading = false;
            this.$message.error('上传失败！');
            options.onError('上传失败！');
          });

        // setTimeout(() => {
        //   this.loading = false;
        //   this.$emit("onSuccess", {
        //     data: {
        //       url: "https://img-myzx-cn.oss-cn-beijing.aliyuncs.com/video/aliyunoss/2021-10-18/1634544512672.mp4",
        //       duration: options.file.duration,
        //     },
        //   });
        //   options.onSuccess(
        //     "https://img-myzx-cn.oss-cn-beijing.aliyuncs.com/video/aliyunoss/2021-10-18/1634544512672.mp4"
        //   );
        // }, 2000);
      },
      onVideoPreview(file) {
        this.dialogUrl = file.url;
        this.dialogVisible = true;
      },
    },
  };
</script>

<style scoped>
  ::v-deep.upload-box > div {
    display: inline-block;
  }
  .el-upload-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .el-upload-list--picture-card {
    margin: 0;
    display: inline;
    vertical-align: top;
  }

  .el-upload-list__item {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
    font-size: 14px;
    color: #606266;
    line-height: 1.8;
    margin-top: 5px;
    position: relative;
    box-sizing: border-box;
    border-radius: 4px;
    width: 100%;
  }

  .el-upload-list--picture-card .el-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    margin: 0 8px 8px 0;
    display: inline-block;
  }

  .el-upload-list--picture-card .el-upload-list__item-thumbnail {
    width: 100%;
    height: 100%;
  }

  .el-upload-list__item-status-label {
    position: absolute;
    right: 5px;
    top: 0;
    line-height: inherit;
    display: none;
  }

  .el-upload-list--picture-card .el-upload-list__item-status-label {
    position: absolute;
    right: -15px;
    top: -6px;
    width: 40px;
    height: 24px;
    background: #13ce66;
    text-align: center;
    transform: rotate(45deg);
    box-shadow: 0 0 1pc 1px rgb(0 0 0 / 20%);
  }

  .el-upload-list__item.is-success .el-upload-list__item-status-label {
    display: block;
  }

  .el-upload-list--picture-card .el-upload-list__item-status-label i {
    font-size: 12px;
    margin-top: 11px;
    transform: rotate(-45deg);
  }

  .el-upload-list--picture-card .el-upload-list__item .el-icon-check,
  .el-upload-list--picture-card .el-upload-list__item .el-icon-circle-check {
    color: #fff;
  }

  .el-upload-list--picture-card .el-upload-list__item-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s;
  }
  .el-upload-list--picture-card .el-upload-list__item-actions:hover {
    opacity: 1;
  }
  .el-upload-list--picture-card .el-upload-list__item-actions:hover span {
    display: inline-block;
  }
  .el-upload-list--picture-card .el-upload-list__item-actions span {
    display: none;
    cursor: pointer;
  }
  .el-upload-list__item-delete {
    position: absolute;
    right: 10px;
    top: 0;
    font-size: 12px;
    color: #606266;
    display: none;
  }
  .el-upload-list--picture-card .el-upload-list__item-actions span {
    display: none;
    cursor: pointer;
  }
  .el-upload-list--picture-card .el-upload-list__item-actions span + span {
    margin-left: 15px;
  }
  .el-upload-list--picture-card .el-upload-list__item-actions .el-upload-list__item-delete {
    position: static;
    font-size: inherit;
    color: inherit;
  }

  .el-upload {
    display: inline-block;
    text-align: center;
    cursor: pointer;
    outline: 0;
  }
  .el-upload--picture-card {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    line-height: 146px;
    vertical-align: top;
  }
  .el-upload--picture-card i {
    font-size: 28px;
    color: #8c939d;
  }
  .el-upload input[type='file'] {
    display: none !important;
  }
  .el-upload__tip {
    display: block !important;
    font-size: 12px;
    color: #606266;
    margin-top: 7px;
  }
</style>
