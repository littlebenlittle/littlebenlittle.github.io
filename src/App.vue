<template>
  <v-app>
    <TheNavigationBar/>
    <v-content>
      <TitleCard
        :avatar="avatar"
        :name="name"
        :title="title"
        :tagline="tagline"
      />
      <Highlights
        showRecentActivity=showRecentActivity
      />
      <Projects
        projects=projects
      />
    </v-content>
  </v-app>
</template>

<script>
import TheNavigationBar from './components/TheNavigationBar';
import TitleCard from './components/TitleCard';
import Highlights from './components/Highlights';
import Projects from './components/Projects';

export default {
  name: 'App',

  components: {
    TheNavigationBar,
    TitleCard,
    Highlights,
    Projects,
  },

  data: () => ({
    avatar: "assets/avatar.png",
    name: "Ben Little",
    title: "Software Engineer",
    tagline: "Mindful, Mathematical, Modular",
    showRecentActivity: true,
    projects: [
      {
        title: "Raku in the Browser",
        link: "raku-in-the-browser"
      }
    ],
  }),
};
</script>
