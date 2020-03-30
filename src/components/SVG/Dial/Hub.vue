<template>
  <svg
    id="Hub"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
  >
    <foreignObject
      :width="width"
      :height="height"
      x="0"
      y="0"
    >
      <slot></slot>
    </foreignObject>
  </svg>
</template>

<script>
export default {
  name: 'Hub',
  data: () => { return {} },
  props: {
    radius: Number,
  },
  computed: {
    x() { return (-this.$parent.r - this.$props.radius) * 1/2 },
    y() { return -this.$parent.r * 1/2 },
    width()  { return this.$parent.r },
    height() { return this.$parent.r },
  }
}

</script>

