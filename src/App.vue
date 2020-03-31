<template>
  <v-app>
    <v-container>

      <v-row
        align="stretch"
      >
        <v-col
          cols="12"
        >
          <TitleCard
            ref="theTitleCard"
            name="Ben Little"
            title="Software Engineer"
            tagline="Mindful, Mathematical, Modular"
          />
        </v-col>
      </v-row>

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
  import TitleCard   from './components/TitleCard'
  import GithubCard  from './components/GithubCard'
  import SponsorCard from './components/SponsorCard'

  export default {
    name: 'App',
    components: {
      TitleCard,
      GithubCard,
      SponsorCard,
    },
    data: () => {return {}},
    computed: {
      model () {
        let props = this.$props
        let refs = this.$refs
        console.log(refs)
        let m = {}
        m.titlecard = {
          width  : refs.theTitleCard.width,
          height : refs.theTitleCard.height,
        }
        return m
      },
    }
  };

</script>
