<template>
  <div class="headbox">
    <div class="flex">
      <div class="avatar cursor-pointer" @click="methods.index">
        <el-avatar shape="square" :size="100" fit="cover" src="static/images/avatar.jpg" />
      </div>
      <div class="headinfo">
        <h3 class="title flex">相左</h3>
        <div class="share flex p-1 pl-0">
          <el-button class="mr-1" type="primary" v-if="!is_login" @click="methods.swDialog">登录</el-button>
          <el-button class="mr-1" type="success" v-if="is_login" @click="methods.logout">登出</el-button>
          <el-divider direction="vertical" />
          <el-tooltip content="2251513837" placement="top">
            <span @click="methods.copy('2251513837')"><svg-icon class="wh-100" file-name="qq"></svg-icon></span>
          </el-tooltip>
          <el-tooltip content="yang2210670" placement="top" >
            <span @click="methods.copy('yang2210670')"><svg-icon class="wh-100" file-name="wechat"></svg-icon></span>
          </el-tooltip>
          <el-tooltip content="yang2210670@163.com" placement="top">
            <span @click="methods.copy('yang2210670@163.com')"><svg-icon class="wh-100" file-name="email"></svg-icon></span>
          </el-tooltip>
        </div>
        <p>知不可乎骤得，托遗响于悲风</p>
      </div>
    </div>
  </div>
  <Login :showLogin="showLogin" @close="methods.swDialog" />   
</template>

<script>
import { inisHelper } from '@/utils/helper'
import useClipboard from 'vue-clipboard3'
import { reactive,toRefs } from 'vue'
import Login from "@/components/Login"
import { mapGetters } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'Header',
    computed: {
        ...mapGetters([
            'is_login'
        ])
    },
  components: { Login },
  setup(){
    const router = useRouter()
    const { toClipboard } = useClipboard()
    const state = reactive({
        showLogin: false
    })
    const methods = {
      copy(msg){
        toClipboard(msg)
          ElNotification({
            title: '复制成功',
            message: msg,
            type: 'success',
          })     
      },
      index(){
        router.push({name: 'index'})
      },
      swDialog(){
        state.showLogin = !state.showLogin
      },
      logout(){
        inisHelper.clear.storage("login")
        ElMessage({message: '已退出登录！',type: 'success'})
        location.reload()
      }
    }

   return { ...toRefs(state),methods }
  }
}

</script>

<style lang="less" scoped>
.headbox {
  z-index: 9;
  background-color: var(--card-bg-color);
  border-radius: var(--border-radius);
  box-shadow: 0px 20px 40px rgb(103 118 128 / 3%);
  padding: 1.875rem;
  position: relative;
  transition: box-shadow .3s ease-in-out;
    .flex {
      align-items: center;
    }
  .headinfo {
    margin-left: 1rem;
    .title {
      letter-spacing: .5rem;
      font-size:1.5rem;
      color: var(--title-color);
    }
    p {
      font-size:.875rem;
      font-weight:300;
      color: var(--text-color);
      display: inline-block;
      text-align: left;
      line-height: 1.5rem;
    }
  }
.el-button {
  height: 25px;
}
  .share {
    span {
      margin: 0 5px;
      cursor: pointer;
      height: 1.5rem;
      width: 1.5rem;
    }
  }
}
.el-header {
  padding: 0;
}
</style>