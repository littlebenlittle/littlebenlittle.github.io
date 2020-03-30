
<template>
  <v-container>
    <v-col
      align="center"
      justify="center"
    >
      <v-card>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/octicons/3.5.0/octicons.min.css">
        <github-feed login="littlebenlittle" />
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
import Vue from 'vue'
import VueGithubActivity from 'vue-github-activity'

Vue.use(VueGithubActivity)

export default {
  name: 'RecentActivity',
  data: () => { return {} },
}

</script>

