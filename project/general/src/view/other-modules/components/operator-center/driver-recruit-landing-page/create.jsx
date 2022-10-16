import Vue from 'vue'
import DriverRecruitLandingConfig from './driver-recruit-landing-config'
import { CREATE } from "./constant";

export default Vue.extend({
  name: 'createDriverRecruitLandingConfig',
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
  mounted() {},
  render(h) {
    return (
      <div class="create-driver-recruit-landing-config">
        <DriverRecruitLandingConfig />
      </div>
    )
  }
})
