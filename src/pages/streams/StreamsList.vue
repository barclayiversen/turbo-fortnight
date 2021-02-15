<template>
  <div>
    <base-dialog :show="!!error" title="An error occured" @close="handleError">
      {{ error }}
    </base-dialog>
    <section>
      <coach-filter @change-filter="setFilters"></coach-filter>
    </section>
    <section>
      <base-card>
        <div class="controls">
          <base-button mode="outline" @click="loadStreams(true)">
            Refresh
          </base-button>
          <base-button v-if="!isLoggedIn" link to="/auth?redirect=register">
            Login to register as a streamer
          </base-button>
          <base-button
            v-if="isLoggedIn && !isCoach && !isLoading"
            link
            to="/register"
          >
            Become a coach!
          </base-button>
        </div>
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <ul v-else-if="hasStreams">
          
          <coach-item
            v-for="stream in filteredStreams"
            :key="stream.id"
            :id="stream.id"
            :streamerHandle="stream.streamerHandle"
            :streamName="stream.streamName"
            :description="stream.description"
            :areas="stream.areas"
          ></coach-item>
        </ul>
        <h3 v-else>No streams found</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import CoachItem from '../../components/streams/CoachItem.vue';
import CoachFilter from '../../components/streams/CoachFilter.vue';

export default {
  components: {
    CoachItem,
    CoachFilter
  },
  data() {
    return {
      activeFilters: {
        music: true,
        games: true,
        other: true
      },
      isLoading: false,
      error: null
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    isCoach() {
      return this.$store.getters['streams/isCoach'];
    },
    filteredStreams() {
      const streams = this.$store.getters['streams/streams'];
      return streams.filter(coach => {
        if (this.activeFilters.music && coach.areas.includes('Music')) {
          return true;
        }
        if (this.activeFilters.games && coach.areas.includes('Games')) {
          return true;
        }
        if (this.activeFilters.other && coach.areas.includes('Other')) {
          return true;
        }
        return false;
      });
    },
    hasStreams() {
      return !this.isLoading && this.$store.getters['streams/hasStreams'];
    }
  },
  methods: {
    handleError() {
      this.error = null;
    },
    setFilters(filters) {
      this.activeFilters = filters;
    },
    async loadStreams(refresh = false) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('streams/loadStreams', {
          forceRefresh: refresh
        });
      } catch (error) {
        this.error = error.message || 'Something went wrong.';
      }
      this.isLoading = false;
    }
  },
  created() {
    this.loadStreams();
  }
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
