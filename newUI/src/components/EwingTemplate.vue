<template>
  <div class='test'>
    <h3 id="msg">{{ msg }}</h3>
      <v-btn dark default 
        class="mt-4"
        id="btn">
        Start Tour
      </v-btn>
      <v-btn dark default 
        class="mt-4" 
        @click.native="test">
        Test
      </v-btn>
    <v-chip>
      <v-avatar class="teal" id="teal">A</v-avatar>
      Ewing LOL
    </v-chip>
  </div>
</template>

<script>
export default {
  name: 'test',
  data () {
    return {
      msg: 'Template or Testing page'
    }
  },
  created () {
    // console.log(this._.random(20))
  },
  methods: {
    test () {
      console.log('abc')
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>