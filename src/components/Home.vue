
<template>
  <div class="container">
    <div class="row">
      <div id="" class="col-md-8">
        <div class="card-body scroll whitebg">
          <TileInfo></TileInfo>
          
           <h4><small>Live SSB Feed of the Scuttlebutt Solarpunk Fleet</small></h4>

          <br/>
          <Messages style="max-height: 100%" ></Messages>
        </div>  
      </div>
      <div class="col-md-4">
        <div class="map">
          <l-map
            v-if="showMap"
            :zoom="zoom"
            :center="center"
            :options="mapOptions"
            style="height: 80%"
            @update:center="centerUpdate"
            @update:zoom="zoomUpdate"
          >
            <l-tile-layer :url="url" :attribution="attribution" />
            <l-marker :lat-lng="withPopup">
              <l-popup>
                <div @click="innerClick">
                  I am a popup
                  <p v-show="showParagraph">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
                    sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi.
                    Donec finibus semper metus id malesuada.
                  </p>
                </div>
              </l-popup>
            </l-marker>
            <l-marker :lat-lng="withTooltip">
              <l-tooltip :options="{ permanent: true, interactive: true }">
                <div @click="innerClick">
                  I am a tooltip
                  <p v-show="showParagraph">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
                    sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi.
                    Donec finibus semper metus id malesuada.
                  </p>
                </div>
              </l-tooltip>
            </l-marker>
          </l-map>
        </div>

        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Shared Funds</h5>
            <p class="card-text">
               Ξ {{ (balance / 1000000000000000000).toFixed(4) }} Ether
            </p>
            <a href="https://etherscan.io/address/0x9f2E66Bd2354f37793C5f75516B2371190ce68f0" class="card-link">Details</a>
          </div>
        </div>

        <Helpers></Helpers>
      </div>
    </div>
  </div>
</template>


<script>

import Messages from './../components/Messages'
import TileInfo from './../components/TileInfo'
import Helpers from './../components/Helpers'

import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from "vue2-leaflet";


const pull = require('pull-stream')
const drain = require('pull-stream/sinks/drain')

import sbotLibs from './../sbot'

export default {

  components: {
    Messages,
    TileInfo,
    Helpers,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip
  },

  data () {
    return { 
      zoom: 3,
      center: latLng(-37.1441077 , 174.3789877),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      withPopup: latLng(47.41322, -1.219482),
      withTooltip: latLng(47.41422, -1.250482),
      currentZoom: 3.5,
      currentCenter: latLng(-37.1441077,174.3789877),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      },
      showMap: true,
      balance: "-"
    }
  },

  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    innerClick() {
      alert("Click!");
    },
    balance_loaded(bal_data) {
      this.$data.balance = bal_data.result
    }
  },

  mounted: function() {
    this.$nextTick(() => {
    //   window.LMap.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(this.$refs.scuttleshipMap.mapObject)

    })
    var api = require('etherscan-api').init('32UFFXZPZBPRJPEY2IKU3QE94WQMN2HNIF');
    var balance = api.account.balance('0x9f2E66Bd2354f37793C5f75516B2371190ce68f0');
    balance.then(this.balance_loaded);

    // Check we're following the pub
    this.$ssb.then((ssb) => {
      var pub_id = "@+COav7rGgSXqV36bsgYJK1EHtUuk9SvojPFGdIzJLlA=.ed25519"
      var our_id = JSON.parse(localStorage.keys).id
      
      ssb.friends.isFollowing({source: our_id, dest: pub_id}, function(err, following)
      {
        if(!following)
        {
          // console.log("not following, so gunna follow", pub_id, our_id)
          // follow
          sbotLibs.post_as(ssb, JSON.parse(localStorage.keys), {
            type: "contact",
            contact: pub_id,
            following: true
          }, () => {
            // console.log("followed")
          })
        }
      })    
    })

  },
  
}
</script>

<style>

#app
{
  background-image: url('./../assets/solarpunkfleet.png');
  background-repeat: no-repeat;
  background-size: auto;
  background-position: top;
}

.whitebg
{
  background-color: rgba(255, 255, 255, 0.8);
}

.map
{
  max-height: 3em;
}
</style>