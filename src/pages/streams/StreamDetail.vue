<template>
  <div>
    <section>
      <base-card>
        <h2>{{ streamerHandle }}</h2>
        <h3>{{ streamName }}</h3>
      </base-card>
    </section>
    <section>
       <base-card>
        <video-player :options="videoOptions"></video-player>

      <!--  <header>
          <h2>Contact now!</h2>
          <base-button @click="hideButton">
            Contact
          </base-button>
        </header>
        <form @submit.prevent="submitForm" v-if="formOpen">
          <div class="form-control">
            <label for="email">Email</label>
            <input type="email" id="email" v-model.trim="email" />
          </div>
          <div class="form-control">
            <label for="message">Message</label>
            <textarea
              name="message"
              id="message"
              cols="30"
              rows="5"
              v-model.trim="message"
            ></textarea>
          </div>
          <p v-if="!formIsValid" class="errors">
            Please enter a valid email and non-empty message
          </p>
          <div class="actions">
            <base-button>Send Message</base-button>
          </div>
        </form> -->
      </base-card>
    </section>
    <section>
      <base-card>
        <base-badge
          v-for="area in areas"
          :key="area"
          :type="area"
          :title="area"
        >
        </base-badge>
        <p>{{ description }}</p>
      </base-card>
    </section>
  </div>
</template>

<script>
import 'video.js/dist/video-js.css';
import VideoPlayer from "@/components/streams/VideoPlayer.vue";

export default {
  components: {
    VideoPlayer
  },
  props: ['id'],
  data() {
    return {
      selectedCoach: null,
      formOpen: false,
      email: '',
      message: '',
      formIsValid: true,
      videoOptions: {
        autoplay: true,
        controls: true,
        sources: [{
          src:
            "http://localhost:8000/destiny2.mp4",
          type: 
            "video/mp4"
        }]
      }
    };
  },
  computed: {
    streamerHandle() {
      return this.selectedCoach.streamerHandle
    },
    streamName() {
      return this.selectedCoach.streamName;
    },
    areas() {
      return this.selectedCoach.areas;
    },
    rate() {
      return this.selectedCoach.hourlyRate;
    },
    description() {
      return this.selectedCoach.description;
    }
    // contactLink() {
    //   // console.log('called contact', this.$route.path);
    //   // return this.$route.path + '/contact';
    // }
  },
  methods: {
    submitForm() {
      this.formIsValid = true;
      if (
        this.email === '' ||
        !this.email.includes('@') ||
        this.message === ''
      ) {
        this.formIsValid = false;
        return;
      }
      this.$store.dispatch('requests/contactCoach', {
        email: this.email,
        message: this.message,
        coachId: this.$route.params.id
      });
      this.$router.replace('/streams');
    },
    hideButton() {
      this.formOpen = !this.formOpen;
    }
  },
  created() {
    this.selectedCoach = this.$store.getters['streams/streams'].find(
      coach => coach.id === this.id
    );
  },
};
</script>

<style scoped>
form {
  margin: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
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

.errors {
  font-weight: bold;
  color: red;
}

.actions {
  text-align: center;
}
</style>
