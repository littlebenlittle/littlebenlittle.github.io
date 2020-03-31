
<template>
    <v-dialog
      max-width="290"
      v-model="show"
    >

      <v-card>
        <v-card-title class="headline">
          {{ name }}
        </v-card-title>
        <v-img
         :src="src"
        >
        </v-img>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="$emit('done')"
          >
              Done
          </v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>
</template>

<script>
export default {
  data: () => { return {} },
  props: {
      name : String,
      show : Boolean,
      src  : String,
  },
}

</script>

