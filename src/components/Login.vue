<template>
  <el-dialog
    v-model="showLogin"
    width="30%"
    :show-close="false"
    destroy-on-close
    custom-class="cus-dialog"
    center
  >
    <h2 class="flex-center dialog-title">{{actionName}}</h2>
    <el-form v-if="action == 'login'">
      <el-form-item>
        <el-input v-model="username" placeholder="请输入用户名">
          <template #prefix>
            <svg-icon file-name="admin" fill="var(--h2-color)"></svg-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="password"
          placeholder="密码"
          type="password"
          @keyup.enter="methods.login"
        >
          <template #prefix>
            <svg-icon file-name="password" fill="var(--h2-color)"></svg-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <el-form v-if="action == 'register'">
      <el-form-item>
        <el-input v-model="regusername" placeholder="请输入用户名">
          <template #prefix>
            <svg-icon file-name="admin" fill="var(--h2-color)"></svg-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="regmail" placeholder="请输入邮箱">
          <template #prefix>
            <svg-icon file-name="regmail" fill="var(--h2-color)"></svg-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="regpassword1"
          placeholder="设置密码"
          type="password"
        >
          <template #prefix>
            <svg-icon file-name="password" fill="var(--h2-color)"></svg-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="regpassword2"
          placeholder="重复密码"
          type="password"
        >
          <template #prefix>
            <svg-icon file-name="password" fill="var(--h2-color)"></svg-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <div class="flex justify-center w-100">
        <el-input
          v-model="checkcode"
          placeholder="验证码"
        >
          <template #prefix>
            <svg-icon file-name="checkcode" fill="var(--h2-color)"></svg-icon>
          </template>
        </el-input>
        <el-button :disabled="checkstatus" class="ml-1 h-100 checbtn" type="primary" @click="methods.getCode">
          {{!checkstatus?'获取验证码':`重新发送(${countdown})`}}</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-form v-if="action == 'vcllogin'">
      <el-form-item>
        <el-input v-model="regmail" placeholder="请输入邮箱">
          <template #prefix>
            <svg-icon file-name="regmail" fill="var(--h2-color)"></svg-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <div class="flex justify-center w-100">
        <el-input
          v-model="checkcode"
          placeholder="验证码"
        >
          <template #prefix>
            <svg-icon file-name="checkcode" fill="var(--h2-color)"></svg-icon>
          </template>
        </el-input>
        <el-button :disabled="checkstatus" class="ml-1 h-100 checbtn" type="primary" @click="methods.getCode">
          {{!checkstatus?'获取验证码':`重新发送(${countdown})`}}</el-button>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer" v-if="action == 'login'">
        <el-button type="primary" @click="methods.login">登录</el-button>
      </span>
      <span class="dialog-footer" v-if="action == 'register'">
        <el-button type="primary" @click="methods.register">注册</el-button>
      </span>
      <span class="dialog-footer" v-if="action == 'vcllogin'">
        <el-button type="primary" @click="methods.vcllogin">登录</el-button>
      </span>
      <div class="flex-sb pt-1">
        <span class="item-text cursor-pointer" v-if="action == 'login'" @click="action = 'vcllogin';actionName = '验证码登录'">忘记密码？</span>
        <span class="item-text cursor-pointer" v-if="action == 'vcllogin'" @click="action = 'login';actionName = '登录'">返回密码登录</span>
        <span class="item-text cursor-pointer" v-if="action == 'login'" @click="methods.action">没有账号?立即注册></span>
        <span class="item-text cursor-pointer" v-if="action == 'register'" @click="methods.action">已有账号?返回登录></span>
        </div>
    </template>
  </el-dialog>
</template>

<script>
import { inisHelper } from "@/utils/helper";
import { reactive, toRefs } from "vue";
import { POST } from "@/utils/http/request";
import { useStore } from "vuex";
export default {
  name: "Login",
  props: {
    showLogin: Boolean,
  },
  setup(props, context) {
    const store = useStore();
    const state = reactive({
      action: 'login',
      actionName: '登录',
      checkstatus: false,
      countdown: 0,
      username: "",
      password: "",
      regmail: "",
      regusername: "",
      regpassword1: "",
      regpassword2: "",
      checkcode: "",
      showLogin: false,
      is_login: false,
    });
    // 获取缓存中的登录信息
    let login_storage = inisHelper.get.storage("login");
    if (login_storage != "expire" && login_storage != false) {
      state.user = login_storage.user;
      state.is_login = true;
      store.dispatch("isLogin");
    } else {
      inisHelper.clear.storage("login");
    }
    const methods = {
      login() {
        if (inisHelper.is.empty(state.username))
          ElMessage({ message: "用户名不能为空！", type: "warning" });
        else if (inisHelper.is.empty(state.password))
          ElMessage({ message: "密码不能为空！", type: "warning" });
        else {
          let params = {
            mode: "login",
            account: state.username,
            password: state.password,
          };
          POST("users", params).then((res) => {
            if (res.data.code == 200) {
              ElMessage({ message: "登陆成功！", type: "success" });
              // 设置登录用户信息
              state.user = res.data.data.user;
              // 有效时间
              res.data.data.time = 7200;
              // 登录信息存储到缓存中
              inisHelper.set.storage("login", res.data.data);
              // 更新登录状态
              state.is_login = true;
              // 重载页面
              location.reload();
            } else ElMessage({ message: res.data.msg, type: "warning" });
          });
        }
      },
      action(){
        state.countdown = 0
        state.checkstatus = false
        if(state.action == 'register'){
          state.action = 'login'
          state.actionName = '登录'
        }else {
          state.action = 'register'
          state.actionName = '注册'
        }
      },
      register(){
        if (state.regusername && state.regmail && state.regpassword1 && state.regpassword2 && state.checkcode){
          if(state.regpassword1 != state.regpassword2){
            ElMessage({ message: "两次输入的密码不一致！", type: "warning" });
          }else{
            let params = {
              mode: "register",
              nickname: state.regusername,
              email: state.regmail,
              password: state.regpassword1,
              code: state.checkcode,
            };
            POST('users',params).then((res)=>{
              if(res.data.code == 200){
                ElMessage({ message: "注册成功，请返回登录", type: "success" });
                state.regmail = ""
                state.regusername = ""
                state.regpassword1 = ""
                state.regpassword2 = ""
                state.checkcode = ""
                state.countdown = ""
                state.checkstatus = false
                state.action = 'login'
              }else{
                ElMessage({ message: res.data.msg, type: "error" });
              }
            }) 
          }
        }else{
          ElMessage({ message: "请完整填写表单信息！", type: "warning" });
        }
      },
      getCode(){
        if(state.regmail){
          methods.sendCode()
          state.checkstatus = true
          state.countdown = 60
          let timeClock = null
          timeClock = setInterval(()=>{
            state.countdown --
            if(state.countdown == 0){
              clearInterval(timeClock)
              state.checkstatus = false
            }
          },1000)
        }else{
          ElMessage({ message: "请输入邮箱！", type: "warning" });
        }
      },
      sendCode(){
          let api = 'verify-code'
          let params = {
            mode: 'create',
            email: state.regmail,
          };
          if(state.action == 'vcllogin') {
            api = 'users'
            params = {
            mode: 'vcl',
            account: state.regmail,
            }
          }
          POST(api,params).then((res)=>{
            if(res.data.code == 200){
              ElMessage({ message: res.data.msg, type: "success" });
            }else{
              state.countdown = 0
              state.checkstatus = false
              ElMessage({ message: res.data.msg, type: "warning" });
            }
          })
      },
      vcllogin(){
        if(state.regmail && state.checkcode){
          let params = {
            mode: "vcl",
            account: state.regmail,
            code: state.checkcode
          };
          POST('users',params).then((res)=>{
            if (res.data.code == 200) {
              ElMessage({ message: "登陆成功！", type: "success" });
              state.user = res.data.data.user;
              res.data.data.time = 7200;
              inisHelper.set.storage("login", res.data.data);
              state.is_login = true;
              location.reload();
            } else ElMessage({ message: res.data.msg, type: "warning" });
          })  
        }else{
          ElMessage({ message: "请完整填写表单信息！", type: "warning" });
        }
      }
    };
    return { ...toRefs(state), methods };
  },
};
</script>

<style lang="less" scoped>
.el-button {
  width: 100%;
}
h2 {
  letter-spacing: 1rem;
  border-bottom: none;
}
:deep(.el-dialog__body) {
  padding: 0 !important;
}
.dialog-title {
  color: var(--title-color);
  padding-bottom: 2rem;
}
.el-input {
  height: 2.5rem;
}
.el-form-item {
  padding-top: 0.5rem;
}
.checbtn {
  width: 8rem;
  background-color: var(--theme-color-2) !important;
}
</style>
