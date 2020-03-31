<template>
  <v-card>

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
  
  import CurrencyExpansionPanelGroup from "./Currency/ExpansionPanelGroup"

  export default {
    name: 'SponsorCard',
    components: {
        CurrencyExpansionPanelGroup,
    },
    data: () => { return {
    }},
  }
</script>

