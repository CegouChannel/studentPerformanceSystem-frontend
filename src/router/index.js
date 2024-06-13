import {createRouter, createWebHistory} from 'vue-router'
import StudentsView from '@/pages/StudentsView/StudentsView.vue'
import JournalView from '@/pages/JournalView/JournalView.vue'
import GroupsView from '@/pages/GroupsView/GroupsView.vue'
import StudyPlansView from '@/pages/StudyPlansView/StudyPlansView.vue'
import Cookies from "js-cookie";
import LessonsView from "@/pages/LessonsView/LessonsView.vue";

const HomeView = () => import('@/pages/HomeView/HomeView.vue')

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: {
                hasAuth: false,
            },
        },
        {
            path: '/students',
            name: 'students',
            component: StudentsView,
            meta: {
                // hasAuth: true,
            },

        },
        {
            path: '/journal',
            name: 'journal',
            component: JournalView,
            meta: {
                hasAuth: true,
            },

        },
        {
            path: '/groups',
            name: 'groups',
            component: GroupsView,
            meta: {
                hasAuth: true,
            },
        },
        {
            path: '/plans',
            name: 'plans',
            component: StudyPlansView,
            meta: {
                hasAuth: true,
            },

        },
        {
            path: '/lessons',
            name: 'lessons',
            component: LessonsView,
            meta: {
                hasAuth: true,
            },

        },
    ],
})
router.beforeEach((to, from, next) => {
    const userData = Cookies.get('AuthUser');
    if (!userData && to.meta.hasAuth === true) {
        next('/')
    } else if (userData && to.meta.hasAuth === false) {
        next('/students')
    }
    next()
});
export default router
