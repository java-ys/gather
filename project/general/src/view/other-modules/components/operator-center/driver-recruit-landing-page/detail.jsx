import Vue from 'vue'
import DriverRecruitLandingConfig from './driver-recruit-landing-config'
import { DETAIL } from "./constant";

export default Vue.extend({
  name: 'createDriverReruitLandingConfig',
  data() {
    return {
    }
  },
  provide() {
    return {
      type: DETAIL,
      id: this.$route.params.id,
    }
  },
  methods: {
  },
  mounted() {},
  render(h) {
    return (
      <div class="detail-driver-recruit-landing-config">
        <DriverRecruitLandingConfig />
      </div>
    )
  }
})
