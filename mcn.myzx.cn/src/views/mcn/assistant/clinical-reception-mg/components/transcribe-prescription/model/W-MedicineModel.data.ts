import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '药品名称',
    dataIndex: 'name',
    align: 'left',
    width: 200,
    slots: { customRender: 'name' },
  },
  {
    title: '数量',
    dataIndex: 'number',
    align: 'left',
    width: 90,
    slots: { customRender: 'number' },
  },
  {
    title: '规格',
    dataIndex: 'specs',
    align: 'left',
  },
  {
    title: '用法',
    dataIndex: 'usage',
    align: 'left',
    slots: { customRender: 'usage' },
  },
  {
    title: '用药天数',
    dataIndex: 'usage_day',
    align: 'left',
    width: 90,
    slots: { customRender: 'usageDay' },
  },
  {
    title: '单价',
    dataIndex: 'retail_price',
    width: 90,
    align: 'left',
    slots: { customRender: 'retailPrice' },
  },
  {
    title: '金额',
    dataIndex: 'amount',
    width: 90,
    slots: { customRender: 'amount' },
  },
];

export const searchFormSchema: FormSchema[] = [];

export const medicineTableData: any[] = [
  {
    id: 1,
    name: '名称',
    number: 1,
    spec: '规格',
    usage: '用法',
    usage_day: 1,
    unit_price: 2,
    retail_price: 0,
    amount: 1,
  },
];
