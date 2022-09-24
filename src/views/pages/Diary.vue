<template>

    <div class="diary" v-if="loading">
      <el-skeleton class="text-left m-0 pt-2 pb-0 border-none h2s" :loading="loading" animated>
        <template #template>
          <el-skeleton-item variant="h1" style="width: 60% " class="h2s"/>
        </template>
      </el-skeleton>
      <el-skeleton class="meta text-left pt-1" :loading="loading" animated>
        <template #template>
          <el-skeleton-item variant="text" style="width: 5rem; height: 1rem" class="mr-1"/>
          <el-skeleton-item variant="text" style="width: 4rem; height: 1rem" class="mr-1"/>
          <el-skeleton-item variant="text" style="width: 4rem; height: 1rem" class="mr-1"/>
        </template>
      </el-skeleton>
      <el-skeleton class="article-content text-left my-2 pt-2" :rows="22" :loading="loading" animated/>
    </div>

  <div v-if="!loading" class="diary">
    <div v-if="diary_data.code == 200">
      <div class="head">
        <h2 class="text-left m-0 pt-2 pb-0 border-none">{{ diary_data.data.title }}</h2>
        <div class="meta text-left pt-1">
          <span>发布{{ diary_data.data.create_time.split(" ")[0] }}</span>
          <el-divider direction="vertical" />
          <span>字数{{ diary_data.data.font_count }}</span>
        </div>
        <el-divider content-position="right" class="my-2"> </el-divider>
      </div>
      <div
        class="diary-content text-left mt-2"
        v-diary
        v-html="diary_data.data.content"
      ></div>
      <span class="date item-text">{{ diary_data.data.create_time }}</span>
    </div>
    <div v-if="diary_data.code == 405">
      <el-dialog
        :model-value="diary_data.code == 405"
        width="30%"
        :show-close="false"
        destroy-on-close
        custom-class="cus-dialog"
        center
        title="输入密码访问"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form>
          <el-form-item>
            <el-input v-model="password" type="password" placeholder="请输入日记密码" @keyup.enter="methods.getDiary(password)">
              <template #prefix>
                <svg-icon file-name="password" fill="var(--h2-color)"></svg-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="info" @click="$router.go(-1)">返回</el-button>
            <el-button type="primary" @click="methods.getDiary(password)">提交</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div v-if="diary_data.code == 403">
      <el-empty :description="diary_data.msg" image="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjU1NDQ1MDEzOTQ2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjY5MzYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj5AZm9udC1mYWNlIHsgZm9udC1mYW1pbHk6IGVsZW1lbnQtaWNvbnM7IHNyYzogdXJsKCJjaHJvbWUtZXh0ZW5zaW9uOi8vbW9vbWJlb2Rmb21kcGpucG9jb2JlbW9pYWVtZWRua2cvZm9udHMvZWxlbWVudC1pY29ucy53b2ZmIikgZm9ybWF0KCJ3b2ZmIiksIHVybCgiY2hyb21lLWV4dGVuc2lvbjovL21vb21iZW9kZm9tZHBqbnBvY29iZW1vaWFlbWVkbmtnL2ZvbnRzL2VsZW1lbnQtaWNvbnMudHRmICIpIGZvcm1hdCgidHJ1ZXR5cGUiKTsgfQpAZm9udC1mYWNlIHsgZm9udC1mYW1pbHk6IGZlZWRiYWNrLWljb25mb250OyBzcmM6IHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xMDMxMTU4X3U2OXc4eWh4ZHUud29mZjI/dD0xNjMwMDMzNzU5OTQ0IikgZm9ybWF0KCJ3b2ZmMiIpLCB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTAzMTE1OF91Njl3OHloeGR1LndvZmY/dD0xNjMwMDMzNzU5OTQ0IikgZm9ybWF0KCJ3b2ZmIiksIHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xMDMxMTU4X3U2OXc4eWh4ZHUudHRmP3Q9MTYzMDAzMzc1OTk0NCIpIGZvcm1hdCgidHJ1ZXR5cGUiKTsgfQo8L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEyIDY0LjFjMTI2LjA5MyA1NS44MjYgMjUyLjE4NyA5NC4zNzMgMzc4LjI4IDExNS42NHYzMzUuMzIzYzAgMTIwLjYyMS02MC4zOTUgMjMzLjIzLTE2MC44NzQgMjk5Ljk1OEw1MTIgOTU5LjQgMjk0LjU5NCA4MTUuMDJDMTk0LjExNCA3NDguMjkzIDEzMy43MiA2MzUuNjg0IDEzMy43MiA1MTUuMDYzVjE3OS43NDFDMjU5LjgxMyAxNTguNDczIDM4NS45MDcgMTE5LjkyNiA1MTIgNjQuMXoiIGZpbGw9IiNDNUM1QzUiIGZpbGwtb3BhY2l0eT0iLjUiIHAtaWQ9IjY5MzciPjwvcGF0aD48cGF0aCBkPSJNMzY3LjcxNCA0ODYuODc4Yy0xNS44NjUgMTguMS0yNS4zNzMgNDEuOTEtMjUuMzczIDY4LjMgMCA1Ny44ODQgNDUuNzUgMTAzLjM2NCAxMDMuOTc3IDEwMy4zNjQgMjYuMDUzIDAgNDkuNjEtOS4xMDYgNjcuNjg2LTI0LjM1NHYzMjMuODhMNTEyIDk1OS40IDI5NC41OTQgODE1LjAyQzE5NC4xMTQgNzQ4LjI5MyAxMzMuNzIgNjM1LjY4NCAxMzMuNzIgNTE1LjA2M3YtMjguMTg1aDIzMy45OTR6IG03OC42MDQgNi4yOGMzNS4zNTIgMCA2Mi4zODYgMjYuODc2IDYyLjM4NiA2Mi4wMiAwIDM1LjE0My0yNy4wMzQgNjIuMDE4LTYyLjM4NiA2Mi4wMTgtMzMuMjczIDAtNjIuMzg2LTI2Ljg3NS02Mi4zODYtNjIuMDE4IDAtMzUuMTQ0IDI3LjAzNC02Mi4wMiA2Mi4zODYtNjIuMDJ6TTUxMiA2NC4xMDJjMTI2LjA5MyA1NS44MjUgMjUyLjE4NyA5NC4zNzIgMzc4LjI4IDExNS42NHYzMDkuMjMxSDU0Ni4xOTJsMTEwLjE2LTEwOS41MTQtNTEuOTg5LTUxLjY4Mi0yOS4xMTQgMjguOTQyIDIyLjg3NSAyMi43NC0xNC41NTYgMTQuNDcxLTIyLjg3NS0yMi43NC0yOS4xMTQgMjguOTQyIDIyLjg3NSAyMi43NC00Mi41NTIgNDIuMjk0VjY0LjE0NGwwLjA5OC0wLjA0M3oiIGZpbGw9IiNBQkFCQUIiIGZpbGwtb3BhY2l0eT0iLjQ1IiBwLWlkPSI2OTM4Ij48L3BhdGg+PHBhdGggZD0iTTUzNS43MzggNDk5LjM2YzEwLjM5OCAxNi41NCAxNC41NTcgMzUuMTQ1IDE0LjU1NyA1NS44MTggMCA1Ny44ODQtNDUuNzUgMTAzLjM2NC0xMDMuOTc3IDEwMy4zNjQtNTguMjI3IDAtMTAzLjk3Ny00NS40OC0xMDMuOTc3LTEwMy4zNjQgMC01Ny44ODUgNDUuNzUtMTAzLjM2NSAxMDMuOTc3LTEwMy4zNjUgMjIuODc1IDAgNDEuNTkgNi4yMDIgNjAuMzA3IDE4LjYwNmw0Ny44MjktNDcuNTQ4LTIyLjg3NS0yMi43NCAyOS4xMTQtMjguOTQyIDIyLjg3NSAyMi43NCAxNC41NTYtMTQuNDcxLTIyLjg3NS0yMi43NCAyOS4xMTQtMjguOTQyIDUxLjk4OSA1MS42ODJMNTM1LjczOCA0OTkuMzZ6IG0tODkuNDIgMTE3LjgzNmMzNS4zNTIgMCA2Mi4zODYtMjYuODc1IDYyLjM4Ni02Mi4wMTggMC0zNS4xNDQtMjcuMDM0LTYyLjAyLTYyLjM4Ni02Mi4wMi0zNS4zNTIgMC02Mi4zODYgMjYuODc2LTYyLjM4NiA2Mi4wMiAwIDM1LjE0MyAyOS4xMTMgNjIuMDE4IDYyLjM4NiA2Mi4wMTh6IiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9Ii4zMDIiIHAtaWQ9IjY5MzkiPjwvcGF0aD48L3N2Zz4=" />
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { reactive, toRefs, onMounted,onUnmounted } from "vue";
import { GET } from "@/utils/http/request";
import iLink from "@/components/tool/Link";
import { inisHelper } from "@/utils/helper";
import { useStore } from "vuex"
export default {
  components: { iLink },
  setup() {
    const route = useRoute();
    const store = useStore();
    const state = reactive({
      loading:true,
      diary_data: null,
      password: null,
    });
    const methods = {
      initData() {
        methods.getDiary();
      },
      getDiary(password) {
        let diary_pass = inisHelper.get.cookie(`diaryPassword_${route.params.id}`);
        if (!diary_pass) {
          diary_pass = password;
        }
        let params = { id: route.params.id, password: diary_pass };
        GET("article", { params }).then((res) => {
          if (res.status == 200) {
            state.diary_data = res.data;
            store.dispatch("headCover", res.data.data.img_src)
            document.title =  INIS.title + " - " + state.diary_data.data.title
            state.loading = false
            // console.log('res.data: ', res.data.data.img_src);
            if (password && res.data.code == 200) {
              inisHelper.set.cookie(`diaryPassword_${route.params.id}`, password, 7200);
            }
          }else{
            inisHelper.clear.cookie(`diaryPassword_${route.params.id}`)
          }
        });
      },
    };
    onMounted(() => {
      methods.initData();
    });
    onUnmounted(()=> {
      store.dispatch("headCover", null);
    })
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
.date {
  display: inline-block;
  text-align: right;
  width: 100%;
}
</style>
