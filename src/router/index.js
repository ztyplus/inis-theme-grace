import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'

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
        ]
    },
    // {
    //     name: 'login',
    //     path: '/login',
    //     component: () => import('@/views/pages/Login'),
    // },
]
  

const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes
  })

// 全局路由守卫
// router.beforeEach((to, from, next) => {
// if (!inisHelper.get.cookie('LoginToken')) {
//     if (to.name == "login") {
//         next();
//     } else {
//         router.push('login')
//     }
// } else {
//     if (to.name == "login") {
//         router.push('/')
//     }
//     next();
// }
// });

export default router