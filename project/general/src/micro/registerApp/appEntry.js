
import * as MicrAppNames from './appNames'

export const isDev = process.env.NODE_ENV === "development";
export const devMicroUrl = (name) => process.env[`VUE_APP_MICRO_NAME_${name}`] || ''
export const microAppUrl = (name) => `//${window.location.host}/${name}/` // todo 需要加个应用中心的功能么

export const subAppEntry = (name) => isDev ? devMicroUrl(name) : microAppUrl(name)

export const appEntryMap = Object.keys(MicrAppNames).reduce((pre, cur) => {
  const entry = subAppEntry(MicrAppNames[cur])
  return { ...pre, ...(entry ? { [MicrAppNames[cur]]: entry } : {}) }
}, {})

