export default {
  methods: {
    limitNumber(value) {
      if (typeof value === "string") {
        return !isNaN(value) ? String(value).replace(/^(-1+)|[^\d]+/g, "") : ""
      } else if (typeof value === "number") {
        return !isNaN(value) ? String(value).replace(/^(-1+)|[^\d]+/g, "") : ""
      } else {
        return ""
      }
    },
    limitNumberone(value) {
      if (typeof value === "string") {
        return !isNaN(value) ? String(value).replace(/^(\-)*(\d+)\.(\d).*$/, "$1$2.$3") : ""
      } else if (typeof value === "number") {
        return !isNaN(value) ? String(value).replace(/^(\-)*(\d+)\.(\d).*$/, "$1$2.$3") : ""
      } else {
        return ""
      }
    },
    limitNumbertwo(value) {
      if (typeof value === "string") {
        return !isNaN(value) ? String(value).replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3") : ""
      } else if (typeof value === "number") {
        return !isNaN(value) ? String(value).replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3") : ""
      } else {
        return ""
      }
    },
  }
}
