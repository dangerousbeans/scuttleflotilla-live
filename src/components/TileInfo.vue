<template>
	<div class="">
		<h3 class="card-title"><span class="font-weight-bold">⛵</span>ScuttleFlotilla</h3>

    <!-- <b-button class="btn-xxs btn-primary" v-if="status != 'ScuttleCity'" v-b-modal.modal-1>Build a camp 🔥</b-button> -->

  </div>
</template>

<script>
export default {
  name: 'tile_info',
  props: [ 'x', 'y', 'active_tags' ],
  computed: {
    status() {
      if(this.scuttlecity())
      {
        return "ScuttleCity"
      }
      else
      {
        return "Unoccupied"  
      }
      
    }
  },
  methods: {
    scuttlecity(){
      if( (this.$route.params.x == 4 && this.$route.params.y == 21) || !(this.$route.params.x && this.$route.params.y) )
      {
        return true
      }
      else
      {
        return false
      }
    }
  }
}
</script>