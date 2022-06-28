<template>
  <div class="main main-card mb-2" :class="$route.meta.css">
    <RouteView />
  </div>
</template>

<script>
import RouteView from "@/components/module/RouteView";
export default {
  name: "MainBox",
  components: { RouteView },
};
</script>

<style lang="less" scoped>
.main {
  background-color: var(--card-bg-color);
}
.talk-pages,
.article-pages,
.message-pages {
  box-shadow: none;
  padding: 0 !important;
  background: none !important;
}
</style>
