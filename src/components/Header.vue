<template>
  <div class="headbox">
    <div class="flex">
      <div class="avatar cursor-pointer" @click="methods.index">
        <el-avatar
          shape="square"
          :size="100"
          fit="cover"
          :src="avatar"
        />
      </div>
      <div class="headinfo">
        <h3 @click="methods.index" class="title flex cursor-pointer">{{nickname}}</h3>
        <div class="share flex p-1 pl-0">
          <el-button
            class="mr-1"
            type="primary"
            v-if="!is_login"
            @click="methods.swDialog"
            >登录</el-button
          >
          <el-button class="mr-1" type="success" v-if="is_login" @click="methods.logout"
            >登出</el-button
          >
            <el-divider direction="vertical" />
          <el-tooltip v-if="qq" :content="qq" placement="top">
            <span @click="methods.copy(qq)"
              ><svg-icon class="wh-100" file-name="qq"></svg-icon
            ></span>
          </el-tooltip>
          <el-tooltip v-if="wechat" :content="wechat" placement="top">
            <span @click="methods.copy(wechat)"
              ><svg-icon class="wh-100" file-name="wechat"></svg-icon
            ></span>
          </el-tooltip>
          <el-tooltip v-if="email" :content="email" placement="top">
            <span @click="methods.copy(email)"
              ><svg-icon class="wh-100" file-name="email"></svg-icon
            ></span>
          </el-tooltip>
        </div>
        <p class="w-100">{{description}}</p>
      </div>
    </div>
  </div>
  <Login :showLogin="showLogin" @close="methods.swDialog" />
</template>

<script>
import { inisHelper } from "@/utils/helper";
import useClipboard from "vue-clipboard3";
import { reactive, toRefs } from "vue";
import Login from "@/components/Login";
import { mapGetters,useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  name: "Header",
  computed: {
    ...mapGetters(["is_login"]),
  },
  components: { Login },
  setup() {
    const router = useRouter();
    const store = useStore();
    const { toClipboard } = useClipboard();
    const grace_config = inisHelper.get.sessionStorage("grace_config")
    const state = reactive({
      showLogin: false,
      qq: (grace_config && grace_config.option.qq ? grace_config.option.qq : ""),
      wechat: (grace_config && grace_config.option.wechat ? grace_config.option.wechat : ""),
      email: (grace_config && grace_config.option.email ? grace_config.option.email : ""),
      nickname: (grace_config && grace_config.option.nickname ? grace_config.option.nickname : INIS.title),
      description: (grace_config && grace_config.option.description ? grace_config.option.description : ""),
      avatar: (grace_config && grace_config.option.avatar ? grace_config.option.avatar : "data:image/svg+xml;base64,PHN2ZyB0PSIxNjU3ODUyNjkzNTkxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjUzMDQiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTkxNC4yODU3MTQgODAyLjg1NzE0M3EwIDY4LjU3MTQyOS00MS43MTQyODUgMTA4LjI4NTcxNHQtMTEwLjg1NzE0MyAzOS43MTQyODZIMjYyLjI4NTcxNHEtNjkuMTQyODU3IDAtMTEwLjg1NzE0My0zOS43MTQyODZUMTA5LjcxNDI4NiA4MDIuODU3MTQzcTAtMzAuMjg1NzE0IDItNTkuMTQyODU3dDgtNjIuMjg1NzE1VDEzNC44NTcxNDMgNjE5LjQyODU3MXQyNC41NzE0MjgtNTUuNzE0Mjg1IDM1LjQyODU3Mi00Ni4yODU3MTUgNDguODU3MTQzLTMwLjU3MTQyOFQzMDcuNDI4NTcxIDQ3NS40Mjg1NzFxNS4xNDI4NTcgMCAyNCAxMi4yODU3MTV0NDIuNTcxNDI5IDI3LjQyODU3MSA2MS43MTQyODYgMjcuNDI4NTcyVDUxMiA1NTQuODU3MTQzdDc2LjI4NTcxNC0xMi4yODU3MTQgNjEuNzE0Mjg2LTI3LjQyODU3MiA0Mi41NzE0MjktMjcuNDI4NTcxIDI0LTEyLjI4NTcxNXEzNC44NTcxNDMgMCA2My43MTQyODUgMTEuNDI4NTcydDQ4Ljg1NzE0MyAzMC41NzE0MjggMzUuNDI4NTcyIDQ2LjI4NTcxNSAyNC41NzE0MjggNTUuNzE0Mjg1IDE1LjE0Mjg1NyA2MiA4IDYyLjI4NTcxNSAyIDU5LjE0Mjg1N3ogbS0xODIuODU3MTQzLTUxMC4yODU3MTRxMCA5MC44NTcxNDMtNjQuMjg1NzE0IDE1NS4xNDI4NTdUNTEyIDUxMiAzNTYuODU3MTQzIDQ0Ny43MTQyODYgMjkyLjU3MTQyOSAyOTIuNTcxNDI5dDY0LjI4NTcxNC0xNTUuMTQyODU4VDUxMiA3My4xNDI4NTd0MTU1LjE0Mjg1NyA2NC4yODU3MTRUNzMxLjQyODU3MSAyOTIuNTcxNDI5eiIgcC1pZD0iNTMwNSIgZmlsbD0iIzdCOTFGNCI+PC9wYXRoPjwvc3ZnPg=="),
    });
    const methods = {
      copy(msg) {
        toClipboard(msg);
        ElNotification({
          title: "复制成功",
          message: msg,
          type: "success",
        });
      },
      index() {
        router.push({ name: "index" });
        store.dispatch("headCover", null);
      },
      swDialog() {
        state.showLogin = !state.showLogin;
      },
      logout() {
        ElMessageBox.confirm("此操作将清除登录信息！", "退出登录", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
          showClose: false,
        })
          .then(() => {
            inisHelper.clear.storage("login");
            ElMessage({ message: "已退出登录！", type: "success" });
            location.reload();
          })
          .catch(() => {});
      },
    };

    return { ...toRefs(state), methods };
  },
};
</script>

<style lang="less" scoped>
.headbox {
  z-index: 9;
  background-color: var(--card-bg-color);
  border-radius: var(--border-radius);
  box-shadow: 0px 20px 40px rgb(103 118 128 / 3%);
  padding: 1.875rem;
  position: relative;
  transition: box-shadow 0.3s ease-in-out;
  .flex {
    align-items: center;
  }
  .headinfo {
    margin-left: 1rem;
    .title {
      letter-spacing: 0.5rem;
      font-size: 1.5rem;
      color: var(--title-color);
    }
    p {
      font-size: 0.875rem;
      font-weight: 300;
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
.el-avatar {
  position: relative;
  overflow: hidden;
  transition-duration: 5s; /**动画时间**/
}

.el-avatar:before {
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
