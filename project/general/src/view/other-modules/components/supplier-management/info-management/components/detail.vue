<template>
  <div class="supplier-detail">
    <div class="detail-section">
      <h2>基本信息</h2>
      <Row :gutter="24">
        <Col :span="6">
          <div>
            <label class="detail-label">供应商名称</label>
            <div class="text">{{supplierDetail.name}}</div>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <label class="detail-label">供应商编码</label>
            <div class="text">{{supplierDetail.code}}</div>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <label class="detail-label">城市</label>
            <div class="text">{{supplierDetail.registeredCity}}</div>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <label class="detail-label">供应商联系人</label>
            <div class="text">{{contactDetail.name}}</div>
          </div>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col :span="6">
          <div>
            <label class="detail-label">联系人电话</label>
            <div class="text">{{contactDetail.telephone}}</div>
          </div>
        </Col>
        <Col :span="12">
          <div>
            <label class="detail-label">供应商地址</label>
            <div class="text">{{supplierDetail.address}}</div>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <label class="detail-label">备注</label>
            <div class="text">{{supplierDetail.remark}}</div>
          </div>
        </Col>
      </Row>
    </div>
    <div class="detail-section">
      <h2>营业执照</h2>
      <Row :gutter="24">
        <Col :span="6">
          <div>
            <label class="detail-label">编号</label>
            <div class="text">{{businessDetail.licenseNo}}</div>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <label class="detail-label">社会信用代码证</label>
            <div class="text">{{businessDetail.socialCreditCode}}</div>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <label class="detail-label">名称</label>
            <div class="text">{{businessDetail.name}}</div>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <label class="detail-label">类型</label>
            <div class="text">{{businessDetail.copType}}</div>
          </div>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col :span="6">
          <div>
            <label class="detail-label">法定代表人</label>
            <div class="text">{{businessDetail.legalPerson}}</div>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <label class="detail-label">注册资本</label>
            <div class="text">{{businessDetail.registeredCapital}}&nbsp;{{businessDetail.registeredCapitalUnit === 0 ?
              "元": "万元"}}
            </div>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <label class="detail-label">成立日期</label>
            <div class="text">{{businessDetail.foundDate}}</div>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <label class="detail-label">发证日期</label>
            <div class="text">{{businessDetail.issueDate}}</div>
          </div>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col :span="12">
          <div>
            <label class="detail-label">营业期限</label>
            <div class="text">{{businessDetail.bizStartDate}}&nbsp;&nbsp;&nbsp;&nbsp;{{businessDetail.bizEndDate}}</div>
          </div>
        </Col>
        <Col :span="12">
          <div>
            <label class="detail-label">住所</label>
            <div class="text">{{businessDetail.residence}}</div>
          </div>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col :span="12">
          <div>
            <label class="detail-label">经营范围</label>
            <div class="text">{{businessDetail.bizScope}}</div>
          </div>
        </Col>
        <Col :span="12">
          <div>
            <label class="detail-label">营业执照照片</label>
            <div v-for="item in bussImgDetail">
              <div style="float: left;margin-right: 5px">
                <el-image fit="scale-down" :src="item" style="width: 50px; height: 50px" :preview-src-list="bussImgDetail"></el-image>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <div class="detail-section">
      <h2>签约信息</h2>
      <Row :gutter="24">
        <Col :span="6">
          <div>
            <label class="detail-label">合同编号</label>
            <div class="text">{{contractDetail.contractNo}}</div>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <label class="detail-label">合同起期</label>
            <div class="text">{{contractDetail.startDate}}</div>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <label class="detail-label">合同止期</label>
            <div class="text">{{contractDetail.endDate}}</div>
          </div>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col :span="24">
          <div>
            <label class="detail-label">合同文本 pdf</label>
            <div v-for="(item, index) in contractImgDetail">
              <div style="float: left;margin-right: 5px">
                <!--<el-image fit="scale-down" :src="item" style="width: 50px; height: 50px" :preview-src-list="contractImgDetail"></el-image>-->
                <div style="cursor: pointer;" @click="handleView(item)">合同{{index + 1}}</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <div class="detail-section">
      <h2>财务账号</h2>
      <Row :gutter="24">
        <Col :span="6">
          <div>
            <label class="detail-label">开户凭证核准号</label>
            <div class="text">{{accountDetail.approvalNo}}</div>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <label class="detail-label">开户凭证编号</label>
            <div class="text">{{accountDetail.certificateNo}}</div>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <label class="detail-label">银行账号</label>
            <div class="text">{{accountDetail.account}}</div>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <label class="detail-label">开户行</label>
            <div class="text">{{accountDetail.bankName}}</div>
          </div>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col :span="6">
          <div>
            <label class="detail-label">银行户名</label>
            <div class="text">{{accountDetail.accountName}}</div>
          </div>
        </Col>
        <Col :span="18">
          <div>
            <label class="detail-label">开户凭证照片</label>
            <div v-for="item in accountImgDetail">
              <div style="float: left;margin-right: 5px">
                <el-image fit="scale-down" :src="item" style="width: 50px; height: 50px" :preview-src-list="accountImgDetail"></el-image>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <div class="detail-section">
      <h2>结算信息</h2>
      <Row :gutter="24">
        <Col :span="6">
          <div>
            <label class="detail-label">结算周期日</label>
            <div class="text">{{srmSettlementMethodDetail.period}}</div>
          </div>
        </Col>
        <Col :span="24">
          <div>
            <label class="detail-label">&nbsp;</label>
            <div class="text" style="font-weight: lighter">目前，仅支持月度结算方式；举例，选择28日，则结算周期为上月的28日到本月的27日。</div>
          </div>
        </Col>
      </Row>
    </div>
    <div class="detail-section" style="border-bottom: 0">
      <h2>供应信息</h2>
      <Row :gutter="24">
        <Col :span="6">
          <div>
            <label class="detail-label">供应商类型</label>
            <div class="text">{{supplyTypeDetail.supplierType}}</div>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <label class="detail-label">供应方式</label>
            <div class="text">{{supplyTypeDetail.supplyMethod[0].supplierMethod}}</div>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <label class="detail-label">运营区域</label>
            <div class="text">{{supplyTypeDetail.opAreaName}}</div>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <label class="detail-label">所属机构</label>
            <div class="text">{{supplyTypeDetail.refOrganName}}</div>
          </div>
        </Col>
      </Row>
    </div>
    <div class="detail-section" style="border-bottom: 0">
      <h2>账号信息</h2>
      <Row :gutter="24">
        <Col :span="24">
          <div>
            <label class="detail-label">是否登录||运营中心</label>
            <div class="text">{{supplierDetail.isLogin === 1 ? '是' : '否'}}</div>
          </div>
        </Col>
        <template v-if="supplierDetail.isLogin === 1">
          <Col :span="6">
            <div>
              <label class="detail-label">管理员姓名</label>
              <div class="text">{{supplierDetail.managerName}}</div>
            </div>
          </Col>
          <Col :span="6">
            <div>
              <label class="detail-label">管理员身份证号</label>
              <div class="text">{{supplierDetail.managerCardId}}</div>
            </div>
          </Col>
          <Col :span="6">
            <div>
              <label class="detail-label">管理员手机号码</label>
              <div class="text">{{supplierDetail.managerTel}}</div>
            </div>
          </Col>
          <Col :span="6">
            <div>
              <label class="detail-label">邮箱</label>
              <div class="text">{{supplierDetail.managerEmail}}</div>
            </div>
          </Col>
        </template>
      </Row>
    </div>
  </div>
</template>

<script>

  export default {
    name: "detail",
    props: {
      theInfo: {
        type: Object,
        default: () => {
          return {}
        }
      },
      myCitys: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {}
    },
    computed: {
      supplierDetail() {
        if (this.theInfo.supplier) {
          this.myCitys.forEach(item => {
            if (item.provinceCode === this.theInfo.supplier.provinceUuid) {
              item.cityDtoList.forEach(e => {
                if (e.orgCode === this.theInfo.supplier.cityUuid) {
                  this.theInfo.supplier.address = item.provinceName + e.orgName + this.theInfo.supplier.address
                }
              })
            }
            if (item.provinceCode === (this.theInfo.supplier.registeredCity.substring(0,2) + "0000")) {
              item.cityDtoList.forEach(e => {
                if (e.orgCode === this.theInfo.supplier.registeredCity) {
                  this.theInfo.supplier.registeredCity = item.provinceName + e.orgName
                }
              })
            }
          })
          return this.theInfo.supplier
        } else {
          return {
            name: "",
            code: "",
            registeredCity: "",
            address: "",
            remark: ""
          }
        }
      },
      contactDetail() {
        if (this.theInfo.contact && this.theInfo.contact.length) {
          return this.theInfo.contact[0]
        } else {
          return {
            name: "",
            telephone: ""
          }
        }
      },
      businessDetail() {
        if (this.theInfo.businessLicense) {
          if (this.theInfo.businessLicense.foundDate) {
            let foundDate = this.theInfo.businessLicense.foundDate.split(" ")
            this.theInfo.businessLicense.foundDate = foundDate[0]
          }
          if (this.theInfo.businessLicense.issueDate) {
            let issueDate = this.theInfo.businessLicense.issueDate.split(" ")
            this.theInfo.businessLicense.issueDate = issueDate[0]
          }
          if (this.theInfo.businessLicense.bizStartDate) {
            let bizStartDate = this.theInfo.businessLicense.bizStartDate.split(" ")
            this.theInfo.businessLicense.bizStartDate = bizStartDate[0]
          }
          if (this.theInfo.businessLicense.bizEndDate) {
            let bizEndDate = this.theInfo.businessLicense.bizEndDate.split(" ")
            this.theInfo.businessLicense.bizEndDate = bizEndDate[0]
          }
          return this.theInfo.businessLicense
        } else {
          return {
            licenseNo: "",
            socialCreditCode: "",
            name: "",
            copType: "",
            legalPerson: "",
            registeredCapital: "",
            registeredCapitalUnit: null,
            foundDate: "",
            issueDate: "",
            bizStartDate: "",
            bizEndDate: "",
            residence: "",
            bizScope: ""
          }
        }
      },
      bussImgDetail() {
        if (this.theInfo.businessLicense && this.theInfo.businessLicense.bussImgList && this.theInfo.businessLicense.bussImgList.length) {
          let imgForm = this.theInfo.businessLicense.bussImgList
          if (imgForm.length) {
            let imgList = []
            imgForm.forEach(item => {
              imgList.push(item.attachmentUuid)
            })
            return imgList
          }
        } else {
          return []
        }
      },
      contractDetail() {
        if (this.theInfo.contract && this.theInfo.contract.length) {
          if (this.theInfo.contract[0].startDate) {
            let startDate = this.theInfo.contract[0].startDate.split(" ")
            this.theInfo.contract[0].startDate = startDate[0]
          }
          if (this.theInfo.contract[0].endDate) {
            let endDate = this.theInfo.contract[0].endDate.split(" ")
            this.theInfo.contract[0].endDate = endDate[0]
          }
          return this.theInfo.contract[0]
        } else {
          return {
            contractNo: "",
            startDate: "",
            endDate: ""
          }
        }
      },
      contractImgDetail() {  //合同文本照片
        if (this.theInfo.contract && this.theInfo.contract.length) {
          let imgForm = this.theInfo.contract[0]
          if (imgForm.contractImgList.length) {
            let imgList = []
            imgForm.contractImgList.forEach(item => {
              imgList.push(item.attachmentUuid)
            })
            return imgList
          }
        } else {
          return []
        }
      },
      accountDetail() {
        if (this.theInfo.account && this.theInfo.account.length) {
          return this.theInfo.account[0]
        } else {
          return {
            approvalNo: "",
            certificateNo: "",
            account: "",
            bankName: "",
            accountName: ""
          }
        }
      },
      accountImgDetail() {  //开户凭证照片
        if (this.theInfo.account && this.theInfo.account.length) {
          let imgForm = this.theInfo.account[0]
          if (imgForm.accountImgList.length) {
            let imgList = []
            imgForm.accountImgList.forEach(item => {
              imgList.push(item.attachmentUuid)
            })
            return imgList
          }
        } else {
          return []
        }
      },
      srmSettlementMethodDetail() {
        if (this.theInfo.srmSettlementMethod && this.theInfo.srmSettlementMethod.length) {
          return this.theInfo.srmSettlementMethod[0]
        } else {
          return {
            period: ""
          }
        }
      },
      supplyTypeDetail() {
        if (this.theInfo.supplyType && this.theInfo.supplyType.length) {
          if (this.theInfo.supplyType[0].supplierType === 0 || this.theInfo.supplyType[0].supplierType === 5) {
            if (this.theInfo.supplyType[0].supplierType === 5) {
              this.theInfo.supplyType[0].supplierType = '自动驾驶车辆供应商'
            } else {
              this.theInfo.supplyType[0].supplierType = '车辆供应商'
            }
            if (this.theInfo.supplyType[0].supplyMethod.length) {
              let methodText = ""
              this.theInfo.supplyType[0].supplyMethod.forEach(item => {
                if (item.supplierMethod === 0) {
                  methodText = methodText + "自购/"
                } else if (item.supplierMethod === 1) {
                  methodText = methodText + "加盟/"
                } else if (item.supplierMethod === 3) {
                  methodText = methodText + "裸车租赁/"
                } else if (item.supplierMethod === 4) {
                  methodText = methodText + "大包租赁/"
                }
              })
              this.supplyTypeDetail.supplyMethod[0].supplierMethod = methodText.substring(0,methodText.length - 1)
            }
          } else if (this.theInfo.supplyType[0].supplierType === 1) {
            this.theInfo.supplyType[0].supplierType = '设备供应商'
            this.supplyTypeDetail.supplyMethod[0].supplierMethod = ""
          } else if (this.theInfo.supplyType[0].supplierType === 2) {
            this.theInfo.supplyType[0].supplierType = '能源供应商'
            if (this.theInfo.supplyType[0].supplyMethod.length) {
              let methodText = ""
              this.theInfo.supplyType[0].supplyMethod.forEach(item => {
                if (item.supplierMethod === 1) {
                  methodText = methodText + "桩企直连/"
                } else if (item.supplierMethod === 2) {
                  methodText = methodText + "聚合平台/"
                }
              })
              this.supplyTypeDetail.supplyMethod[0].supplierMethod = methodText.substring(0,methodText.length - 1)
            }
          } else if (this.theInfo.supplyType[0].supplierType === 3) {
            this.theInfo.supplyType[0].supplierType = '配件供应商'
            if (this.theInfo.supplyType[0].supplyMethod.length) {
              let methodText = ""
              this.theInfo.supplyType[0].supplyMethod.forEach(item => {
                if (item.supplierMethod === 1) {
                  methodText = methodText + "普通采购/"
                } else if (item.supplierMethod === 2) {
                  methodText = methodText + "寄售采购/"
                } else if (item.supplierMethod === 3) {
                  methodText = methodText + "客户寄存/"
                }
              })
              this.supplyTypeDetail.supplyMethod[0].supplierMethod = methodText.substring(0,methodText.length - 1)
            }
          } else if (this.theInfo.supplyType[0].supplierType === 4) {
            this.theInfo.supplyType[0].supplierType = '地推供应商'
            if (this.theInfo.supplyType[0].supplyMethod.length) {
              let methodText = ""
              this.theInfo.supplyType[0].supplyMethod.forEach(item => {
                if (item.supplierMethod === 0) {
                  methodText = methodText + "线下推广/"
                }
              })
              this.supplyTypeDetail.supplyMethod[0].supplierMethod = methodText.substring(0,methodText.length - 1)
            }
          }
          return this.theInfo.supplyType[0]
        } else {
          return {
            supplierType: "",
            supplyMethod: [{
              supplierMethod: ""
            }]
          }
        }
      }
    },
    methods: {
      handleView(url) {
        window.open(url)
      },
    }
  };
</script>

<style lang="less" scoped>
  .supplier-detail {
    position: relative;
    padding: 10px 10px 0;
  }

  .labelRequired:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }

  .link {
    text-decoration: underline;
    margin-top: 17px;
  }

  .detail-section {
    margin-bottom: 24px;
    line-height: 2;
    border-bottom: 1px solid #e8eaec;
    padding-bottom: 12px;

    h2 {
      border-left: 4px solid rgba(121, 121, 121, 1);
      font-size: 16px;
      color: #333;
      padding: 2px 12px;
      font-weight: 100;
      line-height: 1;

      span {
        margin-left: 24px;
      }
    }

    .detail-label {
      font-size: 16px;
      color: #777;
    }

    .text {
      color: #040404;
      font-size: 13px;
    }

    .detail-text {
      color: #000;
    }

    & > .ivu-row {
      margin: 10px 0;
    }
  }
</style>
