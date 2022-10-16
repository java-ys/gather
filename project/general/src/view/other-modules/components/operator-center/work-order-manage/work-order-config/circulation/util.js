
export const createRule = (message, type = "string", trigger = "blur") => ({
  required: true,
  message,
  trigger,
  type,
})