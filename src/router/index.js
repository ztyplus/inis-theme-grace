import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'
import { inisHelper } from '@/utils/helper'

const routes = [
    {
        path: '/',
        component: () => import('@/views/layout/Base'),
        children: [
            {
                name: 'index',
                path: '/',
                meta: { keepAlive: true,title: "首页"},
                component: () => import('@/views/pages/Index'),
            },
            {
                name: 'post',
                path: '/post',
                meta: { keepAlive: true,title: "文章"},
                component: () => import('@/views/pages/PostList'),
            },
            {
                name: 'article',
                path: '/article/:id',
                meta: { keepAlive: false,css: "article-pages"},
                component: () => import('@/views/pages/Article'),
            },
            {
                name: 'diarylist',
                path: '/diarylist',
                meta: { keepAlive: true,title: "日记"},
                component: () => import('@/views/pages/DiaryList'),
            },
            {
                name: 'diary',
                path: '/diary/:id',
                meta: { keepAlive: false},
                component: () => import('@/views/pages/Diary'),
            },
            {
                name: 'albumlist',
                path: '/albumlist',
                meta: { keepAlive: true,title: "相册"},
                component: () => import('@/views/pages/AlbumList'),
            },
            {
                name: 'album',
                path: '/album/:id',
                meta: { keepAlive: false},
                component: () => import('@/views/pages/Album'),
            },
            {
                name: 'talks',
                path: '/talks',
                meta: { keepAlive: true,css: "talk-pages",title: "动态"},
                component: () => import('@/views/pages/Talks'),
            },
            {
                name: 'links',
                path: '/links',
                meta: { keepAlive: true,title: "链接"},
                component: () => import('@/views/pages/Links'),
            },
            {
                name: 'msgwall',
                path: '/msgwall',
                meta: { keepAlive: true,css:"message-pages",title: "留言墙"},
                component: () => import('@/views/pages/MsgWall'),
            },
            {
                name: 'tools',
                path: 'tools',
                meta: { title: "工具"},
                component: () => import('@/components/Tools'),
                children: [
                    {
                        name: 'douyin',
                        path: 'douyin',
                        meta: { keepAlive: true,title: "抖音解析"},
                        component: () => import('@/components/module/Douyin'),
                    },
                    {
                        name: 'avatar',
                        path: 'avatar',
                        meta: { keepAlive: false,title: "头像生成器"},
                        component: () => import('@/components/module/Avatar'),
                    },
                    {
                        name: 'hotsearch',
                        path: 'hotsearch',
                        meta: { keepAlive: true,title: "百度热搜"},
                        component: () => import('@/components/module/HotSearch'),
                    },
                ]
            },
            {
                name: 'config',
                path: '/config',
                meta: { keepAlive: false,css: "config-page",title: "主题配置"},
                component: () => import('@/views/pages/Config'),
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/views/pages/404')
    },
]
  

// let history   = (INIS.route_hash) ? createWebHashHistory() : createWebHistory();
// let history   = (INIS.route_hash) ? createWebHashHistory() : createWebHistory();

const router = createRouter({
  history:createWebHashHistory(),
  routes
})

let is_login = inisHelper.get.storage("login")
// 判断缓存是否存在且未过期
if (is_login != "expire" && is_login != false) {
    is_login = true
  } else is_login = false

// 路由守卫
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = INIS.title + " - " + (to.meta.title ? to.meta.title : defaultTitle);
    }

if (!is_login) {
    if (to.name == "config") {
        next({path: '/'})
    }else next()
}else {
    next()
}

});

export default router