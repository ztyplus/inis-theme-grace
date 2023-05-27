<template>
  <div class="index">首页</div>
  <button @click="login">登录</button>
</template>

<script setup lang="ts">
import Common from "@/api/common";

const login = async () => {
  const result = await Common.login("hello", "sss");
  console.log(result);
};
</script>

<style lang="less" scoped>
.index {
  height: 1200px;
}
</style>
