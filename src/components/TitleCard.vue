<template>
  <v-card>
    <v-container>
      <v-row>
        <!-- TODO: ben on 2020-04-01T08:33:02Z
           Dial radius and position need to be responsive
           see:
           - ../../models/portrait-dial-model.svg
           - https://google.com/search?q=responsive+web+design
           - https://vuetifyjs.com/en/customization/breakpoints
        -->
        <PortraitDial
         :name="name"
         :title="title"
         :tagline="tagline"
         :width="400"
         :height="200"
          skeleton
        />
      </v-row>
    </v-container>
  </v-card>
</template>

<script>

  import PortraitDial from './PortraitDial'

  export default {
    name: 'TitleCard',
    components: {
      PortraitDial,
    },
    data: () => { return {} },
    props: {
      name    : String,
      title   : String,
      tagline : String,
    },
    computed: {
      radius () {
        return this.$props.height
      },
    },
  }

</script>

