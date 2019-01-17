<template>
  <div>
    <h1>
      <router-link :to="{name: 'List'}">
        Tokoflix
      </router-link>
    </h1>
    <h4 style="float: right">
      <router-link :to="{name: 'List'}">
        Back
      </router-link>
    </h4>
    <span>Balance: {{ formatCurrency(balance) }}</span>
    <br>
    <br>
    <button v-if="!isMyMovie(movie.detail)">Purchased</button>
    <button v-else-if="balance < pricing(movie.detail.vote_average, false)">Insufficient balance</button>
    <button v-else-if="pricing(movie.detail.vote_average, false) != 0" @click="buy(movie.detail)">Buy {{ pricing(movie.detail.vote_average) }}</button>
    <br>
    <br>
    <div class="container mt-2">
      <div class="row">
        <div class="col-md-4 col-sm-12 margin-20">
          <div class="card-block">
            <img :src="`${ image(movie.detail) }`" :alt="`Photo of ${movie.detail.original_title}`" >
          </div>
        </div>
        <div class="col-md-8 col-sm-12 margin-20">
          <div class="col-md-12 col-sm-12" style="float:right">
            <h1 class="card-title mt-5 mb-5 title-list" style="height:38px"><a :href="`${movie.detail.hompage}`" target="_blank">{{ movie.detail.original_title }}</a></h1>
            <h1 class="card-title mt-5 mb-5 title-list" style="height:38px">
              {{ movie.detail.release_date.split('-')[0] }} |
              {{ movie.detail.genres.map(g => g.name).join(', ') }} |
              {{ movie.detail.runtime }} mins
              {{ movie.detail.vote_average > 0 ? ` | Rating ${movie.detail.vote_average}` : ''}}
            </h1>
            <div style="padding:10px">{{ movie.detail.overview }}</div>
          </div>
          <div class="col-md-12 col-sm-12" style="float:right">
            <h4 class="card-title mt-3 mb-3 title-list">Star : </h4>
            <div class="col-md-3 col-sm-12" v-for="cast in movie.cast.cast.slice(0, 5)" :key="cast.index" style="margin:5px; border: 1px solid #f1f1f1;padding:0px">
              <div class="col-md-4 col-sm-12" style="margin:0px;padding:0px">
                <img style="width:100%" :src="`https://image.tmdb.org/t/p/w300_and_h450_bestv2${ cast.profile_path }`" :alt="`Photo of ${cast.name}`" >
              </div>
              <div class="col-md-7 col-sm-12">
                <p><strong>{{ cast.name }}</strong> as {{ cast.character }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br>
    <h1>Similiar Movies</h1>
    <br>
    <div class="container mt-2">
      <div class="row">
        <div v-for="similiar in similiars" :key="similiar.index" class="col-md-2 col-sm-12 margin-20">
          <router-link :to="{name: 'Detail', params: { id: similiar.id, slug: slug(similiar.original_title) }}" v-on-click="scrolltop()">
          <div class="card card-block">
            <img :src="`${ image(similiar) }`" :alt="`Photo of ${similiar.original_title}`" >
            <h5 class="card-title mt-3 mb-3 title-list">{{ limitText(similiar.original_title, 17) }}</h5>
            <p class="card-text content-list">
              Rating: {{ similiar.vote_average }}
              <br>
              Price: {{ pricing(similiar.vote_average) }}
            </p>
          </div>
          </router-link>
        </div>
      </div>
    </div>
    <h1>Recommendations Movies</h1>
    <br>
    <div class="container mt-2">
      <div class="row">
        <div v-for="recommendation in recomendations" :key="recommendation.index" class="col-md-2 col-sm-12 margin-20">
          <router-link :to="{name: 'Detail', params: { id: recommendation.id, slug: slug(recommendation.original_title) }}" v-on-click="scrolltop()">
          <div class="card card-block">
            <img :src="`${ image(recommendation) }`" :alt="`Photo of ${recommendation.original_title}`" >
            <h5 class="card-title mt-3 mb-3 title-list">{{ limitText(recommendation.original_title, 17) }}</h5>
            <p class="card-text content-list">
              Rating: {{ recommendation.vote_average }}
              <br>
              Price: {{ pricing(recommendation.vote_average) }}
            </p>
          </div>
          </router-link>
        </div>
    </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { currencyFormating } from './store'

export default {
  data () {
    return {
      movie: [],
      similiars: [],
      recomendations: []
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.movie = this.fetchItems(to.params.id)
    this.similiars = this.fetchSimiliar(to.params.id)
    this.recomendations = this.fetchRecomendation(to.params.id)
    next()
  },
  created () {
    const id = this.$router.currentRoute.params.id
    this.fetchItems(id)
    this.fetchSimiliar(id)
    this.fetchRecomendation(id)
    this.scroll(this.items)
  },
  computed: {
    ...mapState(['balance', 'myMovie']),
    ...mapGetters(['slug', 'image', 'limitText', 'pricing'])
  },
  methods: {
    fetchItems (ids = null) {
      const id = ids || this.$router.currentRoute.params.id
      const detailUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=c7c69aa876af679ca32ddbbe0e533952&language=en-US`
      const castUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=c7c69aa876af679ca32ddbbe0e533952`

      this.axios.all([
        this.axios.get(detailUrl),
        this.axios.get(castUrl)
      ])
        .then(this.axios.spread((detailRes, castRes) => {
          const detail = detailRes.data
          const cast = castRes.data

          this.movie = { detail, cast }
        }))
    },
    fetchSimiliar (id) {
      const uri = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=c7c69aa876af679ca32ddbbe0e533952&language=en-US&page=1`
      this.axios.get(uri).then((response) => { this.similiars = response.data.results.slice(0, 6) })
    },
    fetchRecomendation (id) {
      const uri = `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=c7c69aa876af679ca32ddbbe0e533952&language=en-US&page=1`
      this.axios.get(uri).then((response) => { this.recomendations = response.data.results.slice(0, 6) })
    },
    scroll (items) {
      window.onscroll = () => false
    },
    formatCurrency (price) {
      return currencyFormating('IDR', price)
    },
    buy (movie) {
      const amount = this.pricing(movie.vote_average, false)
      this.$store.commit('creditBalance', amount)
      this.$store.commit('setMyMovie', movie.id)
    },
    isMyMovie (movie) {
      return this.myMovie.indexOf(movie.id) === -1
    },
    scrolltop: () => window.scrollTo(0, 0)
  }
}
</script>
