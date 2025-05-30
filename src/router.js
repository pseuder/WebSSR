import { createRouter as createVueRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import WritingPractice from '@/views/WritingPractice.vue'
import ListeningPractice from '@/views/ListeningPractice.vue'
import Backend from '@/views/Backend.vue'
import SongOverview from '@/views/SongOverview.vue'
import SongPractice from '@/views/SongPractice.vue'
import Analysis from '@/views/Analysis.vue'
import SongEdit from '@/views/SongEdit.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/writing', component: WritingPractice },
    { path: '/listening', component: ListeningPractice },
    { path: '/song', component: SongPractice },
    { path: '/backend', component: Backend },
    { path: '/songOverview', name: 'songOverview', component: SongOverview },
    { path: '/songPractice/:id', name: 'songPractice', component: SongPractice },
    { path: '/analysis', component: Analysis },
    { path: '/songEdit', component: SongEdit },

    // 添加一個 catch-all 路由
    { path: '/:pathMatch(.*)*', redirect: '/' }
]

export function createRouter() {
    return createVueRouter({
        history: typeof window !== 'undefined' ? createWebHistory() : createMemoryHistory(),
        routes
    })
}

// 為了向後兼容，保留預設導出
export default createRouter()
