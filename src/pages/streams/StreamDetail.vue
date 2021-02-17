<template>
  <div>
    <section>
      <div class="main">
        <div class="stream-container-partial">
          <video-player :options="videoOptions"></video-player>
        </div>
        <div class="chat-container">
          <div class="chat-header" v-if="chatOpen">
            <h4>{{ streamerHandle }}'s chat</h4>
          </div>
          <div class="chat" v-if="chatOpen">
            <ul>
              <li
                v-for="message in messages"
                :key="message.id"
                :message="message.message"
                :user="message.user"
              >
                {{ user }}: {{ message.message }}
              </li>
            </ul>
          </div>
            <div class="message-container">
              <form @submit.prevent="submitForm">
                <input
                  type="text"
                  v-model="message"
                  placeholder="Send a message"
                />
              </form>

              <!-- <button @click="hideButton">Collapse Chat</button> -->
              <!-- <button v-if="isLoggedIn" @click="submitForm" style="float: right"> -->
              <!-- Send message -->
              <!-- </button> -->
              <!-- <p v-else style="float: right">Log in to chat!</p> -->

              <button @click="submitForm" style="float: right">
                Send Message
              </button>
            </div>
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
      user: 'Spracto',
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
      messages: [],
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
      console.log(this.message);
      this.formIsValid = true;
      if (this.message.trim() === '') {
        this.formIsValid = false;
        return;
      }
      const message = {
        message: this.message,
        user: this.user,
        id: this.messages.length + 1,
      };
      this.messages.push(message);
      this.message = '';
      // this.$store.dispatch('requests/contactCoach', {
      //   email: this.email,
      //   message: this.message,
      //   coachId: this.$route.params.id,
      // });
    },
    hideButton() {
      if (this.chatOpen) {
        this.chatOpen = !this.chatOpen;
      }
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
  margin: 0;
}
.stream-container-partial {
  width: 70%;
  display: inline-block;
}
.stream-container-full {
  width: 100%;
  /* display: inline-block; */
}
.main {
  margin: 0;
  display: flex;
  flex-direction: row;
}
.message-container {
  display: flex;
  min-height: 13vh;
  max-height: 13vh;
  width: 100%;

}
.chat-container {
  margin: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 30%;
}
.chat-header {
  height: 7vh;
  border: 2px solid black;
  background-color: white;
  display: inline-block;
  /* position: absolute; */
}
.chat {
  overflow: scroll;
  min-height: 70vh;
  max-height: 70vh;
  /* height: 75%; */
  padding: 1rem;
  /* margin-top: 0.5rem; */
  border: 3px solid black;
  /* position:relative; */
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
