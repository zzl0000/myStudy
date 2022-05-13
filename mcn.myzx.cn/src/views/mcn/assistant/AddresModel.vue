<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="快递信息"
    width="1024px"
    :height="260"
    :showOkBtn="isUpdate"
    @ok="handleSubmit"
    @Cancel="hhh"
  >
    <a-form
      style="margin-top: 30px"
      ref="formRef"
      :model="formState"
      :wrapperCol="{ span: 24 }"
      :labelCol="{ style: { width: '120px' } }"
    >
      <a-row>
        <a-col :span="10" class="pl-3">
          <a-form-item label="">
            <a-input
              v-model:value="formState.identification_address_val"
              placeholder="可将复制的地址粘贴到这里"
            />
          </a-form-item>
        </a-col>
        <a-col :span="10" class="pl-3">
          <a-button type="primary" @click="handleIdentificationAddress">识别地址</a-button>
        </a-col>
        <a-col :span="10">
          <a-form-item label="收货人">
            <a-input v-model:value="formState.express_name" placeholder="请输入收货人" />
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item label="收货人手机号">
            <a-input
              v-model:value="formState.express_mobile"
              placeholder="请输入收货人手机号"
              @change="phoneNumber"
            />
          </a-form-item>
        </a-col>
        <a-col :span="14">
          <a-form-item label="收货地址">
            <a-select
              v-model:value="formState.express_province"
              placeholder="省份"
              class="mr-5"
              style="width: 120px"
              @change="
                formState.express_city = '';
                formState.express_area = '';
              "
            >
              <a-select-option
                v-for="item in provinces"
                v-bind:key="item.name"
                :label="item.name"
                >{{ item.name }}</a-select-option
              >
            </a-select>
            <a-select
              v-model:value="formState.express_city"
              placeholder="城市"
              class="mr-5"
              style="width: 120px"
              @change="formState.express_area = ''"
            >
              <a-select-option v-for="item in cities" v-bind:key="item.name" :label="item.name">{{
                item.name
              }}</a-select-option>
            </a-select>
            <a-select
              v-model:value="formState.express_area"
              placeholder="地区"
              style="width: 120px"
            >
              <a-select-option v-for="item in areas" v-bind:key="item.name" :label="item.name">{{
                item.name
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="">
            <a-input
              style="width: 240px"
              v-model:value="formState.express_address"
              placeholder="请输入收货人详细地址"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, watch, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { editPrescriptionAddres, getIdentificationAddress } from '/@/api/sys/prescription';
  import citysJson from '/@/assets/json/get_citys.json';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    components: { BasicModal },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const formState = ref({
        express_name: '',
        express_mobile: '',
        express_province: '',
        express_city: '',
        express_area: '',
        express_address: '',
        identification_address_val: '',
      });
      const { createMessage } = useMessage();
      const { success, error } = createMessage;
      const provinces = computed(() => [...citysJson]);
      const cities = computed(() => {
        let id = formState.value.express_province;
        let _arr = [];
        provinces.value.map((m) => {
          if (id === m.name) {
            _arr = m.children;
            console.log(_arr);
          }
        });

        console.log(_arr);

        return _arr;
      });
      const areas = computed(() => {
        let id = formState.value.express_city;
        let _arr = [];
        cities.value.map((m) => {
          if (id === m.name) {
            _arr = m.children;
          }
        });
        return _arr;
      });

      watch(
        () => {
          return formState.value.express_province;
        },
        (state) => {
          if (state) {
            nextTick(() => {
              console.log(formState.value.express_city);
              formState.value.express_city = formState.value.express_city || cities.value[0].name;
            });
          }
        }
      );

      watch(
        () => {
          return formState.value.express_city;
        },
        (state) => {
          if (state) {
            nextTick(() => {
              formState.value.express_area = formState.value.express_area || areas.value[0].name;
            });
          }
        }
      );

      const _id = ref(''),
        isUpdate = ref(false);

      const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
        isUpdate.value = data.isUpdate;
        console.log(data.record);
        _id.value = data.record.order.id;
        formState.value.express_name = data.record.order.express_name;
        formState.value.express_mobile = data.record.order.express_mobile;
        formState.value.express_province = data.record.order.express_province;
        formState.value.express_city = data.record.order.express_city;
        formState.value.express_area = data.record.order.express_area;
        formState.value.express_address = data.record.order.express_address;
      });

      // const emit = defineEmits(['success', 'register']);

      const handleIdentificationAddress = async () => {
        if (!formState.value.identification_address_val) {
          error('请先填写地址~!');
          return;
        }
        try {
          const { data } = await getIdentificationAddress({
            address: formState.value.identification_address_val,
          });
          formState.value.express_name = data.person;
          formState.value.express_mobile = data.phonenum;
          formState.value.express_province = data.province;
          formState.value.express_city = data.city;
          formState.value.express_area = data.county;
          formState.value.express_address = data.text;
        } catch (error) {
          console.log(error);
        }
      };

      const phoneNumber = () => {
        if (!formState.value.express_mobile) {
          return error('手机号不能为空！');
        } else {
          formState.value.express_mobile = formState.value.express_mobile.replace(/[^\d]/g, '');
        }
      };
      function hhh(){
        formState.value.identification_address_val = ''
      }
      async function handleSubmit() {
        let params = {
          id: _id.value,
          ...formState.value,
        };
        try {
          setModalProps({ confirmLoading: true });
          // console.log(orderNo.value, reason.value);
          if (formState.value.express_name == '') return error('收货人不能为空！');

          if (!formState.value.express_mobile) {
            return error('手机号不能为空！');
          } else {
            await editPrescriptionAddres(params);
            closeModal();
            emit('success');
          }
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        isUpdate,
        formState,
        provinces,
        cities,
        areas,
        registerModal,
        handleSubmit,
        handleIdentificationAddress,
        phoneNumber,
        hhh
      };
    },
  });
</script>
<style lang="less" scoped>
  .image-box {
    display: flex;
    align-items: center;
    flex-direction: column;
    .desc {
      color: #666;
      font-size: 14px;
      padding: 40px 0 0;
    }
  }
  .mr-5 {
    margin-right: 15px !important;
  }
</style>
