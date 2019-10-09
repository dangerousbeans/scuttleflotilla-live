<template>
  <div class="container">
    <h3>Helpers</h3>
    
    <row>
      <Helper v-for="helper in Object.keys(balances)" :helper="helper" v-bind:key="helper.id"></Helper>
    </row>
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
      console.log("balances_loaded", balances)
      this.$data.balances = balances
    },
  },

  mounted: function()
  {
    // Async fetch and connect ssb
    this.$ssb.then((ssb) => {
      var mutual = Mutual.init(ssb)
      mutual.getCurrencyBalances("🔷", this.balances_loaded)
      // console.log(ssb.getAddress("public", function(err, address) { console.log(address) } ))
      // debugger
      // sbotLibs.displayName(ssb, JSON.parse(localStorage.keys).id, this.name_loaded)
      // sbotLibs.avatar(ssb, JSON.parse(localStorage.keys).id, this.avatar_loaded)  


    })
  },
  
}
</script>

</style>  