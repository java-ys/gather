import Vue from 'vue'
import PaymentStrategyConfig from './components/payment-strategy-config/payment-strategy-config'
import { CREATE } from "./constant";

export default Vue.extend({
  name: 'createPaymentStrategyConfig',
  data() {
    return {
    }
  },
  provide() {
    return {
      type: CREATE,
      id: undefined,
    }
  },
  methods: {
  },
  mounted() {
  },
  render(h) {
    return (
      <div class="create-payment-strategy-config">
        <PaymentStrategyConfig />
      </div>
    )
  }
})
