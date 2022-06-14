<template>
    <div class="main mb-2">
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
    border-radius: 15px;
    box-shadow: 0px 20px 40px rgb(103 118 128 / 3%);
    padding: 1rem 1.875rem;
    position: relative;
    transition: box-shadow 0.3s ease-in-out; 
}
</style>