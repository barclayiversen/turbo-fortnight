<template>
  <div>
    <section>
      <div>
        <div class="stream-container">
          <video-player :options="videoOptions"></video-player>
        </div>
        <div class="chat" v-if="chatOpen">
          <h4>{{ streamerHandle }}'s chat</h4>
          <ul>
            <li v-for="message in messages" :key="message.id" :message="message.message" :user="message.user">{{ user }}: {{ message.message }}</li>
          </ul>
          <form @submit.prevent="submitForm">
            <input type="text" v-model="message" placeholder="Send a message"/>
          </form>
          <button @click="collapseChat">Collapse Chat</button>
          <button @click="submitForm" style="float: right">Send Message</button>
          <!-- <button v-if="isLoggedIn" @click="submitForm" style="float: right"> -->
            <!-- Send message -->
          <!-- </button> -->
          <!-- <p v-else style="float: right">Log in to chat!</p> -->
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
import VideoPlayer from '@/components/streams/VideoPlayer.vue';

export default {
  components: {
    VideoPlayer,
  },
  props: ['id'],
  data() {
    return {
      user: "Spracto",
      selectedStreamer: null,
      chatOpen: true,
      message: '',
      formIsValid: true,
      videoOptions: {
        fluid: true,
        autoplay: false,
        controls: true,
        sources: [
          {
            src: 'http://localhost:8000/destiny2.mp4',
            type: 'video/mp4',
          },
        ],
      },
      messages: []
    };
  },
  computed: {
    getChatMessages() {
      return this.$store.getters.chatMessages;
    },
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    streamerHandle() {
      return this.selectedCoach.streamerHandle;
    },
    streamName() {
      return this.selectedCoach.streamName;
    },
    areas() {
      return this.selectedCoach.areas;
    },
    description() {
      return this.selectedCoach.description;
    },
    // contactLink() {
    //   // console.log('called contact', this.$route.path);
    //   // return this.$route.path + '/contact';
    // }
  },
  methods: {
    submitForm() {
      console.log(this.message)
      this.formIsValid = true;
      if (
        this.message.trim === ''
      ) {
        this.formIsValid = false;
        return;
      }
      const message = {
        message: this.message,
        user: this.user,
        id: this.messages.length + 1
      }
      this.messages.push(message)
      this.message = '';
      // this.$store.dispatch('requests/contactCoach', {
      //   email: this.email,
      //   message: this.message,
      //   coachId: this.$route.params.id,
      // });
    },
    hideButton() {
      this.formOpen = !this.formOpen;
    },
    collapseChat() {},
  },
  created() {
    this.selectedCoach = this.$store.getters['streams/streams'].find(
      (coach) => coach.id === this.id
    );
  },
};
</script>

<style scoped>
p {
  margin: 0
}
.stream-container {
  width: 70%;
  display: inline-block;
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
  display: inline-block;
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
