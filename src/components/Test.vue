<template>
  <div>
    <p
      v-for="n in squares"
      :key="n"
    >
      {{ n }}
    </p>
  </div>
</template>

<script>

export default {
  name: 'Test',
  data: () => { return {} },
  props: [ 'numbers' ],
  computed: {
    squares () { return this.$props.numbers }
  },
}


</script>

