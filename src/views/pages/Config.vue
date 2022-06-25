<template>
  <div class="config text-left">
    <h3>主题配置</h3>
    <el-collapse class="mt-4" v-model="activeNames" :accordion="true">
      <el-collapse-item title="样式设置" name="1">
        <span class="item-text py-1 w-100">
          <strong>主题色：</strong>
        </span>
        <div class="flex">
          <el-color-picker
            :show-alpha="true"
            @active-change="methods.colorChange"
            class="mr-2"
            v-model="grace_config.style.themeColor"
            :predefine="predefineColors"
          />
          <el-input
            :input-style="{
              'background-color': `${grace_config.style.themeColor}!important`,
              cursor: 'pointer',
            }"
            :readonly="true"
            :disabled="true"
          />
        </div>

        <span class="item-text py-1 mt-2 w-100">
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
      </el-collapse-item>
      <el-collapse-item title="个人信息" name="2">
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
        <div class="flex mt-1">
          <span class="item-text py-1 mr-2"><strong>标题</strong></span>
          <el-input :input-style="{'align-items': 'center'}" v-model="grace_config.option.title" placeholder="请输入站点标题" />
        </div>
        <div class="flex mt-1">
          <span class="item-text py-1 mr-2"><strong>描述</strong></span>
          <el-input :input-style="{'align-items': 'center'}" v-model="grace_config.option.description" placeholder="请输入站点描述" />
        </div>
        <div class="flex mt-1">
          <span class="item-text py-1 mr-2"><strong>封面</strong></span>
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
import { GET, POST } from "@/utils/http/request";
import { reactive, toRefs, onMounted } from "vue";
import { inisHelper } from "@/utils/helper";
export default {
  setup() {
    const state = reactive({
      activeNames: ["1"],
      login_token: null,
      grace_config: {
        style: {
          themeColor: "#79bbff",
        },
        option: {
          autoSwithch: true,
          day: true,
          qq: "",
          wechat: "",
          email: "",
          title: "",
          description: "",
          cover: "",
          beian: "",
          avatar: "",
          diaryId: "",
          albumId: "",
          setYear: ""
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
              title: state.grace_config.option.title,
              description: state.grace_config.option.description,
              cover: state.grace_config.option.cover,
              beian: state.grace_config.option.beian,
              avatar: state.grace_config.option.avatar,
              diaryId: state.grace_config.option.diaryId,
              albumId: state.grace_config.option.albumId,
              setYear: state.grace_config.option.setYear,
            },
          },
        };
        POST("options", params).then((res) => {
          if (res.data.code == 200) {
            ElMessage({ message: "保存成功!", type: "success" });
            inisHelper.set.storage("grace_config",params.opt)
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
