<template>
  <b-modal ref="modalAdmin"
      title="Promote Node to Admin role"
      size="lg"
      hide-footer>
    <b-form @submit="onSubmit" @reset="onReset" class="w-100">
      <b-card bg-variant="light">
        <div class="list-group">
          <a v-for="(entry,index) in currentNodes()"
              href="#"
              :key="index"
              @click.stop="selectNode"
              class="list-group-item list-group-item-action">
            {{ entry.DN }}
          </a>
        </div>
      </b-card>
      <b-form-group class="controls">
        <b-button type="submit"
          variant="primary">
          <i class="fa fa-plus-circle"></i>
          <span> Promote Selected</span>
        </b-button>
        <b-button type="reset"
          variant="danger">
          <i class="fa fa-times"></i>
          Close
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
      adminForm: this.$root.adminForm,
      actionName: null,
      isActive: false,
      admins: [],
      neoAdmins: []
    };
  },
  name: 'ModalAdmin',
  methods: {
    showModal() {
      // Display modal
      this.$refs.modalAdmin.show();
    },
    currentNodes() {
      var nodes = [];
      // Parse each nodes
      for (var i = 0; i < this.$root.nodes.length; i++) {
        // Avoid nodes already admins
        if (!this.$root.nodes[i].Admin) {
          nodes.push(this.$root.nodes[i]);
        }
      }
      return nodes;
    },
    selectNode(event) {
      this.neoAdmins.push(event.target.innerText);
      event.target.classList.toggle('active');
    },
    addAdmins() {
      const path = `${this.api_host}/admins`;
      request.post(path, this.neoAdmins)
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant === 'success') {
            // Update global lists
            this.$root.getAdmins();
            this.$root.getNodes();
          }
          this.$root.showAlert(res.data.message, variant);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.$root.showAlert(error, 'danger');
        });
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$refs.modalAdmin.hide();
      this.addAdmins();
      this.$refs.modalAdmin.hide();
      // Reset data
      this.adminForm = this.$root.adminForm;
      this.neoAdmins = [];
    },
    onReset(evt) {
      evt.preventDefault();
      this.$refs.modalAdmin.hide();
      // Reset data
      this.adminForm = this.$root.adminForm;
      this.neoAdmins = [];
    },
  },
  created() {
    this.$root.getNodes();
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
