<template>
  <v-container>
    <!-- TODO: ben on 2020-04-02T18:19:29Z MDT
      Fix the upper padding on the sponsor/stackoverflow
      section so the cards all line up neatly
    -->
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
        <v-row
        >
          <v-col
            cols="12"
          >
            <SponsorCard/>
          </v-col>
          <v-col>
            <StackOverflowCard
              userid="5530704"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import GithubCard        from './GithubCard'
  import SponsorCard       from './SponsorCard'
  import StackOverflowCard from './StackOverflowCard'

  export default {
    name: "OpenSourceBar",
    components: {
      GithubCard,
      SponsorCard,
      StackOverflowCard,
    },
    data: () => { return {} },
}

</script>

