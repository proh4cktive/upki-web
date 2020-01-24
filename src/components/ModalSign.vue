<template>
  <b-modal ref="modalSign"
      :title="`Sign ${nodeForm.CN} (${nodeForm.Profile})`"
      size="lg"
      hide-footer>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-card bg-variant="light">
        <b-form-group id="form-csr-group"
              label="Select Certificate Signing Request (CSR)"
              label-for="form-csr-input"
              label-cols-sm="5"
              label-align-sm="right"
              class="mb-0">
          <b-form-file accept=".csr, application/csrattrs"
              v-model="csr_file"
              @change="selectCSR"
              placeholder="Drop CSR file here..."
              drop-placeholder="Drop CSR file here..."></b-form-file>
        </b-form-group>
        <b-form-group>
          <b-form-textarea id="form-csr-input"
              v-model="csr_data"
              class="raw_data"
              placeholder="or copy CSR content here..."
              rows="10"
              max-rows="15"
              required>
          </b-form-textarea>
        </b-form-group>
      </b-card>
      <b-form-group class="controls">
        <b-button type="submit" variant="success">
          <i class="fa fa-plus-circle"></i>
          <span>Sign node</span>
        </b-button>
        <b-button type="reset" variant="danger">
          <i class="fa fa-ban"></i>
          Cancel
        </b-button>
      </b-form-group>
    </b-form>
  </b-modal>
</template>
<script>
import request from './../core/request';

export default {
  data() {
    return {
      api_host: this.$root.privateAPI,
      node_host: this.$root.publicAPI,
      nodeForm: this.$root.nodeForm,
      csr_data: null,
      csr_file: null,
    };
  },
  name: 'ModalSign',
  methods: {
    showModal(node) {
      // Build node object
      this.nodeForm = this.$root.initNode(node);
      // Display modal
      this.$refs.modalSign.show();
    },
    selectCSR(evt) {
      const reader = new FileReader();
      reader.readAsText(evt.target.files[0], 'UTF-8');
      reader.onload = ((e) => {
        this.csr_data = e.target.result;
      });
      reader.onerror = (() => {
        this.$root.showAlert('Unable to read File', 'danger');
      });
      if (!this.csr_data.includes('-----BEGIN CERTIFICATE REQUEST-----')) {
        this.$root.showAlert('This does not seems to be a valid CSR file', 'danger');
      }
    },
    onSubmit(evt) {
      evt.preventDefault();
      const path = `${this.api_host}/sign`;
      const payload = {
        Profile: this.nodeForm.Profile,
        CN: this.nodeForm.CN,
        DN: `${this.nodeForm.DN}`,
        CSR: this.csr_data,
      };
      request.post(path, payload)
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant === 'success') {
            this.$root.getNodes();
          } else {
            // eslint-disable-next-line
            console.error(res.data.message);
            this.$root.showAlert(res.data.message, 'danger');
          }
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.$root.showAlert(error, 'danger');
        });
      this.$refs.modalSign.hide();
      // Reset data
      this.nodeForm = this.$root.nodeForm;
    },
    onReset(evt) {
      evt.preventDefault();
      this.$refs.modalSign.hide();
      // Reset data
      this.nodeForm = this.$root.nodeForm;
    },
  },
};
</script>
<style lang="sass">
.controls
  text-align: right
  margin-top: 20px
  button
    margin-left: 1em
.raw_data
  margin-top: 1em
  height: 15em
</style>
