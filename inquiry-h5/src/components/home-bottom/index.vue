<template>
  <div class="copyright">
    <ul class="copyright_nav">
      <li class="copyCon">
        <a href="/user/user/falvwenjian">
          <p>服务条款</p>
        </a>
      </li>
      <li class="copyLine"></li>
      <li class="copyCon">
        <a href="/user/user/feedback">
          <p>意见反馈</p>
        </a>
      </li>
      <li class="copyLine"></li>
      <li class="copyCon">
        <a href="/user/user/about">
          <p>关于我们</p>
        </a>
      </li>
    </ul>
    <i
      >Copyright@2013-2021 未经授权请勿转载 <br />
      <a href="http://www.beian.miit.gov.cn">渝ICP备13002882号-2</a></i
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const title = ref('Hello')
const searchValue = ref('')
</script>

<style>
.copyright {
  font-size: 0;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.copyright_nav {
  margin: 0 auto;
  padding-top: 30rpx;
  text-align: center;
  display: flex;
  justify-content: center;
}

.copyright a {
  display: inline;
  color: #999 !important;
}

.copyright_nav .copyCon {
  padding: 0 20rpx;
  color: #999999;
  font-size: 20rpx;
}

.copyright_nav .copyLine {
  width: 1px;
  background-color: #d8d8d8;
}

.copyright i {
  display: block;
  font-size: 20rpx;
  color: #999;
  padding: 18rpx 0 50rpx;
  text-align: center;
}
</style>
