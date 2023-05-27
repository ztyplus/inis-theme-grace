<template>
  <div class="headimg-wrapper">
    <div
      class="headimg"
      style="
        background-image: url('https://p6.qhimg.com/bdr/__85/t018d51fc208fc1f298.jpg');
      "
    ></div>
  </div>

  <div class="container">
    <Header />
    <div class="main-wrapper flex mt-3">
      <SideBar />
      <div class="main br p-2 w-100">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useThemeStore } from "@/stores/theme";
import { RouterView } from "vue-router";
import Header from "@/components/Header.vue";
import SideBar from "@/components/SideBar.vue";

const theme = useThemeStore();
const initData = () => {
  theme.initData();
};

initData();
</script>

<style lang="less" scoped>
.headimg-wrapper {
  height: 18rem;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  .headimg {
    position: relative;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    height: 100%;
    z-index: 1;
  }
}
.container {
  min-height: 100vh;
  padding-top: 12rem;
  box-sizing: border-box;
  width: 80%;
  position: relative;
  max-width: 1140px;
  padding-bottom: 4rem;
  z-index: 9;
  margin: 0 auto;

  .main {
    background-color: var(--card-bg-color);
  }
}
</style>
