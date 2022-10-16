import { Table, LocaleProvider, Calendar, Form, FormModel, Modal, Button, Icon, Select, Input, Radio, Row } from "ant-design-vue";

export default {
  install(Vue) {
    Vue.use(LocaleProvider);
    Vue.use(Table);
    Vue.use(Calendar);
    Vue.use(Form);
    Vue.use(FormModel);
    Vue.use(Modal);
    Vue.use(Button);
    Vue.use(Icon);
    Vue.use(Select);
    Vue.use(Input);
    Vue.use(Radio);
    Vue.use(Row);
  }
};
