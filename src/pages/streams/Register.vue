<template>
  <section>
    <base-card>
      <h2>Register As a coach now!</h2>
      <streamer-form @save-data="saveData"></streamer-form>
    </base-card>
  </section>
</template>

<script>
import StreamerForm from '../../components/streams/StreamerForm.vue';
export default {
  emits: [''],
  components: {
    StreamerForm
  },
  methods: {
    saveData(data) {
      this.$store.dispatch('coaches/saveCoachData', data);
      this.$router.replace('/streams');
    }
  }
};
</script>
