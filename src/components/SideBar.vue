<template>
  <div class="sidebar-wrapper">
    <div class="sidebar br">
      <router-link class="menu" :to="{ name: 'home' }">首页</router-link>
      <router-link class="menu" :to="{ name: 'about' }">关于</router-link>
      <router-link class="menu" :to="{ name: 'config' }">设置</router-link>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.sidebar-wrapper {
  position: sticky;
  top: 1rem;
  margin-right: 1rem;
  width: 100px;
  height: 500px;
  .sidebar {
    width: 100%;
    height: 100%;
    background-color: var(--card-bg-color);

    .menu {
      display: block;
      text-decoration: none;
      width: 5rem;
      height: 6rem;
      text-align: center;
      box-shadow: 0 16px 30px rgba(159, 154, 154, 0.1);
    }
  }
}
</style>
