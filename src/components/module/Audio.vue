<template>
  <div>
    <audio
      ref="audioRef"
      :src="music_info.url"
      controls="controls"
      style="display:none"
      :currentTime="currentTime"
      @ended="methods.ended"
      @canplay="methods.getDuration"
      @timeupdate="methods.onTimeupdate"
      :volume="volume"
    ></audio>
  </div>
</template>

<script>
import { reactive, toRefs, ref, watch } from "vue";
import { mapGetters, useStore } from "vuex";
export default {
  computed: {
    ...mapGetters(["is_play", "music_info","currentTime","volume"]),
  },
  setup() {
    const store = useStore();
    const state = reactive({
      audioRef: ref(null),
    });
    watch(store.state.music, (val) => {
      if (val.is_play) {
        state.audioRef.play();
      } else {
        state.audioRef.pause();
      }
    });
    const methods = {
      getDuration(){
        store.dispatch('duration',Math.round(state.audioRef.duration))
      },
      ended(){
        store.dispatch("playEnded", true); 
      }
    }
    return { ...toRefs(state),methods };
  },
};
</script>

<style lang="less" scoped></style>
