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
                    pre_head.innerHTML = "<p><span class='code-language'>" + language.toUpperCase() + "</span><span class='copy'><img class='w-auto mr-1' src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjIzMTU5NzgwNzUyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjExOTU0IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwvc3R5bGU+PC9kZWZzPjxwYXRoIGQ9Ik00OS41OTQxODIgNDQwLjAxNzQ1NWwtMS4yNTY3MjcgMS4yMzM0NTQgMS4yNTY3MjctMS4yMzM0NTR6IG0tMS4yNTY3MjcgMS4yMzM0NTRsMS4yNTY3MjctMS4yMzM0NTQgMC41NTg1NDUtMC41NTg1NDZINDYuNTQ1NDU1VjE2MC41MTJhNDMuNjU5NjM2IDQzLjY1OTYzNiAwIDAgMSAxMi45MTYzNjMtMzEuMjA4NzI3QTQ0LjA1NTI3MyA0NC4wNTUyNzMgMCAwIDEgOTAuNjcwNTQ1IDExNi4zNjM2MzZoMjc4Ljk0NjkxdjMuNjA3MjczVjExNi4zNjM2MzZoMTYxLjA5MzgxOHYzLjYwNzI3M2wxLjgxNTI3Mi0xLjgxNTI3MyA0MjAuMTY1ODE5IDQyMC4xNjU4MTlhODQuNTI2NTQ1IDg0LjUyNjU0NSAwIDAgMSAwIDExOS41Mjg3MjdsLTIwMy41ODk4MTkgMjAzLjU2NjU0NWE4NC4yNDcyNzMgODQuMjQ3MjczIDAgMCAxLTU5Ljc2NDM2MyAyNC43NjIxODIgODQuMjkzODE4IDg0LjI5MzgxOCAwIDAgMS01OS43NjQzNjQtMjQuNzYyMTgybC0yMC43NTkyNzMtMjAuNzU5MjcyLTIwLjc4MjU0NSAyMC43ODI1NDVhODQuMDM3ODE4IDg0LjAzNzgxOCAwIDAgMS01OS43NjQzNjQgMjQuNzM4OTA5IDg0LjI5MzgxOCA4NC4yOTM4MTggMCAwIDEtNTkuNzY0MzYzLTI0LjczODkwOUw0OC4zMzc0NTUgNDQxLjI3NDE4MnpNNjU4LjE1MjcyNyA3OTEuMjcyNzI3bDIwLjc4MjU0NiAyMC43ODI1NDZhMTQuMzU5MjczIDE0LjM1OTI3MyAwIDAgMCAxMC4zNzk2MzYgNC4zMDU0NTQgMTQuNDc1NjM2IDE0LjQ3NTYzNiAwIDAgMCAxMC40MDI5MDktNC4zMDU0NTRsMjAzLjU4OTgxOC0yMDMuNTg5ODE4QTE0LjQyOTA5MSAxNC40MjkwOTEgMCAwIDAgOTA3LjYzNjM2NCA1OTguMTA5MDkxYTE0LjQ1MjM2NCAxNC40NTIzNjQgMCAwIDAtNC4yODIxODItMTAuMzc5NjM2TDUwMS44MDY1NDUgMTg2LjE4MTgxOGgtNjIuMzcwOTA5bC02Ljc5NTYzNi02LjgxODkwOSA2Ljc5NTYzNiA2LjgxODkwOSAzNTIuMTYyOTA5IDM1Mi4xMzk2MzdhODQuNTI2NTQ1IDg0LjUyNjU0NSAwIDAgMSAwIDExOS41Mjg3MjdMNjU4LjE3NiA3OTEuMjcyNzI3ek0zNzEuNDMyNzI3IDExOC4xNTU2MzZsLTAuNTU4NTQ1IDAuNTM1MjczIDAuNTM1MjczLTAuNTM1Mjczek01MC41MDE4MTggMTQyLjE0OTgxOHogbTQ3Ny43NDI1NDYgNzQ0LjAyOTA5MXpNMjAyLjMwOTgxOCAyNzIuMTI4YTYzLjM3MTYzNiA2My4zNzE2MzYgMCAxIDAgODkuNjQ2NTQ2IDg5LjY5MzA5MSA2My4zNzE2MzYgNjMuMzcxNjM2IDAgMCAwLTg5LjY0NjU0Ni04OS42OTMwOTF6IiBmaWxsPSIjZmZmZmZmIiBwLWlkPSIxMTk1NSI+PC9wYXRoPjwvc3ZnPg==' />复制</span></p>";
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
                item.firstChild.firstChild.lastChild.onclick = function(){
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
