import Vue from 'vue'
import PaymentStrategyConfig from './components/payment-strategy-config/payment-strategy-config'
import { EDIT } from "./constant";

export default Vue.extend({
  name: 'editPaymentStrategyConfig',
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
      <div class="edit-payment-strategy-config">
        <PaymentStrategyConfig />
      </div>
    )
  }
})
