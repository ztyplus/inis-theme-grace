<template>
  <div
    class="message-box p-2 mt-2 text-left"
    v-for="(item, index) in commentList"
    :key="index"
  >
    <div class="topmsg" @click="methods.getSubComments(item.son)">
      <div class="msg-head flex">
        <img :src="item.expand.head_img" class="cursor-pointer" @click="methods.goUrl(item.url)" />
        <div class="info pl-1 w-100">
          <div>
            <div class="name h-60">{{ item.nickname }}
              <span v-if="(item.opt.level && item.opt.level == 'admin')" class="author mr-1">作者</span>
            </div>
            <span
              style="display: inline-block; vertical-align: text-top"
              class="item-text h-40"
              >{{ item.create_time }}</span
            >
          </div>
          <span v-if="allow == 'true' || allow == null" class="reply cursor-pointer transform" @click="methods.Reply(item.id)"
            >回复</span
          >
        </div>
      </div>
      <div class="msg-content text-left pt-2" v-html='"<p>" + item.content.replace(/\n*$/g, "").replace(/\n/g, "</p> <p>") + "</p>"'></div> 
    </div>
    <Comment
      v-if="replyId == item.id"
      :pid="pid"
      :commentType="commentType"
      :articleId="articleId"
      @getWallmasg="methods.getFirst()"
    />
    <div class="sonmsg_box mt-2 pl-1" v-if="item.son.length != 0">
      <div
        class="submsg mb-2 p-1"
        v-for="submsg in methods.getSubComments(item.son)"
        :key="submsg.id"
      >
        <div class="msg-head flex">
          <img :src="submsg.head_img" class="br-50 cursor-pointer" @click="methods.goUrl(item.url)" />
          <div class="info pl-1 w-100">
            <div>
              <div class="name h-60">
                {{ submsg.nickname }} 
                <span v-if="submsg.level && submsg.level == 'admin'" class="author mr-1">作者</span>
                <span class="relyto">@{{ submsg.replyto }}</span>
              </div>
              <span
                style="display: inline-block; vertical-align: text-top"
                class="item-text h-40"
                >{{ submsg.create_time }}</span
              >
            </div>
            <span v-if="allow == 'true' || allow == null" class="reply cursor-pointer transform pr-1" @click="methods.Reply(submsg.id)"
              >回复</span
            >
          </div>
        </div>
        <div class="msg-content text-left pt-2" v-html='"<p>" + submsg.content.replace(/\n*$/g, "").replace(/\n/g, "</p> <p>") + "</p>"'></div>
        <Comment
          v-if="replyId == submsg.id"
          :pid="pid"
          :commentType="commentType"
          :articleId="articleId"
          @getWallmasg="methods.getFirst()"
        />
      </div>
    </div>
  </div>
  <div v-if="commentList.length != 0" class="more-load cursor-pointer mt-2" @click="methods.getComments">
    <div class="justify-center h-100">
      <svg-icon file-name="more" :class="isLoading ? 'rotate' : ''"></svg-icon>
      <span v-if="page <= allpage" class="pl-1 item-text">加载更多...</span>
      <span v-if="page > allpage" class="pl-1 item-text">没有更多内容了</span>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, defineComponent, ref } from "vue";
import { GET } from "@/utils/http/request";
import Comment from "@/components/module/Comment";
export default defineComponent({
  components: { Comment },
  props: ["commentType","articleId","allow"],
  setup(props, ctx) {
    const state = reactive({
      message_type: "message",
      isLoading: false,
      commentList: [],
      type: ref(props.commentType),
      articleId: ref(props.articleId),
      limit: 30,
      page: 1,
      allpage: 1,
      replyId: 0,
      pid: 0,
    });
    const methods = {
      initData() {
        methods.getComments();
      },
      getComments() {
        let api = "comments/type"
        if(state.articleId ) api = "comments"
        if (state.page <= state.allpage) {
          state.isLoading = true;
          let params = {
            type: state.type,
            limit: state.limit,
            page: state.page,
            cache: false,
            article_id: state.articleId
          };
          GET(api, { params }).then((res) => {
            if (res.data.code == 200) {
              state.commentList = state.commentList.concat(res.data.data.data);
              state.allpage = res.data.data.page;
              state.page += 1;
            }
            state.isLoading = false;
          });
        }
      },
      getSubComments(sub) {
        let subList = [];
        methods.recursion(sub, subList);
        subList = methods.sortBy(subList, "id");
        return subList;
      },
      recursion(sub, arr) {
        if (sub.length != 0) {
          sub.forEach((item) => {
            arr.push({
              id: item.id,
              ip: item.ip,
              url: item.url,
              nickname: item.nickname,
              create_time: item.create_time,
              html: item.expand.html,
              content: item.content,
              head_img: item.expand.head_img,
              pid: item.pid,
              replyto: item.expand.pid.nickname,
              level: item.opt.level ? item.opt.level : 'user',
            });
            methods.recursion(item.son, arr);
          });
        }
      },
      // 对象数组根据id排序
      sortBy(arr, key) {
        return arr.sort((a, b) => {
          return a[key] - b[key];
        });
      },
      goUrl(url){
        if(url) {
          window.open("//"+url,"_blank")
        }
      },
      getFirst() {
        let api = "comments/type"
        if(state.articleId ) api = "comments"
        state.pid = 0;
        state.replyId = 0;
        state.page = 1;
        state.isLoading = true;
        state.commentList = [];
        let params = { type: state.type, limit: state.limit, page: 1, cache: false,article_id: state.articleId };
        GET(api, { params }).then((res) => {
          if (res.data.code == 200) {
            // state.commentList.unshift(res.data.data.data[0]);
            state.commentList = res.data.data.data;
            state.allpage = res.data.data.page;
            state.page += 1;
          }
          state.isLoading = false;
        });
      },
      loadComment() {
        if (state.page <= state.allpage) {
          methods.getComments();
        }
      },
      Reply(id) {
        state.replyId = id;
        state.pid = id;
      },
    };

    onMounted(() => {
      methods.initData();
    });
    return { ...toRefs(state), methods };
  },
});
</script>

<style lang="less" scoped>
.author {
  display: inline-block;
  background-color: rgb(254, 44, 85);
  color: #ffffff;
  font-size: 10px!important;
  padding: 2px 4px;
  border-radius: var(--border-radius);
}
.msg-head {
  img {
    height: 2.5rem;
    width: 2.5rem;
    border-radius: var(--border-radius);
  }
  .br-50 {
    border-radius: 50%;
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
.reply {
  color: var(--theme-color);
  font-size: 0.875rem;
  height: 1rem;
  opacity: 0;
  visibility: hidden;
  display: inline-block;
}
.relyto {
  color: var(--theme-color);
}
.topmsg:hover .reply {
  opacity: 1;
  visibility: visible;
}
.submsg:hover .reply {
  opacity: 1;
  visibility: visible;
}
.msg-content {
  color: var(--text-color);
}
 .message-box {
  box-shadow: var(--box-shadow-2);
} 
.submsg {
  border-radius: var(--border-radius);
  background-color: var(--theme-color-4);
}
.more-load  {
  box-shadow: var(--box-shadow-3);
}
</style>
