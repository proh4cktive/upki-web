<template>
  <div class="container">
    <h1 class="title text-center">Welcome on μPKI administration!</h1>
    <div class="logo"></div>
    <div class="row">
      <div class="col-sm-4 offset-sm-2 text-center">
        <b-button type="button"
          block
          variant="success"
          size="lg"
          @click="downloadCA()">
          <i class="fa fa-download"></i>
          Download CA certificate
        </b-button>
      </div>
      <div class="col-sm-4 text-center">
        <b-button type="button"
          block
          variant="primary"
          size="lg"
          @click="downloadCRL()">
          <i class="fa fa-download"></i>
          Download CRL
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  data() {
    return {
      api_host: this.$root.publicAPI,
    };
  },
  methods: {
    downloadCA() {
      axios.get(`${this.api_host}/certs/ca.crt`)
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant === 'success') {
            this.$root.forceFileDownload({ name: 'ca.crt', data: res.data.certificate });
          } else {
            this.$root.show(res.data.message, 'danger');
          }
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.$root.show(error, 'danger', 60);
        });
    },
    downloadCRL() {
      axios.get(`${this.api_host}/certs/crl.pem`)
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant === 'success') {
            this.$root.forceFileDownload({ name: 'crl.pem', data: res.data.certificate });
          } else {
            this.$root.show(res.data.message, 'danger');
          }
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.$root.show(error, 'danger', 60);
        });
    },
  },
};
</script>

<style lang="sass">
h1.title
  color: #3d4c5a

.logo
  background-image: url('~@/assets/logo.png')
  background-repeat: no-repeat
  background-size: 50%
  height: 60vh
  width: auto
  margin: auto
  margin-top: 5%
  margin-left: 35%

</style>
