<template>
  <el-dialog
    id="send-sms-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="新建短信"
    :visible="sendVisible"
    @close="closeDialog"
    width="60%"
    style="margin: 15px; padding: 15px">
    <el-row style="margin: 0 0 20px 10px">
      <i class="el-icon-info"></i>
      <span style="">
        消息内容填写规则：<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;1. 发送的短信内容中，必须包含默认的短信模板中的<span  class="hl-red">关键字</span>，否则无法通过校验，具体关键字为：<span class="hl-red">{{keyWords}}</span> <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;2. <span  class="hl-red">不能</span>包含<span  class="hl-red">反动、邪恶、敏感、辱骂</span>词语等等信息，否则无法通过校验 <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;3. 不填写消息内容模板，则使用系统默认的模板进行消息发送
      </span>
    </el-row>

    <el-form :inline="true" ref="smsForm" :rules="rules" :model="smsForm" class="demo-form-inline" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item id="send-sms-item" label="消息内容模板">
            <el-input id="send-sms-input" type="textarea" v-model="modelText" maxlength="200" style="width: 170%" :rows="9"
                      :placeholder="modelTextInit" @blur="keyWordReplace"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <template>
        <span id="send-sms-span-1" style="font-size: 14px;color: #606266;line-height: 40px;padding: 0 12px 0 0;font-weight: bold">由模板生成的信息：<span id="send-sms-span-2" v-if="!isSingle">(示例第一条)</span></span><br/>
        {{sendArray[0].messageContent}}
        <el-collapse id="send-sms-collapse" v-model="activeNames" style="margin: 10px" v-if="!isSingle" @change="handleCollapseChange">
          <el-collapse-item id="send-sms-collapse-item" :title="'点击' + collapseText + '由模板生成的所有信息'" name="1">
            <template :id="'send-sms-collapse-' + index" v-for="(sendObj, index) in sendArray" style="margin: 10px">
              {{(index + 1) + ': ' + sendObj.messageContent}}<br/>
            </template>
          </el-collapse-item>
        </el-collapse>
      </template>
    </el-row>
    <div id="send-sms-button-group" class="button-group">
      <el-button id="send-sms-send" @click="send" type="primary">发送</el-button>
      <el-button id="send-sms-back" type="info" @click="closeDialog">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      targets: {type: Array, required: true, default: []},
      sendVisible: {type: Boolean, required: true, default: false},
      modelTextInit: {type: String, required: true},
      keyWordMap: {type: Object, required: true, default: {}},
      isSingle: {type: Boolean, required: true, default: false},
      currentIndex: {type: Number, required: false}
    },
    data() {
      return {
        activeNames: ['0'],
        modelText: '',
        firstMessage: '',
        smsForm: {},
        rules: {},
        sendArray: [],
        sendArrayDefault: [],
        legitimateFlag: false,
        keyWords: '',
        collapseText: '展开'
      }
    },
    methods: {
      closeDialog() {
        this.$emit('closeDialogHandle', 'send');
      },
      send() {
        if (!this.modelText) {
          // // console.log("==sendArrayDefault: %o", this.sendArrayDefault);
          let json = {
            sendArray: this.sendArrayDefault,
            index: this.currentIndex
          };
          this.$emit('sendRequest', json);
        }
        else {
          if (!this.legitimateFlag) {
            this.$alert('消息模板中必须包含所有关键字');
          }
          else {
            // // console.log("==sendArr: %o", this.sendArray);
            let json = {
              sendArray: this.sendArray,
              index: this.currentIndex
            };
            this.$emit('sendRequest', json);
          }
        }
      },
      keyWordReplace() {
        this.legitimateFlag = true;
        let keyWord, propValue, tempSendArray = [];
        // // console.info("this.targets: %o", this.targets);
        // // console.info("this.keyWordMap: %o", this.keyWordMap);
        // targets遍历次数<=20（每页数据条数）
        this.targets.forEach(each => {
          let message = this.modelText, phone, uuid;
          // each遍历次数 = 短信关键字个数，一般为个位数，keyWordMap遍历次数同each
          for (let propName in each) {
            if (this.legitimateFlag && each.hasOwnProperty(propName)) {
              if (propName !== 'phone' && propName !== 'uuid') {
                this.legitimateFlag = false;
                for (let key in this.keyWordMap) {
                  if (this.keyWordMap.hasOwnProperty(key) && propName === key) {
                    keyWord = this.keyWordMap[key];
                    propValue = each[propName];
                    // // console.log("keyWord: %o", keyWord);
                    // // console.log("propValue: %o", propValue);
                    message = message.replace(keyWord, propValue);
                    // // console.log("===message after replace: %o", message);
                    if (this.modelText.indexOf(keyWord) > -1) {
                      this.legitimateFlag = true;
                    }
                    break;
                  }
                }
              }
              else if(propName === 'phone') {
                phone = each[propName];
              }
              else {
                uuid = each[propName];
              }
            }
          }
          if (phone && message && uuid) {
            tempSendArray.push({mobile: phone, messageContent: message, resumeUuid: uuid});
          }
        });
        if (this.modelText && !this.legitimateFlag) {
          this.$alert('消息模板中必须包含所有关键字');
        }
        else {
          // // console.log("tempSendArray: %o", tempSendArray);
          this.sendArray = JSON.parse(JSON.stringify(tempSendArray.length > 0 ? tempSendArray : this.sendArrayDefault));
        }
      },
      keyWordInitReplace() {
        let beReplaceWord;
        // // console.log("===targets: %o", this.targets);
        // // console.log("===keyWordMap: %o", this.keyWordMap);
        // targets遍历次数<=20（每页数据条数）
        this.targets.forEach(each => {
          let message = this.modelTextInit, phone, uuid;
          // each遍历次数 = 短信关键字个数，一般为个位数，keyWordMap遍历次数同each
          for (let propName in each) {
            if (each.hasOwnProperty(propName)) {
              if (propName !== 'phone' && propName !== 'uuid') {
                for (let key in this.keyWordMap) {
                  if (this.keyWordMap.hasOwnProperty(key) && propName === key) {
                    beReplaceWord = this.keyWordMap[key];
                    // // console.log("===beReplaceWord: %o", beReplaceWord);
                    message = message.replace(beReplaceWord, each[propName]);
                    // // console.log("===message after replace: %o", message)
                    break;
                  }
                }
              }
              else if(propName === 'phone'){
                phone = each[propName];
              }
              else {
                uuid = each[propName];
              }
            }
          }
          // // console.log(phone, message, uuid);
          this.sendArray.push({mobile: phone, messageContent: message, resumeUuid: uuid});
          // // console.log("======this.sendArray: %o", this.sendArray);
          this.sendArrayDefault = JSON.parse(JSON.stringify(this.sendArray))
        });
      },
      handleCollapseChange(val) {
        this.collapseText = val.indexOf('1') > -1? '收起': '展开'
      }
    },
    created() {
      this.keyWordInitReplace();
      for(let key in this.keyWordMap) {
       if(this.keyWordMap.hasOwnProperty(key)) {
         this.keyWords += (this.keyWordMap[key] + '、')
       }
      }
      this.keyWords = this.keyWords.substr(0, this.keyWords.length - 1)
    }
  }
</script>

<style scoped>
  .button-group {
    margin: 20px 15px;
  }

  .button-group button {
    margin: 0 15px;
  }

  .hl-red {
    color: red;
    font-weight: bolder;
  }
</style>
