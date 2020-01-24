<template>
  <div id="app" class="py-4">
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
      integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
      crossorigin="anonymous"
    />
    <sidebar-menu
      :menu="menu"
      :width="width"
      :collapsed="collapsed"
      @toggle-collapse="onToggleCollapse"
    />
    <div
      :style="{width: `calc(100% - ${hasSideMenuCollapsed ? '50px' : width})`, marginLeft: hasSideMenuCollapsed ? '50px' : width, height: '100%' }"
    >
      <router-view />
    </div>

    <alert
      v-if="$root.showMessage == true || $root.showMessage > 0"
      :message="$root.message"
      :variant="$root.message_class"
      :show-alert="$root.showMessage"
      @close="$root.hideAlert()"
    ></alert>
  </div>
</template>

<script>
import Alert from "./components/Alert";

export default {
  name: "App",
  components: {
    alert: Alert
  },
  data() {
    const defaultCollapsedBehavior = false;
    return {
      hasSideMenuCollapsed: defaultCollapsedBehavior,

      width: "200px",
      collapsed: defaultCollapsedBehavior,
      rtl: true,
      menu: [
        {
          header: true,
          title: "menu"
        },
        {
          href: "/",
          title: "Home",
          icon: "fa fa-home"
        },
        {
          href: "/nodes",
          title: "Certificates",
          icon: "fa fa-medal"
        },
        {
          href: "/profiles",
          title: "Profiles",
          icon: "fa fa-layer-group"
        },
        {
          href: "/admins",
          title: "Admins",
          icon: "fa fa-user-shield"
        }
      ]
    };
  },
  methods: {
    onToggleCollapse(value) {
      this.hasSideMenuCollapsed = value
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
