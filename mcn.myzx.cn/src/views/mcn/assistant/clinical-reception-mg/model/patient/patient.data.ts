import { BasicColumn } from '/@/components/Table';

export const TypeEnums = ['', '图文', '图文', '电话', '视频'];

export const columns: BasicColumn[] = [
  {
    title: '就诊人',
    dataIndex: 'payment_id',
    width: 90,
    slots: { customRender: 'patient' },
    align: 'center',
    ellipsis: true,
  },
  {
    title: '日期',
    dataIndex: 'date_time',
    width: 90,
    slots: { customRender: 'date' },
    align: 'center',
    ellipsis: true,
  },
  {
    title: '时间',
    dataIndex: 'dial_time',
    width: 100,
    slots: { customRender: 'dateTime' },
    align: 'center',
    ellipsis: true,
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 60,
    slots: { customRender: 'type' },
    align: 'center',
    ellipsis: true,
  },
  {
    title: '医生',
    dataIndex: 'doctor_name',
    width: 60,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '金额',
    dataIndex: 'pay_money',
    width: 70,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '支付',
    dataIndex: 'pay_status',
    slots: { customRender: 'payStatus' },
    width: 70,
    align: 'center',
  },
];
