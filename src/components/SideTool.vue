<template>
  <div class="sidetool">
    <div v-if="is_login && $route.name == 'talks'" class="tool">
      <el-button type="primary" plain @click="methods.send">
        <svg-icon class="wh-100" file-name="send"></svg-icon>
      </el-button>
    </div>
    <div class="tool">
      <el-button type="primary" plain @click="methods.clearStorage">
        <svg-icon class="wh-100" file-name="refresh"></svg-icon>
      </el-button>
    </div>
    <div class="tool" v-if="is_login">
      <el-button type="primary" plain @click="methods.config">
        <svg-icon class="wh-100" file-name="setting"></svg-icon>
      </el-button>
    </div>
    <div class="tool">
      <el-button type="primary" plain @click="methods.getDay">
        <svg-icon v-if="!day" class="wh-100" file-name="sun-icon"></svg-icon>
        <svg-icon v-if="day" class="wh-100" file-name="moon-icon"></svg-icon>
      </el-button>
    </div>
    <div class="tool">
      <el-button type="primary" plain @click="methods.goTop">
        <svg-icon class="wh-100" file-name="arrow-top"></svg-icon>
      </el-button>
    </div>
  </div>
  <transition name="fade">
    <SwitchDay v-if="switchDay" :day="day" />
  </transition>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { inisHelper } from "@/utils/helper";
import SwitchDay from "@/components/SwitchDay";
import { mapGetters, useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  components: { SwitchDay },
  computed: {
    ...mapGetters(["is_login"]),
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const grace_config = inisHelper.get.storage("grace_config")
    const state = reactive({
      day: (grace_config ? grace_config.option.day : true),
      switchDay: false,
    });
    const methods = {
      clearStorage() {
        inisHelper.clear.storage("grace_config");
        ElMessage({ message: "清除缓存成功！", type: "success" });
        location.reload();
      },
      goTop() {
        inisHelper.to.scroll(0, 300);
      },
      getDay() {
        methods.stop();
        state.day = !state.day;
        state.switchDay = !state.switchDay;
        inisHelper.set.cookie("day", state.day, 7200);
        methods.swDay(state.day);
        setTimeout(() => {
          state.switchDay = !state.switchDay;
          methods.move();
        }, 2000);
      },
      config() {
        router.push({ name: "config" });
      },
      swDay(day) {
        if (day) document.body.removeAttribute("class", "dark");
        else document.getElementsByTagName("body")[0].className = "dark";
      },
      stop() {
        //禁止页面滑动
        var mo = function (e) {
          e.preventDefault();
        };
        document.body.style.overflow = "hidden";
        document.addEventListener("touchmove", mo, false); //禁止页面滑动
      },
      move() {
        var mo = function (e) {
          e.preventDefault();
        };
        document.body.style.overflow = "";
        document.addEventListener("touchmove", mo, false); //禁止页面滑动
      },
      send() {
        store.dispatch("swTalk", true);
      },
    };
    onMounted(() => {
      let autoSwithch = (grace_config ? grace_config.option.autoSwithch : true)
      if(autoSwithch){
        let hour = new Date().getHours();
        if (8 <= hour && hour < 20) state.day = true;
        else state.day = false;
      }
      let day = eval(inisHelper.get.cookie("day"));
      if (day != null) {
        state.day = day;
        methods.swDay(day);
      } else {
        methods.swDay(state.day);
      }
    });
    return { ...toRefs(state), methods };
  },
};
</script>

<style lang="less" scoped>
.sidetool {
  position: fixed;
  right: 0.8rem;
  bottom: 150px;
  z-index: 9;
}
.el-button {
  width: 100%;
  height: 100%;
  padding: 5px;
  background-color: var(--main-button-color);
  border: none;
}
.tool {
  height: 30px;
  width: 30px;
  margin-bottom: 0.5rem;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave {
  opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
</style>
