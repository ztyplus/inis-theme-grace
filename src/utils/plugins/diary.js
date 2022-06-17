
const diary = {
    install: Vue => {
        Vue.directive('diary',(el)=>{
            let diary_text = ""
            el.querySelectorAll('p').forEach((p)=>{
                if(p.innerText !== "") {
                    diary_text += "<p>" + p.innerText + "</p>" ; 
                }
            })
            el.querySelector('p').parentNode.innerHTML = diary_text
        })
    }
}

export default diary
