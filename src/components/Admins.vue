<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-10">
        <h1><i class="fa fa-user-shield"></i> Admins</h1>
      </div>
      <div class="col-sm-2">
        <button type="button"
                class="btn btn-success btn-sm"
                @click="showAdminModal(null)">
              <i class="fa fa-plus-circle"></i>
              Add Admin
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">DN</th>
              <th scope="col" class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(admin, index) in this.$root.admins" :key=index>
              <td>{{ admin.name }}</td>
              <td>{{ admin.DN }}</td>
              <td class="text-right">
                <i class="fa fa-times text-danger pointer"
                    v-b-tooltip.hover
                    title="Delete admin"
                    @click="deleteAdmin(admin.DN)"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <modal-admin ref="modalAdmin"/>
  </div>
</template>

<script>
import axios from 'axios';
import ModalAdmin from './ModalAdmin';

export default {
  data() {
    return {
      api_host: this.$root.privateAPI,
    };
  },
  components: {
    modalAdmin: ModalAdmin,
  },
  methods: {
    showAdminModal(admin, action = 'Create') {
      this.$refs.modalAdmin.showModal(admin, action);
    },
    deleteProfile(admin) {
      const path = `${this.api_host}/admins/${admin.name}`;
      axios.delete(path)
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant === 'success') {
            this.$root.getAdmins();
          } else {
            this.$root.showAlert(res.data.message, variant);
          }
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.$root.showAlert(error, 'danger', 60);
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
