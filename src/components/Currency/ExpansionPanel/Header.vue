<template>
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
</template>

<script>
export default {
  name: 'ExansionPanelHeader',
  props: {
    name: String,
    icon: String,
  },
  data: () => { return {} },
}

</script>

