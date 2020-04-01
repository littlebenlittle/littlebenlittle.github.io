<template>
  <v-app>

    <div
      height="200"
      style="position: fixed; margin-top: 20;"
    >
      <v-img
        src="./assets/rack.jpg"
        gradient="to top right, rgba(25,32,86,.9), rgba(100,115,201,.4)"
        style="position: fixed;"
        height="300"
      />
    </div>

    <TitleBar/>

    <v-container>
      <v-row
        align="stretch"
      >
        <v-col
          cols="12"
          sm="7"
          align="center"
        >
          <GithubCard/>
        </v-col>
        <v-col
          align="center"
        >
          <SponsorCard/>
        </v-col>
      </v-row>
    </v-container>

  </v-app>
</template>

<script>
  /* eslint-disable */
  import style from './css/style.css'
  /* eslint-ensable */
  import TitleBar    from './components/TitleBar'
  import GithubCard  from './components/GithubCard'
  import SponsorCard from './components/SponsorCard'

  export default {
    name: 'App',
    components: {
      TitleBar,
      GithubCard,
      SponsorCard,
    },
    data: () => {return {}},
    computed: {
    }
  };

</script>
