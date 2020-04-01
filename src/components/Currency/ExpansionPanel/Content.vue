
<template>
  <v-expansion-panel-content>
    <v-container>
      <v-row
        align="center"
      >
        <v-col
          cols=2
        >
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

