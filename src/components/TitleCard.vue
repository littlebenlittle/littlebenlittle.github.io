<template>
  <v-card>
    <v-container>
      <v-row>
        <PortraitDial
         :name="name"
         :title="title"
         :tagline="tagline"
         :width="400"
         :height="150"
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

