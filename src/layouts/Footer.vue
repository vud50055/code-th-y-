<template>
  <footer>
    <div class="container">
      <a
        href="/"
        title=""
        class="logo-ft wow fadeInUp"
      ><img
        src="@/assets/images/logo.png"
        alt=""
      ></a>
      <div class="row">
        <div class="col-lg-6">
          <div class="ft-left wow fadeInUp delay02">
            <div class="copyright">
              2021 FoxAl. All rights reserved
            </div>
            <ul class="social-ft">
              <li>
                <select v-model="locale">
                  <option value="en">
                    EN
                  </option>
                  <option value="vi">
                    VN
                  </option>
                </select>
              </li>
              <li />
              <li />
            </ul>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="ft-right wow fadeInUp delay02">
            <div class="ft-item">
              <h3 class="title">
                {{ $t('layout.menu') }}
              </h3>
              <ul
                id="link-ft"
                class="link-ft"
              >
                <li>{{ $t('layout.menu_items.product') }}</li>
                <li>{{ $t('layout.menu_items.inventigate') }}</li>
                <li>{{ $t('layout.menu_items.service') }}</li>
              </ul>
            </div>
            <div class="ft-item">
              <h3 class="title">
                {{ $t('layout.pricing') }}
              </h3>
              <ul
                id="pricing-menu-ft"
                class="link-ft"
              >
                <li>{{ $t('layout.pricing_items.personal') }}</li>
                <li>{{ $t('layout.pricing_items.enterprise') }}</li>
                <li>{{ $t('layout.pricing_items.company') }}</li>
              </ul>
            </div>
            <div class="ft-item">
              <h3 class="title">
                {{ $t('layout.support') }}
              </h3>
              <ul
                id="support-menu-ft"
                class="link-ft"
              >
                <li>{{ $t('layout.support_items.support') }}</li>
                <li>{{ $t('layout.support_items.privacy') }}</li>
                <li>{{ $t('layout.support_items.contact') }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
  import i18n from '@/plugins/i18n'
  export default {
    name: 'LayoutFooter',
    data() {
      return {
        locale: i18n.locale
      }
    },
    watch: {
      locale() {
        i18n.locale = this.locale
      }
    }
  }
</script>
