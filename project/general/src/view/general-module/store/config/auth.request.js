import { axiosHttpRequest } from "@/libs/util";
// 安全登录api
const oauthGatePath = "/security-authentication-api"
export default axiosHttpRequest(oauthGatePath);
