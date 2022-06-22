<template>
  <div class="massage-box p-2">
    <div class="msghead flex-center mt-1">
      <svg-icon width="2rem" height="2rem" file-name="envelope"></svg-icon>
      <h2 class="pl-2">给我留言</h2>
    </div>
    <Comment :commentType="message_type" @getWallmasg="methods.getFirst()" />
  </div>
  <div
    class="message-pages p-2 mt-2 text-left"
    v-for="(item, index) in commentList"
    :key="index"
  >
    <div class="msg-head flex">
      <img :src="item.expand.head_img" class="br-50" />
      <div class="info pl-1 w-100">
        <div>
          <div class="name h-60">{{ item.nickname }}</div>
          <span
            style="display: inline-block; vertical-align: text-top"
            class="item-text h-40"
            >{{ item.create_time }}</span
          >
        </div>
      </div>
    </div>
    <div class="msg-content text-left pt-2" v-html="item.expand.html"></div>
  </div>
  <!-- <div class="more-load cursor-pointer mt-2" @click="methods.getComments">
    <div class="justify-center h-100">
      <svg-icon file-name="more" :class="isLoading ? 'rotate': ''"></svg-icon>
      <span v-if="page<=allpage" class="pl-1 item-text">加载更多...</span>
      <span v-if="page>allpage" class="pl-1 item-text">没有更多内容了</span>
    </div>
  </div> -->
</template>

<script>
import Comment from "@/components/tool/Comment";
import { reactive, toRefs, onMounted } from "vue";
import { GET } from "@/utils/http/request";
export default {
  components: { Comment },
  setup() {
    const state = reactive({
      message_type: "message",
      isLoading: false,
      commentList: [],
      limit: 9999,
      page: 1,
      allpage: null,
    });
    const methods = {
      initData() {
        methods.getComments();
      },
      getComments(page = state.page, limit = state.limit) {
        state.isLoading = true;
        let params = { type: "msg_wall", limit, page, cache: false };
        GET("comments", { params }).then((res) => {
          if (res.data.code == 200) {
            state.commentList = res.data.data.data;
            state.allpage = res.data.data.page;
            state.page += 1;
          }
          state.isLoading = false;
        });
      },
      getFirst() {
        state.isLoading = true;
        let params = { type: "msg_wall", limit: 1, page: 1, cache: false };
        GET("comments", { params }).then((res) => {
          if (res.data.code == 200) {
            state.commentList.unshift(res.data.data.data[0]);
          }
          state.isLoading = false;
        });
      },
      loadComment() {
        if (state.page <= state.allpage) {
          methods.getComments();
        }
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
  color: var(--h2-color);
}
.massage-box,
.message-pages {
  background-color: var(--card-bg-color);
  border-radius: var(--border-radius);
}
.msg-head {
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
  .name {
    color: var(--h2-color);
    font-size: 0.875rem;
    font-weight: 600;
  }
}
.msg-content {
  color: var(--text-color);
}
</style>
