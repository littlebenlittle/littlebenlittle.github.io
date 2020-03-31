
<template>
  <div>
    <v-dialog
      v-for="cur in currencies"
     :key="'dialog-' + cur.name"
      max-width="290"
      v-model="cur.qr.show"
    >
      <v-card>
        <v-card-title class="headline">
          {{ cur.name }}
        </v-card-title>

        <v-img
         :src="cur.qr.url"
        >
        </v-img>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="cur.qr.show = false"
          >
              Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-expansion-panels>

      <v-expansion-panel
        v-for="cur in currencies"
       :key="'expansion-panel-' + cur.name"
      >
        <v-expansion-panel-header>
          {{ cur.name }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-btn
            rounded
            @click.stop="cur.qr.show = true"
          >
            Show QR
          </v-btn>

        </v-expansion-panel-content>
      </v-expansion-panel>

    </v-expansion-panels>
  </div>
</template>

<script>

import btcqr from "../assets/btc.svg"
import ethqr from "../assets/eth.svg"

export default {
  name: 'CurrencyExpansionPanels',
  data: () => { return {
    currencies: [
      {
        name: 'Bitcoin',
        qr: {
          show : false,
          url  : btcqr,
        },
      },
      {
        name: 'Ethereum',
        qr: {
          show : false,
          url  : ethqr,
        },
      },
    ]
  }},
}

</script>

