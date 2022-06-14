<template>
  <div class="sidetool">
    <div class="tool">
      <!-- <el-tooltip content="清除缓存" placement="left"> -->
        <el-button type="primary" plain @click="methods.clearStorage">
          <img class="wh-100" src="@/assets/images/refresh.svg">
        </el-button>
      <!-- </el-tooltip> -->
    </div>
    <div class="tool">
      <!-- <el-tooltip content="黑夜模式" placement="left"> -->
        <el-button type="primary" plain @click="methods.getDay">
          <img v-if="!day" class="wh-100" src="@/assets/images/sun-icon.svg">
          <img v-if="day" class="wh-100" src="@/assets/images/moon-icon.svg">
        </el-button>
      <!-- </el-tooltip> -->
    </div>

    <div class="tool">
      <!-- <el-tooltip content="回到顶部" placement="left"> -->
        <el-button type="primary" plain @click="methods.goTop">
          <img class="wh-100" src="@/assets/images/arrow-top.svg">
        </el-button>
      <!-- </el-tooltip> -->
    </div>
  </div>
  <transition name="fade">
    <SwitchDay v-if="switchDay" :day="day" />
  </transition>
  
</template>

<script>
import { reactive, toRefs,onMounted } from 'vue'
import { inisHelper } from '@/utils/helper'
import SwitchDay from '@/components/SwitchDay'
export default {
  components: {SwitchDay},
  setup(){
    const state = reactive({
      day: true,
      switchDay: false,
    })
    const methods = {
      clearStorage(){
        inisHelper.clear.storage("TopList")
        inisHelper.clear.storage("About")
        ElMessage({message: '清除缓存成功！',type: 'success',})
        location.reload()
      },
      goTop(){
        inisHelper.to.scroll(0,300)
      },
      getDay(){
        methods.stop()
        state.day = !state.day
        state.switchDay = !state.switchDay
        inisHelper.set.cookie('day',state.day,7200)
        methods.swDay(state.day)
        setTimeout(()=>{
          state.switchDay = !state.switchDay
          methods.move()
        },2000)
      },
      swDay(day){
        if (day) document.body.removeAttribute("class","dark")
        else  document.getElementsByTagName("body")[0].className="dark"
      },
      stop(){//禁止页面滑动
        var mo=function(e){e.preventDefault();};
        document.body.style.overflow='hidden';
        document.addEventListener("touchmove",mo,false);//禁止页面滑动
      },
      move() {
        var mo=function(e){e.preventDefault();};
        document.body.style.overflow='';
        document.addEventListener("touchmove",mo,false);//禁止页面滑动
      },
    }
    onMounted(()=>{
      let hour = new Date().getHours()
      if ( 8 <= hour && hour < 20) state.day = true 
      else state.day = false
      let day = eval(inisHelper.get.cookie('day')) ;
      document.getElementsByTagName("body")[0].className="dark";
      if(day != null){
        state.day = day
        methods.swDay(day)
      }else {
        methods.swDay(state.day)
      }
    })
    return {...toRefs(state),methods}
  }
}
</script>

<style lang="less" scoped>
.sidetool {
  position: fixed;
  right: .8rem;
  bottom: 150px;
  z-index: 9;
}
.el-button {
  width: 100%;
  height: 100%;
  padding: 5px;
  background-color:#409EFF;
  border: none;
}
.tool {
  height: 30px;
  width: 30px;
 margin-bottom: .5rem;
}
.fade-enter,.fade-leave-to {
	opacity: 0;
}
.fade-enter-to,.fade-leave {
	opacity: 1;
}
.fade-enter-active,.fade-leave-active {
	transition: all .5s;
}

</style>