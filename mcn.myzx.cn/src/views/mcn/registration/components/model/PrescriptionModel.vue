<template>
  <!-- <a-card class="prescription-wrapper"> -->
    <div class="custom-tabs" >
      <div style="display:flex;">
        <div class="tabs-title">
          <span :class="modelType == 1 ? 'active' : ''" @click="handleChangeMoedl(1)">历史方</span>
          <span :class="modelType == 2 ? 'active' : ''" @click="handleChangeMoedl(2)">常用方</span>
        </div>
        <div class="search-item">
          <a-input
            v-model:value="keyword"
            @change="fetchUser"
            placeholder="请输入关键词搜索,双击应用模版"
          />
        </div>
      </div>
      <div class="tabs-item">
        <a-checkbox-group
          class="checkbox-group"
          @change="onSelect"
          v-if="modelType == 1"
          v-model:value="historyValue"
        >
          <div class="checkbox-item" :span="24" v-for="(k, i) in historyData" :key="i">
            <div style="line-height:50px;min-width:150px;">
              <a-checkbox :value="k">
                <span>{{ `${k.optionsData.time} 治疗方案` }}</span></a-checkbox
              >
            </div>
            <div class="prescription-detail">
              <span v-for="j in k.optionsData.list" :key="j.id">
                {{ `${j.drug_name} ${j.number}${j.unit} 、` }}</span
              >
            </div>
          </div>
        </a-checkbox-group>
        <a-checkbox-group
          class="checkbox-group"
          @change="onSelect"
          v-else
          v-model:value="templateValue"
        >
          <div class="checkbox-item" :span="24" v-for="(k, i) in templateData" :key="i">
            <div style="line-height:50px;min-width:150px;">
              <a-checkbox :value="k"
                ><span>{{ k.optionsData.name }}</span></a-checkbox
              >
            </div>
            <div class="prescription-detail">
              <span v-for="j in k.optionsData.list" :key="j.id">
                {{ `${j.drug_name} ${j.number}${j.unit} 、` }}</span
              >
            </div>
          </div>
        </a-checkbox-group>
      </div>
    </div>
  <!-- </a-card> -->
</template>
<script lang="ts">
  import { defineComponent, ref, toRefs, reactive, watch, nextTick, computed } from 'vue';
  import { getPrescriptListApi } from '/@/api/sys/prescription';
  import { debounce, max } from 'lodash-es';
  import { useClinicalReceptionStore } from '/@/store/modules/clinical-reception';
  import Events from '/@/utils/events';
  export default defineComponent({
    props: {
      formState: <any>Object,
    },
    components: {},
    emits: ['handleUpdateMedicineList'],
    setup(props, { emit }) {
      const state = reactive({
        historyData: [],
        templateData: [],
        historyValue: [],
        templateValue: [],
        fetching: false,
        pharmacy_id: '',
        patient_mobile: '',
        patient_id:'',
        doctor_id: '',
        drug_type: '',
      });
      

      const modelType = ref(1);
      const prescriptionModelList = ref([]);
      const keyword = ref();

      const orderId = computed(() => useClinicalReceptionStore().orderId);

      watch(
        () => {
          return props.formState.drugType;
        },
        (val) => {
          if (val) {
            nextTick(() => {
              Events.listen('updatePM', () => {
                state.pharmacy_id = props.formState.pharmacy_id;
                state.patient_id = props.formState.patient_id;
                state.patient_mobile = props.formState.patient_mobile;
                state.doctor_id = props.formState.doctor_id;
                state.drug_type = props.formState.drugType;
                getPrescriptListApiSync();
              });
            });
          }
        },
        {
          immediate: true,
          deep: true,
        }
      );
      const handleChangeMoedl = (val) => {
        modelType.value = val;
        state.fetching = false;
        console.log(state);
        getPrescriptListApiSync();
      };

      const pageCf = reactive({
        p: 1,
        size: 1000,
      });

      const fetchUser = debounce((value) => {
        // console.log(value.data);
        modelType.value == 1 ? (state.historyData = []) : (state.templateData = []);
        state.fetching = true;
        getPrescriptListApiSync();
      }, 300);

      const getPrescriptListApiSync = async () => {
        let params = {
          type: modelType.value,
          pharmacy_id: props.formState.pharmacy_id,
          // drug_type: 2,
          drug_type: props.formState.drugType,
          drug_name: keyword.value,
          patient_id: props.formState.patient_id,
          patient_mobile: props.formState.patient_mobile,
          doctorId: props.formState.doctor_id,
          ...pageCf,
        };
        try {
          const data = await getPrescriptListApi(params);
          // console.log(data);
          // prescriptionModelList.value = data ? data : [];
          const _data = data.map((m) => ({
            optionsData: m,
            value: modelType.value == 1 ? m.id : m.name,
            label: modelType.value == 1 ? `${m.time} 治疗方案` : m.name,
          }));
          modelType.value == 1 ? (state.historyData = _data) : (state.templateData = _data);
          state.fetching = false;
        } catch (error) {
          console.log(error);
          modelType.value == 1 ? (state.historyData = []) : (state.templateData = []);
          state.fetching = false;
        }
      };

      watch(state.historyValue, () => {
        state.historyData = [];
        state.fetching = false;
      });

      watch(state.templateValue, () => {
        state.templateData = [];
        state.fetching = false;
      });

      const onSelect = (v: any) => {
        // console.log(v);
        // const type = modelType.value;
        // const id
        // console.log(v, type, state.historyValue);
        handleSubmit2();
      };
      const handleSubmit2 = () => {
        let _arr: any = [];
        let nameArr: any = [];
        // let defArr = state.data;
        // console.log(state.templateValue, state.templateData);
        if (state.historyData.length > 0) {
          state.historyValue.map((j: any) => {
            state.historyData.map((m: any) => {
              if (j.value === m.optionsData.id) {
                _arr = [..._arr, ...m.optionsData.list];
                // console.log(m);
                nameArr.push(m.label);
              }
            });
          });
        }

        if (state.templateData.length > 0) {
          state.templateValue.map((j: any) => {
            state.templateData.map((m: any) => {
              if (j.label === m.optionsData.name) {
                _arr = [..._arr, ...m.optionsData.list];
                nameArr.push(m.optionsData.name);
              }
            });
          });
        }

        // 1.整理数据规则相同药品取克数大的合并成一条数据，
        // 2.单位非克的数据转为克在比较

        const _highest = _arr.reduce((groups, item) => {
          // 获取 item 的分组的 key
          const key = by(item);
          // console.log(key, item);
          // 看看这个组是不是已经存在
          let group = groups.find((g) => {
            // console.log(g, item);
            let result = {};
            if (g.key === key) {
              if (Number(g.number) < Number(item.number)) {
                g.number = item.number;
                result = g;
              } else {
                result = g;
              }
              // result = g;
              return result;
            }
          });
          // console.log(group);
          if (!group) {
            // 不存在就创建一个新组
            group = { key, ...item };
            groups.push(group);
          }
          // item 放入组中
          group = { ...group, ...item };
          return groups;
        }, []);
        state.drug_type = props.formState.drugType
        emit('handleUpdateMedicineList', { type: state.drug_type, name: nameArr, list: _highest });
        // handleCancel();
      };
      const handleSubmit = () => {
        let _arr: any = [];
        let nameArr: any = [];
        // let defArr = state.data;
        // console.log(state.templateValue, state.templateData);
        if (state.historyData.length > 0) {
          state.historyValue.map((j: any) => {
            state.historyData.map((m: any) => {
              if (j.value === m.optionsData.id) {
                _arr = [..._arr, ...m.optionsData.list];
                // console.log(m);
                nameArr.push(m.label);
              }
            });
          });
        }

        if (state.templateData.length > 0) {
          state.templateValue.map((j: any) => {
            state.templateData.map((m: any) => {
              if (j.label === m.optionsData.name) {
                _arr = [..._arr, ...m.optionsData.list];
                nameArr.push(m.optionsData.name);
              }
            });
          });
        }

        // 1.整理数据规则相同药品取克数大的合并成一条数据，
        // 2.单位非克的数据转为克在比较

        const _highest = _arr.reduce((groups, item) => {
          // 获取 item 的分组的 key
          const key = by(item);
          // console.log(key, item);
          // 看看这个组是不是已经存在
          let group = groups.find((g) => {
            // console.log(g, item);
            let result = {};
            if (g.key === key) {
              if (Number(g.number) < Number(item.number)) {
                g.number = item.number;
                result = g;
              } else {
                result = g;
              }
              // result = g;
              return result;
            }
          });
          // console.log(group);
          if (!group) {
            // 不存在就创建一个新组
            group = { key, ...item };
            groups.push(group);
          }
          // item 放入组中
          group = { ...group, ...item };
          return groups;
        }, []);
        state.drug_type = props.formState.drugType
        emit('handleUpdateMedicineList', { type: state.drug_type, name: nameArr, list: _highest });
        // handleCancel();
      };

      const by = (item) => item['drug_id'];

      const handleCancel = () => {
        state.historyData = [];
        state.templateData = [];
        state.historyValue = [];
        state.templateValue = [];
        state.fetching = false;
        state.pharmacy_id = '';
        state.patient_id = '';
        state.doctor_id = '';
        state.drug_type = '';
      };
      return {
        keyword,
        ...toRefs(state),
        ...toRefs(pageCf),
        fetchUser,
        modelType,
        prescriptionModelList,
        handleChangeMoedl,
        handleSubmit,
        onSelect,
        handleSubmit2,
        handleCancel,
        getPrescriptListApiSync,
      };
    },
  });
</script>
<style lang="less" scoped>
  .prescription-wrapper {
    width: 450px;
    position: relative;
    margin-left: 20px;
    min-height: 284px;
    margin-bottom: 20px;
  }
  .custom-tabs {
    width: 450px;
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    // align-items: center;
    .tabs-title {
      display: flex;
      // width: 100%;
      margin-bottom: 11px;
      span {
        display: flex;
        padding: 3px 0;
        width: 70px;
        text-align: center;
        align-items: center;
        justify-content: center;
        border: 1px solid #dedede;
        border-radius: 5px;
        margin-right: 5px;
        cursor: pointer;
        &:last-child {
          // border-left: 0;
        }
      }
      .active {
        background: #2097f8;
        border: 1px solid #2097f8 !important;
        color: #fff;
        
      }
    }
    .tabs-content {
      width: 100%;
      position: relative;
    }
    .search-item {
      // width: 100%;
      width: 250px;
      // width: calc(100% - 160px);
      position: relative;
    }
    .tabs-item {
      display: flex;
      border: 1px solid #dedede;
      width: 100%;
      // height: 240px;
      height: 242px;
      // margin-top: 15px;
      overflow-y: scroll;
      .checkbox-group {
        width: 100%;
        // padding: 15px;
      }
      .checkbox-item {
        display: flex;
        // flex-direction: column;
        width: 100%;
        height: 50px;
        padding-left: 15px;
        border-bottom: 1px solid #ECEDF3;
      }
      .checkbox-group .checkbox-item:nth-child(2n-1){
        background: #F9FAFD;
      }
    }
  }
  .prescription-detail {
    // margin-top: 10px;
    border-left: 1px solid #ECEDF3;
    padding-left: 13px;
    margin-left: 13px;
    padding-top: 5px;
    color: #787878;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    word-break: break-all;
    white-space: normal !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    box-sizing: border-boxs;
  }
</style>
