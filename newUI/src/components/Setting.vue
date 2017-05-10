<template>
  <v-card>
    <v-card-row>
      <v-toolbar class="light-blue lighten-2" style="opacity: 0.5">
        <!-- <v-toolbar-title>Settings</v-toolbar-title> -->
        <v-btn class="white--text" flat="flat" @click.native="d3 = false">Save</v-btn>
      </v-toolbar>
    </v-card-row>


    <v-list three-line subheader>
      <v-subheader>User Controls</v-subheader>
      <v-list-item>
        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>Content filtering</v-list-tile-title>
            <v-list-tile-sub-title>Set the content filtering level to restrict appts that can be downloaded</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-item>
      <v-list-item>
        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>Password</v-list-tile-title>
            <v-list-tile-sub-title>Require password for purchase or use password to restrict purchase</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list three-line subheader>
      <v-subheader>General</v-subheader>
      <v-list-item>
        <v-list-tile avatar>
          <v-list-tile-action>
            <v-checkbox />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Notifications</v-list-tile-title>
            <v-list-tile-sub-title>Notify me about updates to apps or games that I downloaded</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-item>
      <v-list-item>
        <v-list-tile avatar>
          <v-list-tile-action>
            <v-checkbox />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Sound</v-list-tile-title>
            <v-list-tile-sub-title>Auto-update apps at any time. Data charges may apply</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-item>
      <v-list-item>
        <v-list-tile avatar>
          <v-list-tile-action>
            <v-checkbox />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Auto-add widgets</v-list-tile-title>
            <v-list-tile-sub-title>Automatically add home screen widgets</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-item>
    </v-list>
  </v-card>
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