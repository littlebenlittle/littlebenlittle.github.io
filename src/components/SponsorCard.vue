<template>
  <v-card>

    <div>
      SPONSOR
    </div>

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

