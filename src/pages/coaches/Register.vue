<template>
  <section>
    <base-card>
      <h2>Register As a coach now!</h2>
      <coach-form @save-data="saveData"></coach-form>
    </base-card>
  </section>
</template>

<script>
import CoachForm from '../../components/coaches/CoachForm.vue';
export default {
  emits: [''],
  components: {
    CoachForm
  },
  methods: {
    saveData(data) {
      console.log('data in reg', data);
      this.$store.dispatch('coaches/saveCoachData', data);
      this.$router.replace('/coaches');
    }
  }
};
</script>
