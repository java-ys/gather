import moment from "moment";
/**
 * requestAnimationFrame polyfill
 */

let prev = Date.now();

/* istanbul ignore next */
function fallback(fn) {
  const curr = Date.now();
  const ms = Math.max(0, 16 - (curr - prev));
  const id = setTimeout(fn, ms);
  prev = curr + ms;
  return id;
}

/* istanbul ignore next */
const root = window;

/* istanbul ignore next */
const iRaf = root.requestAnimationFrame || fallback;

/* istanbul ignore next */
const iCancel = root.cancelAnimationFrame || root.clearTimeout;

export function raf(fn) {
  return iRaf.call(root, fn);
}

// double raf for animation
export function doubleRaf(fn) {
  raf(() => {
    raf(fn);
  });
}

export function cancelRaf(id) {
  iCancel.call(root, id);
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function parseTimeData(time) {
  const days = Math.floor(time / DAY);
  const hours =
    Math.floor((time % DAY) / HOUR) < 10
      ? `0${Math.floor((time % DAY) / HOUR)}`
      : Math.floor((time % DAY) / HOUR);
  const minutes =
    Math.floor((time % HOUR) / MINUTE) < 10
      ? `0${Math.floor((time % HOUR) / MINUTE)}`
      : Math.floor((time % HOUR) / MINUTE);
  const seconds =
    Math.floor((time % MINUTE) / SECOND) < 10
      ? `0${Math.floor((time % MINUTE) / SECOND)}`
      : Math.floor((time % MINUTE) / SECOND);
  const milliseconds = Math.floor(time % SECOND);
  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}

export function padZero(num, targetLength = 2) {
  let str = num + "";

  while (str.length < targetLength) {
    str = "0" + str;
  }

  return str;
}
export function parseFormat(format, timeData) {
  const { days } = timeData;
  let { hours, minutes, seconds, milliseconds } = timeData;

  if (format.indexOf("DD") === -1) {
    hours += days * 24;
  } else {
    format = format.replace("DD", padZero(days));
  }

  if (format.indexOf("HH") === -1) {
    minutes += hours * 60;
  } else {
    format = format.replace("HH", padZero(hours));
  }

  if (format.indexOf("mm") === -1) {
    seconds += minutes * 60;
  } else {
    format = format.replace("mm", padZero(minutes));
  }

  if (format.indexOf("ss") === -1) {
    milliseconds += seconds * 1000;
  } else {
    format = format.replace("ss", padZero(seconds));
  }

  return format.replace("SSS", padZero(milliseconds, 3));
}

export function isSameSecond(time1, time2) {
  return Math.floor(time1 / 1000) === Math.floor(time2 / 1000);
}

// 根据经纬度获取位置信息
export function getPointDetailInfoByAmap(locationInfo) {
  // eslint-disable-next-line
  // const AMap = window.AMap;
  let LngLat = new AMap.LngLat(
    locationInfo.lng || locationInfo.longitude,
    locationInfo.lat || locationInfo.latitude
  );
  return new Promise((resolve, reject) => {
    AMap.plugin("AMap.Geocoder", async () => {
      const geocoder = new AMap.Geocoder();
      geocoder.getAddress(LngLat, (status, result) => {
        if (status === "complete" && result.regeocode) {
          const {
            addressComponent,
            pois,
            formattedAddress: formatted_address,
          } = result.regeocode;
          const {
            province,
            city,
            district,
            township,
            streetNumber,
          } = addressComponent;

          const preStr = province + city + district;
          let shortAddress = formatted_address.replace(preStr, "");

          if (shortAddress.length > 9) {
            shortAddress = shortAddress.replace(township, "");
          }

          if (shortAddress.length > 9 && streetNumber) {
            const addr1 = streetNumber.street;
            const addr2 = streetNumber.street + streetNumber.number;

            if (shortAddress.startsWith(addr2)) {
              shortAddress = shortAddress.replace(addr2, "");
            } else if (shortAddress.startsWith(addr1)) {
              shortAddress = shortAddress.replace(addr1, "");
            }
          }

          let lc = {
              addressName: shortAddress, // 地址名
              amapCityCode: addressComponent.citycode, // 3位高德码
              longitude: locationInfo.longitude || locationInfo.lng, // 纬
              latitude: locationInfo.latitude || locationInfo.lat, // 经度
          };
          resolve(lc);
          LngLat = null;
        }
      });
    });
  });
}