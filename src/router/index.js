import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './../components/Home'
import Profile from './../components/Profile'
import ViewProfile from './../components/ViewProfile'
import Messages from './../components/Messages'
import About from './../components/About'

// import Thread from './../components/Thread'


Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/post/:id',
      name: 'View Post',
      component: Messages
    },
    {
      path: '/about',
      name: 'About',
      component: About
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
