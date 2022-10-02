<template>

  <div v-if="loading" class="talks w-100">
    <div class="talk-box main-card mb-2" v-for="(index) in 8" :key="index">
      <el-skeleton class="article-content text-left my-2 pt-2" :rows="2" :loading="loading" animated/>
    </div>
  </div>

  <div class="talks w-100" v-if="!loading">
    <div class="talk-box main-card mb-2" v-for="(talk, index) in talkList" :key="index">
      <div class="talk-head text-left flex">
        <img :src="talk.expand.user.head_img" class="br-50" />
        <div class="info pl-1 w-100">
              <div class="talk-name h-60">{{ talk.nickname }}</div>
            <div class="w-100 flex-sb">
              <span
              style="display: inline-block; vertical-align: text-top"
              class="item-text h-40"
              >{{ methods.natureTime(talk.create_time) }}</span>
              <span class="item-text">{{talk.create_time}}</span>
            </div>
        </div>
      </div>
      <el-divider border-style="dashed"></el-divider>
      <div class="talk-content text-left" v-html='"<p>" + talk.content.replace(/\n*$/g, "").replace(/\n/g, "</p> <p>") + "</p>"'></div>
      <div v-if="talk.opt && talk.opt.hasOwnProperty('uploadfile')" class="talkimg flex flex-wrap">
        <photo-provider
        :photoClosable="true"
        :shouldTransition="true"
        :default-backdrop-opacity="0.9"
      >
        <photo-consumer v-for="(item, index) in talk.opt.uploadfile" :key="index" :src="item.url" :intro="item.name" class="talkimgbox" :class="talk.opt.uploadfile.length == 1 ? '' : 'layout-100'">
          <div :class="talk.opt.uploadfile.length == 1 ? '' : 'layout-card'">
            <img :src="item.url" v-if="talk.opt.uploadfile.length == 1" />
            <div class="talkimgbox1 wh-100">
              <div class="wh-100 backcover cursor-pointer" :style="{'background-image': 'url('+item.url+')'}"></div>
            </div>
          </div>
        </photo-consumer>
        </photo-provider>
      </div>
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
      <div class="delete_talk">
      <el-tooltip v-if="is_login" effect="dark" content="删除" placement="top">
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

    <el-upload
      :action="api_url"
      list-type="picture-card"
      :file-list="fileList"
      :multiple="false"
      accept="image/*"
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
  </el-upload>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="methods.submit" style="width:100px">发布</el-button>
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
      loading: true,
      upload_headers: {},
      upload_data: { mode: "upload" },
      talkList: [],
      page: 1,
      allpage: 1,
      isLoading: false,
      stopLoding: false,
      talkcontent: null,
      api_url: INIS.api + "/file/upload",
      fileList: [],
      upload_url: [],
      limit: 20,
      login_token: null,
      uploadEnd : true
    });
    const methods = {
      initData() {
        state.login_token = inisHelper.get.storage("login")["login-token"];
        state.upload_headers = { "Authorization": state.login_token,token: INIS.token };
        methods.getTalks(1);
      },
      getTalks(page, limit = state.limit, del = false) {
        if (page == 1) {
          state.page = 1;
          state.isLoading = true;
          state.talkList = [];
        }
        let params = { type: "moving", limit, page };
        GET("comments/type", { params }).then((res) => {
          if (res.data.code == 200) {
            if (del && res.data.data.data.length > state.limit)
              state.allpage = res.data.data.page * 2;
            else state.allpage = res.data.data.page;
            if (page == 1) state.talkList = [];
            state.talkList = state.talkList.concat(res.data.data.data);
            state.page = Math.ceil(state.talkList.length / state.limit);
            if (state.page >= state.allpage) state.stopLoding = true;
            state.isLoading = false;
            state.loading = false;
          }
        });
      },
      async submit() {
        if (state.uploadEnd){
          let location = await methods.loction();
          if (state.talkcontent) {
            let params = {
              content: state.talkcontent,
              "login-token": state.login_token,
              type: "moving",
              opt: {
                address: location,
                uploadfile: state.upload_url
              },
            };
            POST("comments/add", params).then((res) => {
              if (res.data.code == 200) {
                ElMessage({ message: "发布成功", type: "success" });
                state.talkcontent = null;
                methods.getTalks(1);
                store.dispatch("swTalk", false);
                state.fileList = []
                state.upload_url = []
              } else ElMessage({ message: res.data.msg, type: "error" });
            });
          } else {
            ElMessage({ message: "内容为空", type: "warning" });
          }
        }else{
          ElMessage({ message: "图片上传未结束，请稍后！", type: "warning" });
        }
      },
      getAddr(opt) {
        let addr = "";
        let address = opt
        if(opt && opt.hasOwnProperty('address')) address = opt.address
        if (address) {
          if (address.province) addr += address.province;
          if (address.city) addr += address.city;
          if (address.district) addr += address.district;
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
            POST("comments/remove", params).then((res) => {
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
        if (res.code == 200) {
          state.upload_url.push({
            url: res.data,
            name: file.name,
          });
          state.uploadEnd = true
        } else {
          state.uploadEnd = false
          ElNotification({
            title: "文件信息获取失败",
            message: res.msg,
            type: "warning",
          });
        }
        // console.log(state.upload_url)
      },
      beforeUpload(rawFile) {
        state.uploadEnd = false
        // console.log("beforeUpload",rawFile)
        // setTimeout(() => {}, 1000);
      },
      handleRemove(file, fileList) {
        state.upload_url.forEach((item,index)=>{
          if(file.name == item.name){
            state.upload_url.splice(index, 1);
          }
        })
        // console.log("删除后2", fileList);
      },
      handleError(err, file) {
          ElNotification({
            title: "失败",
            message: "文件上传失败",
            type: "error",
          });
      },
      handleStart(e) {
        // console.log(e);
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
  .delete_talk {
    position: absolute;
    top: .5rem;
    right: 1.875rem;
  }
  .delete_talk:hover svg {
    fill: var(--theme-color);
  }
}
.talkimg{
  width: 400px;
  max-width: 400px;
  .talkimgbox{
    width: 33.33%;
    position: relative;
    img {
      cursor: pointer;
      padding: 1px;
      box-sizing: border-box;
      max-height: 400px;
      max-width: 100%;
    }
  }
  .talkimgbox:nth-last-child(2):first-child ~ .talkimgbox,
  .talkimgbox:nth-last-child(2):first-child ,
  .talkimgbox:nth-last-child(4):first-child ~ .talkimgbox,
  .talkimgbox:nth-last-child(4):first-child {
    width: 50%!important;
  }
  .talkimgbox:nth-last-child(1):first-child {
    width: 400px;
    text-align: left;
  }
  .maxw100 {
    max-width: 100%;
  }
}
.talkimgbox1 {
  padding: 1px;
  box-sizing: border-box;
}
</style>
