<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="1000px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" class="BasicForm">
      <template #doctorSearch="{ model, field }">
        <a-select show-search v-model:value="model[field]" optionFilterProp="label">
          <a-select-option
            v-for="item in doctor.list"
            :key="item.id"
            :value="item.id"
            :label="item.info"
            >{{ item.info }}</a-select-option
          >
        </a-select>
      </template>
      <template #phone="{ model, field }">
        <FormItem v-for="(domain, index) in domains" :key="domain.key">
          <Input
            v-model:value="domain.value"
            placeholder="请输入"
            maxlength="11"
            style="width: 80%; margin-right: 8px"
          />
          <MinusCircleOutlined
            v-if="domains.length > 1"
            class="dynamic-delete-button"
            :disabled="domains.length === 1"
            @click="removeDomain(domain)"
          />
        </FormItem>
        <FormItem>
          <a-button type="dashed" style="width: 80%" @click="addDomain">
            <PlusOutlined />
            添加
          </a-button>
        </FormItem>
      </template>
      <template #medium="{ model, field }">
        <select class="ant-input" v-model="model[field]">
          <option value="">请选择</option>
          <option v-for="item in mediums" :key="item" :value="item.id">{{ item.title }}</option>
        </select>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, reactive } from 'vue';
  import { BasicForm, useForm, ApiSelect } from '/@/components/Form';
  import { formSchema } from './patient.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Input, Form } from 'ant-design-vue';
  import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { createTrack, editTrack } from '/@/api/sys/track';
  //import FormItem from "/@/components/Form/src/components/FormItem.vue";
  import { getMediumList } from '/@/api/sys/track';

  const FormItem = Form.Item;

  interface Domain {
    value: string;
    key: number;
  }

  export default defineComponent({
    name: 'PatientDrawer',
    components: {
      BasicDrawer,
      BasicForm,
      Input,
      FormItem,
      MinusCircleOutlined,
      PlusOutlined,
      ApiSelect,
    },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);

      const doctor = reactive({
        list: [],
      });

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 120,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 12 },
      });

      const domains = ref<Domain[]>([{ value: '', key: Date.now() }]);

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        doctor.list = data.doctorList;
        resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        domains.value.splice(0);

        if (unref(isUpdate)) {
          const mobiles = data.record.patient_phone.split(',');
          for (const mobile of mobiles) {
            domains.value.push({
              value: mobile,
              key: Date.now() + Math.round(Math.random() * 1000000 + 10),
            });
          }

          setFieldsValue({
            ...data.record,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '添加线索' : '编辑线索'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });

          values.patient_phone = [];
          for (const domain of domains.value) {
            values.patient_phone.push(domain.value);
          }

          if (!unref(isUpdate)) {
            await createTrack(values);
          } else {
            await editTrack(values.id, values);
          }

          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      const addDomain = () => {
        domains.value.push({
          value: '',
          key: Date.now() + Math.round(Math.random() * 1000000 + 10),
        });
      };

      const removeDomain = (item: Domain) => {
        let index = domains.value.indexOf(item);
        if (index !== -1) {
          domains.value.splice(index, 1);
        }
      };

      const mediums = ref<any>([]);
      getMediumList().then((response) => {
        mediums.value = response;
      });

      return {
        doctor,
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
        domains,
        addDomain,
        removeDomain,
        mediums,
      };
    },
  });
</script>
<style scoped>
  .dynamic-delete-button {
    cursor: pointer;
    position: relative;
    top: 4px;
    font-size: 24px;
    color: #999;
    transition: all 0.3s;
  }
  .dynamic-delete-button:hover {
    color: #777;
  }
  .dynamic-delete-button[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>
<style scoped lang="less">
  .BasicForm {
    & ::v-deep(.ant-col):nth-child(4) label span {
      color: #ff4d4f;
      span {
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }
</style>
