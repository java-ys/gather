import Vue from 'vue'
import DriverRewardPageConfig from './driver-reward-page-config'
import { CREATE } from "./constant";

export default Vue.extend({
  name: 'createDriverRewardPageConfig',
  data() {
    return {
    }
  },
  provide() {
    return {
      type: CREATE,
    }
  },
  methods: {
  },
  mounted() {
    console.log(this.$router)
  },
  render(h) {
    return (
      <div class="create-driver-reward-page-config">
        <DriverRewardPageConfig />
      </div>
    )
  }
})
