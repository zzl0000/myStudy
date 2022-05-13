<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    width="40%"
    @ok="handleSubmit"
    :title="doctorsName"
  >
    <BasicForm @register="registerForm">
      <template #pharmacy>
        <a-select
          class="ant-input"
          v-model:value="pharmacyShowId"
          mode="multiple"
          placeholder="请选择可见药房"
          :allowClear="true"
          @change="defaultsPharmacy"
          style="width: 40%"
        >
          <a-select-option
            v-for="item in allPharmacy"
            :key="item.pharmacyId"
            :value="item.pharmacyId"
            >{{ item.pharmacyName }}</a-select-option
          >
        </a-select>
      </template>

      <template #defaultsPharmacys>
        <a-select
          class="ant-input"
          v-model:value="defaultShowId"
          placeholder="请选择默认药房"
          @change="handleDefaultChange"
          style="width: 40%"
        >
          <a-select-option
            v-for="item in visiblepharmacy"
            :value="item.pharmacyId"
            :key="item.pharmacyId"
            >{{ item.pharmacyName }}</a-select-option
          >
        </a-select>
      </template>

      <template #wenzhen>
        <Divider style="margin-top: 30px" orientation="left">问诊设置</Divider>
      </template>

      <template #switch>
        <Divider style="margin-top: 30px" orientation="left"></Divider>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { userFormSchema } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { getDoctorSets, getDoctorSeting } from '/@/api/sys/operation';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Select, Switch, Divider } from 'ant-design-vue';

  export default defineComponent({
    name: 'PharmacyDrawer',
    components: { BasicDrawer, BasicForm, Divider, ASelect: Select, Switch },
    emits: ['success', 'register'],

    setup(_, { emit }) {
      const doctors = ref([]);

      const { createMessage, createSuccessModal, createWarningModal } = useMessage();
      const { success } = createMessage;
      const [registerForm, { resetFields, setFieldsValue, getFieldsValue }] = useForm({
        labelWidth: 90,
        schemas: userFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
      });
      const PharmacyData = ref({});
      const allPharmacy = ref([]);
      const visiblepharmacy = ref([]);
      const checked1 = ref(false);
      const DefaultPharmacy = ref({});
      const isDefault = ref([]);
      const doctorsName = ref();
      const defaultShowId = ref<string>();
      const pharmacyShowId = ref([]);
      const pharmacy = ref([]);
      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        pharmacyShowId.value = [];
        const params = {
          did: data.record.did,
          doctorId: data.record.doctor_id,
        };
        doctorsName.value = data.record.name + '医生的基础配置';
        DefaultPharmacy.value = params;

        await getDoctorSets(params).then((res: any) => {
          if (res.freeDelivery === 2) {
            res.freeDeliveryLimit = '';
          }
          PharmacyData.value = res;

          allPharmacy.value = res.allPharmacy;
          visiblepharmacy.value = res.pharmacy;

          if (visiblepharmacy.value.length > 0) {
            pharmacy.value = visiblepharmacy.value;

            visiblepharmacy.value.forEach((item) => {
              pharmacyShowId.value.push(item.pharmacyId);

              if (item.isdefault == 1) {
                defaultShowId.value = item.pharmacyId;
              }
            });

            if (defaultShowId.value == '') {
              defaultShowId.value = visiblepharmacy.value[0].pharmacyId;
            }
          } else {
            pharmacy.value = allPharmacy.value;
            allPharmacy.value.forEach((item) => {
              pharmacyShowId.value.push(item.pharmacyId);

              if (item.isdefault == 1) {
                defaultShowId.value = item.pharmacyId;
              }
            });

            if (defaultShowId.value == '') {
              defaultShowId.value = allPharmacy.value[0].pharmacyId;
            }
          }
        });

        const newData = { ...PharmacyData.value };

        if (newData.videoSwitch == 0) {
          newData.videoSwitch = -1;
        }
        if (newData.viewSwitch == 0) {
          newData.viewSwitch = -1;
        }
        if (newData.callSwitch == 0) {
          newData.callSwitch = -1;
        }
        if (newData.freeDelivery == 0) {
          newData.freeDelivery = 2;
        }
        setFieldsValue({
          ...newData,
        });
      });

      function defaultsPharmacy(record: any) {
        defaultShowId.value = '';
        pharmacyShowId.value = [];
        visiblepharmacy.value = [];

        if (record.length > 0) {
          allPharmacy.value.forEach((item) => {
            record.forEach((i) => {
              if (item.pharmacyId == i) {
                item.isdefault = 0;
                pharmacyShowId.value.push(i);
                visiblepharmacy.value.push(item);
              }
            });
          });

          let arrBoolean = false;
          pharmacy.value.forEach((item) => {
            if (item.isdefault == 1) {
              defaultShowId.value = item.pharmacyId;
            }
          });
          visiblepharmacy.value.forEach((i) => {
            if (defaultShowId.value == i.pharmacyId) {
              i.isdefault = 1;
              defaultShowId.value = i.pharmacyId;
              arrBoolean = true;
            }
          });

          if (!arrBoolean || defaultShowId.value == '') {
            defaultShowId.value = visiblepharmacy.value[0].pharmacyId;
          }
        }
      }

      function handleDefaultChange(val) {
        //    console.log(val);
        //   defaultSelectItem.value = val;
      }

      async function handleSubmit() {
        try {
          const values = await getFieldsValue();
          isDefault.value = visiblepharmacy.value;
          visiblepharmacy.value.filter((item) => {
            if (item.pharmacyId === defaultShowId.value) {
              isDefault.value.push({ defaultId: item.pharmacyId });
            }
          });
          if (String(values.freeDeliveryLimit).length > 0) {
            if (Number(values.freeDeliveryLimit) >= 0) {
              values.freeDelivery = 1;
              values.freeDeliveryLimit = Number(values.freeDeliveryLimit);
            }
          }

          if (values.freeDeliveryLimit === '') {
            values.freeDelivery = 2;
          }

          const params = {
            did: DefaultPharmacy.value.did,
            doctorId: DefaultPharmacy.value.doctorId,
            callPrice: Number(values.callPrice),
            videoPrice: Number(values.videoPrice),
            viewPrice: Number(values.viewPrice),
            callSwitch: values.callSwitch,
            videoSwitch: values.videoSwitch,
            viewSwitch: values.viewSwitch,
            freeDelivery: values.freeDelivery,
            freeDeliveryLimit: values.freeDeliveryLimit,
            pharmacy: isDefault.value,
          };
          await getDoctorSeting(params).then((res) => {
            success('修改成功');
          });
          closeDrawer();
          setDrawerProps({ confirmLoading: true });
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        registerDrawer,
        registerForm,
        getDoctorSets,
        handleSubmit,
        doctors,
        PharmacyData,
        DefaultPharmacy,
        defaultsPharmacy,
        isDefault,
        doctorsName,
        defaultShowId,
        pharmacyShowId,
        handleDefaultChange,
        visiblepharmacy,
        checked1,
        allPharmacy,
      };
    },
  });
</script>
<style type="text/css">
  #role_ids .vben-basic-tree,
  #managed_doctor_ids .vben-basic-tree {
    height: fit-content !important;
  }
  #role_ids .scrollbar__wrap,
  #managed_doctor_ids .scrollbar__wrap {
    padding: 0px !important;
    margin-left: -24px;
    margin-top: -2px;
  }
  #role_ids .ant-tree li {
    width: 50%;
    display: inline-block;
  }

  .ant-input-affix-wrapper {
    width: 180px;
    border-radius: 5px;
  }

  .ant-radio-button-wrapper:first-child {
    border-radius: 5px 0 0 5px;
  }
  .ant-radio-button-wrapper:last-child {
    border-radius: 0 5px 5px 0;
  }

  .suffix {
    color: #90381c;
    font-size: 12px;
  }
</style>
