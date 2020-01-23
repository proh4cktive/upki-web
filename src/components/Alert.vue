<template>
  <b-container>
    <b-row>
      <b-col align-self="center">
        <b-alert
          :show="showAlert"
          dismissible
          :variant="variant"
          @dismissed="alertHidden"
          @dismiss-count-down="countDownChanged"
        >
          <p>{{ message }}</p>
          <b-progress :variant="variant" :max="dismissSecs" :value="dismissCountDown" height="4px"></b-progress>
        </b-alert>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      dismissSecs: 10,
      dismissCountDown: 0,
      showDismissibleAlert: false
    };
  },
  props: {
    message: {
      default: null
    },
    variant: {
      type: String,
      default: "info"
    },
    showAlert: {
      type: [Boolean, Number],
      default: false
    }
  },
  watch: {
    showAlert: {
      handler(value) {
        if (value === true) {
          // default countdown value
          this.dismissCountDown = this.dismissSecs;
          return
        }
        if (value === false) {
          // stop countdown
          this.dismissCountDown = 0;
          return
        }

        // integer case
        this.dismissCountDown = parseInt(value);
      },
      immediate: true
    }
  },
  mounted() {
    console.log("mounted", this.showAlert);
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    alertHidden() {
      this.dismissCountDown = 0;
      this.$emit("close");
    }
  }
};
</script>
