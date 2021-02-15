<template>
  <div>
    <section>
      <div>

      <div class="stream-container">
          <video-player :options="videoOptions"></video-player>
      </div>
      <div class="chat" v-if="chatOpen">chatdiv
        <button @click="collapseChat">Collapse Chat</button>
      </div>
      </div>
    </section>
    <section>
      <base-card>
        <h2>{{ streamerHandle }}</h2>
        <h3>{{ streamName }}</h3>
        <p>{{ description }}</p>
        <base-badge
          v-for="area in areas"
          :key="area"
          :type="area"
          :title="area"
        >
        </base-badge>
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
      chatOpen: true,
      email: '',
      message: '',
      formIsValid: true,
      videoOptions: {
        // height: "300%",
        // width: "500%",
        fluid: true,
        // responsive: true,
        // fill: true,
        // aspectRatio: '9:16',
        autoplay: false,
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
    },
    collapseChat() {

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
.stream-container {
  /* margin-left: 0.5rem; */
  /* height: 30%; */
  width: 70%;
  display: inline-block;
  /* max-width: 70%; */
}
.chat {
  /* height: 75%; */
  padding: 1rem;
  /* margin-top: 0.5rem; */
  border: 3px solid black;
  width: 30%;
  position: absolute;
  /* float: right; */
  /* background-color: #3d008d; */
  display:inline-block;
}
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
