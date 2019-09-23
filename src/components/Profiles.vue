<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-10">
        <h1><i class="fa fa-layer-group"></i> Profiles</h1>
      </div>
      <div class="col-sm-2">
        <button type="button"
                class="btn btn-success btn-sm"
                @click="showProfileModal(null)">
              <i class="fa fa-plus-circle"></i>
              Add Profile
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Name</th>
              <th scope="col">Domain</th>
              <th scope="col">Duration</th>
              <th scope="col" class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(profile, index) in this.$root.profiles" :key=index>
              <td>
                <i class="fa fa-star"
                    title="CA"
                    v-b-tooltip.hover
                    v-if="profile.certType.includes('sslCA')"></i>
                <i class="fa fa-user"
                    title="User"
                    v-b-tooltip.hover
                    v-if="profile.extendedKeyUsage.includes('clientAuth')"></i>
                <i class="fa fa-server"
                    title="Server"
                    v-b-tooltip.hover
                    v-if="profile.extendedKeyUsage.includes('serverAuth')"></i>
                <i class="fa fa-envelope"
                    title="Email"
                    v-b-tooltip.hover
                    v-if="profile.extendedKeyUsage.includes('emailProtection')"></i>
              </td>
              <td>{{ profile.name }}</td>
              <td>{{ profile.domain }}</td>
              <td>{{ profile.duration }} days</td>
              <td class="text-right">
                <i class="fa fa-edit text-primary pointer"
                    v-b-tooltip.hover
                    title="Edit profile"
                    @click="editProfile(profile)"></i>
                <i class="fa fa-clone text-secondary pointer"
                    v-b-tooltip.hover
                    title="Duplicate profile"
                    @click="duplicateProfile(profile)"></i>
                <i class="fa fa-times text-danger pointer"
                    v-b-tooltip.hover
                    title="Delete profile"
                    @click="deleteProfile(profile)"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <modal-profile ref="modalProfile"/>
  </div>
</template>

<script>
import axios from 'axios';
import ModalProfile from './ModalProfile';

export default {
  data() {
    return {
      api_host: this.$root.privateAPI,
      profileForm: this.$root.profileForm,
    };
  },
  components: {
    modalProfile: ModalProfile,
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
      axios.delete(path)
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant === 'success') {
            this.$root.getProfiles();
          } else {
            this.$root.show(res.data.message, variant);
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

$size: 10px

.pointer
  cursor: pointer

tr
  &.init
    border-left: $size solid #0053b3
  &.valid
    border-left: $size solid #32b802
  &.expired
    border-left: $size solid #d4bf04
  &.revoked
    border-left: $size solid #b80600

</style>
