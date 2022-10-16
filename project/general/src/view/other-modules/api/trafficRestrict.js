import axios from "_g/config/api.request";
import crmRequest from "_o/config/api4Crm.request"

export const getHeaderNumber = data => {
  return axios.request({
    url: "/admin/trafficRestStrategy/headNumberSelect",
    method: "get",
    params: data
  });
};