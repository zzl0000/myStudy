<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    title="处方模版"
    width="650px"
    :showOkBtn="true"
    :showFooter="true"
    @ok="handleSubmit"
    @close="handleCancel"
  >
    <!-- :showOkBtn="true"
    @ok="handleSubmit"
    @cancel="handleCancel" -->
    <template #default>
      <div class="custom-tabs">
        <div class="tabs-title">
          <span :class="modelType == 1 ? 'active' : ''" @click="handleChangeMoedl(1)"
            >历史处方</span
          >
          <span :class="modelType == 2 ? 'active' : ''" @click="handleChangeMoedl(2)">常用方</span>
        </div>
        <!-- <div v-if="modelType == 1" class="tabs-content">
          <a-select
            v-model:value="historyValue"
            mode="multiple"
            label-in-value
            show-search
            placeholder="输入关键词搜索，双击应用模版"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            option-label-prop="label"
            :options="historyData"
            @search="fetchUser"
            @select="onSelect"
            :defaultOpen="true"
            :open="true"
            notFoundContent="暂无模板方"
          >
            <template v-if="fetching" #notFoundContent>
              <a-spin size="small" />
            </template>
            <template #option="{ optionsData }">
              <div>
                <span>{{ `${optionsData.time} 治疗方案` }}</span>
              </div>
              <div class="prescription-detail">
                <span v-for="j in optionsData.list" :key="j.id">
                  {{ `${j.drug_name} ${j.number}${j.unit} 、` }}</span
                >
              </div>
            </template>
          </a-select>
        </div>
        <div v-else class="tabs-content">
          <a-select
            v-model:value="templateValue"
            mode="multiple"
            label-in-value
            show-search
            placeholder="输入关键词搜索，双击应用模版"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            option-label-prop="label"
            :options="templateData"
            @search="fetchUser"
            @select="onSelect"
            :defaultOpen="true"
            :open="true"
            notFoundContent="暂无模板方"
          >
            <template v-if="fetching" #notFoundContent>
              <a-spin size="small" />
            </template>
            <template #option="{ optionsData }">
              <div>
                <span>{{ optionsData.name }}</span>
              </div>
              <div class="prescription-detail">
                <span v-for="j in optionsData.list" :key="j.id">
                  {{ `${j.drug_name} ${j.number}${j.unit} 、` }}</span
                >
              </div>
            </template>
          </a-select>
        </div> -->
      </div>
      <div>
        <div class="search-item">
          <a-input v-model:value="keyword" @change="fetchUser" placeholder="请输入关键词搜索" />
        </div>
        <!-- <div class="search-item" v-show="modelType == 2">
          <a-input
            v-model:value="historyValue"
            @change="fetchUser"
            placeholder="请输入关键词搜索"
          />
        </div> -->
        <div class="tabs-item">
          <a-checkbox-group
            class="checkbox-group"
            @change="onSelect"
            v-if="modelType == 1"
            v-model:value="historyValue"
          >
            <div class="checkbox-item" :span="24" v-for="(k, i) in historyData" :key="i">
              <div class="checkBox ellipsis">
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
              <div class="checkBox ellipsis">
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
    </template>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, toRefs, reactive, watch, computed } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { getPrescriptListApi } from '/@/api/sys/prescription';
  import { debounce, max } from 'lodash-es';
  export default defineComponent({
    components: { BasicDrawer },
    props: {},
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
        patient_id: '',
        doctor_id: '',
        drug_type: '',
      });
      const modelType = ref(1);
      const prescriptionModelList = ref([]);

      const [registerDrawer, { closeDrawer }] = useDrawerInner((data) => {
        // console.log(data);
        state.pharmacy_id = data.pharmacy_id;
        state.patient_id = data.patient_id;
        state.patient_mobile = data.patient_mobile;
        state.doctor_id = data.doctor_id;
        state.drug_type = data.drugType;
        getPrescriptListApiSync('');
      });
      const keyword = ref();
      const handleChangeMoedl = (val) => {
        modelType.value = val;
        state.fetching = false;
        getPrescriptListApiSync('');
      };

      const pageCf = reactive({
        p: 1,
        size: 1000,
      });

      const fetchUser = debounce((value) => {
        modelType.value == 1 ? (state.historyData = []) : (state.templateData = []);
        state.fetching = true;
        getPrescriptListApiSync(keyword.value);
      }, 300);

      const getPrescriptListApiSync = async (value: any) => {
        let params = {
          type: modelType.value,
          pharmacy_id: state.pharmacy_id,
          drug_type: state.drug_type,
          drug_name: value,
          patient_id: state.patient_id,
          patient_mobile: state.patient_mobile,
          doctorId: state.doctor_id,
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
        // const type = modelType.value;
        // const id
        // console.log(v)
        // console.log(state.historyValue)
      };

      const handleSubmit = () => {
        let _arr: any = [];
        let nameArr: any = [];
        // let defArr = state.data;
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

        // console.log(_arr, _highest);
        emit('handleUpdateMedicineList', { type: state.drug_type, name: nameArr, list: _highest });
        handleCancel();
        closeDrawer();
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
        ...toRefs(state),
        ...toRefs(pageCf),
        fetchUser,
        modelType,
        prescriptionModelList,
        registerDrawer,
        handleChangeMoedl,
        handleSubmit,
        onSelect,
        handleCancel,
        keyword,
      };
    },
  });
</script>
<style lang="less" scoped>
.checkBox{
  width: 170px;
  padding-top: 5px;
  
}
.ellipsis{
   overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 2;
  white-space: normal !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
  .custom-tabs {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    align-items: center;
    .tabs-title {
      display: flex;
      width: 100%;
      margin-bottom: 15px;
      span {
        display: flex;
        padding: 3px 0;
        width: 50%;
        text-align: center;
        align-items: center;
        justify-content: center;
        border: 1px solid #dedede;
        cursor: pointer;
        &:last-child {
          border-left: 0;
        }
      }
      .active {
        border: 1px solid #2097f8 !important;
        color: #2097f8;
      }
    }
    .tabs-content {
      width: 100%;
      position: relative;
    }
  }
  .tabs-item {
    margin-top: 20px;
    margin-left: 20px;
    display: flex;
    border: 1px solid #dedede;
    width: 95%;
    // height: 240px;
    height: calc(100% - 260px);
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
      border-bottom: 1px solid #ecedf3;
    }
    .checkbox-group .checkbox-item:nth-child(2n-1) {
      background: #f9fafd;
    }
  }
  .prescription-detail {
    // margin-top: 10px;
    width: calc(100% - 170px);
    border-left: 1px solid #ecedf3;
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
  .search-item {
    width: 95%;
    // width: calc(100% - 160px)
    margin-left: 20px;
  }
  // .prescription-detail {
  //   margin-top: 10px;
  //   color: #787878;
  //   display: -webkit-box;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   word-wrap: break-word;
  //   word-break: break-all;
  //   white-space: normal !important;
  //   -webkit-line-clamp: 2;
  //   -webkit-box-orient: vertical;
  // }
</style>
