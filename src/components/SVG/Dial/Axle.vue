<template>
  <div
    id="Axle"
  >
    <line 
      :x1="hub.x"
      :y1="hub.y"
      :x2="x"
      :y2="y"
      stroke="black"
    />
  </div>
</template>

<script>
export default {
  name: 'Axle',
  data: () => { return {} },
  props: {
    angle:  Number,
    radius: Number,
  },
  computed: {
    x ()   { return this.$parent.x + this.$props.radius * Math.cos(this.$props.angle * 6.24) },
    y ()   { return this.$parent.y - this.$props.radius * Math.sin(this.$props.angle * 6.24) },
    hub () { return this.$parent },
  },
}
</script>

