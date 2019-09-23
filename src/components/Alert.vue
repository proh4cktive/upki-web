<template>
  <b-container>
    <b-row>
      <b-col align-self="center">
        <b-alert @dismissed="showAlert"
            @dismiss-count-down="countDownChanged"
            :variant="variant"
            :show="countDown"
            dismissible>{{ message }}</b-alert>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      dismissCountDown: 10,
      showAlert: false,
    };
  },
  props: ['message', 'variant', 'countDown'],
  methods: {
    countDownChanged(dismissCountDown) {
      this.showAlert = dismissCountDown;
    },
  },
};
</script>
