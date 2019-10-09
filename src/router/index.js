import Vue from 'vue'
import VueRouter from 'vue-router'

import Map from './../components/Map'
import Profile from './../components/Profile'
import Camp from './../components/Camp'
import ViewProfile from './../components/ViewProfile'
import Messages from './../components/Messages'
import Thread from './../components/Thread'


Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Map
    },
    {
      path: '/:x(\\d+)/:y(\\d+)',
      name: 'Map',
      component: Map,
      props: true
    },
    {
      path: '/:x(\\d+)/:y(\\d+)/camp',
      name: 'New Camp',
      component: Camp
    },
    {
      path: '/:x(\\d+)/:y(\\d+)/post/:id',
      name: 'View Post',
      component: Messages
    },
    {
      path: '/feed',
      name: 'Feed',
      component: Thread
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/profile/:id',
      name: 'ViewProfile',
      component: ViewProfile,
      props: true
    },
  ]
})
