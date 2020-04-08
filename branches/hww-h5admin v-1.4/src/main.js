import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueCookie from 'vue-cookie'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/normalize.css'
import './assets/common.css'
const Bus = new Vue();
export default Bus;
import VueAreaLinkage from 'vue-area-linkage'
import 'vue-area-linkage/dist/index.css'
Vue.config.productionTip = false
import {
  Form,
  Tree,
  Dialog,
  Checkbox,
  CheckboxGroup,
  Input,
  Button,
  Dropdown,
  Breadcrumb,
  BreadcrumbItem,
  DropdownMenu,
  DropdownItem,
  Menu,
  Radio,
  Submenu,
  MenuItem,
  MenuItemGroup,
  DatePicker,
  TimeSelect,
  TimePicker,
  Select,
  Table,
  TableColumn,
  Loading,
  Pagination,
  Message,
  Option,
  Upload,
  MessageBox,
  FormItem
} from 'element-ui';

Message.install = function (Vue, options) {
  Vue.prototype.$message = Message
}
MessageBox.install = function (Vue, options) {
  Vue.prototype.$MessageBox = MessageBox
}
Vue.use(Form)
  .use(FormItem)
  .use(Tree)
  .use(Dialog)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(VueAreaLinkage)
  .use(Radio)
  .use(Input)
  .use(Button)
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Dropdown)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem)
  .use(MenuItemGroup)
  .use(DatePicker)
  .use(TimeSelect)
  .use(TimePicker)
  .use(Select)
  .use(Select)
  .use(Table)
  .use(TableColumn)
  .use(Loading)
  .use(Pagination)
  .use(Message)
  .use(Option)
  .use(Upload)
  .use(VueCookie);

Vue.prototype.$confirm = MessageBox.confirm;
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')