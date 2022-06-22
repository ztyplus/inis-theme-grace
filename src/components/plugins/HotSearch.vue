<template>
  <div class="">
    <h3>百度热搜</h3>
    <ul class="text-left mt-4">
      <li
        v-for="item in hotList"
        :key="item.index"
        class="mb-2 p-2 cursor-pointer"
        @click="methods.goHot(item.url)"
      >
        <span class="hot" v-if="item.index != ''">{{ item.index }}</span>
        <span class="top" v-if="item.index == ''">TOP</span>
        <span class="pl-2">{{ item.title }} </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { GET } from "@/utils/http/request";
import { reactive, toRefs, onMounted } from "vue";
export default {
  setup() {
    const state = reactive({
      hotList: [],
    });
    const methods = {
      initData() {
        methods.getHotList();
      },
      getHotList() {
        GET("other/hot").then((res) => {
          if (res.data.code == 200) {
            console.log(res.data.data);
            state.hotList = res.data.data.baidu;
          }
        });
      },
      goHot(url) {
        window.open(url, "_blank");
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
ul {
  list-style: none;
  color: var(--text-color);
  li {
    box-shadow: var(--box-shadow-2);
    border-radius: var(--border-radius);
  }
  li:hover {
    color: var(--theme-color);
  }
  .top,
  .hot {
    display: inline-block;
    width: 1.5rem;
    text-align: center;
    background-color: var(--theme-color);
    font-size: 0.8rem;
    padding: 3px 5px;
    border-radius: 5px;
    font-weight: 700;
    span {
      line-height: 1.5;
    }
  }
  .top {
    color: rgb(232, 11, 11);
  }
  .hot {
    color: rgb(255, 255, 255);
  }
}
</style>
