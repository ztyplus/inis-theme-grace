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
