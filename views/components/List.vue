<template>
  <div>
    <h1>TFLIX</h1>
    <br>
    <div class="container mt-2">
      <div class="row">
        <div v-for="item in items" :key="item.index" class="col-md-2 col-sm-12 margin-20">
          <div class="card card-block">
            <img :src="`https://image.tmdb.org/t/p/w300_and_h450_bestv2${ item.poster_path }`" :alt="`Photo of ${item.original_title}`" >
            <h5 class="card-title mt-3 mb-3 title-list">{{ limitText(item.original_title, 17) }}</h5>
            <p class="card-text content-list">
              Rating: {{ item.vote_average }}
              <br>
              Price: {{ pricing(item.vote_average) }}
            </p> 
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return{
        items: []
      }
    },
    created() {
      this.fetchItems();
    },
    mounted() {
      this.scroll(this.items)
      window.history.pushState({}, '/', `?`)
    },
    methods: {
      fetchItems(){
        const uri = 'http://localhost:4000/api/movie/now-playing';
        this.axios.get(uri).then((response) => this.items = response.data.data.results)
      },
      pricing(rating){
        const price = rating === 0 ? 0 : (rating > 0 && rating <= 3 ? 3500 : (rating > 3 && rating <= 6 ? 8250 : (rating > 6 && rating <= 8 ? 16350 : 21250)))

        return price === 0 ? '-' : this.currencyFormating('IDR', price)
      },
      limitText(text, count){
        return text.slice(0, count) + (text.length > count ? "..." : "");
      },
      scroll (items) {
        window.onscroll = () => {
          const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;

          if (bottomOfWindow) {
            const getPage = this.getParameterByName('page')
            const page = getPage ? parseInt(getPage) + 1 : 2
            const uri = `http://localhost:4000/api/movie/now-playing?page=${page}`;
            this.axios.get(uri).then((response) => {
              const data = response.data.data.results
              if(data.length > 0){
                this.items.push(...response.data.data.results)
                window.history.pushState({}, '/', `?page=${page}`)
              }
            })
          }
        }
      },
      getParameterByName(name, url = null) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';

        return decodeURIComponent(results[2].replace(/\+/g, ' '));
      },
      currencyFormating(currency, value) {
        return `${currency} ${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
      }
    }
  }
</script>
