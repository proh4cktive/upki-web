<template>
  <b-container fluid>
    <b-row>
      <b-col sm="10">
        <h1><i class="fa fa-medal"></i> Certificates</h1>
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
              placeholder="Filter nodes"
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
                @click="showNodeModal(null, 'Create')">
              <i class="fa fa-plus-circle"></i>
              Add Certificate
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
          :filter="filter"
          :items="this.$root.nodes"
          :fields="fields"
          :filterIncludedFields="filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          :tbody-tr-class="rowClass"
          @filtered="onFiltered" class="nodes">
          <template v-slot:cell(usages)="row">
            <i class="fa fa-star"
                title="CA"
                v-b-tooltip.hover
                v-if="hasFeature(row.item.Profile, 'sslCA')"></i>
            <i class="fa fa-user"
                title="User"
                v-b-tooltip.hover
                v-if="hasFeature(row.item.Profile, 'clientAuth')"></i>
            <i class="fa fa-server"
                title="Server"
                v-b-tooltip.hover
                v-if="hasFeature(row.item.Profile, 'serverAuth')"></i>
            <i class="fa fa-envelope"
                title="Email"
                v-b-tooltip.hover
                v-if="hasFeature(row.item.Profile, 'emailProtection')"></i>
          </template>
          <template v-slot:cell(actions)="row">
            <b-button v-if="row.item.State === 'Init'"
                v-b-tooltip.hover
                title="Edit node"
                variant="primary"
                @click.stop="editNode(row.item.DN)">
              <i class="fa fa-edit"></i>
            </b-button>
            <b-button v-if="row.item.State === 'Init'"
                v-b-tooltip.hover
                title="Sign node"
                variant="success"
                @click.stop="showNodeSign(row.item)">
              <i class="fa fa-file-signature"></i>      
            </b-button>
            <b-button v-if="row.item.State === 'Init'"
                v-b-tooltip.hover
                title="Get generation command"
                variant="warning"
                @click.stop="getCommand(row.item)">
              <i class="fa fa-magic"></i>      
            </b-button>
            <b-button v-if="row.item.State === 'Valid'"
                v-b-tooltip.hover
                title="Download certificate"
                variant="primary"
                @click.stop="downloadCert(row.item.DN, row.item.CN, row.item.Profile)">
              <i class="fa fa-download pointer"></i>
            </b-button>
            <b-button v-if="row.item.State === 'Valid'"
                v-b-tooltip.hover
                title="Revoke node"
                variant="danger"
                @click.stop="revokeNode(row.item.DN)">
              <i class="fa fa-ban"></i>
            </b-button>
            <b-button v-if="row.item.State === 'Revoked'"
                v-b-tooltip.hover
                title="Restore node"
                variant="success"
                @click.stop="restoreNode(row.item.DN)">
              <i class="fa fa-check"></i>
            </b-button>
            <b-button v-if="['Revoked','Expired','Init'].includes(row.item.State)"
                v-b-tooltip.hover
                title="Delete node"
                variant="danger"
                @click.stop="deleteNode(row.item.DN)">
              <i class="fa fa-trash"></i>
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
    <modal-node  ref="modalNode"/>
    <modal-sign  ref="modalSign"/>
  </b-container>
</template>

<script>
import request from './../core/request';
import ModalNode from './ModalNode';
import ModalSign from './ModalSign';

export default {
  filters: {
    capitalize(res) {
      if (!res) return '';
      const value = res.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  data() {
    return {
      api_host: this.$root.privateAPI,
      node_host: this.$root.publicAPI,
      perPage: 15,
      totalRows: 1,
      currentPage: 1,
      sortBy: 'Created',
      sortDesc: false,
      sortDirection: 'desc',
      filter: null,
      filterOn: [],
      fields: [
        { key: 'usages', class: 'usages', tdClass: this.getUsage },
        { key: 'Profile', label: 'Profile', sortable: true, sortDirection: 'desc' },
        { key: 'CN', label: 'Name', sortable: true, sortDirection: 'desc' },
        { key: 'Created_human', label: 'Created', sortable: true, sortDirection: 'desc' },
        { key: 'Duration', label: 'Duration', sortable: false },
        { key: 'Expire', label: 'Expire', sortable: true, sortDirection: 'desc' },
        { key: 'actions', label: 'Actions', class: 'actions' },
      ]
    };
  },
  components: {
    modalNode: ModalNode,
    modalSign: ModalSign,
  },
  mounted() {
    this.$root.getNodes();
    // Set the initial number of items
    this.totalRows = this.$root.nodes.length
  },
  methods: {
    getUsage(value, key, item) {
      return item.State.toLowerCase();
    },
    rowClass(item, type) {
      if (!item || type !== 'row') return;
      if (item.Admin) return 'table-success';
    },
    showNodeModal(node, action) {
      this.$refs.modalNode.showModal(node, action);
    },
    showNodeSign(node) {
      this.$refs.modalSign.showModal(node);
    },
    editNode(dn) {
      const node = this.$root.getNode(dn);
      this.showNodeModal(node, 'Update');
    },
    displayNode(dn) {
      const node = this.$root.getNode(dn);
      this.showNodeModal(node, 'Show');
    },
    hasFeature(profileName, feature) {
      return this.$root.profileSupport(profileName, feature);
    },
    downloadCert(dn, cn, profile) {
      this.$root.downloadNode(dn, cn, profile);
    },
    getCommand(node) {
      request.post(`${this.node_host}/magic/${node.Profile}`, { cn: node.CN })
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant === 'success') {
            this.$root.showAlert(res.data.command, 'success');
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
    revokeNode(dn) {
      const path = `${this.api_host}/revoke`;
      request.post(path, { DN: dn, Reason: 'admin revokation' })
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant === 'success') {
            this.$root.getNodes();
          } else {
            // eslint-disable-next-line
            console.log(res.data.message);
            this.$root.showAlert(res.data.message, 'danger');
          }
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.$root.showAlert(error, 'danger');
        });
    },
    restoreNode(dn) {
      const path = `${this.api_host}/unrevoke`;
      request.post(path, { DN: dn })
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant === 'success') {
            this.$root.getNodes();
          } else {
            this.$root.showAlert(res.data.message, 'danger');
          }
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.$root.showAlert(error, 'danger');
        });
    },
    deleteNode(dn) {
      const dest = btoa(dn);
      const path = `${this.api_host}/nodes/${dest}`;
      request.delete(path)
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
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
  },
  created() {
    this.$root.getProfiles();
  },
};
</script>

<style lang="sass">

$size: 10px

.pointer
  cursor: pointer

.nodes
  margin-top: 1em

  thead
    border-left: $size solid #343a40

  td
    &.init
      border-left: $size solid #0053b3
    &.valid
      border-left: $size solid #32b802
    &.expired
      border-left: $size solid #d4bf04
    &.revoked
      border-left: $size solid #b80600

  th, td
    &.actions,
    &.usages
      text-align: center

</style>
