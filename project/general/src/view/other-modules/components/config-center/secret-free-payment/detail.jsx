import Vue from 'vue'
import PaymentStrategyConfig from './components/payment-strategy-config/payment-strategy-config'
import { DETAIL } from "./constant";

export default Vue.extend({
  name: 'detailPaymentStrategyConfig',
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
  mounted() {
  },
  render(h) {
    return (
      <div class="detail-payment-strategy-config">
        <PaymentStrategyConfig />
      </div>
    )
  }
})
