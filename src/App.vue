<template>
  <v-app>
      <TitleCard
        name="Ben Little"
        title="Software Engineer"
        tagline="Mindful, Mathematical, Modular"
       :width="model.titlecard.width"
       :height="model.titlecard.height"
     >
         <Portrait/>
     </TitleCard>
  </v-app>
</template>

<script>
  import TitleCard from './components/SVG/TitleCard';
  import Portrait  from './components/Portrait';

  function make_model(props) {
    props
    return {
        titlecard: {
            width:  900,
            height: 250,
        },
    }
  }

  export default {
    name: 'App',
    components: {
      TitleCard,
      Portrait,
    },
    data: () => {return {}},
    computed: {
      model () {
        var m = make_model(this.$props)
        return m
      },
    }
  };

</script>
