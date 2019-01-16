<template>
  <div>
    <h1>Tokoflix</h1>
    <br>
    <div class="container mt-2">
      <div class="row">
        <div class="col-md-4 col-sm-12 margin-20">
          <div class="card-block">
            <img :src="`${ image(movie.detail) }`" :alt="`Photo of ${movie.detail.original_title}`" >
          </div>
        </div>
        <div class="col-md-8 col-sm-12 margin-20">
          <h1 class="card-title mt-5 mb-5 title-list" style="height:38px"><a :href="`${movie.detail.hompage}`" target="_blank">{{ movie.detail.original_title }}</a></h1>
          <h1 class="card-title mt-5 mb-5 title-list" style="height:38px">
            {{ movie.detail.release_date.split('-')[0] }} | 
            {{ movie.detail.genres.map(g => g.name).join(', ') }} | 
            {{ movie.detail.runtime }} mins
          </h1>
          <p class="card-text content-list">{{ movie.detail.overview }}</p>
          <br>
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
    <br>
    <h1>Similiar Movies</h1>
    <br>
    <div class="container mt-2">
      <div class="row">
        <div v-for="similiar in similiars" :key="similiar.index" class="col-md-2 col-sm-12 margin-20">
          <router-link :to="{name: 'Detail', params: { id: similiar.id, slug: slug(similiar.original_title) }}">
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
          <router-link :to="{name: 'Detail', params: { id: recommendation.id, slug: slug(recommendation.original_title) }}">
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
  import { mapGetters } from 'vuex'
  export default {
    data(){
      return{
        movie: [],
        similiars: [],
        recomendations: []
      }
    },
    created() {
      this.fetchItems()
      this.fetchSimiliar()
      this.fetchRecomendation()
    },
    computed: {
      ...mapGetters(['slug', 'image', 'limitText', 'pricing'])
    },
    methods: {
      fetchItems(){
        const path = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1).split('-')
        const uri = `http://localhost:4000/api/movie/detail/${path[0]}`
        this.axios.get(uri).then((response) => this.movie = response.data.data)
      },
      fetchSimiliar(){
        const path = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1).split('-')
        const uri = `http://localhost:4000/api/movie/similiar/${path[0]}`
        this.axios.get(uri).then((response) => this.similiars = response.data.data.results.slice(0, 6))
      },
      fetchRecomendation(){
        const path = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1).split('-')
        const uri = `http://localhost:4000/api/movie/recomendation/${path[0]}`
        this.axios.get(uri).then((response) => this.recomendations = response.data.data.results.slice(0, 6))
      }
    }
  }
</script>
