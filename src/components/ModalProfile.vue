<template>
  <b-modal ref="modalProfile"
              :title="title"
              size="lg"
              hide-footer>
    <b-form @submit="onSubmit" @reset="onReset" class="form-horizontal">
      <b-card bg-variant="light">
        <b-form-group id="form-name-group"
            label="Name"
            label-for="form-name-input"
            label-cols-sm="3"
            label-align-sm="right"
            label-class="pt-0"
            class="mb-0">
          <b-form-input id="form-name-input"
              v-model="profileForm.name"
              required
              placeholder="Set name">
          </b-form-input>
        </b-form-group>
        <b-form-group id="form-type-group"
            label="Type"
            label-for="form-type-select"
            label-cols-sm="3"
            label-align-sm="right"
            label-class="pt-0"
            class="mb-0">
          <multiselect id="form-type-select"
              :close-on-select="true"
              :multiple="true"
              :clear-on-select="false"
              @select="onCertTypeSelect"
              @remove="onCertTypeRemove"
              placeholder="Certificate Type"
              v-model="profileForm.certType"
              :options="this.$root.profileOptions.CertTypes">
          </multiselect>
        </b-form-group>
        <b-form-group id="form-domain-group"
            label="Domain"
            label-for="form-domain-input"
            label-cols-sm="3"
            label-align-sm="right"
            label-class="pt-0"
            class="mb-0">
          <b-form-input id="form-domain-input"
              v-model="profileForm.domain"
              required
              placeholder="Set domain">
          </b-form-input>
        </b-form-group>
        <b-form-group id="form-duration-group"
            label="Duration (days)"
            label-for="form-duration-input"
            label-cols-sm="3"
            label-align-sm="right"
            label-class="pt-0"
            class="mb-0">
          <b-form-input id="form-duration-input"
              v-model="profileForm.duration"
              required
              placeholder="0">
          </b-form-input>
        </b-form-group>
        <b-form-group id="form-subject-group"
            label="Subject"
            label-for="form-subject-input"
            label-cols-sm="3"
            label-align-sm="right"
            label-class="pt-0"
            class="mb-0">
          <b-form-input id="form-subject-input"
              v-model="profileForm.DN"
              required
              placeholder="Set subject">
          </b-form-input>
        </b-form-group>
        <b-form-group id="form-alt-group">
          <b-form-checkbox v-model="profileForm.altnames"
              id="form-alt">Alternate Names ?
          </b-form-checkbox>
        </b-form-group>
        <b-form-group id="form-adv-group">
          <b-form-checkbox v-model="advanced"
              id="form-adv"
              :unchecked-value="false">Advanced usage ?
          </b-form-checkbox>
        </b-form-group>
        <b-form-group
          v-if="advanced">
          <b-form-group id="form-keytype-group"
              label="Key type"
              label-for="form-keytype-select"
              label-cols-sm="3"
              label-align-sm="right"
              label-class="pt-0"
              class="mb-0">
            <multiselect id="form-keytype-select"
                :close-on-select="true"
                placeholder="Key Type"
                v-model="profileForm.keyType"
                :options="this.$root.profileOptions.KeyTypes">
            </multiselect>
          </b-form-group>
          <b-form-group id="form-keylen-group"
              label="Key length"
              label-for="form-keylen-select"
              label-cols-sm="3"
              label-align-sm="right"
              label-class="pt-0"
              class="mb-0">
            <multiselect id="form-keylen-select"
                :close-on-select="true"
                placeholder="Key length"
                v-model="profileForm.keyLen"
                :options="this.$root.profileOptions.KeyLen">
            </multiselect>
          </b-form-group>
          <b-form-group id="form-digest-group"
              label="Algorithm"
              label-for="form-digest-select"
              label-cols-sm="3"
              label-align-sm="right"
              label-class="pt-0"
              class="mb-0">
            <multiselect id="form-digest-select"
                :close-on-select="true"
                placeholder="Algorithm"
                v-model="profileForm.digest"
                :options="this.$root.profileOptions.Digest">
            </multiselect>
          </b-form-group>
          <b-form-group id="form-usage-group"
              label="Certificate usage"
              label-for="form-usage-select"
              label-cols-sm="3"
              label-align-sm="right"
              label-class="pt-0"
              class="mb-0">
            <multiselect id="form-usage-select"
                :close-on-select="false"
                :multiple="true"
                :clear-on-select="false"
                placeholder="Select usages"
                v-model="profileForm.keyUsage"
                :options="this.$root.profileOptions.Usages">
            </multiselect>
          </b-form-group>
          <b-form-group id="form-ext-usage-group"
              label="Certificate extended Usage"
              label-for="form-ext-usage-select"
              label-cols-sm="3"
              label-align-sm="right"
              label-class="pt-0"
              class="mb-0">
            <multiselect id="form-ext-usage-select"
                :close-on-select="false"
                :multiple="true"
                :clear-on-select="false"
                placeholder="Select extended usages"
                v-model="profileForm.extendedKeyUsage"
                :options="this.$root.profileOptions.ExtendedUsages">
            </multiselect>
          </b-form-group>
        </b-form-group>
      </b-card>
      <b-form-group class="controls">
        <b-button type="submit"
          variant="primary"
          v-if="actionName !== 'hide'">
          <i class="fa fa-plus-circle"></i>
          <span>{{ actionName }} profile</span>
        </b-button>
        <b-button type="reset"
            v-else
            variant="danger">
            <i class="fa fa-times"></i>
            Close
          </b-button>
          <b-button type="reset"
            v-if="actionName !== 'hide'"
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
import Multiselect from 'vue-multiselect';

export default {
  data() {
    return {
      api_host: this.$root.privateAPI,
      profileForm: this.$root.profileForm,
      origName: null,
      actionName: null,
      editForm: false,
      advanced: false,
      title: null,
    };
  },
  components: {
    Multiselect,
  },
  name: 'ModalProfile',
  methods: {
    showModal(profile, action) {
      this.editForm = Boolean(profile);
      // Build profile object
      this.profileForm = this.$root.initProfile(profile);
      // Convert subject to human readable
      this.profileForm.DN = this.$root.buildDn(this.profileForm.subject);
      // Duplication is creation
      if (action === 'Duplicate') {
        this.editForm = false;
      } else if (action === 'Edit') {
        this.origName = this.profileForm.name;
      }
      // Adapt button action
      this.actionName = action;
      // Adapt modal title
      this.title = `${action} profile`;
      // Display modal
      this.$refs.modalProfile.show();
    },
    onCertTypeSelect(selectedOption) {
      if (selectedOption === 'user') {
        if (!this.profileForm.extendedKeyUsage.includes('clientAuth')) {
          this.profileForm.extendedKeyUsage.push('clientAuth');
        }
        if (!this.profileForm.keyUsage.includes('keyEncipherment')) {
          this.profileForm.keyUsage.push('keyEncipherment');
        }
        if (!this.profileForm.keyUsage.includes('dataEncipherment')) {
          this.profileForm.keyUsage.push('dataEncipherment');
        }
        if (!this.profileForm.keyUsage.includes('nonRepudiation')) {
          this.profileForm.keyUsage.push('nonRepudiation');
        }
      } else if (selectedOption === 'email') {
        if (!this.profileForm.extendedKeyUsage.includes('emailProtection')) {
          this.profileForm.extendedKeyUsage.push('emailProtection');
        }
        if (!this.profileForm.keyUsage.includes('keyEncipherment')) {
          this.profileForm.keyUsage.push('keyEncipherment');
        }
        if (!this.profileForm.keyUsage.includes('digitalSignature')) {
          this.profileForm.keyUsage.push('digitalSignature');
        }
      } else if (selectedOption === 'server') {
        if (!this.profileForm.extendedKeyUsage.includes('serverAuth')) {
          this.profileForm.extendedKeyUsage.push('serverAuth');
        }
        if (!this.profileForm.keyUsage.includes('keyEncipherment')) {
          this.profileForm.keyUsage.push('keyEncipherment');
        }
        if (!this.profileForm.keyUsage.includes('digitalSignature')) {
          this.profileForm.keyUsage.push('digitalSignature');
        }
        if (!this.profileForm.keyUsage.includes('nonRepudiation')) {
          this.profileForm.keyUsage.push('nonRepudiation');
        }
      }
    },
    onCertTypeRemove(selectedOption) {
      // Remove profile usages
      if (this.profileForm.certType.includes(selectedOption)) {
        this.profileForm.certType = this.profileForm.certType.filter(item => item !== selectedOption);
      }
      this.profileForm.extendedKeyUsage = [];
      this.profileForm.keyUsage = [];
      // Then rebuild the complete profile
      this.profileForm.certType.forEach((usage) => {
        // eslint-disable-next-line
        console.log(usage);
        this.onCertTypeSelect(usage);
      });
    },
    addProfile(payload) {
      const path = `${this.api_host}/profiles`;
      axios.post(path, payload)
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          // Update global list
          this.$root.getProfiles();
          this.$root.showAlert(res.data.message, variant);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.$root.showAlert(error, 'danger', 60);
        });
    },
    updateProfile(payload) {
      const path = `${this.api_host}/profiles/${payload.name}`;
      axios.put(path, payload)
        .then((res) => {
          const variant = (res.data.status === 'success') ? 'success' : 'danger';
          // Update global list
          this.$root.getProfiles();
          this.$root.showAlert(res.data.message, variant);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.$root.showAlert(error, 'danger', 60);
        });
    },
    onSubmit(evt) {
      evt.preventDefault();
      if (this.profileForm.DN.includes('CN=')) {
        this.$root.showAlert('You cannot define CN in profile subject', 'danger');
        return false;
      }
      const fields = this.$root.buildSubject(this.profileForm.DN);
      if (!fields) {
        this.$root.showAlert('Invalid subject string, should be /C=XX/ST=XX/L=XX/O=XX at least');
        return false;
      }
      const payload = {
        name: this.profileForm.name,
        origName: this.origName,
        keyType: this.profileForm.keyType,
        keyLen: this.profileForm.keyLen,
        duration: this.profileForm.duration,
        digest: this.profileForm.digest,
        altnames: this.profileForm.altnames,
        domain: this.profileForm.domain,
        subject: fields,
        keyUsage: this.profileForm.keyUsage,
        extendedKeyUsage: this.profileForm.extendedKeyUsage,
        certType: this.profileForm.certType,
      };
      if (this.editForm) {
        this.updateProfile(payload);
      } else {
        this.addProfile(payload);
      }
      this.$refs.modalProfile.hide();
      // Reset data
      this.profileForm = this.$root.profileForm;
      this.editForm = false;
      return true;
    },
    onReset(evt) {
      evt.preventDefault();
      this.$refs.modalProfile.hide();
      // Reset data
      this.profileForm = this.$root.profileForm;
      this.editForm = false;
      return true;
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
