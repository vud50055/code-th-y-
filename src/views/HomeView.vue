<template>
  <div class="home">
    <section class="banner-home">
      <div class="img">
        <img
          src="@/assets/images/banner-home.jpg"
          alt=""
        >
      </div>
    </section>
    <section class="home-cate">
      <div class="container">
        <div class="row justify-content-center">
          <div
            v-for="(menu, i) in getMenu"
            :key="i"
            class="col-lg-4"
          >
            <div class="item-cate-home wow fadeInRight delay01 ">
              <a
                :href="`/products/${menu.id}`"
                title=""
                class="link-pri"
              />
              <span class="ic"><img
                :src="require(`../assets/media${menu.img}`)"
                alt=""
              ></span>
              <h3 class="title">{{ $t(`home.${menu.title}`) }}</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'HomeView',
    computed: {
      ...mapGetters({
        getMenu: 'home/getMenu'
      })
    }
  }
</script>
