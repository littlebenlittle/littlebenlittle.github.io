<template>
  <div class="justify-center">
    <v-container class="grey lighten-4">
      <v-row>
        <v-col
          cols="12"
          sm="6"
        >
          <v-hover>
            <v-row class="justify-center justify-sm-end mt-sm-6 title" >
              {{ name }}
            </v-row>
          </v-hover>
          <v-hover>
            <v-row class="justify-center justify-sm-end subtitle-2" >
              {{ title }}
            </v-row>
          </v-hover>
          <v-hover>
            <v-row class="justify-center justify-sm-end mt-4">
              {{ tagline }}
            </v-row>
          </v-hover>
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-row class="justify-center justify-sm-start" >
            <v-img
              max-width="200"
              class="mx-6"
              transition="scale-transition"
              src="../assets/avatar.png"
              alt="Ben Little smiles for camera"
            ></v-img>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'TitleCard',
  props: [
    'name',
    'title',
    'tagline',
  ],
  data: () => {return {}},
}

</script>

