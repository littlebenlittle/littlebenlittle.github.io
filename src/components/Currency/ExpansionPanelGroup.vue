
<template>
  <v-container>

    <CurrencyQRDialog
      v-for="cur in currencies"
     :key="cur.name + '-dialog'" 
     :name="cur.name"
     :show="cur.qr.show"
     :src="cur.qr.url"
      v-on:done="cur.qr.show = false"
    />

    <v-expansion-panels>
      <CurrencyExpansionPanel
        v-for="cur in currencies"
       :key="cur.name + 'expansion-panel'"
       :name="cur.name"
       :icon="cur.icon.url"
        v-on:show-qr="cur.qr.show = true"
      />
    </v-expansion-panels>

  </v-container>
</template>

<script>

import btcqr   from "../../assets/btc-qr.svg"
import ethqr   from "../../assets/eth-qr.svg"
import btcicon from "../../assets/btc-icon.svg"
import ethicon from "../../assets/eth-icon.svg"

import CurrencyExpansionPanel from "./ExpansionPanel"
import CurrencyQRDialog from "./QRDialog"

export default {
  name: 'CurrencyExpansionPanels',
  components: {
    CurrencyExpansionPanel,
    CurrencyQRDialog,
  },
  data: () => { return {
    currencies: [
      {
        name: 'Bitcoin',
        qr: {
          show : false,
          url  : btcqr,
        },
        icon: {
          url  : btcicon,
        },
      },
      {
        name: 'Ethereum',
        qr: {
          show : false,
          url  : ethqr,
        },
        icon: {
          url  : ethicon,
        },
      },
    ]
  }},
}

</script>

