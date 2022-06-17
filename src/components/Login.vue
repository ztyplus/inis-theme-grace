<template>
    <el-dialog
        v-model="showLogin"
        width="30%"
        :show-close="false"
        destroy-on-close
        custom-class="cus-dialog"
        center
    >
    <h2 class="flex-center dialog-title">登录</h2>
    <el-form>
        <el-form-item>
            <el-input v-model="username" placeholder="管理员账号">
                <template #prefix>
                    <svg-icon file-name="admin" fill="var(--h2-color)"></svg-icon>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-input v-model="password" placeholder="密码" type="password" @keyup.enter="methods.login">
                <template #prefix>
                    <svg-icon file-name="password" fill="var(--h2-color)"></svg-icon>
                </template>
            </el-input>  
        </el-form-item> 
    </el-form> 

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="methods.login">登录</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { inisHelper } from '@/utils/helper'
import { reactive,toRefs } from 'vue'
import { POST } from '@/utils/http/request'
import { useStore } from 'vuex'
export default {
    name: "Login",
    props: {
        showLogin: Boolean
    },
    setup(props, context){
        const store = useStore()
        const state = reactive({
            username: "",
            password: "",
            showLogin: false,
            is_login: false
        })
        // 获取缓存中的登录信息
        let login_storage = inisHelper.get.storage("login")
        if (login_storage != "expire" && login_storage != false) {
            state.user = login_storage.user
            state.is_login = true
            store.dispatch("isLogin")
        }else{inisHelper.clear.storage("login")}
        const methods = {
            login(){
                if (inisHelper.is.empty(state.username)) ElMessage({message: '用户名不能为空！',type: 'warning',})
                else if (inisHelper.is.empty(state.password)) ElMessage({message: '密码不能为空！',type: 'warning',})
                else {
                    let params = {
                        mode:   'login',
                        account:  state.username,
                        password: state.password
                    } 
                    POST('users',params).then(res=>{
                        if (res.data.code == 200) {
                            ElMessage({message: '登陆成功！',type: 'success',})
                            // 设置登录用户信息
                            state.user = res.data.data.user
                            // 有效时间
                            res.data.data.time = 7200
                            // 登录信息存储到缓存中
                            inisHelper.set.storage('login',res.data.data)
                            // 更新登录状态
                            state.is_login = true
                            // 重载页面
                            location.reload()
                        } else ElMessage({message: res.data.msg,type: 'warning',}) 
                    })         
                }
            }
        }
        return { ...toRefs(state),methods }
    }
}
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
    padding: 0!important;
}
.dialog-title {
    color: var(--title-color);
    padding-bottom: 2rem;
}
            .el-input {
                height:2.5rem;
            }
.el-form-item {
    padding-top: .5rem;
}
</style>