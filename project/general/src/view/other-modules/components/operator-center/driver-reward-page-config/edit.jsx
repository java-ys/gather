import Vue from 'vue'
import DriverRewardPageConfig from './driver-reward-page-config'
import { EDIT } from "./constant";

export default Vue.extend({
  name: 'editDriverRewardPageConfig',
  data() {
    return {
    }
  },
  provide() {
    return {
      type: EDIT,
      id: this.$route.params.id,
    }
  },
  methods: {
  },
  mounted() {
  },
  render(h) {
    return (
      <div class="edit-driver-reward-page-config">
        <DriverRewardPageConfig />
      </div>
    )
  }
})
