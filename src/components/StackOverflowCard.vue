
<template>
  <v-card>
    <div>
      CONTENT
    </div>
  </v-card>
</template>

<script>
  import parser from 'rss-parser'

  export default {
    data: () => { return {} },
    methods: {
      model () {
        return parser.parse(this.$prop.feed)
      },
    },
  }

</script>

