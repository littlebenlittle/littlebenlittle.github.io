<template>
  <svg
    id="Dial"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :x="_x" 
    :y="_y"
  >
      <slot></slot>
  </svg>
</template>

<script>

function build_axle(hub, ax) {
  var joint_x = hub.x + ax.radius * Math.cos(ax.angle * 6.24)
  var joint_y = hub.y - ax.radius * Math.sin(ax.angle * 6.24)
  return {
    'angle':  ax.angle,
    'radius': ax.radius,
    'joint': {
        x: joint_x,
        y: joint_y,
    }
  }
}

export default {
  name: 'Dial',
  props: {
    x: Number,
    y: Number,
    r: Number,
  },
  data: () => { return {} },
  computed: {
    width  () { return this.$parent.width },
    height () { return this.$parent.height },
    _axles () { return Object.values(this.$props.axles).map( ax => {
        return build_axle(this.$props.hub, ax)
      })
    },
    _x () { return (this.$parent.width  - this.$props.r) *5/7 },
    _y () { return (this.$parent.height - this.$props.r) *1/2 },
  },
}

</script>

