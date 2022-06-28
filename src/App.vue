<template>
  <router-view></router-view>
  <Audio />
</template>

<script>
import Audio from "@/components/module/Audio"
export default {
  components: { Audio },
  setup(){
    console.log("%cCopyright © "+ new Date().getFullYear() +"%c"+INIS.title,
      "color:white;background:#313a46;padding:3px 7px;border-top-left-radius: 3px;border-bottom-left-radius: 3px;",
      "color:white;background:#727cf5;padding:3px 7px;border-top-right-radius: 3px;border-bottom-right-radius: 3px;"
    )
  }
}
</script>


<style>
@import url(@/assets/css/grace.css);
@import url(@/assets/css/style.css);
@import url(@/assets/css/markdown.css);
</style>