<template>
  <v-app>
    <v-container >
      <v-card
        elevation="7"
       :width="titlecard.width"
       :height="titlecard.height"
      >

        <TitleCard
          name="Ben Little"
          title="Software Engineer"
          tagline="Mindful, Mathematical, Modular"
         :width="titlecard.width"
         :height="titlecard.height"
        />

      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import TitleCard from './components/SVG/TitleCard';

export default {
  name: 'App',
  components: {
    TitleCard,
  },
  data: () => {return {}},
  computed: {
    titlecard () { return {
      width:  500,
      height: 250,
    }},
  }
};
</script>
