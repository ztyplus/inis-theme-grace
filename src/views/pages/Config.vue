<template>
  <div class="config text-left">
    <h3>主题配置 V{{version}}</h3>
    <div v-if="version < newVersion" class="mt-2">
      <el-alert
      title="新版本提示！"
      type="warning"
      :description="'当前版本为 V' + version + '，最新版本为 V' + newVersion + '，请前往INIS社区下载更新！'"
      effect="dark"
      show-icon
      />
    </div>
    <el-collapse class="mt-2" v-model="activeNames" :accordion="true">
      <el-collapse-item title="主题开关" name="1">
        <span class="item-text py-1  w-100">
          <strong>自动切换夜间模式 </strong>(8:00-20:00为白天)
        </span>
        <el-radio-group v-model="grace_config.option.autoSwithch" size="small">
          <el-radio :label="true" border>开启</el-radio>
          <el-radio :label="false" border>关闭</el-radio>
        </el-radio-group>

        <span class="item-text py-1 mt-2 w-100">
          <strong>主题模式 </strong>(关闭自动切换有效)
        </span>
        <el-radio-group
          v-model="grace_config.option.day"
          size="small"
          :disabled="grace_config.option.autoSwithch"
        >
          <el-radio :label="true" border>白天</el-radio>
          <el-radio :label="false" border>黑夜</el-radio>
        </el-radio-group>
        <span class="item-text py-1 mt-2 w-100">
          <strong>日夜模式切换动画 </strong>
        </span>
        <el-radio-group v-model="grace_config.option.animation" size="small">
          <el-radio :label="true" border>开启</el-radio>
          <el-radio :label="false" border>关闭</el-radio>
        </el-radio-group>
        <span class="item-text py-1 mt-2 w-100">
          <strong>开启首页歌单</strong>
        </span>
        <el-radio-group v-model="grace_config.option.music" size="small">
          <el-radio :label="true" border>开启</el-radio>
          <el-radio :label="false" border>关闭</el-radio>
        </el-radio-group>
        <span class="item-text py-1 mt-2 w-100">
          <strong>显示自建工具</strong>
        </span>
        <el-radio-group v-model="grace_config.option.tools" size="small">
          <el-radio :label="true" border>开启</el-radio>
          <el-radio :label="false" border>关闭</el-radio>
        </el-radio-group>

      </el-collapse-item>
      <el-collapse-item title="个人信息" name="2">
        <div class="flex mt-1">
          <span class="item-text py-1 mr-2"><strong>昵称</strong></span>
          <el-input :input-style="{'align-items': 'center'}" v-model="grace_config.option.nickname" placeholder="请输入用户昵称" />
        </div>
        <div class="flex mt-1">
          <span class="item-text py-1 mr-2"><strong>描述</strong></span>
          <el-input :input-style="{'align-items': 'center'}" v-model="grace_config.option.description" placeholder="请输入描述" />
        </div>
        <div class="flex mt-1">
          <span class="item-text py-1 mr-2"><strong>头像</strong></span>
          <el-input :input-style="{'align-items': 'center'}" v-model="grace_config.option.avatar" placeholder="" />
        </div>
        <div class="flex mt-1">
          <span class="item-text py-1 mr-2"><strong>QQ</strong></span>
          <el-input :input-style="{'align-items': 'center'}" v-model="grace_config.option.qq" placeholder="" />
        </div>
        <div class="flex mt-1">
          <span class="item-text py-1 mr-2"><strong>微信</strong></span>
          <el-input :input-style="{'align-items': 'center'}" v-model="grace_config.option.wechat" placeholder="" />
        </div>
        <div class="flex mt-1">
          <span class="item-text py-1 mr-2"><strong>邮箱</strong></span>
          <el-input :input-style="{'align-items': 'center'}" v-model="grace_config.option.email" placeholder="" />
        </div>
      </el-collapse-item>
      <el-collapse-item title="站点配置" name="3">
        <!-- <div class="flex mt-1">
          <span class="item-text py-1 mr-2"><strong>标题</strong></span>
          <el-input :input-style="{'align-items': 'center'}" v-model="grace_config.option.title" placeholder="请输入网站标题" />
        </div> -->
        <div class="flex mt-2">
          <span class="item-text py-1 mr-2"><strong>主色</strong></span>
          <el-color-picker
            :show-alpha="false"
            @active-change="methods.colorChange"
            class="mr-2 w-100"
            color-format="hex"
            v-model="grace_config.style.themeColor"
            :predefine="predefineColors"
          />
        </div>
        <div class="flex mt-1">
          <span class="item-text py-1 mr-2"><strong>头图</strong></span>
          <el-input :input-style="{'align-items': 'center'}" v-model="grace_config.option.cover" placeholder="头部默认封面" />
        </div>
        <div class="flex mt-1">
          <span class="item-text py-1 mr-2"><strong>备案</strong></span>
          <el-input :input-style="{'align-items': 'center'}" v-model="grace_config.option.beian" placeholder="请输入网站备案号" />
        </div>
        <div class="flex mt-1 justify-center">
          <span class="item-text py-1 mr-2"><strong>时间</strong></span>
        <el-date-picker
          v-model="grace_config.option.setYear"
          type="year"
          placeholder="建站时间"
          :editable="false"
          :clearable="false"
          value-format="YYYY"
        />
        </div>
      </el-collapse-item>
      <el-collapse-item title="分类配置" name="4">
        <div class="flex mt-1">
          <span class="item-text py-1 mr-2"><strong>日记</strong></span>
          <el-input :input-style="{'align-items': 'center'}" v-model="grace_config.option.diaryId" placeholder="请输入日记分类ID" />
        </div>
        <div class="flex mt-1">
          <span class="item-text py-1 mr-2"><strong>相册</strong></span>
          <el-input :input-style="{'align-items': 'center'}" v-model="grace_config.option.albumId" placeholder="请输入相册分类ID" />
        </div>
        <div class="sort">
          <span class="item-text px-1 mt-1" v-for="item in sortList" :key="item.id">{{item.name}}ID:{{item.id}}</span>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="w-100 text-right">
      <el-button @click="methods.saveConfig" class="mt-2" type="primary">保存</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { GET, POST } from "@/utils/http/request";
import { reactive, toRefs, onMounted } from "vue";
import { inisHelper } from "@/utils/helper";
export default {
  setup() {
    const state = reactive({
      activeNames: ["1"],
      login_token: null,
      version:INIS.version,
      newVersion:null,
      grace_config: {
        style: {
          themeColor: "rgb(121 187 255)",
        },
        option: {
          autoSwithch: true,
          day: true,
          qq: "",
          wechat: "",
          email: "",
          // title: "",
          nickname: "",
          description: "",
          cover: "",  
          beian: "",
          avatar: "",
          diaryId: "",
          albumId: "",
          setYear: "",
          animation: true,
          music: false,
          tools: false,
        },
      },
      sortList: [],
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
      ],
    });
    const methods = {
      initData() {      
        state.login_token = inisHelper.get.storage("login")["login-token"];
        methods.newVersion()
        methods.getConfig()
        methods.getID()
      },
      getConfig(){
        let params = {key: 'config:grace-theme', cache: false}
        GET("options",{params}).then((res)=>{
          if(res.data.code == 200){
            let config = res.data.data.opt
            config = JSON.parse(JSON.stringify(config).replaceAll('"false"','false').replaceAll('"true"','true'))
            state.grace_config = config
            inisHelper.set.storage('grace_config',config)
          }else {
            ElMessage({ message: '获取主题配置失败,请前往配置主题！', type: "error" });
          }
        })
      },
      newVersion(){
        let random = Math.random().toString(36).substr(2);
        axios.get('https://inis.cc/api/theme?id=11?'+ random).then(res => {
          if(res.data.code == 200){
            state.newVersion = res.data.data.data[0].opt.version
          }
        })
      },
      saveConfig() {
        let params = {
          "login-token": state.login_token,
          keys: "config:grace-theme",
          value: "grace主题配置内容",
          opt: {
            style: {
              themeColor: state.grace_config.style.themeColor,
            },
            option: {
              day: state.grace_config.option.day,
              autoSwithch: state.grace_config.option.autoSwithch,
              qq: state.grace_config.option.qq,
              wechat: state.grace_config.option.wechat,
              email: state.grace_config.option.email,
              // title: state.grace_config.option.title,
              nickname: state.grace_config.option.nickname,
              description: state.grace_config.option.description,
              cover: state.grace_config.option.cover,
              beian: state.grace_config.option.beian,
              avatar: state.grace_config.option.avatar,
              diaryId: state.grace_config.option.diaryId,
              albumId: state.grace_config.option.albumId,
              setYear: state.grace_config.option.setYear,
              animation: state.grace_config.option.animation,
              music: state.grace_config.option.music,
              tools: state.grace_config.option.tools,
            },
          },
        };
        POST("options", params).then((res) => {
          if (res.data.code == 200) {
            ElMessage({ message: "保存成功!", type: "success" });
            inisHelper.set.storage("grace_config",params.opt)
            if(!state.grace_config.option.autoSwithch){
              inisHelper.clear.cookie("day")
            }
            location.reload();
          } else {
            ElMessage({ message: res.data.msg, type: "error" });
          }
        });
      },
      getID(){
        let params = {limit: 9999 };
        GET("article-sort",{params}).then((res)=>{
          if(res.data.code == 200){
            state.sortList = res.data.data.data 
          }else {
            ElMessage({ message: "获取分类ID失败", type: "error" });
          }
        })
      },
      colorChange(val) {
        state.grace_config.style.themeColor = val;
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
h3 {
  color: var(--title-color);
}
.item-text {
  width: 2.5rem;
  display: inline-block;
}
.sort {
  text-align: right;
  span {
    width: auto !important;
  }
}
</style>
