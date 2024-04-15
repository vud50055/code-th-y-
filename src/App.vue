<template>
  <div
    id="app"
    class="wrap"
  >
    <div v-if="adminType">
      <admin-header />
      <div class="container-fluid">
        <div class="row">
          <nav class="col-md-2 d-none d-md-block bg-light sidebar px-0">
            <div class="sidebar-sticky">
              <ul class="nav flex-column">
                <li class="nav-item">
                  <a
                    :class="`nav-link flex-center ${recordPage ? 'active' : ''}`"
                    href="/admin/records"
                  >
                    <img
                      src="@/assets/images/icon/home_icon.svg"
                      class="feather feather-home mr-2"
                    >
                    <span>{{ $t('records.list_records') }}</span>
                  </a>
                </li>
                <li class="nav-item text-nowrap logout-btn">
                  <button
                    class="nav-link flex-center"
                    style="margin: 0 auto"
                    @click="signOut"
                  >
                    <img
                      src="@/assets/images/icon/logout_icon.svg"
                      class="feather feather-home mr-2"
                    >
                    {{ $t('layout.sign_out') }}
                  </button>
                </li>
              </ul>
            </div>
          </nav>
          <main
            role="main"
            class="col-md-9 col-lg-10 pa-0"
          >
            <router-view />
          </main>
        </div>
      </div>
    </div>
    <div v-else>
      <layout-header />
      <!-- <div
        id="back-to-top"
        class="back-top"
      >
        <i class="fas fa-chevron-up" />
      </div> -->
      <router-view />
      <layout-footer />
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import LayoutHeader from '@/layouts/Header.vue'
  import LayoutFooter from '@/layouts/Footer.vue'
  const AdminHeader = () => import('@/layouts/AdminHeader.vue')

  export default {
    components: {
      LayoutHeader,
      LayoutFooter,
      AdminHeader
    },
    computed: {
      adminType() {
        return this.$route.path.includes('admin')
      },
      recordPage() {
        return this.$route.name.includes('record')
      }
    },
    async created() {
      await this.setHomeMenu()
    },
    methods: {
      ...mapActions({
        setHomeMenu: 'home/setHomeMenu'
      }),
      signOut() {
        localStorage.removeItem('accesstoken')
        localStorage.removeItem('refresh')
        this.$router.push({ name: 'home' })
      }
    }
  }
</script>

<style>
@import './assets/css/bootstrap.min.css';
@import './assets/css/app.css';
@import './assets/css/custom.css';

.ar-icon--pulse, .ar-icon--rec{
  display: none !important;
}
.ar-icon__sm {
  width: 45px !important;
  height: 45px !important;
  line-height: 45px !important;
  box-shadow: 0 2px 5px 1px rgba(158, 158, 158, 0.5) !important;
  top:unset !important;
  position: initial !important;
}
.ar-icon__lg {
  margin-right: 10px;
}
.ar-recorder {
  display: inline-flex !important;
  flex-direction: unset !important;
}
</style>

<style>
.sidebar-sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 48px;
  height: calc(100vh - 85px);
  overflow-x: hidden;
  overflow-y: auto;
}
.feather {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}
.feather-lg {
  width: 20px;
  height: 20px;
  vertical-align: text-bottom;
}
nav {
  padding: 0;
}
.nav-item {
  text-align: center;
}
.nav-link.active {
  background-image: linear-gradient(80deg,#66a6ff,#4cabb1);
  color: #10207A
}
.logout-btn {
  position: absolute;
  bottom: 60px;
  width: 100%;
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.pa-0 {
  padding: 0 !important;
}
</style>
