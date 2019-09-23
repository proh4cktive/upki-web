<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-10">
        <h1><i class="fa fa-medal"></i> Certificates</h1>
      </div>
      <div class="col-sm-2">
        <button type="button"
                class="btn btn-success btn-sm"
                @click="showNodeModal(null, 'Create')">
              <i class="fa fa-plus-circle"></i>
              Add Certificate
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Profile</th>
              <th scope="col">Name (CN)</th>
              <th scope="col">Creation</th>
              <th scope="col">Duration</th>
              <th scope="col" class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(node, index) in this.$root.nodes"
              :key=index
              :class="node.State.toLowerCase()"
              @click="displayNode(node.DN)">
              <td>
                <i class="fa fa-star"
                    title="CA"
                    v-b-tooltip.hover
                    v-if="hasFeature(node.Profile, 'sslCA')"></i>
                <i class="fa fa-user"
                    title="User"
                    v-b-tooltip.hover
                    v-if="hasFeature(node.Profile, 'clientAuth')"></i>
                <i class="fa fa-server"
                    title="Server"
                    v-b-tooltip.hover
                    v-if="hasFeature(node.Profile, 'serverAuth')"></i>
                <i class="fa fa-envelope"
                    title="Email"
                    v-b-tooltip.hover
                    v-if="hasFeature(node.Profile, 'emailProtection')"></i>
              </td>
              <td>{{ node.Profile | capitalize }}</td>
              <td>{{ node.CN }}</td>
              <td>{{ node.Created_human }}</td>
              <td>{{ node.Duration }} days</td>
              <td class="text-right">
                <i v-if="node.State === 'Init'"
                    class="fa fa-edit text-primary pointer"
                    v-b-tooltip.hover
                    title="Edit node"
                    @click.stop="editNode(node.DN)"></i>
                <i v-if="node.State === 'Init'"
                    class="fa fa-file-signature pointer"
                    v-b-tooltip.hover
                    title="Sign node"
                    @click.stop="showNodeSign(node)"></i>
                <i v-if="node.State === 'Init'"
                    class="fa fa-magic text-warning pointer"
                    v-b-tooltip.hover
                    title="Get generation command"
                    @click.stop="getCommand(node)"></i>
                <i v-if="node.State === 'Valid'"
                    class="fa fa-download pointer"
                    v-b-tooltip.hover
                    title="Download certificate"
                    @click.stop="downloadCert(node.DN, node.CN, node.Profile)"></i>
                <i v-if="node.State === 'Valid'"
                    class="fa fa-ban text-danger pointer"
                    v-b-tooltip.hover
                    title="Revoke node"
                    @click.stop="revokeNode(node.DN)"></i>
                <i v-if="node.State === 'Revoked'"
                    class="fa fa-check text-success pointer"
                    v-b-tooltip.hover
                    title="Restore node"
                    @click.stop="restoreNode(node.DN)"></i>
                <i v-if="['Revoked','Expired','Init'].includes(node.State)"
                    class="fa fa-trash text-danger pointer"
                    v-b-tooltip.hover
                    title="Delete node"
                    @click.stop="deleteNode(node.DN)"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <modal-node  ref="modalNode"/>
    <modal-sign  ref="modalSign"/>
  </div>
</template>

<script>
import axios from 'axios';
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
    };
  },
  components: {
    modalNode: ModalNode,
    modalSign: ModalSign,
  },
  methods: {
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
      axios.post(`${this.node_host}/magic/${node.Profile}`, { cn: node.CN })
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant === 'success') {
            this.$root.show(res.data.command, 'success', 60);
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
    revokeNode(dn) {
      const path = `${this.api_host}/revoke`;
      axios.post(path, { DN: dn, Reason: 'admin revokation' })
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant === 'success') {
            this.$root.getNodes();
          } else {
            // eslint-disable-next-line
            console.log(res.data.message);
            this.$root.show(res.data.message, 'danger');
          }
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.$root.show(error, 'danger', 60);
        });
    },
    restoreNode(dn) {
      const path = `${this.api_host}/unrevoke`;
      axios.post(path, { DN: dn })
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant === 'success') {
            this.$root.getNodes();
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
    deleteNode(dn) {
      const dest = btoa(dn);
      const path = `${this.api_host}/nodes/${dest}`;
      axios.delete(path)
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant === 'success') {
            this.$root.getNodes();
          } else {
            // eslint-disable-next-line
            console.error(res.data.message);
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
  created() {
    this.$root.getNodes();
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
