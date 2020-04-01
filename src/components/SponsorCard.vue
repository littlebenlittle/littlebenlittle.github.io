<template>
  <v-card>

    <!-- TODO: ben on 2020-04-01T11:24:30Z MDT
       This card should include a large icon like
       
       https://fontawesome.com/icons/hand-holding-heart

       Vuetify has support for font-awesome; see
       https://vuetifyjs.com/en/customization/icons/#install-font-awesome-4-icons)

       but with a project this size, we should probably just add
       the SVG icons to the repo in the assets directory
    -->

    <v-card-title>
      Sponsor Me!
    </v-card-title>

    <v-card-text>
      Open source development rarely provides any sort of tangible
      compensation. You can help me keep the code running by donating 🙇
    </v-card-text>

    <CurrencyExpansionPanelGroup/>

  </v-card>
</template>

<script>
  
  import CurrencyExpansionPanelGroup from "./Currency/ExpansionPanel/Group"

  export default {
    name: 'SponsorCard',
    components: {
        CurrencyExpansionPanelGroup,
    },
    data: () => { return {
    }},
  }
</script>

