
<template>
  <v-card>
    <div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/octicons/3.5.0/octicons.min.css">
      <github-feed login="littlebenlittle" />
    </div>
  </v-card>
</template>

<script>

  import Vue from 'vue'
  import VueGithubActivity from 'vue-github-activity'

  Vue.use(VueGithubActivity)

  export default {
    name: 'GithubCard',
    data: () => { return {} },
  }
</script>

