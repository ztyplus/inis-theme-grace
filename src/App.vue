<template>
  <router-view></router-view>
</template>

<script>
export default {
  setup() {
    console.log(
      "%cCopyright © " + new Date().getFullYear() + "%c" + "相左BLOG",
      "color:white;background:#313a46;padding:3px 7px;border-top-left-radius: 3px;border-bottom-left-radius: 3px;",
      "color:white;background:#727cf5;padding:3px 7px;border-top-right-radius: 3px;border-bottom-right-radius: 3px;"
    );
  },
};
</script>

<style>
@import url(@/assets/css/grace.css);
@import url(@/assets/css/style.css);
</style>
