<template>
  <b-container fluid>
    <b-row>
      <b-col sm="10">
        <h1><i class="fa fa-user-shield"></i> Admins</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12" md="6">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
        ></b-pagination>
      </b-col>
      <b-col sm="12" md="4">
        <b-form-group
          label="Filter"
          label-cols-sm="1"
          label-align-sm="right"
          label-size="sm"
          label-for="filterInput"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              placeholder="Filter admins"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col sm="2">
        <button type="button"
                class="btn btn-success btn-sm"
                @click="showAdminModal(null)">
              <i class="fa fa-plus-circle"></i>
              Add Admin
        </button>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <b-table
          small
          striped
          hover
          head-variant="dark"
          show-empty
          :per-page="perPage"
          :current-page="currentPage"
          :items="this.$root.admins"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          @filtered="onFiltered" class="admins">
          <template v-slot:cell(actions)="row">
            <b-button
                v-b-tooltip.hover
                title="Delete admin"
                variant="danger"
                @click.stop="deleteAdmin(row.item.dn)">
              <i class="fa fa-times"></i>
            </b-button>
          </template>
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
        </b-table>
      </b-col>
    </b-row>
    <modal-admin ref="modalAdmin"/>
  </b-container>
</template>

<script>
import request from './../core/request';
import ModalAdmin from './ModalAdmin';

export default {
  data() {
    return {
      api_host: this.$root.privateAPI,
      perPage: 15,
      totalRows: 1,
      currentPage: 1,
      sortBy: 'Name',
      sortDesc: false,
      sortDirection: 'desc',
      filter: null,
      filterOn: [],
      fields: [
        { key: 'name', label: 'Name', sortable: true, sortDirection: 'desc', class: 'name' },
        { key: 'dn', label: 'Domain Name', sortable: true, sortDirection: 'desc' },
        { key: 'actions', label: 'Actions', class: 'actions'},
      ]
    };
  },
  components: {
    modalAdmin: ModalAdmin,
  },
  mounted() {
    this.$root.getAdmins();
    // Set the initial number of items
    this.totalRows = this.$root.admins.length;
  },
  methods: {
    showAdminModal() {
      this.$refs.modalAdmin.showModal();
    },
    deleteAdmin(dn) {
      const dest = btoa(dn);
      const path = `${this.api_host}/admins/${dest}`;
      request.delete(path)
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant === 'success') {
            // Update global lists
            this.$root.getAdmins();
            this.$root.getNodes();
          } else {
            this.$root.showAlert(res.data.message, variant);
          }
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.$root.showAlert(error, 'danger');
        });
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
  },
};
</script>
<style lang="sass">

$size: 10px

.pointer
  cursor: pointer

.admins
  margin-top: 1em

  th, td
    &.name
      text-align: center

</style>
