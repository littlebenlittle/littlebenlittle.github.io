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
     <RecentActivity/>
  </v-app>
</template>

<script>
  /* eslint-disable */
  import style from './css/style.css'
  /* eslint-ensable */
  import TitleCard      from './components/TitleCard'
  import Portrait       from './components/Portrait'
  import RecentActivity from './components/RecentActivity'

  function make_model(props) {
    props
    return {
        titlecard: {
            height: 250,
        },
    }
  }

  export default {
    name: 'App',
    components: {
      TitleCard,
      Portrait,
      RecentActivity,
    },
    data: () => {return {}},
    computed: {
      model () {
        var m = make_model(this.$props)
        switch(this.$vuetify.breakpoint.name) {
          case 'xs':
            m.titlecard.width = 500
            break
          case 'sm':
            m.titlecard.width = 600
            break
          default:
            m.titlecard.width = window.innerWidth * 0.80
        }
        return m
      },
    }
  };

</script>
