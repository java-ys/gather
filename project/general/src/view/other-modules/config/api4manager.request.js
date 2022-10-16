/**
 * @description m2-manager-web api服务
 */

 import { axiosHttpRequest } from "@/libs/util";
 const gatePath = "/m2-manager-web"
 export default axiosHttpRequest(gatePath);