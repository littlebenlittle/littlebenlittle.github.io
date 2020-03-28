<template>
  <v-app>
    <TitleCard
      name="Ben Little"
      title="Software Engineer"
      tagline="Mindful, Mathematical, Modular"
      width="600"
      height="300"
    />
  </v-app>
</template>

<script>
//import TheNavigationBar from './components/TheNavigationBar';
import TitleCard from './components/TitleCard';
//import Highlights from './components/Highlights';
//import Projects from './components/Projects';

export default {
  name: 'App',
  components: {
    //TheNavigationBar,
    TitleCard,
    //Highlights,
    //Projects,
  },
  data: () => {return {}},
};
</script>
