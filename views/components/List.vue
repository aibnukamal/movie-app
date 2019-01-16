<template>
  <div>
    <h1>Tokoflix</h1>
    <span>Saldo: {{ formatCurrency(balance) }}</span>
    <br>
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
  import { currencyFormating } from './../store'
  export default {
    data(){
      return{
        items: []
      }
    },
    created() {
      this.fetchItems()
      this.scroll(this.items)
      window.history.pushState({}, '/', `?`)
    },
    computed: {
      ...mapState(['balance']),
      ...mapGetters(['slug', 'image', 'limitText', 'pricing', 'getParameterByName'])
    },
    methods: {
      fetchItems(){
        const uri = 'http://localhost:4000/api/movie/now-playing'
        this.axios.get(uri).then((response) => this.items = response.data.data.results)
      },
      formatCurrency(price){
        return currencyFormating('IDR', price)
      },
      scroll (items) {
        window.onscroll = () => {
          const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight

          if (bottomOfWindow) {
            const getPage = this.getParameterByName('page')
            const page = getPage ? parseInt(getPage) + 1 : 2
            const uri = `http://localhost:4000/api/movie/now-playing?page=${page}`
            this.axios.get(uri).then((response) => {
              const data = response.data.data.results
              if(data.length > 0){
                this.items.push(...response.data.data.results)
                window.history.pushState({}, '/', `?page=${page}`)
              }
            })
          }
        }
      }
    }
  }
</script>
