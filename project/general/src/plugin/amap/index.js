import AMap from "vue-amap";

export default {
  install(Vue) {
    Vue.use(AMap);

    AMap.initAMapApiLoader({
      // 高德的key
      key: "b6c2b09a0516da62997aa88e0db75e07",
      // 插件集合
      plugin: [
        "AMapManager",
        "AMap.Autocomplete",
        "AMap.PlaceSearch",
        "AMap.Scale",
        "AMap.OverView",
        "AMap.ToolBar",
        "AMap.MapType",
        "AMap.PolyEditor",
        "AMap.CircleEditor",
        "Geocoder",
        "Geolocation",
        "AMap.MarkerClusterer",
        "AMap.PolyEditor",
        "AMap.CircleEditor",
        "AMap.MouseTool",
        "AMap.Driving",
        "AMap.CitySearch",
        "AMap.InfoWindow",
        "AMap.LngLat",
        "AMap.DistrictSearch",
        "AMap.TileLayer.Traffic",
        "AMap.Heatmap",
        "AMap.Autocomplete",
        "AMap.PlaceSearch"
      ],
      // 高德 sdk 版本，默认为 1.4.4
      v: "1.4.4"
    });
  }
};
