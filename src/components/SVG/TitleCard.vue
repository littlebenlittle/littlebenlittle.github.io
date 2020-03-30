<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
   :width="width"
   :height="height"
    class="blue lighter-2"
  >

      <foreignObject
         id="portrait"
        :x="model.portrait.x"
        :y="model.portrait.y"
        :width="model.portrait.width"
        :height="model.portrait.height"
      >
          <img
           :width="model.portrait.width"
           :height="model.portrait.height"
            src="../../assets/avatar.png"
            alt="Ben Little smiles for camera"
            style="opacity: 0.5;"
          />
      </foreignObject>

      <line
        v-for="card in model.cards"
       :key="card"
       :x1="model.hub.x"
       :y1="model.hub.y"
       :x2="card.joint.x"
       :y2="card.joint.y"
       stroke="black"
       stroke-width="3px"
      />

      <foreignObject
        v-for="card in model.cards"
       :key="card"
       :x="card.x"
       :y="card.y"
       :width="card.width"
       :height="card.height"
      >
          <div
            width="100%"
            height="100%"
              style="text-align: end; padding-right: 10px;"
          >
            <p
             :class="card.classes"
            >
              {{ card.text }}
            </p>
          </div>
      </foreignObject>

  </svg>
</template>

<script>

function make_model(props) {
    return {
        portrait: {
            radius: props.height * 3/4,
        },
        cards: [
            {
              text    : props.name,
              width   : 110,
              height  : 30,
              angle   : 10/24 * 2 * Math.PI,
              classes : "title",
            },
            {
              text    : props.title,
              width   : 150,
              height  : 30,
              angle   : 11/24 * 2 * Math.PI,
              classes : "subtitle-2",
            },
            {
              text    : props.tagline,
              width   : 250,
              height  : 30,
              angle   : 14/24 * 2 * Math.PI,
              classes : "",
            },
        ],
        hub: {
            x: props.width  * 5/7,
            y: props.height * 1/2,
        },
    }
  }

  function vec_add(point, angle, radius) {
      var x = point.x + 6/11 * radius * Math.cos( angle )
      var y = point.y - 6/11 * radius * Math.sin( angle )
      return {x, y}
  }

  export default {
    name: 'TitleCard',
    components: {
    },
    props: {
      name:    String,
      title:   String,
      tagline: String,
      width:   Number,
      height:  Number,
    },
    data: () => { return {} },
    computed: {
      model () {
          var m = make_model(this.$props)
          m.portrait.x      = m.hub.x - m.portrait.radius / 2
          m.portrait.y      = m.hub.y - m.portrait.radius / 2
          m.portrait.width  = m.portrait.radius
          m.portrait.height = m.portrait.radius

          m.cards.forEach( card => {
              card.joint = vec_add(m.hub, card.angle, m.portrait.radius)
              card.x = card.joint.x - card.width
              card.y = card.joint.y - card.height / 2
          })

          return m
      }
    }
  }

</script>

