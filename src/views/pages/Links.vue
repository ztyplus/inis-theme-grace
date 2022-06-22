<template>
  <Tools />

  <div v-if="friendsList.length != 0">
    <el-divider content-position="center"
      ><span><h3>友情链接</h3></span></el-divider
    >
    <div class="link-post">
      <el-row :gutter="0" class="mt-6 mb-2">
        <el-col v-for="(item, index) in friendsList" :key="index" :span="12" :md="8">
          <a class="link-box m-1 p-2 mb-4" :href="item.url" target="_blank">
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

  <div v-if="websList.length != 0">
    <el-divider content-position="center" class="my-2"
      ><span><h3>宝藏网站</h3></span></el-divider
    >
    <div class="link-post text-left">
      <el-row :gutter="0" class="mt-6 mb-2">
        <el-col v-for="(item, index) in websList" :key="index" :span="12" :md="8">
          <a class="link-box m-1 p-2 mb-2" :href="item.url" target="_blank">
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
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { GET } from "@/utils/http/request";
import SvgIcon from "@/components/tool/SvgIcon.vue";
import Tools from "@/components/Tools";
import { useRouter } from "vue-router";
export default {
  components: { SvgIcon, Tools },
  setup() {
    const router = useRouter();
    const state = reactive({
      friendsList: [],
      toolsList: [],
      websList: [],
    });
    const methods = {
      initData() {
        methods.getLinks(1);
        methods.getLinks(2);
        methods.getLinks(3);
      },
      getLinks(sort_id) {
        let params = {
          where: `sort_id,=,${sort_id};`,
          order: "create_time asc",
          limit: 9999,
        };
        GET("links/sql", { params }).then((res) => {
          if (res.data.code == 200) {
            switch (sort_id) {
              case 1:
                state.friendsList = res.data.data.data;
                break;
              case 2:
                state.toolsList = res.data.data.data;
                break;
              default:
                state.websList = res.data.data.data;
            }
          }
        });
      },
    };

    onMounted(() => {
      methods.initData();
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less" scoped>
.link-box {
  display: block;
  position: relative;
  background: var(--card-bg-color);
  padding: 15px;
  border-radius: 14px;
  box-shadow: var(--box-shadow-2);
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
.link-box::before {
  content: "";
  position: absolute;
  inset: 1px;
  // background: var(--bg-gradient-jet);
  border-radius: inherit;
  z-index: -1;
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
