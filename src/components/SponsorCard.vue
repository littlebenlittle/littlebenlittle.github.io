<template>
  <v-card>

    <div>
      SPONSOR
    </div>

    <CurrencyExpansionPanels/>

  </v-card>
</template>

<script>
  
  import CurrencyExpansionPanels from "./CurrencyExpansionPanels"

  export default {
    name: 'SponsorCard',
    components: {
        CurrencyExpansionPanels,
    },
    data: () => { return {
    }},
  }
</script>

