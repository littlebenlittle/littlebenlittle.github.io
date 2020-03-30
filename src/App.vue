<template>
  <v-app
  >

    <v-container
     :width="model.titlecard.width"
     :height="model.titlecard.height"
    >
        <v-col
          align="center"
          justify="center"
        >
          <TitleCard
            name="Ben Little"
            title="Software Engineer"
            tagline="Mindful, Mathematical, Modular"
           :width="model.titlecard.width"
           :height="model.titlecard.height"
          />
        </v-col>
    </v-container>

  </v-app>
</template>

<script>
  import TitleCard from './components/SVG/TitleCard';

  function make_model(props) {
    props
    return {
        titlecard: {
            width:  500,
            height: 250,
        },
    }
  }

  export default {
    name: 'App',
    components: {
      TitleCard,
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
