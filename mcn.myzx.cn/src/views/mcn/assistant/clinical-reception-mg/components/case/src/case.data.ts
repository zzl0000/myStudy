import {  FormSchema } from '/@/components/Form';

export const schemas: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    label: 'ID：',
    colProps: {
      span: 20,
    },
    componentProps: {
      rows: 4
    },
    show:false,
  },
  {
    field: 'order_sn',
    component: 'Input',
    label: 'ID：',
    colProps: {
      span: 20,
    },
    componentProps: {
      rows: 4
    },
    show:false,
  },
  {
    field: 'content',
    component: 'InputTextArea',
    label: '患者主诉：',
    colProps: {
      span: 20,
    },
    componentProps: {
      rows: 4
    }
  },
  {
    field: 'icd',
    component: 'InputTextArea',
    label: '诊断：',
    colProps: {
      span: 20,
    },
    componentProps: {
      rows: 4,
      disabled: true,
    }
  },
  {
    field: 'special_period_enum',
    component: 'InputTextArea',
    label: '特殊期：',
    colProps: {
      span: 20,
    },
    componentProps: {
      rows: 4
    },
    colSlot:'special_period_enum'
  },
  {
    field: 'medical_history_text',
    component: 'InputTextArea',
    label: '既往病史：',
    colProps: {
      span: 20,
    },
    componentProps: {
      rows: 4
    }
  },
  {
    field: 'allergy_text',
    component: 'InputTextArea',
    label: '过敏史：',
    colProps: {
      span: 20,
    },
    componentProps: {
      rows: 4
    }
  },
  {
    field: `cases_checkdata_imgs`,
    label: `舌照/面照：`,
    component: 'Input',
    slot: 'customOne',
  },
  {
    field: `tongue_face_imgs`,
    label: `检查资料：`,
    component: 'Input',
    slot: 'customTow',
  },
]
