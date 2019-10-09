
<template>
  <div class="fluid-container">
    <div class="row">
      <div id="" class="col-md-8">
        <div class="card-body scroll" style="max-height: 1500px">
          <TileInfo v-bind:active_tags="active_tags"></TileInfo>
          
          <h4><small>Live SSB Feed of the Scuttlebutt Solarpunk Fleet</small></h4>

          <br/>
          <!-- <h3 class="card-title">{{active_tags}}</h3> -->
          <Messages style="max-height: 100%" v-bind:this_tile_tags="active_tags" ></Messages>
        </div>  
      </div>
      <div class="col-md-4">
        <Helpers></Helpers>
      </div>
    </div>
  </div>
</template>


<script>

import Messages from './../components/Messages'
import TileInfo from './../components/TileInfo'
import Helpers from './../components/Helpers'


const pull = require('pull-stream')
const drain = require('pull-stream/sinks/drain')

import sbotLibs from './../sbot'



export default {

  components: {
    Messages,
    TileInfo,
    Helpers
  },

  
  data () {
    return { 
      activity: {},
      active_tags: [ ]
    }
  },

  methods: {
    
  },

  mounted: function() {
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

.message{
  overflow-y: wrap;
}


.scroll
{
  overflow-y: scroll;
  height: 100%;
}
</style>