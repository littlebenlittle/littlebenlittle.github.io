<template>
    <v-expansion-panel >

      <ExansionPanelHeader
       :name="name"
       :icon="icon"
      />

      <ExansionPanelContent
        v-on:show-qr="$emit('show-qr')"
      />

    </v-expansion-panel>
</template>

<script>

  import ExansionPanelHeader from './Header'
  import ExansionPanelContent from './Content'

  export default {
    name: "ExpansionPanel",
    components: {
        ExansionPanelHeader,
        ExansionPanelContent,
    },
    data: () => { return {
    }},
    props: {
        name : String,
        icon : String,
    },
  }

</script>

