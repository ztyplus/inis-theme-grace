<template>
  <div class="header br p-2 flex">
    <div class="avatar br">
      <img
        class="wh-100"
        v-lazy="'https://q1.qlogo.cn/g?b=qq&nk=2251513837&s=640'"
        src="/public/svg/lazy.svg"
        alt=""
      />
    </div>

    <div class="ml-2 userinfo">
      <h3 class="title">纸上花开</h3>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.header {
  background-color: var(--card-bg-color);
  box-shadow: 0 20px 40px rgba(103, 118, 128, 0.03);

  .avatar {
    height: 6rem;
    width: 6rem;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      width: 1000px;
      height: 20px; /**光标的宽度，可根据实际调整**/
      background-image: linear-gradient(
        to bottom,
        transparent,
        rgba(255, 255, 255, 0.5),
        transparent
      );
      -webkit-transform: rotate(-45deg);
      -moz-transform: rotate(-45deg);
      -ms-transform: rotate(-45deg);
      -o-transform: rotate(-45deg);
      transform: rotate(-45deg);
      -webkit-animation: searchLights 2s ease-in 2s infinite;
      -o-animation: searchLights 2s ease-in 2s infinite;
      animation: searchLights 2s ease-in 2s infinite; /**第一个数字参数控制扫光速度，数字越大越慢**/
    }
  }
}

@keyframes searchLights {
  0% {
    left: -200px;
    top: -300px;
  }
  100% {
    left: -160px;
    top: 800px;
  }
}
</style>
