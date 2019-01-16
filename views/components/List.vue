<template>
  <div>
    <h1>TFLIX Now Playing</h1>
    <br>
    <div class="container mt-2">
      <div class="row">
        <div v-for="item in items" :key="item.index" class="col-md-3 col-sm-6">
          <div class="card card-block">
            <img :src="`https://image.tmdb.org/t/p/w300_and_h450_bestv2${ item.poster_path }`" alt="Photo of sunset">
            <h5 class="card-title mt-3 mb-3">{{ item.original_title }}</h5>
            <p class="card-text">
              Release: {{ item.release_date }}
              <br>
              Rating: {{ item.vote_average }}
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
    created: function()
    {
      this.fetchItems();
    },
    methods: {
      fetchItems()
      {
        let uri = 'http://localhost:4000/api/movie/now-playing';
        this.axios.get(uri).then((response) => {
          this.items = response.data.data.results;
        });
      }
    }
  }
</script>
