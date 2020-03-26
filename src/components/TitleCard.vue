<template>
  <v-container
    fluid
    class="blue d-flex"
  >
    <v-col
      class="title"
    >
      <v-row class="justify-end title">
          {{ name }}
      </v-row>
      <v-row class="justify-end subtitle">
          {{ title }}
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
    'name',
    'title',
    'tagline',
    'avatar',
  ],
  data: () => {
    //
  }
}

</script>

