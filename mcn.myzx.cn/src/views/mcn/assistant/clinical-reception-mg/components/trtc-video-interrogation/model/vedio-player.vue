<template>
  <div class="home">
    <video
      id="currentPlayer"
      class="video-js vjs-big-play-centered vjs-default-skin"
      muted
      :src="src"
      autoplay
      controls="false"
    ></video>
  </div>
</template>

<script lang="ts">
  // import { defineComponent, nextTick } from 'vue';
  import Videojs from 'video.js';
  import srcVideo from '../../../../../../../assets/images/vedio.mp4';
  import 'video.js/dist/video-js.css';
  export default {
    // setup(props) {
    //   const src = '../../../../../../../assets/images/vedio.png';
    //   const initVideo = () => {
    //     //此处初始化的调用，我放在了获取数据之后的方法内，而不是放在钩子函数mounted
    //     //页面dom元素渲染完毕，执行回调里面的方法
    //     nextTick(() => {
    //       let myPlayer = Videojs(document.getElementById('myVideo'), {
    //         //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
    //         controls: true,
    //         //自动播放属性,muted:静音播放
    //         autoplay: false,
    //         //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
    //         preload: 'auto',
    //         //设置视频播放器的显示宽度（以像素为单位）
    //         // width: "800px",
    //         //设置视频播放器的显示高度（以像素为单位）
    //         // height: "400px",
    //         controlBar: {
    //           playToggle: true,
    //         },
    //       });
    //     });
    //   };
    //   return {
    //     initVideo,
    //     src,
    //   };
    // },
    data() {
      return {
        // ../../../../../../../assets/images/bacg.png
        // require('../../../../../../../assets/images/vedio.mp4')
        src: srcVideo,
      };
    },
    created() {
      setTimeout(() => {
        this.initVideo();
      }, 300);
    },
    mounted() {},
    methods: {
      initVideo() {
        //此处初始化的调用，我放在了获取数据之后的方法内，而不是放在钩子函数mounted
        //页面dom元素渲染完毕，执行回调里面的方法
        this.$nextTick(() => {
          let myPlayer = Videojs(document.getElementById('currentPlayer'), {
            //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
            controls: false,
            //自动播放属性,muted:静音播放
            autoplay: false,
            //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
            preload: 'auto',
            //设置视频播放器的显示宽度（以像素为单位）
            width: '1244px',
            //设置视频播放器的显示高度（以像素为单位）
            height: '700px',
            controlBar: {
              playToggle: true,
            },
          });
        });
      },
    },
  };
</script>
<style scoped>
  .home {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    text-align: center;
  }
  /* .home /deep/ .vjs-control-bar {
    display: none;
  } */
</style>
