<template><!-- v-bind:class="distant" -->
  <div>
      
    
    <div class="media mt-12 col-sm-12 message" >
      <router-link class="" :to="{ name: 'ViewProfile', params: { id: message.value.author } }" >
        <img class="pr-3 rounded " style="max-width: 60px;" v-bind:src="avatar">
      </router-link>
      <div class="media-body">
        <h5 class="mt-0 text-truncate">
          <router-link class="text-dark font-weight-bold" :to="{ name: 'ViewProfile', params: { id: message.value.author } }" >
            {{ $data.author.authorName }}  
          </router-link>
      
          <span class="text-muted">
            <span v-for="tag in message.value.content.tags">
              {{ tag }}
            </span>

            <span v-if="message.value.content.x && message.value.content.y">
              {{ message.value.content.x }}/{{ message.value.content.y }}
            </span>
            
            <span class="text-dark" v-if="message.value.content.channel">#{{ message.value.content.channel }}</span>
          </span>
        </h5>

        <div class="tweet-text">
          <read-more more-str="[more]" less-str="[less]" :max-chars="400" :text="textmd"></read-more>
        </div>
        <div class="tweet-footer">
          <!-- <a class="tweet-footer-btn">
            <eva-icon name="message-square-outline"></eva-icon><span>{{replies}}</span>
          </a> -->
          <a class="tweet-footer-btn" v-on:click="likeClick">
            <eva-icon name="heart-outline" animation="pulse"></eva-icon><span v-if="likes.length > 0">{{ likes.length }}</span>
          </a>
        </div>

        <div class="float-right text-muted small">
          <!-- <router-link class="text-muted font-weight-bold" :to="{ name: 'View Post', params: { id: message.key, x: message.value.x, y: message.value.y } }" > -->
            <timeago v-if="message.value.timestamp" :datetime="message.value.timestamp" :auto-update="60"></timeago>
          <!-- </router-link> -->
        </div>

        <a v-on:click="showRaw = !showRaw">+</a>
        <pre v-if="showRaw">
          {{ message }}
        </pre>
<!-- 
        <message v-for="r in related" :message="r">
        </message> -->

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
    'active_tags': Array
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
    related_loaded: function(err, related)
    {
      this.$data.related.push(related)
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
    previous_loaded: function(err, prev)
    {
      console.log("previous_loaded", prev)
      this.$data.branch = prev
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
      // sbotLibs.related(ssb, this.message.key, this.related_loaded)  
      // if(this.message.value.content.branch !== null)
      // {
      //   ssb.get(this.message.value.content.branch, this.previous_loaded)
      // }
      // else if( this.message.value.content.root !== null)
      // {
      //   ssb.get(this.message.value.content.root, this.previous_loaded)
      // }
    })
  },
  
}
</script>

<style scoped>

.tweet-footer-btn {
  margin-right: 30px;
}
.tweet-footer-btn i, .tweet-footer-btn span {
  color: #657786;
  font-size: 16px;
}
.tweet-footer-btn span {
  margin-left: 8px;
}
.tweet-footer-btn svg
{
  cursor: pointer !important; 
}
.distant
{
  color: grey;
}

</style>  