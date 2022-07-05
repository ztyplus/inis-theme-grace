<template>

  <div class="indexcard pt-2 article text-left mb-4">
    <div class="about article-content" v-html="linksInfo" @click="methods.clickEvent"></div>
  </div>


  <div v-if="linkList.length != 0">
    <el-divider content-position="center"
      ><span><h3>{{linkList[0].name}}</h3></span></el-divider
    >
    <div class="link-post">
      <el-row :gutter="0" class="mt-6 mb-2">
        <el-col v-show="item.is_show == 1" v-for="(item, index) in linkList[0].data" :key="index" :span="12" :md="8">
          <a class="link-box shadow-box m-1 p-2 mb-4" :href="item.url" target="_blank">
            <div class="avatar">
              <img class="transform wh-100" :src="item.head_img" />
            </div>
            <h4 class="text-left h-1x" style="padding-left: 5rem">{{ item.name }}</h4>
            <p class="h-2x text-left pt-2">{{ item.description }}</p>
          </a>
        </el-col>
      </el-row>
    </div>
  </div>

  <div v-if="linkList.length >= 2">
    <div v-for="(list,index) in linkList.slice(1,linkList.length)" :key="index">
      <div v-if="list.count != 0">
          <el-divider content-position="center" class="my-2"><span><h3>{{list.name}}</h3></span></el-divider>
          <div class="link-post text-left">
            <el-row :gutter="0" class="mt-4 mb-2">
              <el-col v-show="item.is_show == 1" v-for="(item, index) in list.data" :key="index" :span="12" :md="8">
                <a v-if="item.is_show == 1" class="link-box shadow-box m-1 p-2 mb-2" :href="item.url" target="_blank">
                  <div class="flex">
                    <img class="transform" :src="item.head_img" />
                    <h4 class="text-left h-1x pl-1">{{ item.name }}</h4>
                  </div>
                  <p class="h-2x text-left pt-1">{{ item.description }}</p>
                </a>
              </el-col>
            </el-row>
          </div>
      </div>
    </div>
  </div>

  <div class="mt-4">
    <Tools v-if="tools" />
  </div>

</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { GET } from "@/utils/http/request";
import SvgIcon from "@/components/tool/SvgIcon.vue";
import Tools from "@/components/Tools";
import { inisHelper } from "@/utils/helper";
export default {
  components: { SvgIcon, Tools },
  setup() {
    const grace_config = inisHelper.get.storage("grace_config")
    const state = reactive({
      tools: (grace_config && grace_config.option.tools ? grace_config.option.tools : false),
      linksInfo: "",
      sortList: [],
      linkList: [],
    });
    const methods = {
      initData() {
        methods.getLinkSort();
        methods.getlinksInfo();
      },
      getLinkSort(){
        let params = {limit: 9999,order: "create_time asc",}
        GET("links-sort", {params}).then(res => {
          if (res.data.code == 200) {
            state.sortList = res.data.data.data
            state.sortList.forEach((item,index) => {
              methods.getLinks(item.id,index,item.name)
            })
          }
        })
      },
      getLinks(sort_id,index,name) {
        let params = {where: `sort_id,=,${sort_id};`,order: "create_time asc",limit: 9999,};
        GET("links/sql", { params }).then((res) => {
          if (res.data.code == 200) {
            res.data.data.index = index
            res.data.data.name = name
            state.linkList = state.linkList.concat(res.data.data)
            state.linkList = state.linkList.sort(methods.sortBy('index'))
          }
        });
      },
      sortBy (field) {
        return (x, y) => {
          return x[field] - y[field]
        }
      },
      addClass(element,csName){
        if(!methods.hasClass(element,csName)){ element.className+=' '+csName; }
      },
      hasClass(element,csName){ return 　element.className.match(RegExp('(\\s|^)'+csName+'(\\s|$)'));  },
      clickEvent(e) {
        if (e.target.nodeName == "IMG" && e.target.className != "emoji-img") {
          state.imgList.forEach((item, index) => {
            if (e.target.src.indexOf(item) !== -1) {
              state.initialIndex = index;
            }
          });
          state.imgVisible = true;
        }else if (e.target.nodeName == "LI" && e.target.className == "nav-item"){
          var list = e.target.parentNode.querySelectorAll('li')
          list.forEach((item) => {
            item.children[0].classList.remove("active")
          })
          e.target.children[0].classList.add("active");
          var tab = e.target.children[0].href.split("#")[1]
          if(tab){
            var tabdom = document.getElementById(tab)
            tabdom.parentNode.childNodes.forEach((item) => {
              if(item.nodeName == "DIV"){
                item.setAttribute("class","tab-pane")
              }
            })
            if (tabdom.classList.value.indexOf("show active") == -1) {
              methods.addClass(tabdom, "show active");
            }
          }
        }
      },
      getlinksInfo(){
        if (state.linksInfo == "") {
          let params = { alias: "links" };
          GET("page", { params }).then((res) => {
            if (res.data.code == 200) {
              state.linksInfo = res.data.data.content;
              res.data.time = 3600;
            }
          });
        }
      }
    };

    onMounted(() => {
      methods.initData();
    });
    return {
      ...toRefs(state),methods
    };
  },
};
</script>

<style lang="less" scoped>
.link-box {
  cursor: pointer;
  z-index: 1;
  .avatar {
    height: 3.6rem;
    width: 3.6rem;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(1.4rem, -1.2rem);
    border-radius: 16px;
    border: 1px solid var(--border-color);
    overflow: hidden;
  }
  img {
    height: 3rem;
    width: 3rem;
    border-radius: 16px;
  }
  h4 {
    font-size: 1.1rem;
    color: var(--card-title-color);
  }
  p {
    color: var(--text-color);
    line-height: 1.5rem;
    height: 3rem;
  }
}
.link-box:hover img,
.link-box:hover svg {
  transform: scale(1.08);
}
.link-box:hover h4 {
  color: var(--theme-color);
}
.flex {
  align-items: center;
}
</style>
