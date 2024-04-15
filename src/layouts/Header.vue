<template>
  <header>
    <div class="container">
      <div class="wrap-hd">
        <a
          href="/"
          title=""
          class="logo"
        >
          <img src="@/assets/images/a76e519273bf4e7eb78862db9680f3c2.png"></a>
        <div class="right-hd">
          <nav
            v-if="!getUser"
            class="d-nav"
          >
            <ul class="main-nav flex-center-end">
              <li>
                <a
                  href="#"
                  @click="signInGG"
                >{{ $t('layout.login') }}
                </a>
              </li>
            </ul>
          </nav>
          <a
            v-else
            href="javascript:;"
            class="icon-menu open-mnav"
          >
            <span />
            <span />
            <span />
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'LayoutHeader',
    computed: {
      ...mapGetters({
        getUser: 'user/getUser'
      })
    },
    methods: {
      ...mapActions({
        setUser: 'user/setUser'
      }),
      async signInGG() {
        const googleUser = await this.$gAuth.signIn()
        await this.setUser({ google_token: googleUser.getAuthResponse().id_token })
      }
    }
  }
</script>
