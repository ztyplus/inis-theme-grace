<template>
  <div :class="swday ? 'dark-theme' : ''">
    <div class="sky-bg">
      <div class="day-moon-1" :class="!swday ? 'hidden' : ''"></div>
      <div class="day-moon-2" :class="swday ? 'hidden' : ''"></div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, ref } from "vue";
export default {
  props: ["day"],
  watch: {
    swday: {
      handler(newValue, oldValue) {
        // console.log("值变化：",newValue,oldValue)
      },
    },
  },
  setup(props) {
    const state = reactive({
      swday: ref(props.day),
    });
    onMounted(() => {
      setTimeout(() => {
        state.swday = !state.swday;
      }, 1000);
    });
    return { ...toRefs(state) };
  },
};
</script>

<style lang="less" scoped>
.hidden {
  visibility: hidden;
  opacity: 0;
}
.sky-bg,
.sky-bg:before {
  content: "";
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
}
.sky-bg {
  background: -webkit-gradient(linear, left top, left bottom, from(#feb8b0), to(#fef9db));
  background: -webkit-linear-gradient(#feb8b0, #fef9db);
  background: -o-linear-gradient(#feb8b0, #fef9db);
  background: linear-gradient(#feb8b0, #fef9db);
}
.sky-bg:before {
  -webkit-transition: 2s ease all;
  -moz-transition: 2s ease all;
  -o-transition: 2s ease all;
  transition: 2s ease all;
  opacity: 0;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#4c3f6d),
    color-stop(#6c62bb),
    to(#93b1ed)
  );
  background: -webkit-linear-gradient(#4c3f6d, #6c62bb, #93b1ed);
  background: -o-linear-gradient(#4c3f6d, #6c62bb, #93b1ed);
  background: linear-gradient(#4c3f6d, #6c62bb, #93b1ed);
}
.dark-theme .sky-bg:before {
  opacity: 1;
}
/* 太阳和月亮 */

.day-moon-1,
.day-moon-2 {
  z-index: 9999;
  position: fixed;
  left: -50%;
  top: -50%;
  width: 200%;
  height: 200%;
  -webkit-animation: PlanetMove 2s cubic-bezier(0.7, 0, 0, 1);
  -moz-animation: PlanetMove 2s cubic-bezier(0.7, 0, 0, 1);
  animation: PlanetMove 2s cubic-bezier(0.7, 0, 0, 1);
  -webkit-transform-origin: center bottom;
  -moz-transform-origin: center bottom;
  -ms-transform-origin: center bottom;
  -o-transform-origin: center bottom;
  transform-origin: center bottom;
}
.day-moon-1:after {
  position: absolute;
  left: 35%;
  top: 40%;
  width: 150px;
  height: 150px;
  content: "";
  background-image: url(@/assets/images/moon.svg);
  background-repeat: no-repeat;
  background-size: cover;
}
.day-moon-2:after {
  position: absolute;
  left: 35%;
  top: 40%;
  width: 150px;
  height: 150px;
  content: "";
  background-image: url(@/assets/images/sun.svg);
  background-repeat: no-repeat;
  background-size: cover;
}
@-webkit-keyframes PlanetMove {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes PlanetMove {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
