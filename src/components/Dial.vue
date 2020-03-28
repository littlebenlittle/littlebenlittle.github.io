<template>
  <v-container>
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      :width="width"
      :height="height"
      class="blue lighten-3"
    >

      <line
        v-for="axle in _axles"
        :key="axle"
        :x1="hub.x"
        :y1="hub.y"
        :x2="axle.joint.x"
        :y2="axle.joint.y"
        stroke="#6c6c6c"
        stroke-dasharray="10 2"
        stroke-width="2"
        display="none"
      />

      <text
        v-for="axle in _axles"
        :key="axle"
        :x="axle.content.x"
        :y="axle.content.y"
      >
        {{ axle.content.text }}
      </text>

      <foreignObject
        :x="hub.x-100"
        :y="hub.y-100"
        :width="200"
        :height="200"
      >
        <v-container>
          <v-img
            transition="scale-transition"
            src="../assets/avatar.png"
            alt="Ben Little smiles for camera"
          ></v-img>
        </v-container>
      </foreignObject>

    </svg>
  </v-container>
</template>

<script>

function build_axle(hub, ax) {
  var joint_x = hub.x + ax.radius * Math.cos(ax.angle * 6.24)
  var joint_y = hub.y - ax.radius * Math.sin(ax.angle * 6.24)
  return {
    'angle':   ax.angle,
    'radius':  ax.radius,
    'content': {
        'x': joint_x - ax.content.width,
        'y': joint_y + ax.content.height/2,
        'text':  ax.content.text,
        'width': ax.content.width,
     },
    'joint': {
        x: joint_x,
        y: joint_y,
    }
  }
}

export default {
  name: 'Dial',
  props: {
    hub: {
      type: Object,
      required: true,
    },
    axles: {
      type: Object,
      required: true,
    },
  },
  data: () => { return {} },
  computed: {
    width  () { return this.$parent.width },
    height () { return this.$parent.height },
    _axles () { return Object.values(this.$props.axles).map( ax => {
        return build_axle(this.$props.hub, ax)
      })
    },
  },
}

</script>

