/**
 * @description 其他模块
 */
import ConfigCenter from "./module/config-center";
import CustomerCenter from "./module/customer-center";
import ShortMessage from "./module/short-message-center";
import OperatorCenter from "./module/operator-center";
import OperatorData from "./module/operator-data"; // 运营数据
import OrderCenter from "./module/order-center";
import PriceCenter from "./module/price-center";
import MoreDayCar from "./module/more-day-car";
import PoiData from "./module/poi-data";
import GroundPushManage from "./module/ground-push-manage"
// import BoardCenter from "./module/board-center";
// import SafeCenter from "./module/safe-center";
import SupplierManagement from  "./module/supplier-manage"
import PassengerAppManage from "./module/passenger-app-manage"
import urgeCollect from "./module/urge-collect"
import ReachPlatform from "./module/reach-platform"

export default [
  ConfigCenter,
  CustomerCenter,
  ShortMessage,
  OperatorCenter,
  OperatorData,
  OrderCenter,
  PriceCenter,
  MoreDayCar,
  PoiData,
  SupplierManagement,
  PassengerAppManage,
  urgeCollect,
  ReachPlatform,
  GroundPushManage,
];
