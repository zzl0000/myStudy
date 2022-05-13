export const formRules = {
  patient_name: [{ required: true, message: '请输入患者姓名', trigger: 'blur' }],
  //patient_age: [{ required: true, message: '请输入患者年龄', trigger: 'blur' }],
  doctor_id: [{ required: true, message: '请选择医生', trigger: 'blur' }],
  patient_mobile: [{ required: true, message: '请输入患者联系方式', trigger: 'blur' }],
  icd_ids: [{ required: true, message: '请输入诊断', trigger: 'blur' }],
  patient_descr: [{ required: true, message: '请输入主诉', trigger: 'blur' }],
  dosage_form: [{ required: true, message: '请选择剂型', trigger: 'blur' }],
  pharmacy_id: [{ required: true, message: '请选择药房', trigger: 'blur' }],
  total_dosage: [{ required: true, message: '请填写', trigger: 'blur' }],
  every_dosage: [{ required: true, message: '请填写', trigger: 'blur' }],
  every_bag: [{ required: true, message: '请填写', trigger: 'blur' }],
  every_day: [{ required: true, message: '请填写', trigger: 'blur' }],
  every_time: [{ required: true, message: '请填写', trigger: 'blur' }],
};

export const labelCol = {
  style: {
    width: '75px',
  },
};

export const wrapperCol = { span: 24 };
