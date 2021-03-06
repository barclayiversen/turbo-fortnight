<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog fixed :show="isLoading" title="Authenticating">
      <base-spinner></base-spinner>
    </base-dialog>
    <form @submit.prevent="submitForm">
      <base-card>
        <div class="form-control">
          <label for="email"> Email </label>
          <input type="email" id="email" v-model.trim="email" />
        </div>
        <p v-if="!formIsValid.email">Please enter a valid email</p>

        <div class="form-control">
          <label for="password"> Password </label>
          <input type="password" id="password" v-model.trim="password" />
        </div>
        <p v-if="!formIsValid.password">
          Please enter a valid password of at least 6 characters
        </p>
        <div v-if="mode === 'signup'">
          <div class="form-control">
            <label for="username">
              Pick a username. Must be alphanumeric.
            </label>
            <input type="username" id="username" v-model.trim="username" />
          </div>
          <p v-if="!formIsValid.username">Please enter a valid username</p>
        </div>
        <base-button>{{ submitButtonCaption }}</base-button>
        <base-button type="button" mode="flat" @click="switchAuthMode">
          {{ switchModeButtonCaption }}
        </base-button>
      </base-card>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      username: '',
      formIsValid: {
        email: true,
        password: true,
      },
      mode: 'login',
      isLoading: false,
      error: null,
    };
  },
  computed: {
    submitButtonCaption() {
      if (this.mode === 'login') {
        return 'Login';
      } else {
        return 'Signup';
      }
    },
    switchModeButtonCaption() {
      if (this.mode === 'login') {
        return 'Signup instead';
      } else {
        return 'Login instead';
      }
    },
  },
  methods: {
    async submitForm() {
      this.formIsValid.email = true;
      this.formIsValid.password = true;
      if (this.email === '') {
        this.formIsValid.email = false;
      }
      if (!this.email.includes('@')) {
        this.formIsValid.email = false;
      }
      if (this.password.length < 6) {
        this.formIsValid.password = false;
      }
      if (this.username.length < 1) {
        this.formIsValid.username = false;
      }
      this.isLoading = true;

      try {
        if (this.mode === 'login') {
          const actionPayload = {
            email: this.email,
            password: this.password
          };
          await this.$store.dispatch('login', actionPayload);
        } else {
          const actionPayload = {
            email: this.email,
            password: this.password,
            username: this.username,
          };
          await this.$store.dispatch('signup', actionPayload);
        }
        console.log('redirect block');
        const redirectUrl = '/' + (this.$route.query.redirect || 'streams');
        this.$router.replace(redirectUrl);
      } catch (error) {
        console.log('hit error1', error);
        this.error = error.message || 'Failed to Authenticate';
      }

      this.isLoading = false;
    },
    switchAuthMode() {
      if (this.mode === 'login') {
        this.mode = 'signup';
      } else {
        this.mode = 'login';
      }
    },
    handleError() {
      this.error = false;
    },
  },
};
</script>

<style scoped>
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>
