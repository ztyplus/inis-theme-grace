<template>
  <div>
    <h3>主题配置</h3>
  </div>
  <el-collapse class="mt-4" v-model="activeNames" @change="handleChange">
    <el-collapse-item title="Feedback" name="1">
      <div>
        Operation feedback: enable the users to clearly perceive their operations by style
        updates and interactive effects;
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import { GET } from "@/utils/http/request";
import { reactive, toRefs, onMounted } from "vue";
export default {
  setup() {
    const state = reactive({
      activeNames: [],
    });
    const methods = {
      initData() {},
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
</style>
