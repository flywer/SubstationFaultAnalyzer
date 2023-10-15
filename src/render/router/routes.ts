import {RouteRecordRaw} from 'vue-router'

const view1 = () => import('@render/views/examples/view1.vue')
const view2 = () => import ('@render/views/examples/view2.vue')

const App = () => import ('@render/App.vue')
const Main = () => import ('@render/pages/main.vue')
const faultInfoMgt = () => import('@render/views/faultInfoMgt/index.vue')

export const routeName = {
    app: 'app',
    main: 'mainPage',
    view1: 'view1',
    view2: 'view2',
    faultInfoMgt: 'faultInfoMgt',
}

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: routeName.app,
        component: App,
        children: [
            {
                name: routeName.main,
                path: 'mainPage',
                component: Main,
                children: [
                    {
                        name: routeName.faultInfoMgt,
                        path: 'faultInfoMgt/index',
                        component: faultInfoMgt
                    },
                ]
            }
        ]
    }
]
