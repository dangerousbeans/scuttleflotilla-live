<template>
  <div class="container">
    <h3>Alchemist Token Holders: {{Object.keys(balances).length - 1}}</h3>
    
    <div>
      <Helper v-for="helper in Object.keys(balances)" :helper="helper" v-bind:key="helper.id"></Helper>
    </div>
  </div> <!-- /container -->  
</template>

<script>
import sbotLibs from './../sbot'
import pull from 'pull-stream'
import Helper from "./Helper.vue"

pull.paraMap = require('pull-paramap')
var md = require('ssb-markdown')

var Mutual = require('ssb-mutual')


export default {
  name: 'helpers',
  data() {
    return {
      balances: null
    }
  },
  components: {
    Helper
  },
  methods: {
    balances_loaded: function(err, balances)
    {
      this.$data.balances = balances
    },
  },

  mounted: function()
  {
    // Async fetch and connect ssb
    this.$ssb.then((ssb) => {
      var mutual = Mutual.init(ssb)
      mutual.getCurrencyBalances("🔷", this.balances_loaded)
    })
  },
  
}
</script>

<style>
.message
{
  padding: 0.3em;
}
</style>  