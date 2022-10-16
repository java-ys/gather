<template>
  <div>
    <p style="font-size: 16px; font-weight: 700">
      {{ data.minNum + "-" + data.maxNum }}
    </p>
    <div :style="{ border: '1px solid #eee', padding: '20px' }">
      <Row style="margin-bottom: 30px">
        <Col :span="4" >
        <span>接送里程单价：</span>
        </Col>
        <Col :span="20" >
        <div
          v-for="(item, key) in data.transferMileages"
          :key="key"
        >
          <span>{{ item.min }}</span>
          <span>{{ item.status ? "公里以上" : "至" }}</span>
          <span>{{ item.max }}</span>
          <span>{{ item.max ? "公里" : "" }}</span>
          <span style="margin-left: 20px">单价（元/公里）:</span>
          <span>{{ item.value }}</span>
        </div>
        </Col>
      </Row>
      <Row style="margin-bottom: 30px">
        <Col :span="4" >
        <span>服务里程单价：</span>
        </Col>
        <Col :span="20" >
        <div
          v-for="(item, key) in data.serviceMileages"
          :key="key"
        >
          <span>{{ item.min }}</span>
          <span>{{ item.status ? "公里以上" : "至" }}</span>
          <span>{{ item.max }}</span>
          <span>{{ item.max ? "公里" : "" }}</span>
          <span style="margin-left: 20px">单价（元/公里）:</span>
          <span>{{ item.value }}</span>
        </div>
        </Col>
      </Row>
      <Row style="margin-bottom: 30px">
        <Col :span="4" >
        <span>时长单价（元/分钟）：</span>
        </Col>
        <Col :span="20" >
        <div>
          <span>{{ +data.priceTime }}</span>
        </div>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
export default {
  name: "typedetail",
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          pickUpMileage: [
            {
              min: 1,
              max: 4,
              status: 0,
              value: 1
            }
          ],
          seiviceMileage: [
            {
              min: 1,
              max: 4,
              status: 0,
              value: 1
            }
          ],
          fare: 2,
          min: 1,
          max: 4
        };
      }
    }
  }
};
</script>
