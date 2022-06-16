> 开发笔记

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