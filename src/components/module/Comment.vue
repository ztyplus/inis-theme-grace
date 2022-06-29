<template>
    <el-form 
    :model="postForm" 
    :rules="baseRules" 
    ref="formRef" 
    :status-icon="true"
    >
      <div class="comment-texera mt-3">
        <el-form-item prop="content">
          <el-input v-model="postForm.content" type="textarea" placeholder="说些什么吧..." />
        </el-form-item>
        <svg-icon @click="methods.submit()" class="send cursor-pointer" width="2.5rem" height="2.5rem" file-name="comment"></svg-icon>
      </div>
      <div class="visitor-info mt-2">
        <el-form-item prop="nickname">
            <el-input v-model="postForm.nickname" placeholder="昵称"></el-input>
        </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="postForm.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item>
            <el-input v-model="postForm.url" placeholder="网址"></el-input>
        </el-form-item>
      </div>
    </el-form> 
</template>

<script>
import { reactive,toRefs,ref } from 'vue'
import { POST } from '@/utils/http/request'
import { inisHelper } from '@/utils/helper'
export default {
  props: ["commentType","pid","articleId"],
  setup(props,ctx){
    const login_storage = inisHelper.get.storage("login")
    const formRef = ref(null)
    const state = reactive({
      postForm: {
        content: "",
        nickname: "",
        email: "",
        url: "",
        level: "user"
      },
      type: ref(props.commentType),
      article_id: ref(props.articleId),
      pid: ref(props.pid),
      isLoading: false,
      limit: 10,
      page: 1,
      allpage: null,
      baseRules: {
        content:[{ required: true, message: '请输入留言内容', trigger: 'blur' }],
        nickname:[{ required: true, message: '请输入昵称', trigger: 'blur' }],
        email:[{ required: true, message: '请输入正确的邮箱地址', type:"email", trigger: 'blur' }],
      }
    })
    if (login_storage != "expire" && login_storage != false){
      state.postForm.nickname = login_storage.user.nickname
      state.postForm.email = login_storage.user.email
      state.postForm.level = login_storage.user.level
    }
    const methods = {
      async send(){
        let params = {
          pid: state.pid,
          content: state.postForm.content,
          nickname:state.postForm.nickname,
          email:state.postForm.email,
          url:state.postForm.url,
          type: state.type,
          article_id: state.article_id ? parseInt(state.article_id) : null,
          opt: {
            like: 0,
            level: state.postForm.level
          }
        }
        // 不知道什么原因，提交POST请求有延迟，暂且搁下 
        // 这是因为后端设置的邮件服务端口不对，邮件服务不正常导致 2022.06.28
        await POST("comments",params).then((res) => {
          if(res.data.code == 200) {
            ElMessage({message: '留言成功',type: 'success'})
          }
          else ElMessage({message: res.data.msg,type: 'error',})
        })
        state.postForm.content = ""
        ctx.emit('getWallmasg',)
      },
      submit(){
        formRef.value.validate((valid) => {
          if (valid) {
            methods.send()
          }
        })
      }
    }

    return { ...toRefs(state),methods,formRef }
  }
}

</script>

<style lang="less" scoped>
.visitor-info {
  justify-content: space-between;
  display: flex;
}
.comment-texera {
  position: relative;
  height: 100px;
  .send {
    position: absolute;
    bottom: .5rem;
    right: .5rem;
  }
}
</style>