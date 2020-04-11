<template>
  <b-modal ref="modalAdmin"
      title="Promote Node to Admin role"
      size="lg"
      hide-footer>
    <b-form @submit="onSubmit" @reset="onReset" class="w-100">
      <b-card bg-variant="light">
        <b-table
          small
          striped
          hover
          head-variant="dark"
          show-empty
          selectable
          select-mode="multi"
          :per-page="perPage"
          :current-page="currentPage"
          :items="suggestedNodes"
          :fields="fields"
          :tbody-tr-class="rowClass"
          @row-selected="selectNode">
          <template v-slot:cell(selected)="{ rowSelected }">
            <template v-if="rowSelected">
              <i class="fa fa-check"></i>
            </template>
            <template v-else>
              <span aria-hidden="true">&nbsp;</span>
            </template>
          </template>
        </b-table>
        <template v-slot:empty="scope">
          <div class="alert alert-warning">
            <i class="fa fa-exclamation-triangle"></i>
            {{ scope.emptyText }}
          </div>
        </template>
        <template v-slot:emptyfiltered="scope">
          <div class="alert alert-warning">
            <i class="fa fa-exclamation-triangle"></i>
            {{ scope.emptyFilteredText }}
          </div>
        </template>
        <b-container fluid>
          <b-row>
            <b-col sm="12">
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                align="fill"
                size="sm"
              ></b-pagination>
            </b-col>
          </b-row>
        </b-container>
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
      perPage: 8,
      totalRows: 1,
      currentPage: 1,
      actionName: null,
      isActive: false,
      admins: [],
      neoAdmins: [],
      suggestedNodes: [],
      sortBy: 'Full Name',
      sortDesc: false,
      sortDirection: 'desc',
      filter: null,
      filterOn: [],
      fields: [
        'selected',
        { key: 'DN', label: 'Full Name', sortable: true, sortDirection: 'desc', class: 'name' },
      ]
    };
  },
  name: 'ModalAdmin',
  mounted() {
    this.findNodes();
    // Set the initial number of items
    this.totalRows = this.suggestedNodes.length;
  },
  methods: {
    rowClass(item, type) {
      if (!item || type !== 'row') return;
      if (this.neoAdmins && item.DN && this.neoAdmins.includes(item.DN)) return 'table-primary';
    },
    showModal() {
      // Display modal
      this.$refs.modalAdmin.show();
    },
    selectNode(items) {
      for (var i = 0; i < items.length; i++) {
        if (!this.neoAdmins.includes(items[i].DN)){
          this.neoAdmins.push(items[i].DN);
        }
      }
    },
    findNodes() {
      this.$root.getNodes();
      // Parse each nodes
      for (var i = 0; i < this.$root.nodes.length; i++) {
        // Avoid nodes already admins
        if (!this.$root.nodes[i].Admin) {
          this.suggestedNodes.push(this.$root.nodes[i]);
        }
      }
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
};
</script>
<style lang="sass">
.controls
  text-align: right
  margin-top: 20px
  button
    margin-left: 1em
</style>
