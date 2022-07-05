<template>
  <div v-if="album" class="album">
    <div class="head">
      <h2 class="text-left m-0 pt-2 pb-0 border-none">{{ album.title }}</h2>
      <div class="meta text-left pt-1">
        <span>发布{{ album.create_time.split(" ")[0] }}</span>
        <el-divider direction="vertical" />
        <span>浏览{{ album.views }}</span>
      </div>
      <el-divider content-position="right" class="my-2">
        <span>★ 更新于{{ create_time }}</span>
      </el-divider>
    </div>

    <photo-provider
      :photoClosable="true"
      :shouldTransition="true"
      :default-backdrop-opacity="0.9"
      :loop="true"
    >
      <el-row :gutter="0">
        <el-col
          v-for="(item, index) in albumlist"
          :key="index"
          :span="12"
          :xs="24"
          :md="8"
        >
          <div class="imgbox layout-169 m-1">
            <div class="layout-card cursor-pointer">
              <photo-consumer :intro="item.src" class="item" :src="item.src">
                <img :src="item.src" class="view-box wh-100 transform" />
              </photo-consumer>
            </div>
          </div>
        </el-col>
      </el-row>
    </photo-provider>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { reactive, toRefs, onMounted } from "vue";
import { GET } from "@/utils/http/request";
import { inisHelper } from "@/utils/helper";
import iLink from "@/components/tool/Link";
export default {
  components: { iLink },
  setup() {
    const route = useRoute();
    const store = useStore();
    const state = reactive({
      album: null,
      albumlist: [],
      create_time: null,
    });
    const methods = {
      initData() {
        methods.getAlbum();
      },
      getAlbum() {
        let params = { id: route.params.id };
        GET("article", { params }).then((res) => {
          if (res.data.code == 200) {
            state.album = res.data.data;
            document.title =  INIS.title + " - " + state.album.title
            state.albumlist = res.data.data.expand.images;
            let timestamp = inisHelper.date.to.time(res.data.data.create_time);
            state.create_time = inisHelper.time.nature(timestamp, 5);
            store.dispatch("headCover", res.data.data.img_src);
          }
        });
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
h2 {
  color: var(--h1-color);
}
.meta {
  span {
    color: var(--h2-color);
    font-size: 0.8rem;
    font-weight: 500;
  }
}
.PhotoConsumer {
  img:hover {
    transform: scale(1.02);
    filter: saturate(1.75);
  }
}
</style>
