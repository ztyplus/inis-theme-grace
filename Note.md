# 开发笔记

## el-image-viewer 参数

``` js
const imageViewerProps = runtime.buildProps({
  urlList: {
    type: runtime.definePropType(Array),
    default: () => typescript.mutable([])
  },
  zIndex: {
    type: Number
  },
  initialIndex: {
    type: Number,
    default: 0
  },
  infinite: {
    type: Boolean,
    default: true
  },
  hideOnClickModal: {
    type: Boolean,
    default: false
  },
  teleported: {
    type: Boolean,
    default: false
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true
  }
});
const imageViewerEmits = {
  close: () => true,
  switch: (index) => typeof index === "number"
};
```

### ImageViewer 属性

| 名称                  | 说明                                                         | 类型              | 默认值  |
| :-------------------- | :----------------------------------------------------------- | :---------------- | :------ |
| `url-list`            | 用于预览的图片链接列表                                       | `string[]`        | `[]`    |
| `z-index`             | 预览时遮罩层的 z-index                                       | `number | string` | —       |
| `initial-index`       | 初始预览图像索引，小于 `url-list` 的长度                     | `number`          | `0`     |
| `infinite`            | 是否可以无限循环预览                                         | `boolean`         | `true`  |
| `hideOnClickModal` | 是否可以通过点击遮罩层关闭预览                               | `boolean`         | `false` |
| `teleported`          | image 自身是否插入至 body 元素上。 嵌套的父元素属性会发生修改时应该将此属性设置为 `true` | `boolean`         | `false` |

## v-html代码块复制

注册插件，使用原生js操作dom实现代码块内容复制

```js
// 复制操作
el.querySelectorAll('pre').forEach((item)=>{
    item.firstChild.firstChild.lastChild.onclick = function(){
        var innerText = item.lastChild.innerText.replace(/\n\n/mg,'\n')
        // 下面是复制内容到剪切板操作，方法任选
        // inisHelper.set.copy.text(innerText)
        // const { toClipboard } = useClipboard()
        toClipboard(innerText)
        ElNotification({title: '复制成功',type: 'success',})  
    }
})
```

## v-html添加点击事件

```vue
<template>
  <div v-html="article.content" @click="methods.imagePreview"></div>
</template>
<script>
export default {
  setup () {
    const methods = {
      imagePreview(e){
        console.log(e.target)
      },
    }
    return { methods }
  }
}
</script>
```

## Audio操作笔记

### audio 属性

1. src 歌曲的路径
2. preload 是否在页面加载后立即加载（设置 autoplay 后无效）
3. controls 显示 audio 自带的播放控件
4. loop 音频循环
5. autoplay 音频加载后自动播放
6. currentTime 音频当前播放时间
7. duration 音频总长度
8. ended 音频是否结束
9. muted 音频静音为 true
10. volume 当前音频音量
11. readyState 音频当前的就绪状态


### audio 事件

1. abort 当音频/视频的加载已放弃时
2. canplay 当浏览器可以播放音频/视频时
3. canplaythrough 当浏览器可在不因缓冲而停顿的情况下进行播放时
4. durationchange 当音频/视频的时长已更改时
5. emptied 当目前的播放列表为空时
6. ended 当目前的播放列表已结束时
7. error 当在音频/视频加载期间发生错误时
8. loadeddata 当浏览器已加载音频/视频的当前帧时
9. loadedmetadata 当浏览器已加载音频/视频的元数据时
10. loadstart 当浏览器开始查找音频/视频时
11. pause 当音频/视频已暂停时
12. play 当音频/视频已开始或不再暂停时
13. playing 当音频/视频在已因缓冲而暂停或停止后已就绪时
14. progress 当浏览器正在下载音频/视频时
15. ratechange 当音频/视频的播放速度已更改时
16. seeked 当用户已移动/跳跃到音频/视频中的新位置时
17. seeking 当用户开始移动/跳跃到音频/视频中的新位置时
18. stalled 当浏览器尝试获取媒体数据，但数据不可用时
19. suspend 当浏览器刻意不获取媒体数据时
20. timeupdate 当目前的播放位置已更改时
21. volumechange 当音量已更改时
22. waiting 当视频由于需要缓冲下一帧而停止