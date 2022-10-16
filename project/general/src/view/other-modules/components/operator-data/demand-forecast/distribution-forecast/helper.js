/**
* 根据一个经纬度及距离角度，算出另外一个经纬度
* @param {*} lng 经度 113.3960698
* @param {*} lat 纬度 22.941386
* @param {*} brng 方位角 45 ---- 正北方：000°或360° 正东方：090° 正南方：180° 正西方：270°
* @param {*} dist 90000距离(米)
*
* 1、角度转换为弧度公式：弧度=角度×(π ÷度180 )
* 2、弧度转换为角度公式： 角度=弧度×（180÷π）
*/
export const getLonAndLat = (longitude, latitude, brng, dist)=> {
    const lng = longitude.toFixed(6);
    const lat = latitude.toFixed(6)
    //大地坐标系资料WGS-84 长半径a=6378137 短半径b=6356752.3142 扁率f=1/298.2572236
    var a = 6378137;
    var b = 6356752.3142;
    var f = 1 / 298.257223563;
    // 高德坐标系
    var aGc = 6378245;
    // var b = 6378245;
    var fGc = 0.00669342162296594323 ;
 
    var lon1 = lng * 1;
    var lat1 = lat * 1;
    var s = dist;
    var alpha1 = brng * (Math.PI / 180)//mapNumberUtil.rad(brng);
    var sinAlpha1 = Math.sin(alpha1);
    var cosAlpha1 = Math.cos(alpha1);
 
    //var tanU1 = (1 - f) * Math.tan(mapNumberUtil.rad(lat1));
    var tanU1 = (1 - f) * Math.tan(lat1 * (Math.PI / 180));
    var cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)), sinU1 = tanU1 * cosU1;
    var sigma1 = Math.atan2(tanU1, cosAlpha1);
    var sinAlpha = cosU1 * sinAlpha1;
    var cosSqAlpha = 1 - sinAlpha * sinAlpha;
    var uSq = cosSqAlpha * (a * a - b * b) / (b * b);
    var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
 
    var sigma = s / (b * A), sigmaP = 2 * Math.PI;
    while (Math.abs(sigma - sigmaP) > 1e-12) {
        var cos2SigmaM = Math.cos(2 * sigma1 + sigma);
        var sinSigma = Math.sin(sigma);
        var cosSigma = Math.cos(sigma);
        var deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
            B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
        sigmaP = sigma;
        sigma = s / (b * A) + deltaSigma;
    }
 
    var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1;
    var lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
        (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp));
    var lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1);
    var C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
    var L = lambda - (1 - C) * f * sinAlpha *
        (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
 
    var revAz = Math.atan2(sinAlpha, -tmp); // final bearing
    const WGSLng = lon1 + L * (180 / Math.PI);
    const WGSLat = lat2 * (180 / Math.PI)
    // var lngLatObj = { lng: lon1 + L * (180 / Math.PI), lat: lat2 * (180 / Math.PI) }
    const lngLatArr =[WGSLng.toFixed(6),WGSLat.toFixed(6)]
    return lngLatArr;
}