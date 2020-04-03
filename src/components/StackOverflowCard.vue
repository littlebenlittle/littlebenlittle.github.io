
<template>
  <v-card>
    <div>
      {{ data }}
    </div>
  </v-card>
</template>

<script>
  /* eslint-disable */
  import parser from 'rss-parser'
  /* eslint-enable */

  import axios from 'axios'

  const client = axios.create({
    baseURL: 'https://stackoverflow.com/feeds/user/',
  })

  export default {
    data: () => { return {
      data: 'CONTENT',
    }},
    props: {
      userid : String,
    },
    created () {
      /*TODO: ben on 2020-04-02T22:34:17Z MDT
       * The CORS policy for the stackexchange response
       * prevents this from working. We need a redis/nginx
       * setup to act a reverse proxy.
       */
      client.get(this.userid)
            .then( r => {
              this.data = r.data
            })
            /* eslint-disable */
            .catch( e => {
            /* eslint-disable */
              this.data = 'failed to load stackexchange data'
            })
    },
  }

</script>

