<template><!-- v-bind:class="distant" -->
  <div style="width: 100%">
      
    
    <div class="media mt-12 col-sm-12 message" >
      <router-link :alt="author.authorName" :to="{ name: 'ViewProfile', params: { id: message.value.author } }" >
        <img class="pr-3 rounded " style="max-width: 45px;" v-bind:src="avatar">

      </router-link>
      <div class="media-body">
        <div class="tweet-text">
          <read-more more-str="[more]" less-str="[less]" :max-chars="400" :text="textmd"></read-more>
        </div>
        
        <div class="float-right text-muted small">
          <!-- <router-link class="text-muted font-weight-bold" :to="{ name: 'View Post', params: { id: message.key, x: message.value.x, y: message.value.y } }" > -->
            <timeago v-if="message.value.timestamp" :datetime="message.value.timestamp" :auto-update="60"></timeago>
          <!-- </router-link> -->
        </div>

        

      </div>
    </div>
  </div>
</template>

<script>
import sbotLibs from './../sbot'
import pull from 'pull-stream'
import GIXI from 'gixi'
pull.paraMap = require('pull-paramap')
var md = require('ssb-markdown')


export default {
  name: 'message',
  props: { 
    'message': {},
    'x': String,
    'y': String,
    'child': Boolean
   },

  data() {
    return {
      avatar: "https://via.placeholder.com/90x90",
      author: "...",
      textmd: "...",
      likes: [],
      related: [],
      root: null,
      branch: null,
      replies: 0,
      showRaw: false
    }
  },
  
  methods: {
    name_loaded: function(err, name)
    {
      this.$data.author = name

      // temporary avatar based on author
      if(this.$data.avatar == "https://via.placeholder.com/90x90")
      {
        var imageData = new GIXI(300, this.message.value.author).getImage();
        this.$data.avatar = imageData
      }
    },
    avatar_loaded: function(err, avatar)
    {
      if(avatar)
        this.$data.avatar = "http://ssb.guild.land/blobs/get/" + avatar
    },
    like_loaded: function(err, like)
    {
      this.$data.likes.push(like)
    },
    likeClick: function()
    {
      this.$ssb.then((ssb) => {
        var x = parseInt(this.$props.x)
        var y = parseInt(this.$props.y)

        var content = {
            type: 'vote',
            x: x,
            y: y,
            channel: this.message.value.content.channel,
            tags: this.message.value.content.tags,
            vote: { 
              value: 1, 
              link: this.message.key
            }
          }

          sbotLibs.post_as(ssb, JSON.parse(localStorage.keys), content)
        })
    }
  },

  mounted: function()
  {
    this.$data.textmd = md.block(this.message.value.content.text, { toUrl: function( blob ){ return "http://ssb.guild.land/blobs/get/" + blob } })

    // Async fetch and connect ssb
    this.$ssb.then((ssb) => {
      sbotLibs.displayName(ssb, this.message.value.author, this.name_loaded)
      sbotLibs.avatar(ssb, this.message.value.author, this.avatar_loaded)    
      sbotLibs.countStream(ssb, this.message.key, this.like_loaded)  
      
    })
  },
  
}
</script>

<style >

.message
{
  width: 100%;
}
</style>  