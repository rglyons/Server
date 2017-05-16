<template>
    <v-card>
        <v-card-title style="color:#2c3e50; padding:2% 50%">
            {{sensor}}
        </v-card-title>
        <div class="ct-chart ct-minor-sixth"></div>
    </v-card>
</template>

<script>
export default {
  name: 'histGraph',
  props: {
    sensor: {
      type: String,
      default: 'Humidity'
    },
  },
  data () {
    return {
      msg: 'Template or Testing page'
    }
  },
  created () {
    // console.log(this._.random(20))
  },
  watch: {
  },
  methods: {
  }
}
</script>
