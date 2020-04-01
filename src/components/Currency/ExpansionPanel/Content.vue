<template>
  <v-expansion-panel-content>
    <v-container>
      <v-row
        align="center"
      >
        <!-- TODO: ben on 2020-04-01T11:57:10Z MDT
          Add a monospace-font, non-editable text area
          containing the address of each wallet.

          bitcoin: bc1qvn5eaenmzzke5gnr8e9r5dashrhrgve0w755un

          ethereum: 0x9b3137fb3Dcf87EFD5E90585dbbC49Bc19ce7546

          monero: 4AAdakS614BQXgwCyggBzC5ejxDVrRZ56U27opGcThnrCY97EM9zZbqW1iypjZ5YyZFbTqPjfPKS3XpvodxKHorG425NvjV

          Immediately after, add an icon button for a
          copy-to-clipboard action.

          https://fontawesome.com/icons/clipboard
        -->
        <v-col
          cols=2
        >
          <!-- TODO: ben on 2020-04-01T11:53:40Z MDT
          This should be an icon button, where the icon
          is the svg QR symol:

          https://fontawesome.com/icons/qrcode

          -->
          <v-btn
            rounded
            @click.stop="$emit('show-qr')"
          >
            Show QR
          </v-btn>

        </v-col>
      </v-row>
    </v-container>
  </v-expansion-panel-content>
</template>

<script>
export default {
  name: 'ExansionPanelContent',
  data: () => { return {} },
}

</script>

