<template>
    <v-expansion-panel >

      <v-expansion-panel-header>
          <v-row
            align="center"
          >
            <v-col
              cols=2
            >
              <v-avatar
                size="24"
              >
                <img
                 :src="icon"
                />
              </v-avatar>
            </v-col>
            <v-col
            >
              <div
                class="title"
              >
                {{ name }}
              </div>
            </v-col>
          </v-row>
      </v-expansion-panel-header>

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

    </v-expansion-panel>
</template>

<script>
export default {
  data: () => { return {
  }},
  props: {
      name : String,
      icon : String,
  },
}

</script>

