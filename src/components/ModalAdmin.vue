<template>
    <b-modal ref="modalAdmin"
            :title="title"
            size="lg"
            hide-footer>
      <b-form @submit="onSubmit" @reset="onReset" class="w-100">
        <b-card bg-variant="light">
          <b-form-group id="form-profile-group"
              label="Admin"
              label-for="form-profile-input"
              label-cols-sm="3"
              label-align-sm="right"
              class="mb-0">
            <b-form-text id="form-dn-input"
                size="lg">{{nodeAdmins.Profile}}
            </b-form-text>
          </b-form-group>
        </b-card>
        <b-form-group class="controls">
          <b-button type="submit"
            variant="primary"
            v-if="actionName !== 'Show'">
            <i class="fa fa-plus-circle"></i>
            <span>{{ actionName }} admin</span>
          </b-button>
          <b-button type="reset"
            v-else
            variant="danger">
            <i class="fa fa-times"></i>
            Close
          </b-button>
          <b-button type="reset"
            v-if="actionName !== 'Show'"
            variant="danger">
            <i class="fa fa-ban"></i>
            Cancel
          </b-button>
        </b-form-group>
      </b-form>
    </b-modal>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      api_host: this.$root.privateAPI,
      adminForm: this.$root.adminForm,
      actionName: null,
      title: null,
      nodeAdmins: {}
    };
  },
  name: 'ModalAdmin',
  methods: {
    showModal(node, action) {
      this.editForm = Boolean(node);
      // Adapt modal title
      this.title = `${action} Admin`;
      // Adapt button action
      if (action === 'Duplicate') {
        this.actionName = 'Create';
      } else {
        this.actionName = action;
      }
      // Display modal
      this.$refs.modalAdmin.show();
    },
    addAdmin(payload) {
      const path = `${this.api_host}/admins`;
      axios.post(path, payload)
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant === 'success') {
            // Update global list
            this.$root.getNodes();
          }
          this.$root.show(res.data.message, variant);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.$root.show(error, 'danger', 60);
        });
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$refs.modalAdmin.hide();
      const payload = {
        DN: this.adminForm.DN,
      };
      this.addAdmin(payload);
      this.$refs.modalAdmin.hide();
      // Reset data
      this.adminForm = this.$root.adminForm;
    },
    onReset(evt) {
      evt.preventDefault();
      this.$refs.modalAdmin.hide();
      // Reset data
      this.adminForm = this.$root.adminForm;
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
</style>
