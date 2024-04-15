<template>
  <div v-if="menu">
    <section
      class="banner-page"
      :style="`background: url(${require(`../assets/media${menu.banner}`)}) no-repeat center; background-size: cover;`"
    >
      <div class="container">
        <h2 class="title wow fadeInDown">
          <span>{{ $t(`home.${menu.title}`) }}</span>
        </h2>
      </div>
    </section>

    <section
      class="page-pri"
    >
      <div
        v-for="(product, i) in menu.products"
        :key="i"
        :class="`block-vision wow fadeInUp ${(i+1)%2 == 0 ? 'v2' : ''}`"
      >
        <div class="container">
          <div class="content">
            <a
              :href="product.url"
              title="go to youtube"
              class="block-img"
              data-fancybox
            >
              <span class="img">
                <img
                  :src="require(`../assets/media/thumb${product.thumbnail}`)"
                  alt=""
                >
                <span class="ic" />
              </span>
            </a>
            <div class="ct">
              <h3 class="title">
                <span class="num">{{ i+1 }}</span>
                {{ product.title }}
              </h3>
              <div class="desc">
                {{ product.description }}
              </div>
              <div v-html="product.content" />
              <br>
              <a
                v-if="product.try_url"
                class="title"
                href="#"
                style="text-transform: none; padding-left: 28px;"
                @click="signInGG(product.is_redirect, product.try_url)"
              >Try it</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'PageProduct',
    computed: {
      ...mapGetters({
        getUser: 'user/getUser'
      })
    },
    data() {
      return {
        menu: null
      }
    },
    async created() {
      const productId = this.$route.params.id
      this.menu = await this.getProductInfo(productId)
    },
    methods: {
      ...mapActions({
        getProductInfo: 'product/getProductInfo',
        setUser: 'user/setUser'
      }),
      async signInGG(redirect, url) {
        if (!this.getUser || !localStorage.getItem('refresh')) {
          const googleUser = await this.$gAuth.signIn()
          const res = await this.setUser({ google_token: googleUser.getAuthResponse().id_token })
          if (!res) return
          if (redirect) {
            window.open(url, '_blank').focus()
          } else {
            window.open('/admin/records', '_blank').focus()
          }
        }
      }
    }
  }
</script>
