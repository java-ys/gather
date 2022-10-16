import Vue from 'vue'
import DriverRecruitLandingConfig from './driver-recruit-landing-config'
import { EDIT } from "./constant";

export default Vue.extend({
  name: 'editDriverRecruitLandingConfig',
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
      <div class="edit-driver-recruit-landing-config">
        <DriverRecruitLandingConfig />
      </div>
    )
  }
})
