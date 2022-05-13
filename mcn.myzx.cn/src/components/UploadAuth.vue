<template>
  <div class="container">
    <div class="upload">
      <div v-if="isShow" class="Upload">
        <input
          type="file"
          id="fileUpload"
          @change="fileChange($event)"
          accept="video/mp4,video/mp3"
        />
        <!-- <button class="btn" @click="btn">选择文件</button> -->
        <!-- <label class="status"
          >上传状态: <span>{{ statusText }}</span></label
        > -->
      </div>
      <div v-else class="upload-type">
        <button @click="authUpload" :disabled="uploadDisabled" class="uploads">点击上传</button>
        <span style="color: cornflowerblue; margin-left: 10px">{{ statusText }}</span>
        <!-- <button @click="pauseUpload" :disabled="pauseDisabled">暂停</button> -->
        <!-- <button :disabled="resumeDisabled" @click="resumeUpload">恢复上传</button> -->
        <!-- <span class="progress"
          >上传进度: <i id="auth-progress">{{ authProgress }}</i> %</span
        > -->
      </div>
    </div>
    <!-- <div class="info"
      >uploadAuth及uploadAddress参数请查看<a
        href="https://help.aliyun.com/document_detail/55407.html"
        target="_blank"
        >获取上传地址和凭证</a
      >
    </div> -->
  </div>
</template>
<script>
  import { GetVideoTicket } from '/@/api/sys/video';

  export default {
    data() {
      return {
        isShow: true,
        timeout: '',
        partSize: '',
        parallel: '',
        retryCount: '',
        retryDuration: '',
        region: 'cn-beijing',
        userId: '1920703387120685',
        file: null,
        authProgress: 0,
        uploadDisabled: true,
        resumeDisabled: true,
        pauseDisabled: true,
        uploader: null,
        statusText: '',
        UploadP: '',
        url: '',
      };
    },
    methods: {
      fileChange(e) {
        this.file = e.target.files[0];
        if (!this.file) {
          alert('请先选择需要上传的文件!');
          return;
        }
        var Title = this.file.name;
        var userData = '{"Vod":{}}';
        if (this.uploader) {
          this.uploader.stopUpload();
          this.authProgress = 0;
          this.statusText = '';
        }
        this.uploader = this.createUploader();
        console.log(userData);
        this.uploader.addFile(this.file, null, null, null, userData);
        this.uploadDisabled = false;
        this.pauseDisabled = true;
        this.resumeDisabled = true;
        document.getElementById('fileUpload').value = null;
        this.authUpload();
      },
      authUpload() {
        // 然后调用 startUpload 方法, 开始上传
        if (this.uploader !== null) {
          this.uploader.startUpload();
          this.uploadDisabled = true;
          this.pauseDisabled = false;
        }
      },
      // 暂停上传
      pauseUpload() {
        if (this.uploader !== null) {
          this.uploader.stopUpload();
          this.resumeDisabled = false;
          this.pauseDisabled = true;
        }
      },
      // 恢复上传
      resumeUpload() {
        if (this.uploader !== null) {
          this.uploader.startUpload();
          this.resumeDisabled = true;
          this.pauseDisabled = false;
        }
      },
      createUploader(type) {
        let self = this;
        let uploader = new AliyunUpload.Vod({
          timeout: self.timeout || 60000,
          partSize: self.partSize || 1048576,
          parallel: self.parallel || 5,
          retryCount: self.retryCount || 3,
          retryDuration: self.retryDuration || 2,
          region: self.region,
          userId: self.userId,
          // 添加文件成功
          addFileSuccess: function (uploadInfo) {
            self.uploadDisabled = false;
            self.resumeDisabled = false;
            self.statusText = '添加文件成功, 等待点击上传...';
            self.isShow = false;
            console.log('addFileSuccess: ' + uploadInfo.file.name);
          },
          // 开始上传
          onUploadstarted: function (uploadInfo) {
            // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
            // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
            // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
            // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
            // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
            // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
            if (!uploadInfo.videoId) {
              const formData = new FormData();
              console.log(uploadInfo);
              formData.append('title', uploadInfo.file.name);
              formData.append('file_name', uploadInfo.file.name);

              GetVideoTicket(formData).then((res) => {
                let uploadAuth = res.data.UploadAuth;
                let uploadAddress = res.data.UploadAddress;
                let videoId = res.data.VideoId;
                uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId);

                self.statusText = '文件开始上传...';
                console.log(
                  'onUploadStarted:' +
                    uploadInfo.file.name +
                    ', endpoint:' +
                    uploadInfo.endpoint +
                    ', bucket:' +
                    uploadInfo.bucket +
                    ', object:' +
                    uploadInfo.object
                );
              });
            } else {
              const formData = new FormData();

              formData.append('title', uploadInfo.file.name);
              formData.append('file_name', uploadInfo.file.name);

              GetVideoTicket(formData).then((res) => {
                let uploadAuth = res.data.UploadAuth;
                let uploadAddress = res.data.UploadAddress;
                let videoId = res.data.VideoId;
                uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId);

                self.statusText = '文件开始上传...';
                console.log(
                  'onUploadStarted:' +
                    uploadInfo.file.name +
                    ', endpoint:' +
                    uploadInfo.endpoint +
                    ', bucket:' +
                    uploadInfo.bucket +
                    ', object:' +
                    uploadInfo.object
                );
              });
            }
          },
          // 文件上传成功
          onUploadSucceed: function (uploadInfo) {
            console.log(
              'onUploadSucceed: ' +
                uploadInfo.file.name +
                ', endpoint:' +
                uploadInfo.endpoint +
                ', bucket:' +
                uploadInfo.bucket +
                ', object:' +
                uploadInfo.object
            );
            self.url = 'https://video.myzx.cn/' + uploadInfo.object;
            console.log(uploadInfo);
            self.$emit('upload', self.url);
            self.statusText = '文件上传成功!';
            self.isShow = true;
          },
          // 文件上传失败
          onUploadFailed: function (uploadInfo, code, message) {
            console.log(
              'onUploadFailed: file:' +
                uploadInfo.file.name +
                ',code:' +
                code +
                ', message:' +
                message
            );
            self.statusText = '文件上传失败!';
          },
          // 取消文件上传
          onUploadCanceled: function (uploadInfo, code, message) {
            console.log(
              'Canceled file: ' + uploadInfo.file.name + ', code: ' + code + ', message:' + message
            );
            self.statusText = '文件已暂停上传';
          },
          // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
          onUploadProgress: function (uploadInfo, totalSize, progress) {
            console.log(
              'onUploadProgress:file:' +
                uploadInfo.file.name +
                ', fileSize:' +
                totalSize +
                ', percent:' +
                Math.ceil(progress * 100) +
                '%'
            );
            let progressPercent = Math.ceil(progress * 100);
            self.authProgress = progressPercent;
            self.statusText = '文件上传中...';
          },
          // 上传凭证超时
          onUploadTokenExpired: function (uploadInfo) {
            // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
            // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
            // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth

            const formData = new FormData();

            formData.append('title', uploadInfo.file.name);
            formData.append('file_name', uploadInfo.file.name);
            GetVideoTicket(formData).then((res) => {
              let uploadAuth = res.data.UploadAuth;
              uploader.resumeUploadWithAuth(uploadAuth);
              console.log('upload expired and resume upload with uploadauth ' + uploadAuth);
            });
            self.statusText = '文件超时...';
          },
          // 全部文件上传结束
          onUploadEnd: function (uploadInfo) {
            console.log('onUploadEnd: uploaded all the files');
            self.statusText = '文件上传完毕';
          },
        });
        return uploader;
      },
    },
  };
</script>

<style scoped>
  #fileUpload {
    /* display: none; */
    outline: none;
    /* z-index: 999; */
    margin-bottom: 10px;
  }
  .uploads {
    width: 100px;
    height: 30px;
    color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    background-color: #2a7dc9;
    z-index: 3;
  }
  .upload-type {
  }
  .Upload {
    position: relative;
  }
  .btn {
    /* background-color: #2a7dc9;
    position: absolute;
    width: 100px;
    height: 30px;
    color: #fff;
    border-radius: 3px;
    top: -8px; */
  }
</style>
