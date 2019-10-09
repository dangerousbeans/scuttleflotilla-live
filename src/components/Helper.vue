<template><!-- v-bind:class="distant" -->
  <div>
    <div class="media mt-12 col-sm-12 message" >
        <img class="pr-3 rounded " style="max-width: 60px;" v-bind:src="avatar">
      <div class="media-body">
        <h5 class="mt-0 text-truncate">
          {{ $data.author.authorName }}  
          
        </h5>
      </div>
    </div>
  </div>
</template>

<script>
import sbotLibs from './../sbot'
import pull from 'pull-stream'
pull.paraMap = require('pull-paramap')


export default {
  name: 'helper',
  props: { 
    helper: null
  },

  data() {
    return {
      avatar: "https://via.placeholder.com/90x90",
      author: "...",
      
    }
  },
  
  methods: {
    name_loaded: function(err, name)
    {
      this.$data.author = name

      // temporary avatar based on author
      if(this.$data.avatar == "https://via.placeholder.com/90x90")
      {
        var imageData = new GIXI(300, this.helper).getImage();
        this.$data.avatar = imageData
      }
    },
    avatar_loaded: function(err, avatar)
    {
      if(avatar)
        this.$data.avatar = "http://ssb.guild.land/blobs/get/" + avatar
    },
    
  },

  mounted: function()
  {

    // Async fetch and connect ssb
    this.$ssb.then((ssb) => {
      sbotLibs.displayName(ssb, this.helper, this.name_loaded)
      sbotLibs.avatar(ssb, this.helper, this.avatar_loaded)    
      
    })
  },
  
}
</script>

<style scoped>

</style>  