import { getOwnSource, getThirdSource } from "_o/api/upgradeConfig";

// 端内渠道
export const getInChannel = async () => {
  const { data: data, status } = await getOwnSource({});
  return {
    data,
    status
  }
}

// 端外渠道
export const getOutChannel = async () => {
  const { data: data, status } = await getThirdSource({});
  return {
    data,
    status
  }
}


