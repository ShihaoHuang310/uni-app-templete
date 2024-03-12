<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <view class="flex text-red-500">
      Demo Count: {{ countStore.count }}
      <button @click="countStore.increment">新增</button>
    </view>
    <button class="i-carbon-sun dark:i-carbon-moon" />
    <uni-icons type="contact" size="30"></uni-icons>
    <uni-badge text="1"></uni-badge>
  </view>
</template>
<route lang="json5">
{
  layout: 'home',
  style: {
    navigationBarTitleText: '我是标题',
  },
}
</route>
<script setup lang="ts">
import { ref } from 'vue'
import { useCountStore } from '@/store'

const countStore = useCountStore()
const title = ref('Hello')
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
import type { useCountStore } from '@/store/useCountStore'@/store/count/useCountStore
