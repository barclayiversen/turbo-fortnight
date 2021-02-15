<template>
  <section>
    <base-card>
      <h2>Register As a coach now!</h2>
      <coach-form @save-data="saveData"></coach-form>
    </base-card>
  </section>
</template>

<script>
import CoachForm from '../../components/streams/CoachForm.vue';
export default {
  emits: [''],
  components: {
    CoachForm
  },
  methods: {
    saveData(data) {
      this.$store.dispatch('coaches/saveCoachData', data);
      this.$router.replace('/streams');
    }
  }
};
</script>
