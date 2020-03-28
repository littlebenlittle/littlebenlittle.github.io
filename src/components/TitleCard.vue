<template>
  <v-container>
    <Dial
      :axles="axles"
      :hub="hub"
    />
  </v-container>
</template>

<script>
import Dial from './Dial';

export default {
  name: 'TitleCard',
  components: {
    Dial
  },
  props: {
    name:    String,
    title:   String,
    tagline: String,
    width:   Number,
    height:  Number,
  },
  data: () => { return {} },
  
  computed: {
    hub () {
      return {
        x: this.$props.width  * 5/7,
        y: this.$props.height * 1/2,
      }
    },
    axles () {
      return {
        name: {
            angle: 9/24,
            radius: 100,
            content: {
              text:   this.$props.name,
              width:  75,
              height: 10,
            }
        },
        title: {
            angle:  10/24,
            radius: 100,
            content: {
              text:   this.$props.title,
              width:  135,
              height: 10,
            }
        },
        tagline: {
            angle:  12/24,
            radius: 100,
            content: {
              text:   this.$props.tagline,
              width:  232,
              height: 10,
            }
        },
      }
    },
  },

}

</script>

