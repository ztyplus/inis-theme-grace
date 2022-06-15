<template>
    <div class="main main-card mb-2" :class="$route.meta.css" >
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
            </keep-alive>
            <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
        </router-view>
    </div>
</template>

<script>
export default {
    name: "MainBox"
}
</script>

<style lang="less" scoped>
.main {
    background-color: var(--card-bg-color);
}
.talk-pages {
    box-shadow: none;
    padding: 0!important;
    background: none!important;
}
</style>