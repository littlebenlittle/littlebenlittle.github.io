<template>
  <v-container>
    <v-row
      align="center"
      justify="end"
    >
      <v-col
        cols="6"
      >
        <TitleCard
          name="Ben Little"
          title="Software Engineer"
          tagline="Mindful, Mathematical, Modular"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import TitleCard from './TitleCard'
  export default {
    name: 'TitleBar',
    components: {
      TitleCard,
    },
    data: () => { return {} },
  }
</script>

