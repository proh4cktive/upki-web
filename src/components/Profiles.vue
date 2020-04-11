<template>
  <b-container fluid>
    <b-row>
      <b-col sm="10">
        <h1><i class="fa fa-layer-group"></i> Profiles</h1>
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
              placeholder="Filter profiles"
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
                @click="showProfileModal(null)">
              <i class="fa fa-plus-circle"></i>
              Add Profile
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
          :items="this.$root.profiles"
          :fields="fields"
          :filterIncludedFields="filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          @filtered="onFiltered" class="profiles">
          <template v-slot:cell(usages)="row">
            <i class="fa fa-star"
                title="CA"
                v-b-tooltip.hover
                v-if="row.item.certType.includes('sslCA')"></i>
            <i class="fa fa-user"
                title="User"
                v-b-tooltip.hover
                v-if="row.item.extendedKeyUsage.includes('clientAuth')"></i>
            <i class="fa fa-server"
                title="Server"
                v-b-tooltip.hover
                v-if="row.item.extendedKeyUsage.includes('serverAuth')"></i>
            <i class="fa fa-envelope"
                title="Email"
                v-b-tooltip.hover
                v-if="row.item.extendedKeyUsage.includes('emailProtection')"></i>
          </template>
          <template v-slot:cell(actions)="row">
            <b-button
                v-b-tooltip.hover
                title="Edit profile"
                variant="primary"
                @click.stop="editProfile(row.item)">
              <i class="fa fa-edit"></i>
            </b-button>
            <b-button
                v-b-tooltip.hover
                title="Duplicate profile"
                variant="secondary"
                @click.stop="duplicateProfile(row.item)">
              <i class="fa fa-clone"></i>
            </b-button>
            <b-button
                v-b-tooltip.hover
                title="Delete profile"
                variant="danger"
                @click.stop="deleteProfile(row.item)">
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
    <modal-profile ref="modalProfile"/>
  </b-container>
</template>

<script>
import request from './../core/request';
import ModalProfile from './ModalProfile';

export default {
  data() {
    return {
      api_host: this.$root.privateAPI,
      profileForm: this.$root.profileForm,
      perPage: 15,
      totalRows: 1,
      currentPage: 1,
      sortBy: 'Name',
      sortDesc: false,
      sortDirection: 'desc',
      filter: null,
      filterOn: [],
      fields: [
        { key: 'usages', class: 'usages' },
        { key: 'name', label: 'Name', sortable: true, sortDirection: 'desc' },
        { key: 'domain', label: 'Domain', sortable: true, sortDirection: 'desc' },
        { key: 'duration', label: 'Duration', sortable: true, sortDirection: 'desc' },
        { key: 'actions', label: 'Actions', class: 'actions'},
      ]
    };
  },
  components: {
    modalProfile: ModalProfile,
  },
  mounted() {
    this.$root.getProfiles();
    // Set the initial number of items
    this.totalRows = this.$root.profiles.length
  },
  methods: {
    showProfileModal(profile, action = 'Create') {
      this.$refs.modalProfile.showModal(profile, action);
    },
    editProfile(profile) {
      this.showProfileModal(profile, 'Edit');
    },
    duplicateProfile(profile) {
      const tmp = JSON.parse(JSON.stringify(profile));
      // Force rename to avoid conflicts
      tmp.name = `${tmp.name} (duplicate)`;
      this.showProfileModal(tmp, 'Duplicate');
    },
    deleteProfile(profile) {
      const path = `${this.api_host}/profiles/${profile.name}`;
      request.delete(path)
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant === 'success') {
            this.$root.getProfiles();
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
  created() {
    this.$root.getProfiles();
  },
};
</script>

<style lang="sass">

$size: 10px

.pointer
  cursor: pointer

.profiles
  margin-top: 1em

  thead
    border-left: 0

  th, td
    &.actions,
    &.usages
      text-align: center

</style>