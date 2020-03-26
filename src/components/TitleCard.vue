
<template>
  <v-container
    fluid
    class="blue d-flex"
  >
    <v-col
      class="title"
    >
      <v-row class="justify-end">
        <v-title
          class="title justify-around"
        >
          {{ title }}
        </v-title>
        <v-subtitle
          class="subtitle justify-around"
        >
          {{ tagline }}
        </v-subtitle>
      </v-row>
    </v-col>
    <v-col
      class="title"
    >
      <v-avatar>
        <img :src="avatar">
      </v-avatar>      
    </v-col>
  </v-container>
</template>

<script>
export default {
  name: 'TitleCard',
  props: [
    'avatar',
    'name',
    'title',
    'tagline',
  ],
  data: () => {

  }
}

</script>

