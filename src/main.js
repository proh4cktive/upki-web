// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'bootstrap/dist/css/bootstrap.css';
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css';
import BootstrapVue from 'bootstrap-vue';
import VueSidebarMenu from 'vue-sidebar-menu';
import Multiselect from 'vue-multiselect';
import request from './core/request';
import Vue from 'vue';
import App from './App';
import router from './router';
import { publicHost, privateHost } from './variables';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(VueSidebarMenu);
Vue.component('multiselect', Multiselect);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App, VueSidebarMenu },
  template: '<App/>',
  render: h => h(App),
  data() {
    return {
      profiles: [],
      nodes: [],
      profileOptions: {
        CertTypes: [],
        Digest: [],
        KeyLen: [],
        KeyTypes: [],
        Usages: [],
        ExtendedUsages: [],
      },
      admins: [],
      privateAPI: privateHost,
      publicAPI: publicHost,
      message: '',
      message_class: '',
      showMessage: false,
      profileForm: {
        options: {
          CertTypes: [],
          Digest: [],
          KeyLen: [],
          KeyTypes: [],
          Usages: [],
          ExtendedUsages: [],
        },
        name: '',
        keyType: 'rsa',
        keyLen: '4096',
        digest: 'sha256',
        duration: 1,
        altnames: false,
        domain: 'yourdomain.com',
        subject: [],
        keyUsage: [],
        extendedKeyUsage: [],
        certType: [],
      },
      nodeForm: {
        options: [
          {
            value: null,
            text: 'Select a profile',
            disabled: true,
            selected: true,
          },
        ],
        State: 'Init',
        Serial: '',
        Profile: '',
        CN: '',
        DN: '',
        KeyLen: '',
        Digest: '',
        Duration: '',
        Start: '',
        Expire: '',
        KeyType: '',
        Sans: [],
      },
      adminForm: {}
    };
  },
  methods: {
    forceFileDownload(response) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', response.name);
      document.body.appendChild(link);
      link.click();
    },
    downloadNode(dn, cn, profile) {
      const dest = btoa(dn);
      request.get(`${publicHost}/certs/${dest}`)
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant === 'success') {
            this.forceFileDownload({ name: `${profile}.${cn}.crt`, data: res.data.certificate });
          } else {
            // eslint-disable-next-line
            console.error(res.data.message);
            this.showAlert(res.data.message, 'danger');
          }
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.showAlert(error, 'danger');
        });
    },
    getProfiles() {
      const path = `${privateHost}/profiles`;
      request.get(path)
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant !== 'success') {
            this.showAlert(res.data.message, variant);
          }
          this.profiles = res.data.profiles;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.showAlert(error, 'danger');
        });
    },
    getNodes() {
      const path = `${privateHost}/nodes`;
      request.get(path)
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant !== 'success') {
            this.showAlert(res.data.message, variant);
          }
          this.nodes = res.data.nodes;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.showAlert(error, 'danger');
        });
    },
    getOptions() {
      const path = `${privateHost}/options`;
      request.get(path)
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant !== 'success') {
            this.showAlert(res.data.message, variant);
            return {
              CertTypes: [],
              Digest: [],
              KeyLen: [],
              KeyTypes: [],
              Usages: [],
              ExtendedUsages: [],
            };
          }
          this.profileOptions = res.data.options;
          return res.data.options;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.showAlert(error, 'danger');
        });
    },
    getAdmins() {
      const path = `${privateHost}/admins`;
      request.get(path)
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant !== 'success') {
            this.showAlert(res.data.message, variant);
          }
          this.admins = res.data.admins;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.showAlert(error, 'danger');
        });
    },
    initProfile(data) {
      this.getOptions();
      let profileData = {};
      if (data) {
        profileData.name = data.name;
        profileData.type = data.type;
        profileData.domain = data.domain;
        profileData.keyType = data.keyType;
        profileData.keyLen = data.keyLen;
        profileData.digest = data.digest;
        profileData.duration = data.duration;
        profileData.altnames = data.altnames;
        profileData.subject = data.subject;
        profileData.keyUsage = data.keyUsage;
        profileData.extendedKeyUsage = data.extendedKeyUsage;
        profileData.certType = data.certType;
      } else {
        profileData = this.profileForm;
      }
      profileData.options = this.profileForm.options;
      return profileData;
    },
    initNode(data) {
      let nodeData = {};
      if (data) {
        nodeData.State = data.State;
        nodeData.Profile = data.Profile;
        nodeData.CN = data.CN;
        nodeData.DN = data.DN;
        nodeData.Serial = data.Serial;
        nodeData.KeyLen = data.KeyLen;
        nodeData.Digest = data.Digest;
        nodeData.Start = data.Start_human;
        nodeData.Expire = data.Expire_human;
        nodeData.Duration = data.Duration;
        nodeData.KeyType = data.KeyType;
        nodeData.Domain = data.Domain;
        nodeData.Altnames = data.Altnames;
        nodeData.Sans = data.Sans;
        if (!data.options) {
          nodeData.options = this.nodeForm.options;
        } else {
          nodeData.options = data.options;
        }
      } else {
        nodeData = this.nodeForm;
      }
      this.profiles.forEach((profile) => {
        const option = {
          value: profile.name,
          text: profile.name,
        };
        if (!nodeData.options.some(e => e.value === profile.name)) {
          nodeData.options.push(option);
        }
      });
      return nodeData;
    },
    getNode(dn) {
      let found = {};
      this.nodes.forEach((node) => {
        if (node.DN === dn) {
          found = node;
        }
      });
      return found;
    },
    getProfile(name) {
      let found = {};
      this.profiles.forEach((profile) => {
        if (profile.name === name) {
          found = profile;
        }
      });
      return found;
    },
    profileSupport(profileName, feature) {
      const profile = this.getProfile(profileName);
      if (profile.certType.includes(feature) || profile.extendedKeyUsage.includes(feature)) {
        return true;
      }
      return false;
    },
    buildDn(subject) {
      let dn = '';
      subject.forEach((entry) => {
        dn += `/${Object.keys(entry)[0]}=${Object.values(entry)[0]}`;
      });
      return dn;
    },
    buildSubject(dn) {
      if (!dn.startsWith('/')) {
        return false;
      } else if (!dn.includes('/')) {
        return false;
      }
      const subject = [];
      const entries = dn.split('/');
      entries.forEach((entry) => {
        const item = entry.split('=');
        const obj = {};
        obj[item[0]] = item[1];
        subject.push(obj);
      });
      return subject;
    },
    showAlert(msg, variant, dismiss = 5) {
      // reset alert if it is already active
      if (this.$root.showMessage == true) {
        this.resetAlert()
      }

      this.$root.message = msg;
      this.$root.message_class = variant;
      this.$root.showMessage = dismiss;
    },
    hideAlert() {
      this.resetAlert()
    },
    resetAlert() {
      this.$root.message = '';
      this.$root.showMessage = false;
    }
  }
});
