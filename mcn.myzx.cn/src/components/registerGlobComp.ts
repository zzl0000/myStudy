import type { App } from 'vue';
// import { Icon } from './Icon';
import { Button } from './Button';
import {
  // Need
  Button as AntButton,
  Input,
  InputNumber,
  Layout,
  Form,
  Row,
  Col,
  Select,
  Card,
  AutoComplete,
  Checkbox,
  Radio,
  Steps,
  Spin,
  Alert,
  Avatar,
  Image,
  Tabs,
} from 'ant-design-vue';

const compList = [AntButton.Group];

export function registerGlobComp(app: App) {
  compList.forEach((comp) => {
    app.component(comp.name || comp.displayName, comp);
  });

  app
    .use(Input)
    .use(Button)
    .use(Layout)
    .use(Form)
    .use(Row)
    .use(Col)
    .use(Select)
    .use(Card)
    .use(AutoComplete)
    .use(Checkbox)
    .use(Radio)
    .use(Steps)
    .use(InputNumber)
    .use(Spin)
    .use(Avatar)
    .use(Alert)
    .use(Tabs)
    .use(Image);
}
