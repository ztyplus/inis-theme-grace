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
                meta: { keepAlive: true},
                component: () => import('@/views/pages/Index'),
            },
            {
                name: 'post',
                path: '/post',
                meta: { keepAlive: true},
                component: () => import('@/views/pages/PostList'),
            },
            {
                name: 'article',
                path: '/article/:id',
                meta: { keepAlive: false},
                component: () => import('@/views/pages/Article'),
            },
            {
                name: 'diarylist',
                path: '/diarylist',
                meta: { keepAlive: true},
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
                meta: { keepAlive: true},
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
                meta: { keepAlive: true,css: "talk-pages"},
                component: () => import('@/views/pages/Talks'),
            },
            {
                name: 'links',
                path: '/links',
                meta: { keepAlive: true},
                component: () => import('@/views/pages/Links'),
            },
            {
                name: 'msgwall',
                path: '/msgwall',
                meta: { keepAlive: false,css:"message-pages"},
                component: () => import('@/views/pages/MsgWall'),
            },
            {
                name: 'tools',
                path: 'tools',
                component: () => import('@/components/Tools'),
                children: [
                    {
                        name: 'douyin',
                        path: 'douyin',
                        meta: { keepAlive: true},
                        component: () => import('@/components/module/Douyin'),
                    },
                    {
                        name: 'hotsearch',
                        path: 'hotsearch',
                        meta: { keepAlive: true},
                        component: () => import('@/components/module/HotSearch'),
                    },
                ]
            },
            {
                name: 'config',
                path: '/config',
                meta: { keepAlive: false,css: "config-page"},
                component: () => import('@/views/pages/Config'),
            },
        ]
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

// if (to.meta.title) {
//     document.title = to.meta.title ? to.meta.title : defaultTitle;
// }

if (!is_login) {
    if (to.name == "config") {
        next({path: '/'})
    }else next()
}else {
    next()
}

});

export default router