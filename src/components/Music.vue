<template>
  <div class="music-box shadow-box">
    <div class="flex">
      <div class="cover cursor-pointer" :class="play? 'rotate': ''" :style="{'background-image':`url(${music.cover})`}"></div>
      <div class="music_info text-left ">
        <div class="mt-1">
          <span class="title">{{music.name}}</span>
          <span class="singer item-text">    演唱：{{music.author}}</span>
        </div>
        <div class="w-100 control flex-center justify-center my-1">
          <svg-icon fileName="pre" height="1.5rem" width="1.5rem" @click="methods.preMusic"></svg-icon>
          <svg-icon v-show="!play" fileName="play" height="2rem" width="2rem" @click="methods.handlePauseOrPlay"></svg-icon>
          <svg-icon v-show="play" fileName="pause" height="2rem" width="2rem" @click="methods.handlePauseOrPlay"></svg-icon>
          <svg-icon fileName="next" height="1.5rem" width="1.5rem" @click="methods.nextMusic"></svg-icon>
          <svg-icon v-show="mode == 0" fileName="loop" height="1.5rem" width="1.5rem" @click="methods.swMode"></svg-icon>
          <svg-icon v-show="mode == 1" fileName="random" height="1.5rem" width="1.5rem" @click="methods.swMode"></svg-icon>
          <svg-icon v-show="mode == 2" fileName="singleloop" height="1.5rem" width="1.5rem" @click="methods.swMode"></svg-icon>
        </div>
        <div class="w-100 progress-slide flex-center">
          <span class="item-text pr-1">{{methods.toTime(progress)}}</span>
          <el-slider 
            v-model="progress" 
            :show-tooltip="false"
            size="small"
            :max="duration"
            @input="methods.Seeked"
            class="play-music"
          />
          <span class="item-text pl-1">{{methods.toTime(duration)}}</span>
          <div class="vioce-control cursor-pointer">
            <el-slider 
              v-show="showVolume"
              class="vioce-bar"
              v-model="volume" 
              vertical 
              height="3.5rem"
              :max="1"
              :show-tooltip="false"
              :step="0.05"
              @input="methods.changeVolume"
            />
            <div class="vioceicon justify-center" @click="methods.showVolume">
              <span v-show="volume != 0" class="ml-1"><svg-icon fileName="voice" height="1.5rem" width="1.5rem"></svg-icon></span>
              <span v-show="volume == 0" class="ml-1"><svg-icon fileName="mute" height="1.5rem" width="1.5rem"></svg-icon></span>
            </div>
          </div>
          <span @click="methods.Collapse" class="ml-1 cursor-pointer"><svg-icon fileName="playlist" height="1.5rem" width="1.5rem"></svg-icon></span>
        </div>
      </div>
    </div>
    <div class="music-list transform text-left" :class="!showSheet ? 'hide-music-list': ''">
      <el-divider v-show="showSheet" content-position="center" class="text-center mt-2">
        <span class="text-center cursor-pointer">{{ musicList.info.title }}</span>
      </el-divider>
      <ul class="">
        <li
          v-for="(item,index) in musicList.songs"
          :key="item.song_id"
          class="cursor-pointer my-1 music-item p-1 justify-center"
          @click="methods.swMusic(item.song_id, musicList.info.expand.type,index)"
        >
        <span >{{index + 1}}</span>
        <img :src="item.cover" class="mr-1">
        <div class="flex w-100" style="justify-content: space-between;">
          <p class="h-1x music-name">{{ item.name }}</p>
          <p class="item-text ml-2 mr-2 h-1x">{{ item.author }}</p>
        </div>
        </li>
      </ul>
      <div class="sheet flex justify-center mt-2">
        <span class="mr-2">歌单选择</span>
        <el-select v-model="sheetId" class="m-2 " placeholder="请选择歌单" @change="methods.swSheet">
        <el-option
          v-for="(item,index) in musicSheetList"
          :key="index"
          :label="item.title"
          :value="item.id"
        />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs,watch,onBeforeUnmount,ref } from "vue";
import { mapGetters, useStore } from "vuex";
import { onMounted } from "@vue/runtime-core";
import { GET } from "@/utils/http/request";
import SvgIcon from './tool/SvgIcon.vue';
export default {
  components: { SvgIcon },
  computed: {
    ...mapGetters(['duration','showVolume'])
  },
  setup() {
    const store = useStore();
    const state = reactive({
      mode: 0,
      play: false,
      musicSheetList: [], //歌单列表
      musicSheet: {},     //当前歌单
      musicList: {},      //当前歌单歌曲列表
      music: {},          //当前播放音乐
      progress: 0,        //播放进度
      volume: 0.7,
      showVolume: false,
      showSheet: false,
      sheetLength: 0,
      index: 0,
      sheetId: 0
    });
    watch(store.state.music_control, (val) => {
      state.progress = val.currentTime
      state.volume = val.volume
    });
    watch(store.state.music_pregres, (val) => {
      if(val.ended){
        if(state.mode == 0){
          methods.nextMusic()
        }else if(state.mode == 1){
          state.index = Math.floor(Math.random() * state.sheetLength)
          state.progress = 0
          methods.swMusic(state.musicList.songs[state.index].song_id,state.musicSheet.expand.type,state.index)
        }else {
          state.progress = 0
          methods.swMusic(state.musicList.songs[state.index].song_id,state.musicSheet.expand.type,state.index)         
        }
      }
    });
    let timer = setInterval(() => {
      if(state.play  ){
        state.progress += 1; //播放进度+1s
      }
    }, 1000)
    const methods = {
      async initData() {
        await methods.getSheetInfo();
        await methods.getMusicList(state.sheetId);
        await methods.getMusic(state.musicList.songs[state.index].song_id,state.musicSheet.expand.type)
        store.dispatch("getMusic", state.music);
      },
      async getSheetInfo() {
        await GET("music").then((res) => {
          if (res.data.code == 200) {
            state.musicSheetList = res.data.data.data;
            state.musicSheet = res.data.data.data[0];
            state.sheetId = res.data.data.data[0].id
          }
        });
      },
      async getMusicList(id) {
        let params = { id,mode:'list' };
        await GET("music", { params }).then((res) => {
          if (res.data.code == 200) {
            state.musicList = res.data.data;
            state.sheetLength = res.data.data.songs.length;
          }
        });
      },
      handlePauseOrPlay() {
        state.play = !state.play;
        store.dispatch("musicPlay", state.play);
      },
      async getMusic(id, type) {
        let params = {
          id,
          mode: "song",
          who: type,
        };
        await GET("music", { params }).then((res) => {
          if ((res.data.code = 200)) {
            state.music = res.data.data;
          }
        });
      },
      async swMusic(id,type,index){
        state.index = index
        await methods.getMusic(id, type)
        await store.dispatch("getMusic", state.music);
        methods.handlePauseOrPlay()
        state.play = true;
        state.progress = 0
        store.dispatch('currentTime',0)
        store.dispatch("musicPlay", state.play);  
      },
      swMode(){
        if(state.mode == 2){
          state.mode = 0
        }else {
          state.mode += 1
        }
      },
      toTime(sec) { 
        let s = sec % 60 < 10 ? ('0' + sec % 60) : sec % 60
        let min = Math.floor(sec / 60) < 10 ? ('0' + Math.floor(sec / 60)) : Math.floor(sec / 60)
        return min + ':' + s
      },
      Seeked(val){
        store.dispatch('currentTime',val)
        state.play = true;
        store.dispatch("musicPlay", state.play); 
        store.dispatch("playEnded", false); 
      },
      changeVolume(val){
        store.dispatch("volume", val); 
      },
      showVolume(){
        state.showVolume = !state.showVolume
      },
      Collapse(){
        state.showSheet = !state.showSheet
      },
      nextMusic(){
        if(state.index == state.sheetLength -1){
          state.index = 0
        }else {
          state.index += 1
        }
        methods.swMusic(state.musicList.songs[state.index].song_id,state.musicSheet.expand.type,state.index)
      },
      preMusic(){
        if(state.index == 0){
          state.index = state.sheetLength -1
        }else {
          state.index -= 1
        }
        methods.swMusic(state.musicList.songs[state.index].song_id,state.musicSheet.expand.type,state.index)
      },
      async swSheet(val){
        state.index = 0
        state.play = false
        state.progress = 0
        store.dispatch("musicPlay", state.play);
        store.dispatch("currentTime", 0);
        await methods.getMusicList(val);
        await methods.getMusic(state.musicList.songs[state.index].song_id,state.musicList.info.expand.type)
        store.dispatch("getMusic", state.music);
      }
    };
    onMounted(() => {
      methods.initData();
    });
    onBeforeUnmount(()=>{
      clearInterval(timer);
    })
    return { ...toRefs(state), methods };
  },
};
</script>

<style lang="less" scoped>
ul {
  height: 400px;
  overflow: auto;
  span {
    width: 2rem;
    display: inline-block;
    text-align: center;
  }
  img {
    height: 2rem;
    width: 2rem;
    border-radius: var(--border-radius);
  }
  p {
    line-height: 2rem;
    height: 2rem;
  }

}
::-webkit-scrollbar {
  width: 0px;
}

::-webkit-scrollbar-track {
    background-color: none;
}

::-webkit-scrollbar-thumb {
    background-color: none;
}
  ::-webkit-scrollbar-thumb:hover {
    background-color: none;
  }
  
  ::-webkit-scrollbar-thumb:active {
    background-color: none;
  }
.music-list {
  overflow: auto;
  overflow: hidden;
  margin-top: 1rem;
  color: var(--text-color);
  height: 500px;
}
.hide-music-list {
  height: 0;
  // visibility: hidden;
  // opacity: 0;
  margin-top: 0!important;
}
.music-box {
  .title {
    color: var(--text-color);
  }
  .music_info {
    padding-left: 1rem;
    padding-right: 1rem;
        box-sizing: border-box;
    width: calc(100% - 6rem);
    .control{
      svg {
        cursor: pointer;
        margin: 0 1rem;
      }
    }
    .progress-slide {
      position: relative;
      span {
        display: inline-block;
        height: 24px;
        line-height: 24px;
      }
    }
  }
  .music-item {
    background-color: var(--theme-color-3);
    border-radius: var(--border-radius);
  }
}

.cover {
  position: relative;
  height: 6rem;
  width: 6rem;
  border-radius: 50%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: 1px solid var(--border-color);
  overflow: hidden;
}
.vioce-control {
  position: relative;
}
.vioce-bar {
  position: absolute;
  bottom: 2.5rem;
  height: 2.5rem;
  // width: 4px;
}
</style>
