<template>
  <h3>头像生成器</h3>
  <div class="mt-4">
    <div class="avatar">
      <img :src="avatar" />
    </div>

    <div class="download mt-4 flex-center">
      <el-button class="mr-1" type="primary" @click="methods.download">下载</el-button>
      <el-select class="" v-model="avatarFormat" placeholder="请选择头像格式">
        <el-option label="svg" value="svg" />
        <el-option label="png格式" value="png" />
      </el-select>
    </div>
    <div class="flex-center">
      <el-button @click="methods.randomSeed" class="mt-2 mr-1" type="primary">随机</el-button>
      <el-input class="mt-2 randomseed" v-model="option.seed" placeholder="输入字符生成唯一头像" />
    </div>
    
  </div>

  <div class="download flex mt-4 justify-center">
    
    
  </div>

  <div class="avatar-option shadow-box-3 mt-2">
    <el-form :model="option" label-width="50px">
      <el-form-item label="背景">
        <div class="flex w-100">
          <el-color-picker
            :show-alpha="true"
            @active-change="methods.colorChange"
            class="w-100 mr-2"
            v-model="option.backgroundColor"
            :predefine="predefineColors"
          />
        </div>
      </el-form-item>
      <el-form-item label="旋转">
        <div class="w-100 progress-slide flex-center">
          <span class="item-text pr-1">0</span>
          <el-slider 
            v-model="option.rotate" 
            size="small"
            :max="360"
            @input="methods.rotate"
            class="play-music"
          />
          <span class="item-text pl-1">360</span>
        </div>
      </el-form-item>
      <el-form-item label="圆角">
        <div class="w-100 progress-slide flex-center">
          <span class="item-text pr-1">0</span>
          <el-slider 
            v-model="option.radius" 
            size="small"
            :max="50"
            @input="methods.radius"
            class="play-music"
          />
          <span class="item-text pl-1">50</span>
        </div>
      </el-form-item>
      <el-form-item label="风格">
        <div class="flex flex-wrap">
          <span 
          @click="methods.styleChange(index)"
          v-for="(item,index) in styleNameList" 
          :key="index" 
          class="avatar-style mr-1 mb-1"
          :class="{'style-active': option.style === index}"
          >{{item}}</span>
        </div>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import download from 'downloadjs';
import { createAvatar } from '@dicebear/avatars';
import * as croodles from '@dicebear/croodles';
import * as adventurer from '@dicebear/adventurer';
import * as adventurer1 from '@dicebear/adventurer-neutral';
import * as sprites from '@dicebear/avatars-avataaars-sprites';
import * as bigears from '@dicebear/big-ears';
import * as bigsmile from '@dicebear/big-smile';
import * as micah from '@dicebear/micah';
import * as miniavs from '@dicebear/miniavs';
import * as personas from '@dicebear/personas';
import * as pixel from '@dicebear/pixel-art';
import { reactive, toRefs } from '@vue/reactivity';
import { onMounted, watch } from '@vue/runtime-core';
export default {
  setup(){
    const styleList = [croodles, adventurer,adventurer1,sprites,bigears,bigsmile,micah,miniavs,personas,pixel ]
    const state = reactive({
      styleNameList : ['croodles', 'adventurer','adventurer1','sprites','bigears','bigsmile','micah','miniavs','personas','pixel' ],
      avatar: '',
      avatarFormat: 'svg',
      option: {
        seed: 'avatar',
        backgroundColor: 'rgba(236, 221, 177, 1)',
        rotate: 0,
        radius: 20,
        style: 0
      },
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
      ],
    })
    const methods = {
      createAvatar(){
        state.avatar = createAvatar(styleList[state.option.style], {
          seed: state.option.seed,
          dataUri: true,
          backgroundColor: state.option.backgroundColor,
          rotate: state.option.rotate,
          radius: state.option.radius,
        });
      },
      // 生成随机种子
      randomSeed(){
        let seed = "";
        const seedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const seedLength = seedChars.length;
        for (let i = 0; i < 12; i++) {
          seed += seedChars.charAt(Math.floor(Math.random() * seedLength));
        }
        state.option.seed = seed;
      },
      // 下载照片
      download(){
        let avatar = state.avatar;
        let name = state.option.seed;
        if(name == ""){
          name = "avatar";
        }
        if (state.avatarFormat == 'png') {
          methods.downloadPNG(name)
        } else {
          download(avatar, `${name}.${state.avatarFormat}`);
        }
      },
      // 下载png格式图片
      downloadPNG(name){
        let img = new Image();
        img.src = state.avatar;
        img.onload = function(){
          let canvas = document.createElement("canvas");
          canvas.width = 900;
          canvas.height = 900;
          let ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          let a = document.createElement("a");
          a.href = canvas.toDataURL("image/png");
          a.download = `${name}.png`;
          a.click();
        }
      },
      colorChange(val) {
        state.option.backgroundColor = val;
      },
      rotate(val) {
        state.option.rotate = val;
      },
      radius(val) {
        state.option.radius = val;
      },
      styleChange(val){
        state.option.style = val;
      }
    }
    onMounted(()=>{
      methods.createAvatar()
    })
    watch(()=>[
      state.option.seed,
      state.option.backgroundColor,
      state.option.rotate,
      state.option.radius,
      state.option.style,
    ],(val) => {
      methods.createAvatar()
    })
    return {...toRefs(state),methods}
  },
  
  
}
</script>

<style lang="less" scoped>
.avatar {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  filter: drop-shadow(var(--box-shadow-2));
}
h3 {
  color: var(--title-color);
}
.el-select,.randomseed {
  width: 125px;
}
.avatar-style {
  cursor: pointer;
  padding: 0 6px;
  background-color: var(--theme-color-3);
  border-radius: var(--border-radius);
  font-size: .875rem;
  color: var(--text-color);
  box-sizing: border-box;
}
.avatar-style:hover {
  background-color: var(--theme-color-2);
}
.style-active {
  background-color: var(--theme-color);
  color: #fff;
}
.style-active:hover {
  background-color: var(--theme-color)!important;
}
</style>