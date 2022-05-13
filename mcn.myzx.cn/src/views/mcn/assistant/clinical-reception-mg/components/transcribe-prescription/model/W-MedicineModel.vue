<template>
  <div class="w-prescription-card">
  <!-- <a-card class="w-prescription-card"> -->

    <!-- operate-group -->
    <div class="operate-group-spc">
      <!-- <div class="btns">
        <span class="btns-item btns-item-spc">多排显示</span>
        <span class="btns-item btns-item-rigth">单排显示</span>
      </div> -->
      <div class="clearBtn" @click="handleClear">清空处方</div>
      <!-- <a-button type="text" danger size="small" @click="handleClear">清空处方</a-button> -->
      <div class="clearBtn" style="color:#1084FF;margin-left:13px;" @click="saveModelClick">存为模板</div>
      <!-- <a-form-item :wrapper-col="{ span: 24 }">
        <a-checkbox
          v-model:checked="modelState.westMedicineValue"
          @change="handleSavePrescriptionModel"
        >
          <span style="color: #d90092">存为模板</span>
        </a-checkbox>
      </a-form-item>
      <a-form-item>
        <a-input
          placeholder="模板名称不能为空"
          v-model:value="modelState.westMedicineName"
          style="width: 160px"
          size="small"
        ></a-input>
      </a-form-item> -->
    </div>

    <div class="medicine-module">
      <BasicTable @register="registerTable">
        <template #name="{ record }">
          <a-auto-complete
            v-model:value="record.name"
            :options="options"
            @search="handleSearch"
            @select="(value, option) => onWestSelect(value, option, record)"
          >
            <a-input placeholder="请输入药材简称或名称" class="custom" @keypress="handleKeyPress" />
          </a-auto-complete>
        </template>
        <template #number="{ record, index }">
          <a-input
            type="number"
            v-model:value="record.number"
            @blur="handleBlurTable(record.number, index, 'number')"
            @change="handleWestStockCheck(record)"
          ></a-input>
        </template>
        <template #usage="{ record }">
          <a-input v-model:value="record.usage"></a-input>
        </template>
        <template #usageDay="{ record, index }">
          <a-input
            type="number"
            v-model:value="record.usage_day"
            @blur="handleBlurTable(record.usage_day, index, 'usage_day')"
          ></a-input>
        </template>
        <template #retailPrice="{ record }">
          ￥ {{ Number(record.retail_price).toFixed(2) }}
        </template>
        <template #amount="{ record }">
          <!-- 是否缺货 -->
          <template v-if="record.isLack">
            <div class="lackStyle">缺货</div>
          </template>
          <template v-else> ￥ {{ multiplie(record.retail_price, record.number) }} </template>
        </template>
        <template #action="{ record }">
          <TableAction
            :actions="[
              {
                icon: 'ant-design:appstore-outlined',
                label: '删除',
                color: 'error',
                ifShow: westDeleteAble,
                onClick: handleDetailWest.bind(null, record),
              },
            ]"
          />
        </template>
      </BasicTable>
    </div>
    
    <a-modal v-model:visible="mubanModal" title="存为模板" @ok="handleOk" width="400px">
      <template #footer>
        <!-- <a-button key="back" @click="handleCancel">Return</a-button> -->
        <a-button key="submit" type="primary"  @click="handleSavePrescriptionModel">保存</a-button>
      </template>
      <a-form-item label="">
        <a-input
          placeholder="模板名称不能为空"
          v-model:value="modelState.westMedicineName"
          style="width: 250px;margin:25px;"
          size="large"
        ></a-input>
      </a-form-item> 
    </a-modal>
  <!-- </a-card> -->
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema } from './W-MedicineModel.data';
  import { BigNumber } from 'bignumber.js';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useClinicalReceptionStore } from '/@/store/modules/clinical-reception';
  import { getWesterDrug } from '/@/api/sys/prescription';
  import Events from '/@/utils/events';

  export default defineComponent({
    props: {
      formState: <any>Object,
      modelState: <any>Object,
    },
    emits: ['handleSavePrescriptionModel'],
    components: { BasicTable, TableAction },
    setup(props, { emit }) {
      const useClinicalReception = useClinicalReceptionStore();
      const WMedicineList = computed(() => useClinicalReception.WMedicineList);

      const { createMessage, createConfirm } = useMessage();
      const { success, error } = createMessage;

      const westDeleteAble = computed(() => {
        return WMedicineList.value.length > 1;
      });

      const [registerTable, { reload, setTableData }] = useTable({
        title: '',
        // api: '',
        dataSource: WMedicineList.value,
        columns,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
        },
        useSearchForm: false,
        showTableSetting: false,
        bordered: true,
        maxHeight: 280,
        showIndexColumn: false,
        pagination: false,
        actionColumn: {
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      Events.listen('updateWMList', () => {
        console.log('1111', WMedicineList.value);
        setTableData(WMedicineList.value);
        reload();
      });

      const handleDelete = () => {};

      const options = ref([]);

      const handleSearch = (value) => {
        if (!props.formState.doctor_id) {
          error('请先选择医生!');
          return;
        }

        if (!props.formState.pharmacy_id) {
          error('请先选择药房!');
          return;
        }

        const params = {
          pharmacy_id: props.formState.pharmacy_id,
          doctor_id: props.formState.doctor_id,
          name: value,
        };
        getWesterDrug(params).then((response) => {
          let names = [] as any;
          for (const item of response) {
            /*names.push({value: item.name +' ' + item.retail_price +'/' + item.unit, data: item});*/
            names.push({
              value: item.name + ' ' + Number(item.retail_price).toFixed(4) + '元/' + item.unit,
              option: item,
            });
          }
          options.value = names;
        });
      };
      const onWestSelect = (value, data, record) => {
        console.log(1111);
        const stockNum = data.option?.stock_num ? data.option?.stock_num : 0;
        if (stockNum < 1) {
          error(data.data.name + '缺货,请更换其他药材!');
          return false;
        }

        const index = WMedicineList.value.indexOf(record);
        for (const item of WMedicineList.value) {
          if (data.option.id === item.id) {
            error(data.option.name + '已存在于处方单中, 请勿重复添加!');
            WMedicineList.value[index].name = '';
            return;
          }
        }

        WMedicineList.value[index].online_share = data.option?.name;
        WMedicineList.value[index].offline_share = data.option?.offline_share;
        WMedicineList.value[index].id = data.option?.id;
        WMedicineList.value[index].drug_id = data.option?.drug_id;
        WMedicineList.value[index].name = data.option?.name;
        WMedicineList.value[index].unit = data.option?.unit;
        WMedicineList.value[index].retail_price = data.option?.retail_price;
        WMedicineList.value[index].stock_num = data.option?.stock_num;
        WMedicineList.value[index].process_cost = data.option.process_cost;
        WMedicineList.value[index].specs = data.option?.specs;
        WMedicineList.value[index].usage = data.option?.usage;
        WMedicineList.value[index].usage_day = 1;
        if (WMedicineList.value.indexOf(record) === WMedicineList.value.length - 1) {
          WMedicineList.value.push({
            id: 0,
            drug_name: '',
            drug_type: '',
            number: 1,
            autograph: '',
            unit_price: '',
            usage: '',
            usage_day: 1,
            drug_id: 0,
            name: '',
            unit: '盒',
            retail_price: 0.0,
            specs: '',
            value: '',
            loading: false,
            offline_share: 0,
            online_share: 0,
            key: Date.now() + parseInt(Math.random() * (10000 + 1), 10),
          });
        }
      };

      const handleBlurTable = (val, index, key) => {
        if (isNaN(val) || !val || val <= 0) WMedicineList.value[index][key] = 1;
      };

      const handleDetailWest = (record) => {
        if (record.id === 0) {
          return;
        }
        const index = WMedicineList.value.indexOf(record);
        WMedicineList.value.splice(index, 1);
      };

      const handleWestStockCheck = (record) => {
        if (record.number > record.stock_num) {
          error(record?.name + '库存不足，当前库存' + record?.stock_num + record?.unit);
          const index = WMedicineList.value.indexOf(record);
          WMedicineList.value[index].numner = record.storck.number;
        }
      };

      const multiplie = (first, second) => {
        const temp = BigNumber(parseFloat(first));
        return temp.multipliedBy(parseFloat(second));
      };

      const handleClear = () => {
        createConfirm({
          iconType: 'info',
          title: '提示',
          content: '确认清空当前药材?',
          onOk: async () => {
            WMedicineList.value.splice(0, WMedicineList.value.length - 1);
            props.modelState.westMedicineValue = false;
            props.modelState.westMedicineName = '';
          },
        });
      };
      // const handleSavePrescriptionModel = (v) => {
      //   // console.log(v);
      //   emit('handleSavePrescriptionModel', v);
      // };
      const handleSavePrescriptionModel = (v) => {
        console.log(props.modelState.westMedicineName)
        if(props.modelState.westMedicineName.trim() == ''){
          error('请填写模版方名称!');
          return;
        }
        emit('handleSavePrescriptionModel', props.modelState.westMedicineName);
        mubanModal.value = false;
      };
      const mubanModal = ref(false)
      const saveModelClick = (v) => {
        if (!props.formState.doctor_id) {
          props.formState.drugType == 1
            ? (props.modelState.znMedicineValue = false)
            : (props.modelState.westMedicineValue = false);
          error('请先选择医生!');
          return;
        }
        let mList = WMedicineList.value;
        if (mList.length <= 0) {
          props.formState.drugType == 1
            ? (props.modelState.znMedicineValue = false)
            : (props.modelState.westMedicineValue = false);
          error('请添加模版方药材!');
          return;
        }
        if(mList.some(item =>item.number == ''))return error('请输入药材克数!');
        props.modelState.westMedicineName = ''
        mubanModal.value = true;
      };

      
      const handleKeyPress = () => {};
      return {
        saveModelClick,
        mubanModal,
        westDeleteAble,
        registerTable,
        handleDelete,
        WMedicineList,
        handleSearch,
        handleKeyPress,
        options,
        onWestSelect,
        handleBlurTable,
        handleDetailWest,
        handleWestStockCheck,
        multiplie,
        handleClear,
        handleSavePrescriptionModel,
      };
    },
  });
</script>

<style lang="less" scoped>
  .w-prescription-card {
    // width: 1080px;
    width: 945px;
    min-height: 300px;
    margin-bottom: 20px;
    position: relative;
    padding: 10px 0px 0px 10px;
    border: 1px solid #E8E8E8;
    .operate-group {
      position: absolute;
      bottom: 5px;
      display: flex;
      align-items: center;

      .ant-form-item {
        margin-bottom: 0;
      }
    }
    .medicine-module {
      display: flex;
      flex-wrap: wrap;
    }
    .operate-group-spc{
      display: flex;
      align-items: center;
      margin-bottom: 25px;
      .ant-form-item {
        margin-bottom: 0;
      }
      .btns{
        width: 160px;
        height: 30px;
        background: #F8F8F8;
        opacity: 1;
        border: 1px solid #CCCCCC;
        border-radius: 5px;
      }
      .btns-item{
        line-height: 30px;
        margin: 0px 0px 6px 12px;
        color: #9E9E9E;
      }
      .btns-item-rigth{
        margin-left: 10px;
      }
      .btns-item-spc{
        padding-right: 10px;
        border-right: 1px solid #CCCCCC;
      }
      .clearBtn{
        width: 86px;
        height: 30px;
        background: #F8F8F8;
        opacity: 1;
        border: 1px solid #CCCCCC;
        border-radius: 5px;
        color: #FF5368;
        line-height: 28px;
        margin-left: 27px;
        // margin-right: 27px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .lackStyle {
    background-color: red;
    width: 30px;
    height: 30px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-radius: 50%;
    font-size: 12px;
  }
</style>
