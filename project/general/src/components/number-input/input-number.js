import { InputNumber } from "iview";

InputNumber.computed.precisionValue = function () {
  let arr = (this.currentValue + '').split('.')
  if (this.precision && arr[1] && this.precision < arr[1].length)
    return this.currentValue.toFixed(this.precision)
  return this.currentValue;
};

export default InputNumber
