<template>
  <v-card>

    <div>
      SPONSOR
    </div>

    <CurrencyExpansionPanelGroup/>

  </v-card>
</template>

<script>
  
  import CurrencyExpansionPanelGroup from "./CurrencyExpansionPanelGroup"

  export default {
    name: 'SponsorCard',
    components: {
        CurrencyExpansionPanelGroup,
    },
    data: () => { return {
    }},
  }
</script>

