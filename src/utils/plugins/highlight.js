// SVG 组件
import svgIcon from '@/components/tool/SvgIcon'
// 代码高亮
import hljs from 'highlight.js'
import select2 from 'vue3-select2-component';
import { inisHelper } from '@/utils/helper'
import useClipboard from 'vue-clipboard3'


const highlight = {
    install: Vue => {

        // 定义全局组件
        Vue.component('svg-icon', svgIcon)
        Vue.component('select2', select2)
        
        // 自定义一个代码高亮指令
        Vue.directive('code-highlight',(el)=>{
            el.querySelectorAll('pre').forEach((pre)=>{
                // 检查初始化
                const init = pre.getAttribute('init')
                if (inisHelper.is.empty(init)) {
                    const code = pre.querySelector('code')
                    hljs.highlightElement(code)
                    // 显示行号
                    code.innerHTML = "<ul><li>" + code.innerHTML.replace(/\n/g, "\n</li><li>") + "\n</li></ul>";
                    // 添加头
                    let language = null
                    code.classList.forEach((className)=>{
                        if (className.indexOf("language-") != -1) language = className.split('-')[1]
                    })
                    let pre_head = document.createElement("div")
                    pre_head.classList.add('pre-head')
                    pre_head.innerHTML = "<p><span class='code-language'>" + language.toUpperCase() + "</span><span class='copy'><img class='w-auto mr-1' src='static/images/tag.svg' />复制</span></p>";
                    code.parentNode.insertBefore(pre_head, code)
                    // 创建修复滚动条白点
                    let repair = document.createElement("span")
                    repair.classList.add("repair")
                    code.parentNode.insertBefore(repair, code)
                    pre.setAttribute('init',true)
                }
                
            })
            // 复制操作
            el.querySelectorAll('pre').forEach((item)=>{
                item.onclick = function(){
                    var innerText = item.lastChild.innerText.replace(/\n\n/mg,'\n')
                    // inisHelper.set.copy.text(innerText)
                    const { toClipboard } = useClipboard()
                    toClipboard(innerText)
                    ElNotification({title: '复制成功',type: 'success',})  
                }
            })
        })
    }
}

const req = require.context('@/assets/svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

export default highlight
