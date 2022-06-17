<template>
    <div class="common-layout flex-center">
        <div class="topback">
            <div class="headimg"
            :style="{'background-image': 'url('+(head_cover?head_cover:'static/images/default-bg.jpg')+')'}"
            ></div>
        </div>
        <div class="container">
            <el-container>
            <el-header><Header /></el-header>
            <el-container>
                <el-aside><SideMenu :isCollapse="isCollapse" @CloseOverlay="methods.close"/></el-aside>
                <el-main><MainBox /></el-main>
            </el-container>
            </el-container>
        </div>
    </div>
    <SideTool />
    <div v-if="!isCollapse" class="overlay" @click="methods.close"></div>
</template>
<script>
import Header from '@/components/Header'
import SideMenu from '@/components/SideMenu'
import MainBox from '@/components/MainBox'
import SideTool from '@/components/SideTool'
import { reactive, toRefs,onMounted } from 'vue'
import { mapGetters } from 'vuex'
import { GET } from '@/utils/http/request'
import { inisHelper } from '@/utils/helper'
export default {
    components: { Header,SideMenu,MainBox,SideTool },
    computed: {
        ...mapGetters([
            'head_cover'
        ]),
    },
    setup(){
        const state = reactive({
            isCollapse: true,
        })
        const methods = {
            initData(){
                methods.welcome()
            },
            close(val){
                state.isCollapse = val
            },
            welcome(){
                if(!inisHelper.get.cookie("wellcome")){
                    GET('location').then((res) => {
                        if (res.data.code == 200) {
                            var data = res.data.data
                            console.log(1)
                            let location = null
                            inisHelper.set.cookie("wellcome",1,7200)
                            if(data.district) location = '来自'+data.province + data.city + data.district+'的朋友.'
                            else location = '来自'+data.province + data.city + '的朋友.'
                            ElNotification({
                                title: '欢迎你！',
                                message: location,
                                type: 'success',
                            })
                        }
                    })
                }
            },
        }
        onMounted(()=>{
            methods.initData()
        })
        return { ...toRefs(state), methods }
    }
}
</script>

<style lang="less" scoped>
.topback {
    height: 18rem;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}
.el-header,.el-main {
    height: auto !important;
    padding: 0;
}
.el-container {
    display: flex;
    margin-top: 1.5rem;
}
.el-aside{
    margin-right: 1rem;
    width: auto;
}

.headimg {
    position: relative;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    height: 100%;
    z-index: 1;
}
.container {
    margin-top: 12rem;
    width: 80%;
    position: relative;
    max-width: 1140px;
}
</style>

