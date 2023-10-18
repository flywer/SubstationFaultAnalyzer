import {RouteRecordRaw} from 'vue-router'

const App = () => import ('@render/App.vue')
const Main = () => import ('@render/pages/main.vue')
const faultInfoMgt = () => import('@render/views/faultInfoMgt/index.vue')
const settings = () => import('@render/views/settings/index.vue')

export const routeName = {
    app: 'app',
    main: 'mainPage',
    faultInfoMgt: 'faultInfoMgt',
    settings: 'settings',
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
                    {
                        name: routeName.settings,
                        path: '/settings/index',
                        component: settings
                    },
                ]
            }
        ]
    }
]
