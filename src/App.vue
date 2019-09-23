<template>
  <div id="app">
    <link rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
        integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
        crossorigin="anonymous">
    <sidebar-menu
      :menu="menu"
      :width="width"
      :collapsed="collapsed"
    />
    <router-view/>
    <alert v-if="this.$root.showMessage"
                :message="this.$root.message"
                :variant="this.$root.message_class"
                :countDown="this.$root.message_dismiss"></alert>
  </div>
</template>

<script>
import Alert from './components/Alert';

export default {
  name: 'App',
  components: {
    alert: Alert,
  },
  data() {
    return {
      width: '200px',
      collapsed: true,
      rtl: true,
      menu: [
        {
          header: true,
          title: 'uPKI menu',
        },
        {
          href: '/',
          title: 'Home',
          icon: 'fa fa-home',
        },
        {
          href: '/nodes',
          title: 'Certificates',
          icon: 'fa fa-medal',
        },
        {
          href: '/profiles',
          title: 'Profiles',
          icon: 'fa fa-layer-group',
        },
        {
          href: '/admins',
          title: 'Admins',
          icon: 'fa fa-user-shield',
        },
      ],
    };
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<!-- <style>
#app {
  margin-top: 40px
}
</style> -->

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 40px;
}
</style>
