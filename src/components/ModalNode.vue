<template>
    <b-modal ref="modalNode"
            :title="title"
            size="lg"
            hide-footer>
      <b-form @submit="onSubmit" @reset="onReset" class="w-100">
        <b-card bg-variant="light">
          <b-form-group id="form-cn-group"
              v-if="actionName === 'Show'"
              label="Name (CN)"
              label-cols-sm="3"
              label-align-sm="right"
              label-for="form-cn-text"
              class="mb-0">
            <b-alert id="form-cn-text"
              class="pt-1"
              show variant="light">{{nodeForm.CN}}
            </b-alert>
          </b-form-group>
          <b-form-group id="form-profile-group"
              label="Profile"
              label-for="form-profile-input"
              label-cols-sm="3"
              label-align-sm="right"
              class="mb-0">
            <b-form-select id="form-profile-input"
                @change="onProfileSelect"
                v-model="nodeForm.Profile"
                v-if="actionName !== 'Show'"
                :options="this.$root.nodeForm.options"
                placeholder="Select profile"
                required>
            </b-form-select>
            <b-alert id="form-profile-input"
              v-else
              class="pt-1"
              show variant="light">{{nodeForm.Profile}}
            </b-alert>
          </b-form-group>
          <b-form-group id="form-cn-group"
              v-if="actionName !== 'Show'"
              label="Name (CN)"
              label-cols-sm="3"
              label-align-sm="right"
              label-for="form-cn-input">
            <b-form-input id="form-cn-input"
              v-model="nodeForm.CN"
              required
              @change="onCnSet(nodeForm.CN)"
              placeholder="Set Common Name (CN)">
            </b-form-input>
          </b-form-group>
          <b-form-group id="form-dn-group"
              label="Qualified Name (DN)"
              label-for="form-dn-input"
              label-cols-sm="3"
              label-align-sm="right"
              class="mb-0">
            <b-alert id="form-dn-input"
              class="pt-1 dn"
              show variant="light">{{calculatedDN}}
            </b-alert>
          </b-form-group>
          <b-form-group id="form-domain-group"
              label="Domain"
              label-for="form-domain-text"
              label-cols-sm="3"
              label-align-sm="right"
              class="mb-0">
            <b-alert id="form-domain-text"
              class="pt-1"
              show variant="light">{{nodeForm.Domain}}
            </b-alert>
          </b-form-group>
          <b-form-group id="form-sn-group"
              v-if="['Valid','Revoked'].includes(nodeForm.State)"
              label="Serial number"
              label-cols-sm="3"
              label-align-sm="right"
              label-for="form-sn-text">
            <b-alert id="form-sn-text"
              class="pt-1"
              show variant="light">{{nodeForm.Serial}}
            </b-alert>
          </b-form-group>
          <b-form-group id="form-duration-group"
              label="Duration"
              label-for="form-duration-input"
              label-cols-sm="3"
              label-align-sm="right"
              class="mb-0">
            <b-form-input id="form-duration-input"
                type="text"
                v-model="nodeForm.Duration"
                required
                v-if="actionName !== 'Show'"
                placeholder="Choose duration">
            </b-form-input>
            <b-alert id="form-duration-input"
              class="pt-1"
              v-else
              show variant="light">{{nodeForm.Duration}}
            </b-alert>
          </b-form-group>
          <b-form-group id="form-start-group"
              v-if="nodeForm.State === 'Valid'"
              label="Validity Start"
              label-cols-sm="3"
              label-align-sm="right"
              label-for="form-start-text">
            <b-alert id="form-start-text"
              class="pt-1"
              show variant="light">{{nodeForm.Start}}
            </b-alert>
          </b-form-group>
          <b-form-group id="form-end-group"
              v-if="nodeForm.State === 'Valid'"
              label="Validity End"
              label-cols-sm="3"
              label-align-sm="right"
              label-for="form-end-text">
            <b-alert id="form-end-text"
              class="pt-1"
              show variant="light">{{nodeForm.Expire}}
            </b-alert>
          </b-form-group>
          <b-form-group id="form-adv-group"
              label-cols-sm="3"
              label-align-sm="right"
              v-if="(actionName !== 'Show') && !nodeForm.Altnames"
              class="mb-0">
              <b-form-checkbox v-model="altnames"
                  id="form-adv"
                  :unchecked-value="false">Add alternate names ?
              </b-form-checkbox>
            </b-form-group>
          <b-form-group id="form-sans-group"
              label="Alternate Names"
              label-for="form-alt-input"
              v-show="nodeForm.Altnames || altnames"
              v-model="nodeForm.Sans"
              label-cols-sm="3"
              label-align-sm="right"
              class="mb-0">
            <i id="form-alt-input"
                class="fa fa-plus-circle text-success"
                v-b-tooltip.hover
                title="Add name"
                v-if="actionName !== 'Show'"
                @click="addAltName(true)"></i>
          </b-form-group>
          <b-form-group v-show="nodeForm.Altnames || altnames"
              label-cols-sm="3"
              label-align-sm="right"
              class="mb-0">
            <table class="altnames-list">
              <tr v-for="(entry,index) in nodeForm.Sans"
                :key="index"
                class="altname-entry">
                <td>
                  <b-form-input
                      v-if="actionName !== 'Show'"
                      v-model="nodeForm.Sans[index]"
                      placeholder="Set Alternate Name">
                  </b-form-input>
                  <b-alert v-else
                    class="pt-1"
                    show variant="light">{{entry}}
                  </b-alert>
                </td>
                <td>
                  <i class="fa fa-times-circle text-danger"
                    v-b-tooltip.hover
                    title="Remove"
                    v-if="actionName !== 'Show'"
                    @click="removeAltName(index)"></i>
                </td>
              </tr>
            </table>
          </b-form-group>
        </b-card>
        <b-form-group class="controls">
          <b-button type="submit"
            variant="primary"
            v-if="actionName !== 'Show'">
            <i class="fa fa-plus-circle"></i>
            <span>{{ actionName }} node</span>
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
      profiles: this.$root.profiles,
      api_host: this.$root.privateAPI,
      nodeForm: this.$root.nodeForm,
      actionName: null,
      altnames: false,
      editForm: false,
      title: null,
      calculatedDN: null,
    };
  },
  name: 'ModalNode',
  methods: {
    showModal(node, action) {
      this.editForm = Boolean(node);
      // Adapt modal title
      this.title = `${action} Certificate`;
      // Build node object
      this.nodeForm = this.$root.initNode(node);
      // Setup correct DN
      if (!this.nodeForm.DN.includes('/CN=')) {
        this.calculatedDN = `${this.nodeForm.DN}/CN=${this.nodeForm.CN}`;
      } else {
        this.calculatedDN = this.nodeForm.DN;
      }
      // Adapt button action
      if (action === 'Duplicate') {
        this.actionName = 'Create';
      } else {
        this.actionName = action;
      }
      // Preset SANS if required
      if (action === 'Create') {
        this.addAltName();
      }
      // Display modal
      this.$refs.modalNode.show();
    },
    onProfileSelect(profileName) {
      const profile = this.$root.getProfile(profileName);
      this.nodeForm.DN = this.$root.buildDn(profile.subject);
      this.nodeForm.Duration = profile.duration;
      this.nodeForm.CertType = profile.certType;
      this.nodeForm.Digest = profile.digest;
      this.nodeForm.KeyType = profile.keyType;
      this.nodeForm.KeyLen = profile.keyLen;
      this.nodeForm.Altnames = profile.altnames;
      this.nodeForm.Domain = profile.domain;
      this.nodeForm.Sans = [];
      // Preset DN if needed
      if (this.nodeForm.CN) {
        this.calculatedDN = `${this.nodeForm.DN}/CN=${this.nodeForm.CN}`;
      } else {
        this.calculatedDN = this.nodeForm.DN;
      }
      this.addAltName();
    },
    onCnSet(cn) {
      this.calculatedDN = `${this.nodeForm.DN}/CN=${cn}`;
      this.nodeForm.Sans = [];
      this.addAltName();
    },
    addAltName(force = false) {
      if (this.nodeForm.State !== 'Init' || !this.nodeForm.CN) {
        return false;
      }
      let entry = null;
      // Preset SANS if required
      if (this.nodeForm.Altnames || this.altnames || force) {
        // Verify if CN is not an email or a fqdn
        if (!this.nodeForm.CN.includes('.') && !this.nodeForm.CN.includes('@')) {
          if (this.$root.profileSupport(this.nodeForm.Profile, 'email')) {
            entry = `${this.nodeForm.CN}@${this.nodeForm.Domain}`;
          } else if (this.$root.profileSupport(this.nodeForm.Profile, 'server')) {
            entry = `${this.nodeForm.CN}.${this.nodeForm.Domain}`;
          }
        }
        // If CN is a mail or fqdn
        else {
          entry = this.nodeForm.CN;
        }
      }
      // If entry is set and does not exists
      if (entry && !this.nodeForm.Sans.includes(entry)) {
        this.nodeForm.Sans.push(entry);
      }
      return true;
    },
    removeAltName(i) {
      this.nodeForm.Sans.splice(i, 1);
    },
    addNode(payload) {
      const path = `${this.api_host}/nodes`;
      axios.post(path, payload)
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          if (variant === 'success') {
            // Update global list
            this.$root.getNodes();
          }
          this.$root.showAlert(res.data.message, variant);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.$root.showAlert(error, 'danger', 60);
        });
    },
    updateNode(payload) {
      const name = btoa(payload.DN);
      const path = `${this.api_host}/nodes/${name}`;
      axios.put(path, payload)
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          // Update global list
          this.$root.getNodes();
          this.$root.showAlert(res.data.message, variant);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.$root.showAlert(error, 'danger', 10);
        });
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$refs.modalNode.hide();
      const payload = {
        Profile: this.nodeForm.Profile,
        CN: this.nodeForm.CN,
        DN: this.calculatedDN,
        Digest: this.nodeForm.Digest,
        Duration: this.nodeForm.Duration,
        KeyType: this.nodeForm.KeyType,
        KeyLen: this.nodeForm.KeyLen,
        Domain: this.nodeForm.Domain,
        SANS: this.nodeForm.Sans,
      };
      if (this.editForm) {
        this.updateNode(payload);
      } else {
        this.addNode(payload);
      }
      this.$refs.modalNode.hide();
      // Reset data
      this.nodeForm = this.$root.nodeForm;
      this.editForm = false;
    },
    onReset(evt) {
      evt.preventDefault();
      this.$refs.modalNode.hide();
      // Reset data
      this.nodeForm = this.$root.nodeForm;
      this.editForm = false;
    },
  },
};
</script>
<style lang="sass">
.dn
  font-size: 0.8em
.altnames-list
  margin-bottom: 1em
.controls
  text-align: right
  margin-top: 20px
  button
    margin-left: 1em
</style>
