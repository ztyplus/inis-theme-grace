<template>
  <div class="config">
    <h2>主题配置</h2>

    <el-collapse v-model="activeName" accordion> </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const activeName = ref(1);
</script>

<style lang="less" scoped></style>
