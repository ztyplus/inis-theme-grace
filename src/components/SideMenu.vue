<template>
<el-affix :offset="20">
    <div class="aside">
        <el-menu 
        class="el-menu-vertical"
        active-text-color="#727cf5"
        :default-active="routeName"
        text-color="#fff"
        background-color="none"
        >
            <el-menu-item index="index" @click="methods.close('index')">
                <svg-icon file-name="index"></svg-icon>
                <span>首页</span>
            </el-menu-item>
            <el-menu-item index="post" @click="methods.close('post')">
                <svg-icon file-name="article"></svg-icon>
                <span>文章</span>
            </el-menu-item>
            <el-menu-item index="diarylist" @click="methods.close('diarylist')">
                <svg-icon file-name="diary"></svg-icon>
                <span>日记</span>
            </el-menu-item>
            <el-menu-item index="albumlist" @click="methods.close('albumlist')">
                <svg-icon file-name="camera"></svg-icon>
                <span>相册</span>
            </el-menu-item>
            <el-menu-item index="talks" @click="methods.close('talks')">
                <svg-icon file-name="talks"></svg-icon>
                <span>动态</span>
            </el-menu-item>
            <el-menu-item index="links" @click="methods.close('links')">
                <svg-icon file-name="links"></svg-icon>
                <span>友链</span>
            </el-menu-item>
            <el-menu-item index="msgwall" @click="methods.close('msgwall')">
                <svg-icon file-name="msgwall"></svg-icon>
                <span>留言</span>
            </el-menu-item>
        </el-menu>
        <div class="wide_switch" @click="methods.isCollapse">
            <div class="btn_switch_bg">
                <svg class="svg_icon" viewBox="0 0 9 59" width="9" height="59"><path fill="var(--main-button-color)" d="M3.8,5.1C1.7,4.3,0.2,2.4,0,0h0v5v4v41v5v3.9c0.6-1.9,2.1-3.4,4-4v0c2.9-0.7,5-3.2,5-6.3v-37  C9,8.4,6.8,5.7,3.8,5.1z"></path></svg>
                <svg v-if="!isCollapse" t="1633952745165" class="icon2 ct" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4376" width="32" height="32"><path d="M576 672c-6.4 0-19.2 0-25.6-6.4l-128-128c-12.8-12.8-12.8-32 0-44.8l128-128c12.8-12.8 32-12.8 44.8 0s12.8 32 0 44.8L492.8 512l102.4 102.4c12.8 12.8 12.8 32 0 44.8C595.2 672 582.4 672 576 672z" p-id="4377" fill="#fff"></path></svg>
                <svg v-if="isCollapse" t="1633952344357" class="icon1 ct" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2402" width="32" height="32"><path d="M448 672c-6.4 0-19.2 0-25.6-6.4-12.8-12.8-12.8-32 0-44.8L531.2 512 422.4 409.6c-12.8-12.8-12.8-32 0-44.8s32-12.8 44.8 0l128 128c12.8 12.8 12.8 32 0 44.8l-128 128C467.2 672 454.4 672 448 672z" p-id="2403" fill="#fff"></path></svg>
            </div>
        </div>  
    </div>
</el-affix>
</template>

<script>
import { reactive,toRefs,toRaw,ref } from "vue"
import { useStore } from "vuex"
import { useRoute,useRouter } from "vue-router"
export default {
    name: "SideMenu",
    props:["isCollapse"],
    setup(props, ctx){
        const route = useRoute()
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            isCollapse: ref(props.isCollapse),
            routeName: toRaw(route.name),
        })
        const methods = {
            isCollapse(){
                state.isCollapse = !state.isCollapse
                ctx.emit('CloseOverlay', state.isCollapse)
            },
            close(name){
                router.push({name})
                store.dispatch("headCover",null)
                if(state.windowWidth < 760) {
                    // state.isCollapse = !state.isCollapse
                    methods.isCollapse() 
                }
            }
        }
        return { ...toRefs(state),methods}
    }
}
</script>

<style lang="less" scoped>
.aside {
    background-color: var(--card-bg-color);
    border-radius: var(--border-radius);
    box-shadow: 0px 20px 40px rgb(103 118 128 / 3%);
    padding: 1rem 1.2rem;
    position: relative;
}

.el-menu {
    border: none;
    .el-menu-item {
          background: var(--card-bg-color);
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow-2);
        margin: .5rem 0;
        height: 5rem;
        width: 5rem;
        box-sizing: border-box;
        border-radius: var(--border-radius);
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-content: space-between;
        flex-direction: column;
        transition: none;
    }
    .el-menu-item:hover {
        background-color: var(--main-bg-color);
    }
    .is-active {
        background-image: linear-gradient(142.17deg, #79bbff 6.66%, #337ecc 91.48%);
        box-shadow: inset -0.25rem -0.25rem 0.3125rem rgb(0 0 0 / 10%), inset 0.25rem 0.25rem 0.3125rem rgb(255 255 255 / 23%);
        span {color: #fff;}
    }
    .el-menu-item * {
        vertical-align: middle;
    }
    .router-link-active {
        display: block;
        width: 100%;
        height: 100%;
    }
    svg {
        width: 40px;
        height: 40px;
    }
    span {
        display: block;
        font-size: 0.8rem;
        color: var(--h2-color);
        line-height: .8rem;
        font-weight: 600;
    }
}
.wide_switch {
    position: absolute;
    top: 50%;
    right: -10px;
    width: 10px;
    height: 60px;
    margin-top: -4px;
    cursor: pointer;
    transform: translateY(-50%);
    .btn_switch_bg {
        position: absolute;
        width: 100%;
        height: 100%;
        .ct {
            top: 50%;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
        }
    }
}
.isCollapse {
    // transform: translateX(-100%);
}
.hidden {
    visibility: hidden;
    opacity: 0;
}
</style>