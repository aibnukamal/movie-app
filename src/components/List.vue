<template>
  <div>
    <select v-model="filter.country" v-on:change="selectRegion()" style="float:right">
      <option disabled>Select Region</option>
      <option value="all">All Country</option>
      <option value="id">Indonesia</option>
    </select>
    <h1>Tokoflix</h1>
    <span>Balance: {{ formatCurrency(balance) }}</span>
    <br>
    <br>
    <br>
    <h4>Now Playing</h4>
    <br>
    <div class="container mt-2">
      <div class="row">
        <div v-for="item in items" :key="item.index" class="col-md-2 col-sm-12 margin-20">
          <router-link :to="{name: 'Detail', params: { id: item.id, slug: slug(item.original_title) }}">
          <div class="card card-block">
            <img :src="image(item)" :alt="`Photo of ${item.original_title}`" >
            <h5 class="card-title mt-3 mb-3 title-list">{{ limitText(item.original_title, 17) }}</h5>
            <p class="card-text content-list">
              Rating: {{ item.vote_average }}
              <br>
              Price: {{ pricing(item.vote_average) }}
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
      items: [],
      country: 'id'
    }
  },
  created () {
    this.fetchItems()
    this.scroll(this.items)
    window.history.pushState({}, '/', `?`)
  },
  computed: {
    ...mapState(['balance', 'filter']),
    ...mapGetters(['slug', 'image', 'limitText', 'pricing', 'getParameterByName'])
  },
  methods: {
    fetchItems () {
      const region = this.filter.country !== 'all' ? `&region=${this.filter.country}` : ''
      const uri = `https://api.themoviedb.org/3/movie/now_playing?api_key=c7c69aa876af679ca32ddbbe0e533952&language=en-US&page=1${region}`
      this.axios.get(uri).then((response) => {
        this.items = response.data.results
      })
    },
    formatCurrency (price) {
      return currencyFormating('IDR', price)
    },
    scroll (items) {
      window.onscroll = () => {
        const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight

        if (bottomOfWindow) {
          const getPage = this.getParameterByName('page')
          const page = getPage ? parseInt(getPage) + 1 : 2
          const region = this.filter.country !== 'all' ? `&region=${this.filter.country}` : ''
          const uri = `https://api.themoviedb.org/3/movie/now_playing?api_key=c7c69aa876af679ca32ddbbe0e533952&language=en-US&page=${page}${region}`
          this.axios.get(uri).then((response) => {
            const data = response.data.results

            if (data.length > 0) {
              this.items.push(...response.data.results)
              window.history.pushState({}, '/', `?page=${page}`)
            }
          })
        }
      }
    },
    selectRegion () {
      this.$store.commit('setCountry', this.filter.country)
      this.fetchItems()
      window.history.pushState({}, '/', `?`)
    }
  }
}
</script>
