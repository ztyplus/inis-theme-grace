<template>
  <router-view></router-view>
</template>

<script>
import { inisHelper } from '@/utils/helper'
export default {
  setup(){
    let time = inisHelper.date.to.time(Date.now())
    const date = inisHelper.time.timeToDate(time,"Y/M/D").split('/')[0]
    console.log("%cCopyright © "+ date +"%c"+"相左BLOG",
      "color:white;background:#313a46;padding:3px 7px;border-top-left-radius: 3px;border-bottom-left-radius: 3px;",
      "color:white;background:#727cf5;padding:3px 7px;border-top-right-radius: 3px;border-bottom-right-radius: 3px;"
    )
  }
}
</script>


<style>
@import url(@/assets/css/grace.css);
@import url(@/assets/css/style.css);
/* @import url(@/assets/css/markdown.css); */
</style>