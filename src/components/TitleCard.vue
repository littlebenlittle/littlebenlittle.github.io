<template>
  <v-card
    class="blue lighten-3"
    ref="mainCard"
  >
    <v-col
      align="center"
      justify="center"
    >
      <PortraitDial
       :name="name"
       :title="title"
       :tagline="tagline"
       :width="width"
       :height="height"
      />
    </v-col>
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
      width () {
        return 250
      },
      height () {
        return 250
      },
    },
  }

</script>

