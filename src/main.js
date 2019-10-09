import Vue from 'vue'
import app from './App.vue'
import router from './router'
import VueTimeago from 'vue-timeago'
Vue.use(VueTimeago, {
	locales: {
    'en': require('date-fns/locale/en'),}
})

import ReadMore from 'vue-read-more';
Vue.use(ReadMore);

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import EvaIcons from 'vue-eva-icons'
Vue.use(EvaIcons)

import ssbclient from 'vue-ssb'

Vue.use(ssbclient, 
	{ 
		keys: localStorage.keys,
		remote: "wss://ssb.guild.land/~shs:+COav7rGgSXqV36bsgYJK1EHtUuk9SvojPFGdIzJLlA=",
		// remote: "ws://192.168.0.109:8989~shs:5NWaVfaBIWV9fnXuI8xx+mVRf19m8XlCZkeMwxPyilk=",
		manifest: { 
			geospatial: 
			{ 
				read: 'source',
				stream: 'source',
				get: 'async'
			} 
		} // Extra functions provided by GeoSpatial FLumeVue Index
	})

Vue.config.productionTip = false

import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

Vue.component('l-map', LMap);
window.LMap = LMap
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);

delete Icon.Default.prototype._getIconUrl;



Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

new Vue({
  router,
  template: '<app/>',
  components: { app }
}).$mount('#app')