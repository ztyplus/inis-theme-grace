<template>
  <div class="talks w-100" v-if="talkList.length != 0">
    <div class="talk-box main-card mb-2" v-for="(talk, index) in talkList" :key="index">
      <div class="talk-head text-left flex">
        <img :src="talk.expand.user.head_img" class="br-50" />
        <div class="info pl-1 w-100">
          <div>
            <div class="talk-name h-60">{{ talk.nickname }}</div>
            <span
              style="display: inline-block; vertical-align: text-top"
              class="item-text h-40"
              >{{ methods.natureTime(talk.create_time) }}</span
            >
          </div>
          <div v-if="is_login">
            <el-tooltip effect="dark" content="删除" placement="top">
              <span @click="methods.deleteTalk(talk.id)"
                ><svg-icon
                  class="cursor-pointer ml-1"
                  file-name="delete"
                  fill="var(--h2-color)"
                ></svg-icon
              ></span>
            </el-tooltip>
          </div>
        </div>
      </div>
      <el-divider border-style="dashed" />
      <div class="talk-content text-left" v-html='"<p>" + talk.content.replace(/\n*$/g, "").replace(/\n/g, "</p> <p>") + "</p>"'></div>
      <div class="talk-info text-left mt-2 flex">
        <span class="justify-center pr-1">
          <svg-icon file-name="os" fill="var(--h2-color)"></svg-icon>
          <span class="item-text">{{ talk.expand.agent.os.system }}</span>
        </span>
        <span class="justify-center pr-1">
          <svg-icon file-name="browser" fill="var(--h2-color)"></svg-icon>
          <span class="item-text">{{ talk.expand.agent.browser.kernel }}</span>
        </span>
        <span class="justify-center pr-1">
          <svg-icon file-name="ip" fill="var(--h2-color)"></svg-icon>
          <span class="item-text">{{ methods.getAddr(talk.opt) }}</span>
        </span>
      </div>
    </div>
  </div>
  <div class="more-load cursor-pointer" @click="methods.loadTalks">
    <div class="justify-center h-100">
      <svg-icon file-name="more" :class="isLoading ? 'rotate' : ''"></svg-icon>
      <span v-if="page < allpage" class="pl-1 item-text">加载更多...</span>
      <span v-if="page >= allpage" class="pl-1 item-text">没有更多内容了</span>
    </div>
  </div>
  <el-dialog
    :model-value="send_talk"
    width="80%"
    :show-close="false"
    custom-class="sendtalk-box"
    center
    title="发布动态"
    @close="methods.colseDialog(false)"
  >
    <div class="sendbx">
      <el-form-item>
      <el-input v-model="talkcontent" type="textarea" placeholder="说些什么吧..." />
    </el-form-item>
    </div>

    <!-- <el-upload
      :action="api_url"
      list-type="picture-card"
      :file-list="fileList"
      :multiple="false"
      accept="image/*,video/*"
      :limit="9"
      :on-exceed="methods.exceed"
      :headers="upload_headers"
      :data="upload_data"
      :handleStart="methods.handleStart"
      :on-success="methods.handleSuccess"
      :on-error="methods.handleError"
      :on-remove="methods.handleRemove"
      :before-upload="methods.beforeUpload"
    >
    <svg-icon file-name="plus"></svg-icon>
  </el-upload> -->

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="methods.submit">发布</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { GET, POST } from "@/utils/http/request";
import { inisHelper } from "@/utils/helper";
import SvgIcon from "@/components/tool/SvgIcon.vue";
import { mapGetters, useStore } from "vuex";
export default {
  components: { SvgIcon },
  computed: {
    ...mapGetters(["send_talk", "is_login"]),
  },
  setup() {
    const store = useStore();
    const state = reactive({
      upload_headers: {},
      upload_data: { mode: "upload" },
      talkList: [],
      page: 1,
      allpage: 1,
      isLoading: false,
      stopLoding: false,
      talkcontent: null,
      api_url: INIS.api + "/file",
      fileList: [],
      upload_url: [],
      limit: 12,
      login_token: null,
    });
    const methods = {
      initData() {
        state.login_token = inisHelper.get.storage("login")["login-token"];
        state.upload_headers = { "login-token": state.login_token };
        methods.getTalks(1);
      },
      getTalks(page, limit = state.limit, del = false) {
        if (page == 1) {
          state.page = 1;
          state.isLoading = true;
          state.talkList = [];
        }
        let params = { type: "moving", limit, page };
        GET("comments", { params }).then((res) => {
          if (res.data.code == 200) {
            if (del && res.data.data.data.length > state.limit)
              state.allpage = res.data.data.page * 2;
            else state.allpage = res.data.data.page;
            if (page == 1) state.talkList = [];
            state.talkList = state.talkList.concat(res.data.data.data);
            state.page = Math.ceil(state.talkList.length / state.limit);
            if (state.page >= state.allpage) state.stopLoding = true;
            state.isLoading = false;
          }
        });
      },
      async submit() {
        let location = await methods.loction();
        if (state.talkcontent) {
          let params = {
            content: state.talkcontent,
            "login-token": state.login_token,
            type: "moving",
            opt: location,
          };
          POST("comments", params).then((res) => {
            if (res.data.code == 200) {
              ElMessage({ message: "发布成功", type: "success" });
              state.talkcontent = null;
              methods.getTalks(1);
              store.dispatch("swTalk", false);
            } else ElMessage({ message: res.data.msg, type: "error" });
          });
        } else {
          ElMessage({ message: "内容为空", type: "warning" });
        }
      },
      getAddr(opt) {
        let addr = "";
        if (opt) {
          if (opt.province) addr += opt.province;
          if (opt.city) addr += opt.city;
          if (opt.district) addr += opt.district;
        }
        if (addr != "") {
          return addr;
        } else {
          return "未知地址";
        }
      },
      deleteTalk(id) {
        let params = {
          "login-token": state.login_token,
          mode: "remove",
          id,
        };
        ElMessageBox.confirm("数据删除后将不能恢复！", "确定删除?", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
          showClose: false,
        })
          .then(() => {
            POST("comments", params).then((res) => {
              if (res.data.code == 200) {
                ElMessage({ message: "删除成功", type: "success" });
                methods.getTalks(1, state.page * state.limit, true);
              } else ElMessage({ message: res.data.msg, type: "error" });
            });
          })
          .catch(() => {});
      },
      loadTalks() {
        state.page += 1;
        if (state.page <= state.allpage) {
          methods.getTalks(state.page);
        }
      },
      async loction() {
        let result = { status: 0 };
        await GET("location").then((res) => {
          if (res.data.code == 200) {
            result = res.data.data;
          }
        });
        return result;
      },
      empty(item) {
        if (item) return item;
        else return "";
      },
      natureTime(date = null) {
        const time = inisHelper.date.to.time(date);
        return inisHelper.time.nature(time, 5);
      },
      colseDialog(param) {
        store.dispatch("swTalk", param);
      },
      exceed() {
        ElNotification({
          title: "文件添加失败",
          message: "最多只能上传9个文件",
          type: "warning",
        });
      },

      handleSuccess(res, file) {
        // console.log(res.data,file.name)
        if (res.code == 200) {
          state.upload_url.push({
            url: res.data,
            name: file.name,
          });
        } else {
          ElNotification({
            title: "文件添加失败",
            message: res.msg,
            type: "warning",
          });
        }
        // console.log(state.upload_url)
      },
      beforeUpload(rawFile) {
        // console.log("beforeUpload",rawFile)
        setTimeout(() => {}, 1000);
      },
      handleRemove(file, fileList) {
        state.upload_url.splice(file.name, 1);
        console.log("删除后2", state.upload_url);
      },
      handleError(err, file) {
        console.log("上传失败");
      },
      handleStart(e) {
        console.log(e);
        // state.fileList = []
      },
    };
    onMounted(() => {
      methods.initData();
    });
    return { ...toRefs(state), methods };
  },
};
</script>

<style lang="less" scoped>
.talk-box {
  background-color: var(--card-bg-color);
  .talk-content {
    color: var(--text-color);
  }
  .talk-head {
    img {
      height: 2.5rem;
      width: 2.5rem;
    }
    .info {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: space-around;
      justify-content: space-between;
      align-items: stretch;
    }
    .talk-name {
      color: var(--h2-color);
      font-size: 0.875rem;
      font-weight: 600;
    }
  }
}
</style>
