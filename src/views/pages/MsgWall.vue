<template>
  <div class="massage-box">
    <div class="msghead flex-center mt-1">
      <svg-icon width="2rem" height="2rem" file-name="envelope"></svg-icon>
      <h2 class="pl-2">给我留言</h2>
    </div>

    <div class="card text-left">
      <div class="about article-content" v-html="msgwallInfo"></div>
    </div>

    <div class="wallpanel">
      <Comment commentType="msg_wall" @getWallmasg="methods.getFirst()" />
    </div>
    <MsgCard ref="msgCard" commentType="msg_wall"/>
  </div>
</template>

<script>
import MsgCard from "@/components/module/MsgCard";
import { reactive,toRefs,ref } from '@vue/reactivity';
import Comment from "@/components/module/Comment";
import { onMounted } from '@vue/runtime-core';
import { GET } from "@/utils/http/request";
export default {
  components : { Comment,MsgCard },
  setup(){
    const state = reactive({
      msgCard : ref(null),
      msgwallInfo: "",
    });
    const methods = {
      getFirst(){
        state.msgCard.methods.getFirst();
      },
      getInfo() {
        if (state.msgwallInfo == "") {
          let params = { alias: "msgwall" };
          GET("page", { params }).then((res) => {
            if (res.data.code == 200) {
              state.msgwallInfo = res.data.data.content;
            }
          });
        }
      },
    }
    onMounted(() => {
      methods.getInfo();
    });
    return { ...toRefs(state),methods }
  }
};
</script>

<style lang="less" scoped>
h2 {
  color: var(--h2-color);
}
.massage-box {
  padding: 1rem;
}
</style>
