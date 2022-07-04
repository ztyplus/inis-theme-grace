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
            <el-input v-model="password" placeholder="请输入日记密码">
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
      <el-empty :description="diary_data.msg" image="static/svg/permission.svg" />
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { reactive, toRefs, onMounted } from "vue";
import { GET } from "@/utils/http/request";
import iLink from "@/components/tool/Link";
import { inisHelper } from "@/utils/helper";
export default {
  components: { iLink },
  setup() {
    const route = useRoute();
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
            state.loading = false
            if (password && res.data.code == 200) {
              inisHelper.set.cookie(`diaryPassword_${route.params.id}`, password, 7200);
            }
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
.date {
  display: inline-block;
  text-align: right;
  width: 100%;
}
</style>
