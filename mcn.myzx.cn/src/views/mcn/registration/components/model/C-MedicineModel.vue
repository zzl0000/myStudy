<template>
  <!-- 中药抄方药材模板 -->
  <div class="prescription-card">
  <!-- <a-card class="prescription-card"> -->
    <!-- 操作组 -->
    <!-- operate-group -->
    <div class="operate-group-spc" style="margin-left: 0px;">
      <div class="btns">
        <span class="btns-item btns-item-spc" @click="showRow(true)">多排显示</span>
        <span class="btns-item btns-item-rigth" @click="showRow(false)">单排显示</span>
      </div>
      <div class="clearBtn" @click="handleClear">清空处方</div>
      <!-- <a-button type="text" danger size="small" @click="handleClear">清空处方</a-button> -->
      <div class="clearBtn" style="color:#1084FF;margin-left:13px;" @click="saveModelClick">存为模板</div>
      <div class="clearBtn" style="margin-left: 15px" @click="handlePrescriptionModel"
        >导入模板</div
      >
      <!-- <a-form-item :wrapper-col="{ span: 24 }">
        <a-checkbox
          v-model:checked="modelState.znMedicineValue"
          @change="handleSavePrescriptionModel"
        >
          <span class="clearBtn" style="color:#1084FF;margin-left:13px;">存为模板</span>
        </a-checkbox>
      </a-form-item>
      <a-form-item>
        <a-input
          placeholder="模板名称不能为空"
          v-model:value="modelState.znMedicineName"
          style="width: 160px"
          size="small"
        ></a-input>
      </a-form-item> -->
    </div>

    <div style="font-size: 12px; margin-bottom: 10px; color: #ff8d00" v-if="warnMsgShow"
      >注： 输入药材简拼或药材名，选择药品后和用量后，点击键盘Enter 键即可</div
    >
    <div class="medicine-module">
      <!-- 药材回显框 -->
      <div
        v-for="(item, index) in CMedicineList"
        v-bind:key="item"
        class="medicine-item medicine-item-spc"
        
        v-show="isMultiRow" 
      >
        <div class="name-group">
          <span
            style="color: rgba(0, 0, 0, 0.85)"
            v-if="!(isNaN(item.number) || !item.number || item.number <= 0)"
            >{{ item.name }}</span
          >
          <span style="color: red" v-else>{{ item.name }}</span>
          <span
            v-if="item.autograph"
            style="padding-left: 10px; cursor: pointer"
            @click="item.autograph = ''"
            >{{ item.autograph }}<Icon icon="gg:close" size="12"
          /></span>
          <span v-else style="padding-left: 10px; cursor: pointer" @click="handleSignName(index)"
            >签名</span
          >
        </div>
        <div class="useage-group">
          <a-form-item
            :labelCol="{ span: 10 }"
            :wrapperCol="{ style: { marginBottom: 0 } }"
            label="用量"
          >
            <a-input
              v-model:value="item.number"
              @keyup.enter="useEnter"
              style="width: 55px;color:#1084FF"
              size="small"
              ref="numRef"
              maxlength="3"
              @blur="handleBlur(item)"
              @change="handleCheckMedicineStock(index, item)"
              @focus="getfocus($event)"
            ></a-input>
          </a-form-item>
          <div class="unit">{{ item.unit }}</div>
        </div>
        <div
          style="color: red; padding-left: 40px"
          v-if="isNaN(item.number) || !item.number || item.number <= 0"
          >请输入用量</div
        >
        <div class="decoction-btn">
          <!-- 是否缺货  -->
          <template v-if="item.isLack">
            <div class="lackStyle">缺货</div>
          </template>
          <template v-else>
            <a-button
             v-if="!item.isDecotion"
              type="link"
              size="small"
              @click="handleAddDecotion(index)"
              >{{ item.usage ? item.usage : '煎法' }}</a-button
            >
            <span v-else>{{ item.decoction }}</span>
          </template>
        </div>
        <div class="close-btn" @click="handleDeleteMedicine(index)">
          <Icon icon="gg:close-o" color="#eb2f96" />
        </div>
        <!-- 自定义煎法吸附弹出层 -->
        <div v-if="isDecotion[index]" class="custom-decoction-prop">
          <div class="prop-top">
            <div class="title">添加煎法</div>
            <div class="close" @click="handleCloseDecotion(index)">
              <Icon icon="gg:close-o" color="#eb2f96" />
            </div>
          </div>

          <div class="prop-content">
            <div
              v-for="item in decotionList"
              v-bind:key="item"
              class="decotion-list"
              @click="handleAddDecotionItem(index, item)"
            >
              <div :class="currentDecotions === item ? 'decotion-item active' : 'decotion-item'">{{
                item
              }}</div>
            </div>
          </div>
          <div class="prop-operate-group">
            <a-button size="small" @click="handleCloseDecotion(index)">取消</a-button>
            <a-button type="primary" class="ml-5" size="small" @click="handleSaveDecotion(index)"
              >保存</a-button
            >
          </div>
        </div>
      </div>

     <!-- 药材回显框--单排 -->
     <div v-show="!isMultiRow" class="medicine-item multiDan"   v-for="(item, index) in CMedicineList" v-bind:key="item">
        <div class="item-row">
          <span class="index" style="margin-right: 30px;">{{index + 1}}</span>
         
          <span class="row-name" style="margin-right: 10px;">
            <span
              style="color: rgba(0, 0, 0, 0.85)"
              v-if="!(isNaN(item.number) || !item.number || item.number <= 0)"
              >{{ item.name }}</span
            >
            <span v-else>{{ item.name }}</span>
          </span>
        
          <span class="row-qian" style="margin-right: 42px;">
            <span v-if="!item.autograph" style="cursor: pointer" @click="handleSignName(index)">签名</span>
            <span v-else style="cursor: pointer" @click="item.autograph = ''" >{{ item.autograph }}
              <Icon icon="gg:close" size="12"/>
            </span>
          </span>
          <span class="row-num" style="margin-right: 42px;">
            <span>用量</span>
            <a-input
              v-model:value="item.number"
              @keyup.enter="useEnter"
              style="width: 43px;margin:0px 8px; color:#1084FF"
              size="small"
              ref="numRef"
              maxlength="3"
              @blur="handleBlur(item)"
              @change="handleCheckMedicineStock(index, item)"
              @focus="getfocus($event)"
            ></a-input>
            <span>{{ item.unit }}</span>
          </span>
          <!-- <span style="color: red;margin-right: 10px;" v-if="isNaN(item.number) || !item.number || item.number <= 0">请输入用量</span> -->
          <span class="row-jian" style="color:#1084FF;" >
            <span v-if="item.isLack" style="color：red;">缺货</span>
            <span v-else>
              <span v-if="!item.isDecotion" @click="handleAddDecotion(index)" style="cursor: pointer;">{{ item.usage ? item.usage : '煎法' }}</span>
              <span v-else>{{ item.decoction }}</span>
            </span>
          </span>
          <!-- 自定义煎法吸附弹出层  -->
          <div v-if="isDecotion[index]" class="custom-decoction-prop-spc">
          <div class="prop-top">
            <div class="title">添加煎法</div>
            <div class="close" @click="handleCloseDecotion(index)">
              <Icon icon="gg:close-o" color="#eb2f96" />
            </div>
          </div>

          <div class="prop-content">
            <div
              v-for="item in decotionList"
              v-bind:key="item"
              class="decotion-list"
              @click="handleAddDecotionItem(index, item)"
            >
              <div :class="currentDecotions === item ? 'decotion-item active' : 'decotion-item'">{{
                item
              }}</div>
            </div>
          </div>
          <div class="prop-operate-group">
            <a-button size="small" @click="handleCloseDecotion(index)">取消</a-button>
            <a-button type="primary" class="ml-5" size="small" @click="handleSaveDecotion(index)"
              >保存</a-button
            >
          </div>
          </div>

          <span class="row-delete" style="text-align: right;" @click="handleDeleteMedicine(index)">删除</span>
        </div> 
     </div>

      <!-- 药材输入框 -->
      <div class="medicine-item" style="margin-top: 20px;height: 38px;">
        <a-form-item>
          <a-auto-complete
            v-model:value="medicineNamevalue"
            :options="medicineOptions"
            :allowClear="true"
            style="width: 680px"
            @search="handleSearch"
            dropdown-class-name="certain-category-search-dropdown"
            @select="onSelect"
          >
            <a-textarea
              placeholder="请输入药材简称或名称"
              ref="cmedicineRef"
              class="custom"
              style="width: 680px; height: 38px"
              @keypress="handleKeyPress"
            />
          </a-auto-complete>
        </a-form-item>
      </div>
    </div>
  <!-- 存为模板 @ok="handleOk" -->
    <a-modal v-model:visible="mubanModal" title="存为模板"  width="400px">
      <template #footer>
        <!-- <a-button key="back" @click="handleCancel">Return</a-button> -->
        <a-button key="submit" type="primary"  @click="handleSavePrescriptionModel">保存</a-button>
      </template>
      <a-form-item label="">
        <a-input
          placeholder="模板名称不能为空"
          v-model:value="modelState.znMedicineName"
          style="width: 250px;margin:25px;"
          size="large"
        ></a-input>
      </a-form-item> 
    </a-modal>
  <!-- </a-card> -->
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, nextTick, computed } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getChineseDrug } from '/@/api/sys/prescription';
  import { Icon } from '/@/components/Icon';
  import { useClinicalReceptionStore } from '/@/store/modules/clinical-reception';

  export default defineComponent({
    components: { Icon },
    props: {
      formState: <any>Object,
      modelState: <any>Object,
    },

    emits: ['handleSavePrescriptionModel','handlePrescriptionModel'],

    setup(props, { emit }) {
      const useClinicalReception = useClinicalReceptionStore();
      // const CMedicineList = computed(() => useClinicalReception.CMedicineList); // 中药材列表
      const CMedicineList =  ref([]) as any; // 中药材列表
      const warnMsgShow = ref(false);
      const currentDecotions = ref();
      const isDecotion = ref([]) as any;

      const isMultiRow = ref(true);//是否多排显示
      console.log(isMultiRow.value)

      // 药名称medicineNamevalue
      const medicineNamevalue = ref('');
      const decotionList = ref([
        '先煎',
        '包煎',
        '另煎',
        '烊化',
        '另包',
        '打碎',
        '兑入',
        '后下',
        '打细粉',
        '打粗粉',
      ]); //煎法
      const { createMessage, createConfirm } = useMessage();
      const { success, error } = createMessage;
      const handlePrescriptionModel = ()=>{
         emit('handlePrescriptionModel');
      }
      // 多排显示 单排显示
      const showRow = (v)=>{
        isMultiRow.value = v
      }
      // 签名
      const handleSignName = (index: number) => {
        CMedicineList.value[index].autograph = props.formState.doctor_name;
        useClinicalReception.setCMedicineListSync(CMedicineList.value);
      };
      //用量
      const handleBlur = (item) => {
        if (isNaN(item.number) || !item.number || item.number <= 0) item.number = '';
      };

      // 库存
      const handleCheckMedicineStock = (index, item) => {
        if (item.number > item.stock_num) {
          error(item.name + '库存不足,当前库存' + item.stock_num + item.unit);
          CMedicineList.value[index].number = item.stock_num;
          useClinicalReception.setCMedicineListSync(CMedicineList.value);
        }
      };

      const getfocus = (event) => {
        event.currentTarget.select();
      };

      // 用量回车事件
      const cmedicineRef = ref();
      const useEnter = () => {
        cmedicineRef.value.focus();
      };

      // 添加煎法
      const handleAddDecotion = (index) => {
        isDecotion.value = [];
        isDecotion.value[index] = true;
        currentDecotions.value = CMedicineList.value[index].usage;
      };

      // 添加煎法
      const handleAddDecotionItem = (index: number, name: string) => {
        currentDecotions.value = name;
      };

      // 关闭煎法弹窗
      const handleCloseDecotion = (index) => {
        isDecotion.value[index] = false;
      };

      const handleSaveDecotion = (index: number) => {
        CMedicineList.value[index].usage = currentDecotions.value;
        isDecotion.value[index] = false;
        useClinicalReception.setCMedicineListSync(CMedicineList.value);
      };

      // 删除药材列表
      const handleDeleteMedicine = (index: number) => {
        if (props.formState.drugType === 1) {
          // 中药
          CMedicineList.value.splice(index, 1);
          useClinicalReception.setCMedicineListSync(CMedicineList.value);
        }
      };

      const medicineOptions = ref<any>([]);
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
        getChineseDrug(params).then((response) => {
          let names = [] as any;
          for (const item of response) {
            names.push({
              value: item.name + ' ' + Number(item.retail_price).toFixed(4) + '元/' + item.unit,
              data: item,
            });
          }
          medicineOptions.value = names;
        });
      };

      const numRef = ref();

      const onSelect = (value, data) => {
        console.log(isMultiRow.value)
        console.log(typeof(isMultiRow.value))
        if (data.data.stock_num < 1) {
          error(data.data.name + '缺货,请更换其他药材!');
          return false;
        }
        const listIndex = CMedicineList.value.findIndex((item) => data.data.name === item.name);
        if (listIndex !== -1) {
          console.log(111111);
          error(data.data.name + '已存在于处方单中, 请勿重复添加!');
          nextTick(() => {
            medicineNamevalue.value = '';
          });
          return;
        }
        // 中药
        CMedicineList.value.push({
          id: data.data.id,
          value: data.data.name,
          name: data.data.name,
          drug_name: data.data.name,
          drug_type: 1,
          number: '',
          autograph: '',
          unit: data.data.unit,
          unit_price: data.data.retail_price,
          retail_price: data.data.retail_price,
          usage: '',
          specs: '',
          drug_id: data.data.drug_id,
          process_cost: data.data.process_cost,
          stock_num: data.data.stock_num,
          weight: data.data.weight,
        });

        useClinicalReception.setCMedicineListSync(CMedicineList.value);

        nextTick(() => {
          medicineNamevalue.value = '';
          numRef.value.focus();
          setTimeout(() => {
            numRef.value.focus();
            warnMsgShow.value = true;
          }, 300);
        });
      };

      // medicineNamevalue

      const handleSavePrescriptionModel = (v) => {
        console.log(props.modelState.znMedicineName)
        if(props.modelState.znMedicineName.trim() == ''){
          error('请填写模版方名称!');
          return;
        }
        emit('handleSavePrescriptionModel', props.modelState.znMedicineName,CMedicineList.value);
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
        let mList = CMedicineList.value;
        if (mList.length <= 0) {
          props.formState.drugType == 1
            ? (props.modelState.znMedicineValue = false)
            : (props.modelState.westMedicineValue = false);
          error('请添加模版方药材!');
          return;
        }
        props.modelState.znMedicineName = ''
        mubanModal.value = true;
      };
      const handleKeyPress = () => {};

      // 清空处方

      const handleClear = () => {
        createConfirm({
          iconType: 'info',
          title: '该患者的处方已提交成功，是否清空当前页面的药材？',
          content: `您可选择清空当前页面的药材，也可保留药材给下一个患者复用调方`,
          okText: '清空',
          cancelText: '不清空',
          onOk: async () => {
            useClinicalReception.setCMedicineListSync([]);
            CMedicineList.value = [];
            props.modelState.znMedicineName = '';
          },
        });
      };

      return {
        handlePrescriptionModel,
        mubanModal,
        isMultiRow,
        isDecotion,
        warnMsgShow,
        medicineNamevalue,
        numRef,
        CMedicineList,
        medicineOptions,
        handleSignName,
        handleBlur,
        handleCheckMedicineStock,
        handleCloseDecotion,
        handleAddDecotion,
        handleAddDecotionItem,
        handleSaveDecotion,
        handleDeleteMedicine,
        handleSearch,
        onSelect,
        handleClear,
        handleSavePrescriptionModel,
        handleKeyPress,
        useEnter,
        cmedicineRef,
        decotionList,
        currentDecotions,
        getfocus,
        showRow,
        saveModelClick
      };
    },
  });
</script>

<style lang="less" scoped>
  .prescription-card {
    width: 100%;
    // min-width: 1080px;
 
    min-height: 284px;
    margin-bottom: 20px;
    padding: 10px 0px 0px 10px;
    border: 1px solid #E8E8E8;
    position: relative;
    .medicine-module {
      display: flex;
      flex-wrap: wrap;
      
      .medicine-item {
        // width: 199px;
        width: 680px;
        height: 71px;
        padding: 7px 14px;
        opacity: 1;
        background: rgba(0, 171, 234, 0.04);
        border-radius: 5px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        position: relative;
        margin-right: 21px;

        .name-group {
        }

        .useage-group {
          display: flex;
          align-content: center;
          position: relative;
          margin-top: 4px;

          .ant-form-item {
            margin-bottom: 0;
          }

          .unit {
            padding-left: 5px;
          }
        }

        .decoction-btn {
          position: absolute;
          right: 8px;
          bottom: 10px;
        }

        .close-btn {
          position: absolute;
          right: -5px;
          top: -5px;
          cursor: pointer;
        }

        &:last-child {
          padding: 0;
        }

        .custom-decoction-prop {
          position: absolute;
          left: 0;
          top: calc(100% + 10px);
          width: 280px;
          height: 300px;
          z-index: 999;
          border: 1px solid #dedede;
          background: #fff;
          padding: 10px;

          .prop-top {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .title {
              font-size: 14px;
              margin: 0;
            }
          }

          .prop-content {
            display: flex;
            flex-wrap: wrap;

            .decotion-item {
              display: flex;
              padding: 6px 20px;
              border: 1px solid #dedede;
              border-radius: 5px;
              font-size: 12px;
              margin-right: 15px;
              margin-top: 15px;
            }
          }

          .prop-operate-group {
            display: flex;
            margin-top: 15px;
            justify-content: center;
          }
        }
        .custom-decoction-prop-spc{
          position: absolute;
          right: 95px;
          top: calc(100% + 2px);
          width: 280px;
          height: 300px;
          z-index: 999;
          border: 1px solid #dedede;
          background: #fff;
          padding: 10px;
          .prop-top {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .title {
              font-size: 14px;
              margin: 0;
            }
          }

          .prop-content {
            display: flex;
            flex-wrap: wrap;

            .decotion-item {
              display: flex;
              padding: 6px 20px;
              border: 1px solid #dedede;
              border-radius: 5px;
              font-size: 12px;
              margin-right: 15px;
              margin-top: 15px;
              line-height: 18px;
              cursor: pointer;
            }
          }

          .prop-operate-group {
            display: flex;
            margin-top: 15px;
            justify-content: center;
          }
        }
      }
      .medicine-item-spc{
        width: 199px;
      }
      .multiDan{
        background:none;
        height: 40px;
        border-bottom: 1px solid #E8E8E8;
        border-radius: 0px;
        .item-row{
          height: 40px;
          line-height: 27px;
          padding-left: 30px;
          color: #000;
          font-size: 14px;
         
        }
        .row-qian{
          background: #D2D2D2;
          padding: 3px;
          font-size: 12px;
          color: #1F1919;
          border-radius: 5px;
        }
        .row-delete{
          position: absolute;
          right: 25px;
          top: 6px;
          color: #FF3838;
          cursor: pointer;
        }
        &:nth-child(2n){
          background: #FAFAFA;
        }
      }
    }

    .operate-group {
      position: absolute;
      bottom: 5px;
      display: flex;
      align-items: center;

      .ant-form-item {
        margin-bottom: 0;
      }
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
        cursor: pointer;
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
        cursor: pointer
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
  .decotion-list .active {
    border: solid 1px #409eff !important;
    color: #409eff;
  }
</style>
