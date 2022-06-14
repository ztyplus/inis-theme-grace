
const photo = {
  install: Vue => {
    // 自定义图片灯箱指令
    Vue.directive('img-preview',(el)=>{
        el.querySelectorAll('img').forEach((img)=>{
          console.log(img.src)
          let previewbox = document.createElement("span")
          img.classList.add('view-box')
          previewbox.classList.add('PhotoConsumer')
          // fancybox.setAttribute("data-fancybox","gallery");
          previewbox.setAttribute("style","display: inline-block;");
          
          img.parentNode.replaceChild(previewbox,img);//  获取子元素原来的父元素并将新父元素代替子元素
          previewbox.appendChild(img);//  在新父元素下添加原来的子元素
        })
    })
  }
}

export default photo