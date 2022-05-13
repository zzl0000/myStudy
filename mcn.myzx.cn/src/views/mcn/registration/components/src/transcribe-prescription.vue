<template>
  <div>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      v-loading="loading"
    >
      <div
        style="display: flex; padding: 20px 20px 20px 20px; box-sizing: border-box; height: 64px"
      >
        <div style="margin-right: 10px">
          <a-form-item
            label="患者姓名"
            required
            name="patient_name"
            @blur="patientsSearchShow = false"
          >
            <a-input
              v-model:value="formState.patient_name"
              placeholder="请输入"
              @change="getPatientsAction"
              @pressEnter="patientsSearchDisable"
              @blur="patientsSearchDisable"
              style="width: 180px"
              :maxlength="10"
              :disabled="records.action == 'videoReception' ? true : false"
              autocomplete="off"
            />
            <div class="search-result" v-show="patientsSearchShow">
              <div
                class="search-item"
                v-for="item in patients"
                :key="item.id"
                @mousedown="onPatientChange(item)"
                >{{ item.name }}
                <span class="search-phone">{{
                  item.phone ? item.phone.substr(0, 3) + '****' + item.phone.substr(7, 11) : ''
                }}</span></div
              >
            </div>
          </a-form-item>
        </div>
        <div style="margin-right: 10px">
          <a-form-item label="" :label-col="{ style: { width: '50px' } }">
            <a-select
              v-model:value="formState.patient_sex"
              :disabled="
                records.action == 'edit' ? true : records.action == 'videoReception' ? true : false
              "
              placeholder="性别"
              required
              style="width: 60px"
            >
              <a-select-option value="1">男</a-select-option>
              <a-select-option value="0">女</a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <div style="margin-right: 10px">
          <a-form-item label="">
            <a-input
              v-model:value="formState.patient_age"
              :disabled="
                records.action == 'edit' ? true : records.action == 'videoReception' ? true : false
              "
              placeholder="年龄"
              :maxlength="3"
              required
              style="max-width: 55px"
            />
          </a-form-item>
        </div>
        <div style="margin-right: 10px">
          <a-form-item label="" name="patient_mobile">
            <a-input
              v-model:value="formState.patient_mobile"
              :disabled="
                records.action == 'edit' ? true : records.action == 'videoReception' ? true : false
              "
              placeholder="请输入患者手机号"
              required
              :maxlength="11"
              style="max-width: 160px"
              autocomplete="off"
              @blur="patientMobileBlur"
            />
          </a-form-item>
        </div>
        <div style="margin-right: 10px">
          <a-form-item label="医生姓名" name="doctor_id">
            <a-select
              v-model:value="formState.doctor_id"
              :disabled="
                records.action == 'edit'
                  ? true
                  : records.action == 'videoReception'
                  ? true
                  : records.action == 'updata'
                  ? true
                  : false
              "
              placeholder="请输入"
              required
              style="width: 120px"
              @change="handleDoctorChange"
            >
              <a-select-option v-for="item in doctors" :key="item.id" :value="item.id">{{
                item.title
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <div style="margin-left: 15px">
          <a-form-item>
            <a-input :value="doctor?.title" hidden />
            <a-input
              v-show="doctor?.title"
              :value="doctor?.department"
              :disabled="true"
              style="width: 120px; margin-right: 15px; margin-left: -20px"
            />
            <a-input
              v-show="doctor?.title"
              :value="doctor?.doctor_title"
              :disabled="true"
              style="width: 100px; margin-right: 15px"
            />
            <a-input
              v-show="doctor?.title"
              :value="doctor?.hospital_name"
              :disabled="true"
              style="width: 150px"
            />
          </a-form-item>
        </div>
      </div>

      <div class="line"></div>

      <a-row style="padding: 0px 20px 0 20px">
        <a-col span="12">
          <a-form-item label="诊断" name="icd_ids">
            <a-auto-complete
              v-model:value="formState.icd_ids"
              :options="icdList"
              @search="getIcdList"
              style="width: 80%"
            >
              <a-input placeholder="请输入" class="custom" />
            </a-auto-complete>
          </a-form-item>
        </a-col>
        <a-col span="12">
          <a-form-item label="主诉" name="content">
            <a-input
              v-model:value="formState.patient_descr"
              style="width: 80%"
              placeholder="请输入"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <div class="line"></div>
      <a-row
        style="padding: 0px 20px 0 20px"
        v-if="Number(formState.audit_status) === 12 && Number(formState.pay_status) !== 1"
      >
        <a-col span="12">
          <a-form-item label="拒绝原因" name="icd_ids">
            <div style="color: red">{{ formState.audit_reason }}</div>
          </a-form-item>
        </a-col>
      </a-row>
      <div
        class="line"
        v-if="Number(formState.audit_status) === 12 && Number(formState.pay_status) !== 1"
      ></div>

      <div style="margin-left: 20px">
        <div style="display: flex">
          <div class="title-spc">选择药房和剂型：</div>
          <div style="display: flex">
            <div style="margin-right: 15px">
              <a-form-item
                label="药房"
                :label-col="{ style: { width: '55px' } }"
                name="pharmacy_id"
              >
                <a-select
                  v-model:value="formState.pharmacy_id"
                  placeholder="请选择药房"
                  @change="getDosageList"
                  style="width: 250px"
                >
                  <a-select-option
                    v-for="item in pharmacyLists"
                    :key="item.pharmacy_id"
                    :value="item.pharmacy_id"
                  >
                    {{ item.pharmacy_sub_name ? item.pharmacy_sub_name : item.pharmacy_name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div style="margin-right: 15px">
              <a-form-item
                label="剂型"
                name="dosage_form"
                :label-col="{ style: { width: '55px' } }"
              >
                <a-select
                  v-model:value="formState.dosage_form"
                  placeholder="请选择剂型"
                  @change="handleChangeDosage"
                  style="width: 110px"
                >
                  <a-select-option
                    :value="item.title"
                    v-for="item in dosageForm.list"
                    :key="item.id"
                  >
                    {{ item.title }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div
              style="
                display: inline-block;
                font-weight: 700;
                letter-spacing: 2px;
                line-height: 32px;
              "
            >
              <span v-if="formState.drugType == 1">共:{{ medicineNumber }}味药,</span>
              <span v-if="formState.drugType == 1">每剂{{ grammage }}克,</span>
              <span>
                每剂药费:
                <span style="color: red">{{
                  totalDrugCost === -1
                    ? '计算中...'
                    : totalDrugCost == 0
                    ? '0.00'
                    : Math.ceil10(totalDrugCost.toFixed(6), -2)
                }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        style="width: 100%; margin-left: 20px; padding-right: 40px; justify-content: space-between"
      >
        <div style="flex: 1">
          <div v-if="formState.drugType == 1" class="prescription-card" style="width: 100%">
            <div class="operate-group-spc" style="margin-left: 0px">
              <div class="btns">
                <span class="btns-item btns-item-spc" @click="showRow(true)">多排显示</span>
                <span class="btns-item btns-item-rigth" @click="showRow(false)">单排显示</span>
              </div>
              <div class="clearBtn" @click="handleClearU">清空处方</div>
              <div
                class="clearBtn"
                style="color: #1084ff; margin-left: 13px"
                @click="saveModelClick"
                >存为模板</div
              >
              <div
                class="clearBtn"
                style="margin-left: 15px; background: #1084ff; color: #fff"
                @click="handlePrescriptionModel"
                >导入模板方</div
              >
            </div>
            <div style="font-size: 12px; margin-bottom: 10px; color: #ff8d00" v-if="warnMsgShow"
              >注： 输入药材简拼或药材名，选择药品后和用量后，点击键盘Enter 键即可</div
            >
            <div class="medicine-module" v-show="isMultiRow">
              <div
                v-for="(item, index) in CMedicineList"
                :key="item"
                class="medicine-item medicine-item-spc"
                style="margin-bottom: 20px"
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
                  <span
                    v-else
                    style="padding-left: 10px; cursor: pointer"
                    @click="handleSignName(index)"
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
                      style="width: 55px; color: #1084ff"
                      size="small"
                      ref="numRef"
                      maxlength="3"
                      @blur="handleBlur(item)"
                      @change="handleCheckMedicineStock(index, item)"
                      @focus="getfocus($event)"
                    />
                  </a-form-item>
                  <div class="unit">{{ item.unit }}</div>
                </div>
                <div
                  style="color: red; padding-left: 40px"
                  v-if="isNaN(item.number) || !item.number || item.number <= 0"
                  >请输入用量</div
                >
                <div class="decoction-btn">
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
                      :key="item"
                      class="decotion-list"
                      @click="handleAddDecotionItem(index, item)"
                    >
                      <div
                        :class="
                          currentDecotions === item ? 'decotion-item active' : 'decotion-item'
                        "
                        >{{ item }}</div
                      >
                    </div>
                  </div>
                  <div class="prop-operate-group">
                    <a-button size="small" @click="handleCloseDecotion(index)">取消</a-button>
                    <a-button
                      type="primary"
                      class="ml-5"
                      size="small"
                      @click="handleSaveDecotion(index)"
                      >保存</a-button
                    >
                  </div>
                </div>
              </div>
              <div class="medicine-item" style="margin-bottom: 5px">
                <a-form-item>
                  <a-auto-complete
                    v-model:value="medicineNamevalue"
                    :options="options"
                    style="width: 200px"
                    @search="handleSearch"
                    @select="onSelect"
                    dropdown-class-name="certain-category-search-dropdown"
                  >
                    <a-textarea
                      placeholder="请输入药材简称或名称"
                      ref="cmedicineRef"
                      class="custom"
                      style="width: 200px; height: 71px"
                      @keypress="handleKeyPress"
                    />
                  </a-auto-complete>
                </a-form-item>
              </div>
            </div>

            <div class="medicine-module" v-show="!isMultiRow">
              <div
                class="medicine-item multiDan"
                v-for="(item, index) in CMedicineList"
                :key="item"
                :style="index == CMedicineList.length - 1 ? 'margin-bottom:10px' : ''"
              >
                <div class="item-row">
                  <span class="index" style="margin-right: 30px">{{ index + 1 }}</span>
                  <div style="display: inline-block; width: 300px; margin-right: 10px">
                    <span class="row-name" style="margin-right: 10px">
                      <span
                        style="color: rgba(0, 0, 0, 0.85)"
                        v-if="!(isNaN(item.number) || !item.number || item.number <= 0)"
                        >{{ item.name }}</span
                      >
                      <span v-else>{{ item.name }}</span>
                    </span>

                    <span class="row-qian" style="margin-right: 0px">
                      <span
                        v-if="!item.autograph"
                        style="cursor: pointer"
                        @click="handleSignName(index)"
                        >签名</span
                      >
                      <span v-else style="cursor: pointer" @click="item.autograph = ''"
                        >{{ item.autograph }}
                        <Icon icon="gg:close" size="12" />
                      </span>
                    </span>
                  </div>
                  <span class="row-num" style="margin-right: 42px">
                    <span>用量</span>
                    <a-input
                      v-model:value="item.number"
                      @keyup.enter="useEnter"
                      style="width: 43px; margin: 0px 8px; color: #1084ff"
                      size="small"
                      ref="numRef2"
                      maxlength="3"
                      @blur="handleBlur(item)"
                      @change="handleCheckMedicineStock(index, item)"
                      @focus="getfocus($event)"
                    />
                    <span>{{ item.unit }}</span>
                  </span>
                  <span class="row-jian" style="color: #1084ff">
                    <span v-if="item.isLack" style="color：red;">缺货</span>
                    <span v-else>
                      <span
                        v-if="!item.isDecotion"
                        @click="handleAddDecotion(index)"
                        style="cursor: pointer"
                        >{{ item.usage ? item.usage : '煎法' }}</span
                      >
                      <span v-else>{{ item.decoction }}</span>
                    </span>
                  </span>
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
                        :key="item"
                        class="decotion-list"
                        @click="handleAddDecotionItem(index, item)"
                      >
                        <div
                          :class="
                            currentDecotions === item ? 'decotion-item active' : 'decotion-item'
                          "
                          >{{ item }}</div
                        >
                      </div>
                    </div>
                    <div class="prop-operate-group">
                      <a-button size="small" @click="handleCloseDecotion(index)">取消</a-button>
                      <a-button
                        type="primary"
                        class="ml-5"
                        size="small"
                        @click="handleSaveDecotion(index)"
                        >保存</a-button
                      >
                    </div>
                  </div>

                  <span
                    class="row-delete"
                    style="text-align: right"
                    @click="handleDeleteMedicine(index)"
                    >删除</span
                  >
                </div>
              </div>
              <div class="medicine-item medicine-item-two" style="margin-bottom: 5px">
                <a-form-item>
                  <a-auto-complete
                    v-model:value="medicineNamevalue"
                    :options="options"
                    style="width: 100%"
                    @search="handleSearch"
                    @select="onSelect"
                    dropdown-class-name="certain-category-search-dropdown"
                  >
                    <a-textarea
                      placeholder="请输入药材简称或名称"
                      ref="cmedicineRef2"
                      class="custom"
                      style="width: 100%; height: 35px"
                      @keypress="handleKeyPress"
                    />
                  </a-auto-complete>
                </a-form-item>
              </div>
            </div>
          </div>

          <div v-if="formState.drugType === 2" class="w-prescription-card" style="width: 100%">
            <div class="operate-group-spc">
              <div class="clearBtn" @click="handleClearU">清空处方</div>
              <div
                class="clearBtn"
                style="color: #1084ff; margin-left: 13px"
                @click="saveModelClick"
                >存为模板</div
              >
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
                    <a-input
                      placeholder="请输入药材简称或名称"
                      class="custom"
                      @keypress="handleKeyPress"
                    />
                  </a-auto-complete>
                </template>
                <template #number="{ record, index }">
                  <a-input
                    type="number"
                    v-model:value="record.number"
                    @blur="handleBlurTable(record.number, index, 'number')"
                    @change="handleWestStockCheck(record)"
                  />
                </template>
                <template #usage="{ record }">
                  <a-input v-model:value="record.usage" />
                </template>
                <template #usageDay="{ record, index }">
                  <a-input
                    type="number"
                    v-model:value="record.usage_day"
                    @blur="handleBlurTable(record.usage_day, index, 'usage_day')"
                  />
                </template>
                <template #retailPrice="{ record }">
                  ￥ {{ Number(record.retail_price).toFixed(2) }}
                </template>
                <template #amount="{ record }">
                  <template v-if="record.isLack">
                    <div class="lackStyle">缺货</div>
                  </template>
                  <template v-else>
                    ￥ {{ multiplie(record.retail_price, record.number) }}
                  </template>
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
          </div>
        </div>
        <div> </div>
      </div>
      <div style="padding: 0px 20px">
        <template v-if="formState.drugType == 1">
          <a-col span="24" v-if="formState.tisanes_way === '自煎'">
            <div class="usage-item">
              <span class="pr-3" style="font-weight: bold; color: #000">共</span>
              <a-form-item style="display: inline-block; margin-top: -3px">
                <a-input
                  v-model:value="formState.tisanes_detail.total_dosage"
                  value="2"
                  class="small"
                  style="width: 47px; text-align: center; padding: 0px 0px; color: #1084ff"
                />
              </a-form-item>
              <span class="pl-3" style="font-weight: bold; color: #000">剂，</span>
              <span style="font-weight: bold; color: #000"
                >每日<span class="pl-2 pr-2">1</span>剂，</span
              >
              <span class="pr-3" style="font-weight: bold; color: #000">1剂分</span>
              <a-form-item style="display: inline-block; margin-top: -3px">
                <a-input
                  v-model:value="formState.tisanes_detail.every_dosage"
                  value="2"
                  class="small"
                  style="width: 47px; text-align: center; padding: 0px 0px; color: #1084ff"
                />
              </a-form-item>
              <span class="pl-3" style="font-weight: bold; color: #000">次服用</span>
              <span style="color: #a5a5a5; font-size: 12px; margin-right: 5px"
                >*如有特殊用量，请在医嘱里备注
              </span>
            </div>
          </a-col>
          <a-col span="24" v-if="formState.tisanes_way === '代煎'">
            <div class="usage-item">
              <span class="pr-3" style="font-weight: bold; color: #000">共</span>
              <a-form-item style="display: inline-block; margin-top: -3px">
                <a-input
                  v-model:value="formState.tisanes_detail.total_dosage"
                  value="2"
                  class="small"
                  style="width: 47px; text-align: center; padding: 0px 0px; color: #1084ff"
                />
              </a-form-item>
              <span class="pl-3" style="font-weight: bold; color: #000">剂，</span>

              <span class="pr-3" style="font-weight: bold; color: #000">每剂</span>
              <a-form-item style="display: inline-block; margin-top: -3px">
                <a-input
                  v-model:value="formState.tisanes_detail.every_dosage"
                  value="2"
                  class="small"
                  style="width: 47px; text-align: center; padding: 0px 0px; color: #1084ff"
                />
              </a-form-item>
              <span class="pl-3">袋，</span>

              <span class="pr-3" style="font-weight: bold; color: #000">每袋</span>
              <a-form-item style="display: inline-block; margin-top: -3px">
                <a-input
                  v-model:value="formState.tisanes_detail.every_bag"
                  value="2"
                  class="small"
                  style="width: 47px; text-align: center; padding: 0px 0px; color: #1084ff"
                />
              </a-form-item>
              <span class="pl-3" style="font-weight: bold; color: #000">ml，</span>

              <span class="pr-3" style="font-weight: bold; color: #000">每日</span>
              <a-form-item style="display: inline-block; margin-top: -3px">
                <a-input
                  v-model:value="formState.tisanes_detail.every_day"
                  value="2"
                  class="small"
                  style="width: 47px; text-align: center; padding: 0px 0px; color: #1084ff"
                />
              </a-form-item>
              <span class="pl-3" style="font-weight: bold; color: #000">次，</span>

              <span class="pr-3" style="font-weight: bold; color: #000">每次</span>
              <a-form-item style="display: inline-block; margin-top: -3px">
                <a-input
                  v-model:value="formState.tisanes_detail.every_time"
                  value="2"
                  class="small"
                  style="width: 47px; text-align: center; padding: 0px 0px; color: #1084ff"
                />
              </a-form-item>
              <span class="pl-3" style="font-weight: bold; color: #000">袋，</span>
            </div>
          </a-col>
        </template>
      </div>
      <a-row style="padding: 0px 20px 0 20px">
        <a-col span="3">
          <div class="title-spc">用药医嘱（选填）：</div>
        </a-col>
        <a-col span="3" v-if="formState.drugType === 1" class="setting">
          <a-form-item label="">
            <a-radio-group v-model:value="formState.usage1" button-style="outline" size="default">
              <a-radio-button value="内服">内服</a-radio-button>
              <a-radio-button value="外用">外用</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col span="3" v-if="formState.dosage_id == 1">
          <a-form-item label="">
            <a-radio-group
              v-model:value="formState.tisanes_way"
              button-style="outline"
              size="default"
            >
              <a-radio-button value="代煎">代煎</a-radio-button>
              <a-radio-button value="自煎">自煎</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col span="8">
          <a-form-item label="">
            <a-select
              style="width: 190px"
              placeholder="请输入服药时间"
              v-model:value="formState.times"
            >
              <a-select-option
                v-for="item in medicamentOptionTimes"
                :key="item.id"
                :value="item.title"
              >
                {{ item.title }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col span="16" style="display: none">
          <a-form-item label="补充说明">
            <a-input style="width: 240px" placeholder="请填写特殊医嘱或其他特殊说明" />
          </a-form-item>
        </a-col>
        <a-col span="24">
          <a-form-item label="">
            <a-checkbox-group v-model:value="formState.taboos" :options="mtOptions" />
          </a-form-item>
        </a-col>
        <a-col span="24">
          <a-form-item label="">
            <a-textarea
              style="width: 100%"
              v-model:value="formState.matter"
              rows="3"
              show-count
              :maxlength="200"
              placeholder="请填写自定义医嘱"
            />
          </a-form-item>
        </a-col>

        <a-col span="3">
          <div class="title-spc">处方设置（选填）</div>
        </a-col>
        <a-col span="8">
          <a-form-item label="患者是否可见" :label-col="{ style: { width: '130px' } }">
            <a-select
              style="width: 190px"
              placeholder="请输入"
              v-model:value="formState.pres_visible"
              :disabled="
                Number(formState.audit_status) === 12 && Number(formState.pay_status) !== 1
                  ? true
                  : false
              "
            >
              <a-select-option v-for="item in prescriptionVisible" :key="item.id" :value="item.id">
                {{ item.title }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col span="13">
          <a-form-item label="诊金" :label-col="{ style: { width: '45px' } }">
            <a-input
              :disabled="
                Number(formState.audit_status) === 12 && Number(formState.pay_status) !== 1
                  ? true
                  : false
              "
              v-model:value="formState.consultation_fee"
              type="number"
              :min="0"
              :max="99999"
              style="width: 100px"
            />
            <span class="pl-3">元</span>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row style="padding: 20px 20px 0 20px">
        <template v-if="false">
          <a-col>
            <h5 class="title">健康管理服务</h5>
          </a-col>
          <a-col>
            <a-form-item label="健康管理服务">
              <a-input
                v-model:value="formState.service_fee"
                type="number"
                style="width: 100px"
                :min="0"
                :max="99999"
              /><span class="pl-3">元</span>
            </a-form-item>
          </a-col>
          <a-col>
            说明：健康管理服务奖励按医药费根据对应比例计算得出，
            若增加健康管理服务奖励则医生将获得等额增长金额收入， 此部分将纳入医药费一并计算，
            若减少健康管理服务奖励则会将此部分作为优惠金额， 计入患者订单
          </a-col>
        </template>
      </a-row>

      <ExpressSetModel
        :formState="formState"
        :comMedicalFee="comMedicalFee"
        :gettype="gettype"
        ref="sonRef"
      />
      <div class="line"></div>
      <div class="con">
        <div class="con-mb con-mb-title">处方划价</div>
        <div class="con-mb"
          >医药费:<span>¥ {{ comMedicalFee }}</span></div
        >
        <div class="con-mb"
          >加工费:<span>¥ {{ comProcessCost }}</span></div
        >
        <div class="con-mb"
          >诊金:<span>¥ {{ comConsultationFee }}</span></div
        >
        <div class="con-mb" style="font-size: 18px"
          >处方合计({{ tipsText }})<span>¥ {{ comTotal }}</span></div
        >
      </div>
    </a-form>

    <div class="line"></div>
    <div class="model" v-show="isshow">
      <div class="title">
        <div class="title-label">
          禁忌详情
          <div class="closes" @click="closeModel"><close-outlined style="color: #a5a3a3" /></div>
          <Divider style="font-size: 30px; font-weight: 500" />
        </div>
        <div class="array">
          <div v-for="item in saveArray">
            {{ item }}
          </div>
        </div>
        <div class="size">
          <Divider class="you">请您签字确认以上药材使用无误</Divider>
          <button class="button" @click="close">医生签名</button>
        </div>
      </div>
    </div>

    <a-modal v-model:visible="mubanModal" title="存为模板" width="400px">
      <template #footer>
        <a-button key="submit" type="primary" @click="handleSavePrescriptionModel">保存</a-button>
      </template>
      <a-form-item label="">
        <a-input
          placeholder="模板名称不能为空"
          v-model:value="modelState.znMedicineName"
          style="width: 250px; margin: 25px"
          size="large"
        />
      </a-form-item>
    </a-modal>

    <div class="mb-5 submit-group">
      <a-button class="ml-20" @click="goBack">取消</a-button>
      <a-button class="ml-10" type="primary" @click="btnClick2">{{
        tisanes_type == 1 ? '抄方成功' : '修改处方'
      }}</a-button>
    </div>
  </div>

  <a-modal
    v-model:visible="prescriptionConfirmation"
    :title="tisanes_type == 1 ? '处方确认' : '处方确认修改'"
    :closable="false"
    width="750px"
    cancelText="返回修改"
    :okText="tisanes_type == 1 ? '确认无误，提交处方' : '确认无误，修改处方'"
    @cancel="prescriptionModalCancel"
    @ok="prescriptionModalOk"
  >
    <div style="padding: 20px; box-sizing: border-box; font-size: 16px">
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">患者信息：</span>
        <span
          >{{ formState.patient_name }}&nbsp;&nbsp;{{
            formState.patient_sex == '1' ? '男' : '女'
          }}&nbsp;&nbsp;{{
            formState.patient_age == '' ? '' : formState.patient_age + '岁'
          }}&nbsp;&nbsp;{{ formState.patient_mobile }}</span
        >
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">医生信息：</span>
        <span
          >{{ formState.doctor_name }}&nbsp;&nbsp;{{ doctor?.department }}&nbsp;&nbsp;{{
            doctor?.doctor_title
          }}&nbsp;&nbsp;{{ doctor?.hospital_name }}</span
        >
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">诊断：</span>
        <span>{{ formState.icd_ids }}</span>
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">药品：</span>
        <div
          style="display: inline-block; width: 90%; vertical-align: top"
          v-if="formState.drugType == 1"
        >
          <span
            v-for="(item, index) in CMedicineList"
            :key="index"
            style="
              width: 22%;
              display: inline-block;
              vertical-align: top;
              margin-bottom: 5px;
              margin-right: 10px;
            "
          >
            <span>{{ item.name }}</span> <span>{{ item.number }}</span
            ><span>{{ item.unit }}</span
            ><span style="font-size: 14px">{{ item.autograph }}</span>
            <span style="color: #d68516; font-size: 14px" v-if="item.usage != ''">{{
              '(' + item.usage + ')'
            }}</span>
          </span>
        </div>
        <div
          style="display: inline-block; width: 90%; vertical-align: top"
          v-if="formState.drugType == 2"
        >
          <span
            v-for="(item, index) in WMedicineListSum"
            :key="index"
            style="
              width: 22%;
              display: inline-block;
              vertical-align: top;
              margin-bottom: 5px;
              margin-right: 10px;
            "
          >
            <span>{{ item.name }}</span> <span v-if="item.name != ''">{{ item.number }}</span
            ><span v-if="item.name != ''">{{ item.unit }}</span
            ><span style="font-size: 14px">{{ item.autograph }}</span>
            <span style="color: #d68516; font-size: 14px" v-if="item.usage != ''">{{
              '(' + item.usage + ')'
            }}</span>
          </span>
        </div>
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">药房及剂型：</span>
        <span
          >{{ submitPharmacy }}&nbsp;&nbsp;<span style="color: #dfa14c"
            >{{ formState.dosage_form
            }}{{
              formState.dosage_form == '颗粒剂' || formState.dosage_form == '西药与中成药'
                ? ''
                : '--' + formState.tisanes_way
            }}</span
          ></span
        >
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">用法用量：</span>
        <span>{{ formState.usage1 }}</span>
        <span v-show="formState.drugType == 1">
          ;&nbsp;{{
            formState.tisanes_way === '自煎' || formState.dosage_form == '颗粒剂'
              ? '共' +
                formState.tisanes_detail.total_dosage +
                '剂，每日1剂，1剂分' +
                formState.tisanes_detail.every_dosage +
                '次服用'
              : '共' +
                formState.tisanes_detail.total_dosage +
                '剂，每剂' +
                formState.tisanes_detail.every_dosage +
                '袋，每袋' +
                +formState.tisanes_detail.every_bag +
                'ml，每日' +
                formState.tisanes_detail.every_day +
                '次，每次' +
                formState.tisanes_detail.every_time +
                '袋'
          }}
        </span>
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">医嘱：</span>
        <span>{{ formState.times == '' ? '无' : formState.times }}</span>
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">患者是否可见处方：</span>
        <span v-show="formState.drugType == 1">{{
          formState.pres_visible == 1
            ? '购药前后均可见'
            : formState.pres_visible == 2
            ? '购药前后均不可见'
            : formState.pres_visible == 3
            ? '购药前后只可见药材名字'
            : formState.pres_visible == 4
            ? '仅购药后可见药材名'
            : formState.pres_visible == 5
            ? '仅购药后可见药材名和克数'
            : ''
        }}</span>
        <span v-show="formState.drugType == 2">{{
          formState.pres_visible == 1
            ? '购药前后均可见'
            : formState.pres_visible == 2
            ? '购药前后均不可见'
            : formState.pres_visible == 6
            ? '仅购药后可见'
            : ''
        }}</span>
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">快递类型：</span>
        <span>{{ formState.express_type == '1' ? '标快' : '特快' }}</span>
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">自定义快递费：</span>
        <span>{{
          formState.set_express_total == '0'
            ? '包邮'
            : formState.set_express_total == ''
            ? '无'
            : formState.set_express_total
        }}</span>
      </div>
      <div style="margin-bottom: 10px">
        <span style="font-weight: 700; font-size: 18px">支付方式：</span>
        <span>{{
          formState.doctor_express_type == 2
            ? '到付'
            : formState.doctor_express_type == 1
            ? '在线支付'
            : '暂无'
        }}</span>
      </div>
    </div>
  </a-modal>
  <RegModal @register="registerQrcodeModal" @cancel="cancelModal" />
  <PrescriptionModel
    @register="registerPrescriptionDrawer"
    @handleUpdateMedicineList="handleUpdateMedicineList"
    ref="prescription"
    :formState="formState"
  />
</template>

<script lang="ts">
  import {
    computed,
    defineComponent,
    inject,
    reactive,
    ref,
    unref,
    onMounted,
    getCurrentInstance,
    nextTick,
    toRefs,
    watch,
    provide,
  } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import {
    PrescriptionModel,
    WMedicineModel,
    ExpressSetModel,
    PAndDModel,
    CMedicineModel,
    UsageAndDosageModal,
  } from '../model';
  import { getOrganizationDoctorList } from '/@/api/sys/doctor';
  import { getPharmacy } from '/@/api/sys/pharmacy';
  import {
    createPrescription,
    getBasics,
    getChineseDrug,
    getWesterDrug,
    getProcessingFee,
    prescriptSave,
    getPrescriptIcd,
    getPrescription,
    getPharmacyListApi,
    getDosageListApi,
    getPrescriptAddApi,
  } from '/@/api/sys/prescription';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BigNumber } from 'bignumber.js';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema } from '../model/MedicineModel.data';
  import { getPatients } from '/@/api/sys/patient';
  import { ApiSelect } from '/@/components/Form';
  import { useRouter } from 'vue-router';
  import RegModal from '../../../customer-service/appointments/RegModal.vue';
  import { useUserStore } from '/@/store/modules/user';
  import _ from 'lodash';
  import { Divider } from 'ant-design-vue';
  import { CloseOutlined } from '@ant-design/icons-vue';
  import { getIdempotentToken } from '/@/api/sys/idempotent';
  import { multiply, roundSync } from '/@/utils/math';

  export default defineComponent({
    components: {
      Icon,
      PrescriptionModel,
      WMedicineModel,
      BasicTable,
      TableAction,
      ApiSelect,
      RegModal,
      Divider,
      CloseOutlined,
      ExpressSetModel,
      PAndDModel,
      UsageAndDosageModal,
      CMedicineModel,
    },
    emits: ['changeTab'],
    setup() {
      const [registerQrcodeModal, { openModal: openQrcodeModal }] = useModal();

      const { createMessage, createConfirm } = useMessage();
      const { success, error } = createMessage;
      const saveArray = ref([]);
      const isshow = ref(false);
      const isCreate = ref(false);
      const issize = ref(true);
      const ischeck = ref(true);
      const newId = ref({});
      const echoPharmacyId = ref([]);
      const resPharmacyId = ref('');
      const resDosage = ref('');
      let yf = ref(0);
      const multiplie = (first, second) => {
        const temp = BigNumber(parseFloat(first));
        return temp.multipliedBy(parseFloat(second));
      };
      const idempotentToken = ref('');

      const WMedicineList = ref([
        {
          id: 0,
          drug_name: '',
          drug_type: '',
          number: 1,
          autograph: '',
          unit_price: '',
          usage: '',
          drug_id: 0,
          name: '',
          unit: '盒',
          retail_price: '0.00',
          specs: '',
          value: '',
          loading: false,
          offline_share: 0,
          online_share: 0,
          key: Date.now() + parseInt(Math.random() * (1000 + 1), 10),
        },
      ]) as any;

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
        showIndexColumn: true,
        pagination: false,
        actionColumn: {
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      const records: any = inject('record');
      const isMultiRow = ref(true); //是否多排显示
      const showRow = (v) => {
        isMultiRow.value = v;
      };
      // console.log()

      const formRef = ref();
      const formState = reactive({
        process_fee: 0,
        consultation_fee: 0,
        express_fee: 0,
        // service_fee: 0,
        service_discount: 0,
        total_fee: 0,
        medical_fee: 0,
        patient_id: 0, // 患者ID
        patient_name: '', // 患者姓名
        patient_sex: '1', // 患者性别
        patient_age: '', // 患者年龄
        patient_descr: '', // 患者主诉
        patient_mobile: '', // 患者手机号
        doctor_id: '', // 医生ID
        doctor_name: '', // 医生姓名
        dosage_id: '',
        dosage_form: '', // 剂型
        pharmacy_id: '', // 药房
        usage1: '内服', // 用药方法
        tisanes_way: '代煎', // 煎药方式
        tisanes_detail: {
          // 煎药详情
          total_dosage: 14, // 剂数
          every_dosage: 2, // 每剂分多少次
          every_bag: 200,
          every_day: 2,
          every_time: 1,
        },
        icd_ids: '',
        times: '', // 服药时间
        taboos: [], // 服药禁忌
        // make: '', // 自定义医嘱
        matter: '', // 医嘱
        drugType: 1, //抄方类型 1为中药 2为西药与中成要
        express_type: '1', //快递类型
        set_express_total: '', //自定义快递费
        free_delivery: 1, // 是否包邮
        free_delivery_limit: '',
        doctor_express_type: 0,
        orderType: 'new', //判断订单状态
        set_express_total_copy: '',
        isUpdate: false,
      }) as any;

      const loading = ref(false);
      let updataId;
      const icdList = ref([]);

      // 是否付款1 isPay
      let isPay;

      //处方确认
      const prescriptionConfirmation = ref(false);
      const isDisabledSelect = ref(false);

      const userStore = useUserStore();
      const userinfo = computed(() => userStore.getUserInfo);

      let isFrist = true;
      let isQuery;
      // 只有挂号入口router才有
      const { currentRoute } = useRouter();
      // const { query } = unref(currentRoute);
      const { query } = unref(currentRoute);
      const tisanes_type = ref(1);
      onMounted(async () => {
        // openQrcodeModal(true);
        getIdempotentTokenAction();
        // 如果 机构id为163、166，禁用剂型、药房
        isDisabledSelect.value =
          userinfo.value.organization_id == 163 || userinfo.value.organization_id == 166;
        if (query.doctor_id) {
          isQuery = true;
          formState.doctor_id = query.doctor_id;
          formState.doctor_name = query.doctor_name;
          formState.order_sn = query.order_sn;
          formState.quick_id = query.id;
          formState.patient_id = query.paid; // 患者ID
          formState.patient_name = query.patient_name; // 患者姓名
          formState.patient_sex = query.patient_sex == '女' ? '0' : '1'; // 患者性别
          formState.patient_age = query.patient_age; // 患者年龄
          formState.patient_mobile = query.patient_mobile; // 患者手机号
          formState.dept_id = query.dept_id;
          formState.dept_name = query.dept_name;
          getPharmacyList();
        }

        getIcdList();

        loading.value = true;
        if (query.action === 'updata' || query.action === 'again') {
          updataId = query.id;
          isPay = query.isPay;
          getPrescription(query.id).then((res: any) => {
            console.log(res, '----------1212121');
            formState.doctor_express_type = res.order.doctor_express_type;
            sonRef.value.getType();
            formState.express_type = String(res.express_type);
            formState.pres_visible = Number(res.pres_visible);
            formState.status = 10;
            formState.orderType = 'updata';
            formState.status_name = res.status_name;
            formState.examine_status = 4;
            formState.consultation_fee = res.consultation_fee;
            formState.express_fee = res.express_fee;
            formState.pay_status = res.order?.pay_status;
            formState.patient_id = res.patient_id;
            formState.patient_name = res.patient_name;
            formState.patient_sex = String(res.patient_sex);
            formState.patient_age = res.patient_age;
            formState.patient_descr = res.patient_descr;
            formState.patient_mobile = res.patient_mobile;
            formState.doctor_id = String(res.doctor_id);
            formState.doctor_name = res.doctor_name;

            formState.dept_id = res.dept_id;
            formState.dept_name = res.dept_name;
            formState.set_express_total = res.set_express_total;
            formState.set_express_total_copy = res.set_express_total;
            if (res.set_express_total != '') {
              formState.isUpdate = true;
            }

            doctor.value = {
              department: res.dept_name,
              department_id: res.dept_id,
              doctor_title: res.doctor_job_title,
              hospital_id: res.hospital_id,
              hospital_name: res.hospital_name,
              did: res.doctor_id,
              title: res.doctor_name,
            };

            formState.icd_ids = res.icd_ids;
            formState.audit_reason = res.audit_reason;
            formState.audit_status = res.audit_status;

            formState.usage1 = res.usage1;

            if (res.tisanes_way == 1 || res.tisanes_way == 3) {
              formState.tisanes_way = '自煎';
            } else {
              formState.tisanes_way = '代煎';
            }
            //用来判断新开处方默认代煎 修改处方默认接口返回值
            tisanes_type.value = 2;
            // formState.tisanes_way = res.tisanes_way;

            console.log(res.tisanes_way, '00000');
            console.log(formState.tisanes_way, '222222');
            formState.tisanes_detail = res.tisanes_detail
              ? {
                  // 煎药详情
                  total_dosage: res.tisanes_detail.total_dosage, // 剂数
                  every_dosage: res.tisanes_detail.every_dosage, // 每剂分多少次
                  every_bag: res.tisanes_detail.every_bag,
                  every_day: res.tisanes_detail.every_day,
                  every_time: res.tisanes_detail.every_time,
                }
              : [];
            const arr = (res.matter || '').split(',');
            formState.matter = arr[arr.length - 1];
            formState.times = arr[0];
            formState.taboos = arr.splice(1, arr.length - 2);
            // formState.make = arr[arr.length - 1];
            formState.drugType = res.drug_type;

            if (res.drug_type == 1) {
              // 中药
              CMedicineList.value = res.prescript_drug.map((item) => {
                return {
                  id: item.id,
                  value: item.drug_name,
                  name: item.drug_name,
                  drug_name: item.drug_name,
                  drug_type: item.drug_type,
                  number: item.number,
                  autograph: item.autograph,
                  unit: item.unit,
                  unit_price: item.unit_price,
                  retail_price: item.unit_price,
                  usage: item.usage,
                  specs: item.specs,
                  drug_id: item.drug_id,
                  process_cost: item.process_cost,
                  stock_num: item.stock_num,
                  weight: item.weight,
                };
              });
            } else {
              // 西药
              res.prescript_drug.map((item) => {
                WMedicineList.value.unshift({
                  id: item.id,
                  drug_name: item.drug_name,
                  drug_type: item.drug_type,
                  number: item.number,
                  autograph: item.autograph,
                  unit_price: item.unit_price,
                  usage: item.usage,
                  drug_id: item.drug_id,
                  name: item.drug_name,
                  unit: '盒',
                  usage_day: item.medication_days,
                  retail_price: item.unit_price,
                  specs: item.specs,
                  value: item.drug_name,
                  loading: false,
                  offline_share: 0,
                  online_share: 0,
                  key: Date.now() + parseInt(Math.random() * (1000 + 1), 10),
                });
              });
            }
            // formState.pharmacy_id = String(res.pharmacy_id);
            resPharmacyId.value = String(res.pharmacy_id);
            resDosage.value = res.dosage_form;

            getPharmacyList();

            // 剂型list
            // getBasics({ type: 1 }).then((response) => {
            //   dosageForm.list = response;
            //   // 药房list
            //   handleChangeDosage(formState.dosage_form).then(() => {
            //     formState.pharmacy_id = String(res.pharmacy_id);
            //     // 最后算药费
            //     processingFee(formState.pharmacy_id);
            //     loading.value = false;
            //     if (res.drug_type == 2) {
            //       nextTick(() => {
            //         reload();
            //       });
            //     }
            //   });
            // });
            loading.value = false;
          });
        } else {
          loading.value = false;
        }
      });

      const rules = {
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

      const doctors = ref<any>({});
      const doctorMaps = ref<any>({});

      const medicamentOptionTimes = ref<any>({});

      const dosageForm = reactive({
        list: [] as any,
      });

      // 获取诊断列表
      const getIcdList = (key = '') => {
        getPrescriptIcd({ key }).then((res) => {
          icdList.value = res.list.map((item) => {
            return {
              value: item.name,
              data: item,
            };
          });
        });
      };

      // getBasics({type: 2}).then((response) => {
      //   console.log(response);
      // });

      getBasics({ type: 3 }).then((response) => {
        medicamentOptionTimes.value = response;
        formState.times = response[0].title;
      });

      const mtOptions = ref<any>([]);
      getBasics({ type: 4 }).then((response) => {
        let list = [];
        for (const item of response) {
          list.push({
            label: item.title,
            value: item.title,
          });
        }
        mtOptions.value = list;
      });

      getOrganizationDoctorList({}).then((response) => {
        let list = [];
        for (const item of response) {
          doctorMaps[String(item.id)] = item;
          item.id = String(item.id);
          item.did = String(item.did);
          list.push(item);
        }

        doctors.value = list;
      });

      // 医生变化
      const sonRef = ref();
      const doctor = ref<any>({});
      const prescription = ref();
      const handleDoctorChange = (doctorId: number) => {
        doctor.value = doctorMaps[String(doctorId)];
        console.log(doctor.value);
        formState.doctor_name = doctor.value.title;
        formState.dept_id = doctor.value.department_id;
        formState.dept_name = doctor.value.department;
        getPharmacyList();
      };
      // 获取手机号焦点
      const patientMobileBlur = () => {
        // if (formState.doctor_id) {
        //   prescription.value.getPrescriptListApiSync();
        // }
      };
      // 获取药房列表
      const getPharmacyList = () => {
        let id, params;
        if (isQuery) {
          id = 0;
          params = { doctor_id: doctor.value.did || formState.doctor_id };
        } else {
          id = 0;
          params = { doctor_id: formState.doctor_id || doctor.value.did };
        }
        getPharmacyListApi(id, params).then((res) => {
          if (res.list.length) {
            pharmacyLists.value = res.list.map((item) => {
              item.pharmacy_id = String(item.pharmacy_id);
              return item;
            });

            echoPharmacyId.value = res.list.filter((item) => {
              return item.pharmacy_id == resPharmacyId.value;
            });
          }
          formState.free_delivery = res.deliveries.free_delivery;
          formState.free_delivery_limit = res.deliveries.free_delivery_limit;
          // pharmacyLists.value = (res.list.length ? res.list : res.all).map((item) => {
          //   item.pharmacy_id = String(item.pharmacy_id);
          //   return item;
          // });

          const defaultArr = res.list.filter((item) => {
            return item.isdefault == 1;
          });
          if (!(isFrist && updataId)) {
            if (defaultArr.length) {
              formState.pharmacy_id = String(defaultArr[0].pharmacy_id);
              getDosageList();
            } else {
              formState.pharmacy_id = '';
              formState.dosage_form = '';
              formState.dosage_id = '';
              dosageForm.list = [];
              loading.value = false;
            }
          } else {
            if (echoPharmacyId.value.length > 0) {
              formState.pharmacy_id = resPharmacyId.value;
              formState.dosage_form = resDosage.value;
              getDosageList();
            } else {
              formState.pharmacy_id = '';
              formState.dosage_form = '';
              formState.dosage_id = '';
              dosageForm.list = [];
              loading.value = false;
              isFrist = false;
            }
          }
          // if (formState.patient_mobile) {
          //   prescription.value.getPrescriptListApiSync();
          // }
          sonRef.value.handlechangeExpressTotal();
        });
      };
      // 获取剂型列表
      const getDosageList = () => {
        getDosageListApi(formState.pharmacy_id).then((res) => {
          dosageForm.list = res.list;
          if (res.list?.length) {
            if (!(isFrist && updataId)) {
              handleChangeDosage(res.list[0].title);
              formState.dosage_form = res.list[0].title;
              formState.dosage_id = res.list[0].id;
            } else {
              handleChangeDosage(formState.dosage_form);
            }
            processingFee();
          }
        });
      };

      const handleWestStockCheck = (record) => {
        if (record.number > record.stock_num) {
          error(record?.name + '库存不足，当前库存' + record?.stock_num + record?.unit);
          const index = WMedicineList.value.indexOf(record);
          WMedicineList.value[index].numner = record.storck.number;
        }
      };
      const handleBlur = (item) => {
        if (isNaN(item.number) || !item.number || item.number <= 0) item.number = '';
      };

      const handleBlurTable = (val, index, key) => {
        if (isNaN(val) || !val || val <= 0) WMedicineList.value[index][key] = 1;
      };

      const pharmacyLists = ref<any>([]);

      const tipsText = computed(() => {
        let str = '';

        if (formState.set_express_total === 0) {
          str = '包含快递费';
          return str;
        }

        if (formState.set_express_total === '' || formState.set_express_total === null) {
          console.log('是否包邮！！！！！！');
          str = '不包含快递费';
          return str;
        }
        if (
          formState.free_delivery == 1 &&
          Number(comMedicalFee.value) > formState.free_delivery_limit
        ) {
          str = '不包含快递费';
        } else {
          str = '包含快递费';
        }
        return str;
      });

      const handleChangeDosage = (e) => {
        const obj = dosageForm.list.find((item) => e.indexOf(item.title) !== -1);
        formState.dosage_form = e;
        formState.dosage_id = obj.id;
        console.log(obj.id, '------');
        console.log(formState.tisanes_way, '------');
        if (obj.id == 1) {
          // if (formState.tisanes_way == 1) {

          // formState.tisanes_way = '代煎';
          if (tisanes_type.value == 2 && formState.tisanes_way == '自煎') {
            formState.tisanes_way = '自煎';
          } else {
            formState.tisanes_way = '代煎';
          }
        } else {
          formState.tisanes_way = '自煎';
          // // if (formState.tisanes_way == 1) {
          // if (formState.tisanes_way == '代煎') {
          //   formState.tisanes_way = '自煎';
          // } else {
          //   formState.tisanes_way = '代煎';
          // }
        }
        console.log(formState.tisanes_way, '------');
        formState.drugType = e === '西药与中成药' ? 2 : 1;

        // 默认 “购药后可见药材名和克数”、“仅购药后可见”
        if (!(isFrist && updataId)) {
          formState.pres_visible = formState.drugType === 1 ? 5 : 6;
        }
        isFrist = false;
        options.value = [];

        if (formState.drugType === 1) {
          let list = CMedicineList.value;
          list.map((m) => {
            m.isLack = true;
          });
          let arr = list.map((item) => {
            return getChineseDrug({
              pharmacy_id: formState.pharmacy_id,
              doctor_id: formState.doctor_id,
              name: item.name,
            });
          });
          // console.log(arr);
          if (arr.length) {
            Promise.all(arr).then((res) => {
              // console.log(arr);
              res.map((item: any) => {
                list.filter((j) => {
                  undefined;
                  item.find((m) => {
                    undefined;
                    if (j.name == m.name) {
                      undefined;
                      return (
                        (j.drug_id = m.drug_id),
                        (j.retail_price = m.retail_price),
                        (j.unit_price = m.retail_price),
                        (j.stock_num = m.stock_num),
                        (j.isLack = m.stock_num === 0 ? true : false)
                      );
                    }
                  });
                });
              });
            });
          }
        } else {
          let arr = [];
          WMedicineList.value.map((item: any) => {
            if (item.name) {
              arr.push(
                getWesterDrug({
                  pharmacy_id: formState.pharmacy_id,
                  doctor_id: formState.doctor_id,
                  name: item.name,
                })
              );
            }
          });
          if (arr.length) {
            Promise.all(arr).then((res) => {
              res.map((item, index) => {
                WMedicineList.value[index].isLack = item.length === 0;
              });
            });
          }
        }
        processingFee();
      };

      const handleSignName = (index: number) => {
        CMedicineList.value[index].autograph = doctor.value?.title || formState.doctor_name;
      };

      const totalDrugCost = computed(() => {
        if (formState.drugType === 1) {
          if (CMedicineList.value.length > 0) {
            let total = 0.0;
            for (const item of CMedicineList.value) {
              if (!item.number || item.number === '0' || isNaN(item.number)) {
                return (total = -1);
              }
              const price = BigNumber(item.retail_price);
              total = price.multipliedBy(item.number).plus(total);
            }
            return isNaN(total) ? 0 : total;
          }
          return 0.0;
        } else {
          if (WMedicineList.value.length > 0) {
            let total = 0.0;
            for (const item of WMedicineList.value) {
              if (!item.number || item.number === '0' || isNaN(item.number)) {
                return (total = -1);
              }
              const price = BigNumber(item.retail_price);
              total = price.multipliedBy(item.number).plus(total);
            }
            return isNaN(total) ? 0 : total;
          }
          return 0.0;
        }
      });
      provide('totalDrugCost', totalDrugCost);

      const medicineNumber = computed(() => {
        let num = 0;
        if (formState.drugType == 1) {
          num = CMedicineList.value.length;
        }
        return num;
      });
      const grammage = computed(() => {
        let num: any = 0;
        if (formState.drugType == 1) {
          let list = CMedicineList.value;
          list.map((m) => {
            num = parseFloat(num + Number(m.number) * Number(m.weight));
          });
          // num
        }
        return num.toFixed(2);
      });

      const handleCheckMedicineStock = (index, item) => {
        if (item.number > item.stock_num) {
          error(item.name + '库存不足,当前库存' + item.stock_num + item.unit);
          CMedicineList.value[index].number = item.stock_num;
        }
        // if (!item.number || item.number == 0) {
        //   error('请输入用量');
        // }
      };
      const getfocus = (event) => {
        event.currentTarget.select();
      };
      const handleClear = () => {
        createConfirm({
          iconType: 'info',
          title: '该患者的处方已提交成功，是否清空当前页面的药材？',
          content: `您可选择清空当前页面的药材，也可保留药材给下一个患者复用调方`,
          okText: '清空',
          cancelText: '不清空',
          onOk: async () => {
            if (formState.drugType === 1) {
              // 中药
              CMedicineList.value = [];
              // formState.patient_name.value = ''
              // formState.patient_age.value = ''
              // formState.patient_mobile.value = ''
              // formState.patient_sex.value = ''
            } else {
              WMedicineList.value.splice(0, WMedicineList.value.length - 1);
              // formState.patient_name.value = '';
              // formState.patient_age.value = '';
              // formState.patient_mobile.value = '';
              // formState.patient_sex.value = '';
            }

            formState.drugType == 1
              ? (modelState.znMedicineName = '')
              : (modelState.westMedicineName = '');
          },
        });
      };

      const handleClearU = () => {
        createConfirm({
          iconType: 'info',
          title: '提示',
          content: `是否确认清空处方？`,
          okText: '清空',
          cancelText: '不清空',
          onOk: async () => {
            if (formState.drugType === 1) {
              // 中药
              CMedicineList.value = [];
              //   formState.patient_name.value = ''
              // formState.patient_age.value = ''
              // formState.patient_mobile.value = ''
              // formState.patient_sex.value = ''
            } else {
              WMedicineList.value.splice(0, WMedicineList.value.length - 1);
              //   formState.patient_name.value = ''
              // formState.patient_age.value = ''
              // formState.patient_mobile.value = ''
              // formState.patient_sex.value = ''
            }

            formState.drugType == 1
              ? (modelState.znMedicineName = '')
              : (modelState.westMedicineName = '');
          },
        });
      };

      const labelCol = {
        style: {
          width: '90px',
        },
      };
      const wrapperCol = { span: 24 };
      const options = ref([]);
      const isDecotion = ref([]) as any;

      const CMedicineList = ref([]) as any; // 中药材列表
      const currentDecotions = ref('');

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

      const modelState = reactive({
        znMedicineValue: false,
        znMedicineName: '',
        westMedicineValue: false,
        westMedicineName: '',
      });

      const [registerPrescriptionDrawer, { openDrawer }] = useDrawer();

      const handlePrescriptionModel = (record) => {
        if (!formState.patient_mobile) {
          error('请填写患者手机号!');
          return;
        }

        if (!formState.doctor_id) {
          error('请先选择医生!');
          return;
        }

        if (!formState.pharmacy_id) {
          error('请先选择药房!');
          return;
        }
        openDrawer(true, {
          doctor_id: formState.doctor_id,
          pharmacy_id: formState.pharmacy_id,
          patient_id: formState.patient_id,
          patient_mobile: formState.patient_mobile,
          drugType: formState.drugType,
        });
      };

      const handleUpdateMedicineList = (data: any) => {
        // console.log(data);
        if (data.type === 1) {
          // CMedicineList.value = data.list;
          let arr: any = [];
          data.list.map((m) => {
            arr.push({
              id: m.id,
              value: m.drug_name,
              name: m.drug_name,
              drug_name: m.drug_name,
              drug_type: m.drug_type,
              number: m.number,
              autograph: '',
              unit: m.unit,
              unit_price: m.unit_price,
              retail_price: m.unit_price,
              usage: m.usage,
              specs: m.specs,
              drug_id: m.drug_id,
              process_cost: m.process_cost,
              stock_num: m.stock_num,
              weight: m.weight,
              isLack: true,
            });
          });

          let defArr = CMedicineList.value;
          let newArr: any = [];
          const by = (item) => item['drug_id'];
          // console.log(defArr);
          if (defArr.length > 0) {
            // CMedicineList.value = newArr;
            newArr = [...arr, ...defArr];
            const _highest = newArr.reduce((groups, item) => {
              // 获取 item 的分组的 key
              const key = by(item);
              // console.log(key, item);
              // 看看这个组是不是已经存在
              let group = groups.find((g) => {
                // console.log(g, item);
                let result = {};
                if (g.key == key) {
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
            updateCmList(_highest);
          } else {
            updateCmList(arr);
          }
          modelState.znMedicineName = data.name.toString();
        }

        if (data.type === 2) {
          data.list.map((item) => {
            WMedicineList.value.unshift({
              id: item.id,
              drug_name: item.drug_name,
              drug_type: item.drug_type,
              number: item.number,
              autograph: item.autograph || '',
              unit_price: item.unit_price,
              usage: item.usage,
              drug_id: item.drug_id,
              name: item.drug_name,
              unit: item.unit,
              usage_day: item.medication_days,
              retail_price: item.unit_price,
              specs: item.specs,
              value: item.drug_name,
              loading: false,
              offline_share: 0,
              online_share: 0,
              key: Date.now() + parseInt(Math.random() * (1000 + 1), 10),
              isLack: true,
            });
          });

          updateWmList(WMedicineList.value);
          modelState.westMedicineValue = data.name.toString();
          reload();
        }
        // console.log(data, WMedicineList);
      };
      const updateCmList = (arr) => {
        let chechkArr = arr.map((item) => {
          // console.log(item);
          return getChineseDrug({
            pharmacy_id: formState.pharmacy_id,
            doctor_id: formState.doctor_id,
            name: item.name,
          });
        });
        // let list = useClinicalReceptionStore().CMedicineList;
        if (chechkArr.length) {
          return Promise.all(chechkArr).then((res) => {
            // console.log(res);
            res.map((item: any) => {
              arr.filter((j) => {
                undefined;
                item.find((m) => {
                  undefined;
                  if (j.name == m.name) {
                    undefined;
                    return (
                      (j.drug_id = m.drug_id),
                      (j.retail_price = m.retail_price),
                      (j.unit_price = m.retail_price),
                      (j.stock_num = m.stock_num),
                      (j.isLack = m.stock_num === 0 ? true : false)
                    );
                  }
                });
              });
            });
            // console.log(arr);
            CMedicineList.value = [];
            CMedicineList.value = arr;
          });
        }
      };

      const updateWmList = (arr) => {
        let chechkArr = arr.map((item) => {
          return getWesterDrug({
            pharmacy_id: formState.pharmacy_id,
            doctor_id: formState.doctor_id,
            name: item.name,
          });
        });
        if (chechkArr.length) {
          Promise.all(chechkArr).then((res) => {
            // console.log(res);
            res.map((item: any) => {
              arr.filter((j) => {
                undefined;
                item.find((m) => {
                  undefined;
                  if (j.name == m.name) {
                    undefined;
                    return (
                      (j.drug_id = m.drug_id),
                      (j.retail_price = m.retail_price),
                      (j.unit_price = m.retail_price),
                      (j.isLack = m.stock_num == 0 ? true : false),
                      (j.medication_days = m.medication_days),
                      (j.stock_num = m.stock_num)
                    );
                  }
                });
              });
            });
            setTableData(arr);
          });
        } else {
          setTableData(arr);
        }
      };
      const mubanModal = ref(false);
      const saveModelClick = (v) => {
        if (!formState.doctor_id) {
          formState.drugType == 1
            ? (modelState.znMedicineValue = false)
            : (modelState.westMedicineValue = false);
          error('请先选择医生!');
          return;
        }
        let mList = formState.drugType == 1 ? CMedicineList.value : WMedicineList.value;
        if (mList.length <= 0) {
          formState.drugType == 1
            ? (modelState.znMedicineValue = false)
            : (modelState.westMedicineValue = false);
          error('请添加模版方药材!');
          return;
        }
        if (mList.some((item) => item.number == '')) return error('请输入药材克数!');
        modelState.znMedicineName = '';
        mubanModal.value = true;
      };
      const handleSavePrescriptionModel = async (v) => {
        // console.log(v.target.checked);
        // if (v.target.checked) {
        let mList = formState.drugType == 1 ? CMedicineList.value : WMedicineList.value;
        let comminly_name =
          formState.drugType == 1 ? modelState.znMedicineName : modelState.westMedicineName;
        if (!comminly_name) {
          formState.drugType == 1
            ? (modelState.znMedicineValue = false)
            : (modelState.westMedicineValue = false);
          error('请填写模版方名称!');
          return;
        }
        let params = {
          drug_type: formState.drugType,
          doctor_id: formState.doctor_id,
          drug_json: JSON.stringify(mList),
          comminly_name: comminly_name,
        };
        try {
          const data = await getPrescriptAddApi(params);
          mubanModal.value = false;
          success('处方模版保存成功!');
        } catch (error) {
          formState.drugType == 1
            ? (modelState.znMedicineValue = false)
            : (modelState.westMedicineValue = false);
          console.log(error);
        }
        // }
        // modelState.znMedicine.value
        // modelState.westMedicine.value
      };

      // 药名称medicineNamevalue
      const medicineNamevalue = ref('');
      // 用量输入框
      const numRef = ref();
      const numRef2 = ref(),
        warnMsgShow = ref(false);
      const onSelect = (value, data) => {
        if (data.data.stock_num < 1) {
          error(data.data.name + '缺货,请更换其他药材!');
          return false;
        }
        const listIndex = CMedicineList.value.findIndex((item) => data.data.name === item.name);
        if (listIndex !== -1) {
          error(data.data.name + '已存在于处方单中, 请勿重复添加!');
          nextTick(() => {
            medicineNamevalue.value = '';
          });
          return;
        }
        if (formState.drugType === 1) {
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
          nextTick(() => {
            medicineNamevalue.value = '';
            if (isMultiRow.value) {
              numRef.value.focus();
            } else {
              numRef2.value.focus();
            }

            setTimeout(() => {
              if (isMultiRow.value) {
                numRef.value.focus();
              } else {
                numRef2.value.focus();
              }
              warnMsgShow.value = true;
            }, 300);
          });
        } else {
          /*const indexs = WMedicineList.value.indexOf(value);
        console.log(indexs, WMedicineList.value.length);
        if(indexs === WMedicineList.value.length-1) {
          WMedicineList.value.push({
            id: 0,
            drug_name: '',
            drug_type: '',
            number: 1,
            autograph: '',
            unit_price: '',
            usage: '',
            drug_id: 0,
            name: '',
            unit: '盒',
            retail_price: '',
            specs: '',
            value: '',
            loading: false,
            offline_share: 0,
            online_share: 0,
            key: Date.now()+parseInt(Math.random()*(10000+1),10),
          });
        }*/
        }
      };

      // 用量回车事件
      const cmedicineRef = ref();
      const cmedicineRef2 = ref();
      const useEnter = () => {
        if (isMultiRow.value) {
          cmedicineRef.value.focus();
        } else {
          cmedicineRef2.value.focus();
        }
      };

      const onWestSelect = (value, data, record) => {
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

      const handleSearch = (value) => {
        if (!formState.doctor_id) {
          error('请先选择医生!');
          return;
        }

        if (!formState.pharmacy_id) {
          error('请先选择药房!');
          return;
        }
        if (formState.drugType == 1) {
          const params = {
            pharmacy_id: formState.pharmacy_id,
            doctor_id: formState.doctor_id,
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
            options.value = names;
          });
        } else {
          const params = {
            pharmacy_id: formState.pharmacy_id,
            doctor_id: formState.doctor_id,
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
        }
      };

      const handleAddDecotionItem = (index: number, name: string) => {
        currentDecotions.value = name;
      };

      const handleSaveDecotion = (index: number) => {
        CMedicineList.value[index].usage = currentDecotions.value;
        isDecotion.value[index] = false;
      };

      const handleKeyPress = () => {};

      // 删除药材列表
      const handleDeleteMedicine = (index: number) => {
        if (formState.drugType === 1) {
          // 中药
          CMedicineList.value.splice(index, 1);
        }
      };

      // 添加煎法
      const handleAddDecotion = (index) => {
        isDecotion.value = [];
        isDecotion.value[index] = true;
        currentDecotions.value = CMedicineList.value[index].usage;
      };

      // 添加煎法关闭
      const handleCloseDecotion = (index) => {
        isDecotion.value[index] = false;
      };
      const submitPharmacy = ref();
      const WMedicineListSum = ref<any>([]);
      const btnClick2 = _.debounce(function () {
        // handleSubmit(1);
        formRef.value.validate().then((res) => {
          prescriptionConfirmation.value = true;
          console.log(formState);
          console.log(WMedicineList.value);
          WMedicineListSum.value = WMedicineList.value;
          pharmacyLists.value.map((item) => {
            if (
              Number(formState.pharmacy_id) == item.pharmacy_id ||
              formState.pharmacy_id == item.pharmacy_id
            ) {
              if (formState.drugType == 1) {
                submitPharmacy.value = item.pharmacy_sub_name;
              }
              if (formState.drugType == 2) {
                submitPharmacy.value = item.pharmacy_name;
              }
            }
          });
        });
      }, 500);
      const prescriptionModalCancel = () => {
        prescriptionConfirmation.value = false;
      };
      const prescriptionModalOk = () => {
        prescriptionConfirmation.value = false;
        handleSubmit();
      };
      const handleSubmit = () => {
        formRef.value
          .validate()
          .then(() => {
            const newFormState = JSON.parse(JSON.stringify(formState));
            console.log(newFormState);
            newFormState.drug_type = formState.drugType;
            newFormState.patient_age_type = 1;
            if (newFormState.doctor_express_type) {
              newFormState.doctor_express_type == 1
                ? 1
                : newFormState.doctor_express_type == 2
                ? 2
                : 0;
            } else {
              newFormState.doctor_express_type = 0;
            }

            if (doctor.value?.title) {
              newFormState.hospital_id = doctor.value?.hid || 0;
              newFormState.hospital_name = doctor.value?.hospital_name || '';
              newFormState.doctor_name = doctor.value?.title;
              newFormState.dept_name = doctor.value.department;
              newFormState.doctor_job_title = doctor.value.doctor_title;
            }
            newFormState.dept_id = formState.dept_id;
            // newFormState.dept_id = 0;
            const newTaboosArr = Array.from(new Set(formState.taboos));
            newFormState.matter = [
              ...[formState.times],
              ...newTaboosArr,
              ...[formState.matter],
            ].join(',');
            if (newFormState.matter == ',') newFormState.matter = '';
            newFormState.medical_fee = comMedicalFee.value;
            // 医药费：medical_service_fee暂且用药品费用，后面说了再改！！！！！！！！！
            newFormState.medical_service_fee = newFormState.medical_fee;
            newFormState.incr_price = 0;
            newFormState.consultation_fee = comConsultationFee.value; // 诊金
            newFormState.process_fee = comProcessCost.value; // 加工费
            newFormState.total_fee = comTotal.value;

            if (
              newFormState.free_delivery == 1 &&
              Number(newFormState.medical_fee) > Number(newFormState.free_delivery_limit)
            ) {
              newFormState.doctor_express_type = 0;
            }
            console.log(newFormState.set_express_total, '99999999');
            console.log(newFormState.doctor_express_type, '0000000');
            if (newFormState.doctor_express_type == 2) {
              delete newFormState.set_express_total;
            }
            if (formState.drugType === 1) {
              // 重要
              newFormState.dosage_num = formState.tisanes_detail.total_dosage;
              newFormState.tisanes_way = '';

              newFormState.tisanes_detail = {};

              let drugs = { chinese_drug: [] };
              for (const item of CMedicineList.value) {
                if (item.isLack) return error('请核对缺货药材！');
                // item.autograph = doctor.value?.title || formState.doctor_name
                item.drug_name = item.name;
                item.unit_price = item.retail_price;
                item.value = item.name;
                drugs.chinese_drug.push(item);
              }
              newFormState.chinese_drug = JSON.stringify(drugs);
              if (drugs.chinese_drug.length == 0) return error('请输入药材信息');
              newFormState.tisanes_way = formState.tisanes_way === '自煎' ? 1 : 2;
              if (newFormState.tisanes_way === 1) {
                newFormState.tisanes_detail = {
                  total_dosage: formState.tisanes_detail.total_dosage,
                  total_dosage_label: formState.tisanes_detail.total_dosage + '剂',
                  every_dosage: formState.tisanes_detail.every_dosage,
                  every_dosage_label:
                    '每日1剂，1 剂分' + formState.tisanes_detail.every_dosage + '次服用',
                };
                newFormState.tisanes_detail = JSON.stringify(newFormState.tisanes_detail);
              } else {
                if (
                  !formState.tisanes_detail.every_bag ||
                  !formState.tisanes_detail.every_day ||
                  !formState.tisanes_detail.every_time
                ) {
                  error('请输入每日用量');
                  return;
                }
                newFormState.tisanes_detail = {
                  total_dosage: formState.tisanes_detail.total_dosage,
                  total_dosage_label: formState.tisanes_detail.total_dosage + '剂',
                  every_dosage: formState.tisanes_detail.every_dosage,
                  every_dosage_label: formState.tisanes_detail.every_dosage + '袋',
                  every_day: formState.tisanes_detail.every_day,
                  every_day_label: formState.tisanes_detail.every_day + '次',
                  every_bag: formState.tisanes_detail.every_bag,
                  every_bag_label: formState.tisanes_detail.every_bag + 'ml',
                  every_time: formState.tisanes_detail.every_time,
                  every_time_label: formState.tisanes_detail.every_time + '袋',
                };
                newFormState.tisanes_detail = JSON.stringify(newFormState.tisanes_detail);
              }
            } else {
              // 西药
              // newFormState.dosage_num = 1;
              newFormState.tisanes_way = '';
              newFormState.tisanes_detail = '{}';
              let drugs = { chinese_drug: [] };
              for (const item of WMedicineList.value) {
                if (item.isLack) return error('请核对缺货药材！');
                if (item.name) {
                  item.drug_name = item.name;
                  item.unit_price = item.retail_price;
                  item.value = item.name;
                  item.quantity = item.number;
                  item.medication_days = item.usage_day;
                  drugs.chinese_drug.push(item);
                }
              }
              newFormState.chinese_drug = JSON.stringify(drugs);
            }

            if (formState.drugType === 1) {
              newFormState.is_doctor_signed = !ischeck.value;
            }

            newFormState.idempotent_token = idempotentToken.value;
            if (!updataId || query.action == 'again') {
              console.log('111111111111111111111111111111111111');
              // 抄录处方
              createPrescript(newFormState);
            } else {
              console.log('22222222222222222222222222222222222222222222');
              // 更新处方
              updatePrescript({ ...{ id: updataId }, ...newFormState });
            }
          })

          .catch(() => {
            error('请检查必填项!');
          });
      };

      // 抄录处方
      const createPrescript = (params) => {
        getIdempotentTokenAction(); // 重新获取获取新幂等token
        createPrescription(params).then((response) => {
          if (response?.errors !== undefined && response?.data === undefined) {
            saveArray.value = response.errors;
            isshow.value = true;
          } else {
            handlePayment(response.data.prescript_id, 'myself', 2, 1, formState);

            formState.patient_name = '';
            formState.patient_age = '';
            formState.patient_mobile = '';
            formState.patient_sex = '';
            formState.doctor_express_type = '';
            sonRef.value.clear();
            ischeck.value = true;
            formState.patient_descr = '';
            formState.icd_ids = 0;
            formState.pay_image_base64 = response.data.image_base64;
          }
        });
      };

      // 修改处方
      const updatePrescript = (params) => {
        getIdempotentTokenAction(); // 重新获取获取新幂等token
        prescriptSave(params).then((response) => {
          if (response?.errors !== undefined && response?.data === undefined) {
            saveArray.value = response.errors;
            isshow.value = true;
          } else {
            handlePayment(response.data.prescript_id, 'myself', 2, 1, formState);

            formState.patient_name = '';
            formState.patient_age = '';
            formState.patient_mobile = '';
            formState.patient_sex = '';
            formState.doctor_express_type = '';
            sonRef.value.clear();
            ischeck.value = true;
            formState.patient_descr = '';
            formState.icd_ids = 0;
            formState.pay_image_base64 = response.data.image_base64;
          }
        });
      };

      const saveData = (params) => {
        prescriptSave(params).then((res: any) => {
          if (res.length > 0) {
            saveArray.value = res;
            isshow.value = true;
          } else {
            formState.patient_name = '';
            formState.patient_age = '';
            formState.patient_mobile = '';
            formState.patient_sex = '';
            formState.doctor_express_type = '';
            sonRef.value.clear();
            ischeck.value = true;
            success('处方抄录成功!您可以继续给下一个患者开处方');
            if (isCreate.value === true) {
              isCreate.value = false;
              getIdempotentTokenAction();
              formState.patient_descr = '';
              formState.icd_ids = 0;
            }
            if (isPay) {
              cancelModal();
              return;
            }
            handlePayment(res.prescript_id, 'myself', 2, 1, formState);
          }
        });
      };
      const close = () => {
        isshow.value = false;
        ischeck.value = false;
        handleSubmit();
      };
      const closeModel = () => {
        isshow.value = false;
        // ischeck.value = false;
        // handleSubmit();
      };

      function handlePayment(
        id,
        type: string,
        paymentType: number,
        paymentPayer: number,
        formState: any
      ) {
        openQrcodeModal(true, {
          type: type,
          paymentType: paymentType,
          paymentPayer: paymentPayer,
          orderId: id,
          patientName: formState.patient_name,
          record: formState,
          a: '111',
        });
      }

      const handleClearWest = () => {
        createConfirm({
          iconType: 'info',
          title: '提示',
          content:
            '该患者的处方已提交成功，是否清空当前页面的药材？您可选择清空当前页面的药材，也可保留药材给下一个患者复用调方。',
          onOk: async () => {
            WMedicineList.value.splice(0, WMedicineList.value.length - 1);
          },
        });
      };

      const handleDetailWest = (record) => {
        if (record.id === 0) {
          return;
        }
        const index = WMedicineList.value.indexOf(record);
        WMedicineList.value.splice(index, 1);
      };

      const westDeleteAble = computed(() => {
        return WMedicineList.value.length > 1;
      });

      const prescriptionVisible = computed(() => {
        if (formState.drugType === 1) {
          return [
            {
              id: 1,
              title: '购药前后均可见',
            },
            {
              id: 2,
              title: '购药前后均不可见',
            },
            {
              id: 3,
              title: '购药前后只可见药材名',
            },
            {
              id: 4,
              title: '仅购药后可见药材名',
            },
            {
              id: 5,
              title: '仅购药后可见药材名和克数',
            },
          ];
        } else {
          return [
            {
              id: 1,
              title: '购药前后均可见',
            },
            {
              id: 2,
              title: '购药前后均不可见',
            },
            {
              id: 6,
              title: '仅购药后可见',
            },
          ];
        }
      });

      const keyword = ref<string>('');
      const searchParams = computed<Recordable>(() => {
        return { params: unref(keyword) };
      });

      function onSearch(value: string) {
        keyword.value = value;
      }

      const changeNum = ref(false);
      const onPatientChange = (record) => {
        changeNum.value = true;
        patientsSearchShow.value = false;
        formState.patient_name = record.name;
        formState.patient_age = record.age;
        formState.patient_id = record.id;
        formState.patient_mobile = record.phone;
        formState.patient_sex = String(record.sex);
      };

      const patients = ref<any>([]);
      const patientsSearchShow = ref<any>(false);
      function getPatientsAction() {
        const patientName = formState.patient_name.replace(/(^\s*)|(\s*$)/g, '');
        formState.patient_name = patientName;
        formState.patient_age = 0;
        formState.patient_id = 0;
        formState.patient_mobile = '';

        if (patientName == '') {
          return;
        }
        getPatients({ params: patientName }).then((response) => {
          patients.value = response;
          patientsSearchShow.value = response.length > 0;
        });
      }

      function patientsSearchDisable() {
        if (!changeNum.value) {
          const patientName = formState.patient_name.replace(/(^\s*)|(\s*$)/g, '');
          if (patientName == '') {
            return;
          }

          const patientNameBlooean = patients.value.filter((item) => {
            return item.name === patientName;
          });

          if (patientNameBlooean.length <= 0) {
            formState.patient_name = patientName;
            formState.patient_age = 0;
            formState.patient_id = 0;
            formState.patient_mobile = '';

            formState.patient_name = patientName;
            patientsSearchShow.value = false;
          } else {
            changeNum.value = false;
            patientsSearchShow.value = false;
            formState.patient_name = patientNameBlooean[0].name;
            formState.patient_age = patientNameBlooean[0].age;
            formState.patient_id = patientNameBlooean[0].id;
            formState.patient_mobile = patientNameBlooean[0].phone;
            formState.patient_sex = String(patientNameBlooean[0].sex);
          }
        } else {
          changeNum.value = false;
        }
      }

      // 药房改变，获取药房费用
      const processingFee = () => {
        if (!formState.pharmacy_id || !formState.dosage_id) return;
        getProcessingFee(formState.pharmacy_id, formState.dosage_id).then((res) => {
          formState.process_fee = res.price || '0';
          loading.value = false;
        });
      };

      const { proxy } = getCurrentInstance() as any;

      const cancelModal = () => {
        // console.log(records.action);
        if (records.action == 'updata') {
          // proxy.$router.go(1);
          proxy.$router.go(-1);
        } else {
          handleClear();
        }
      };

      // 向上取整 保留两位小数
      (function () {
        /**
         * Decimal adjustment of a number.
         *
         * @param {String}  type  The type of adjustment.
         * @param {Number}  value The number.
         * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
         * @returns {Number} The adjusted value.
         */
        function decimalAdjust(type, value, exp) {
          // If the exp is undefined or zero...
          if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
          }
          value = +value;
          exp = +exp;
          // If the value is not a number or the exp is not an integer...
          if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
          }
          // Shift
          value = value.toString().split('e');
          value = Math[type](+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)));
          // Shift back
          value = value.toString().split('e');
          return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp));
        }

        // Decimal round
        if (!Math.round10) {
          Math.round10 = function (value, exp) {
            return decimalAdjust('round', value, exp);
          };
        }
        // Decimal floor
        if (!Math.floor10) {
          Math.floor10 = function (value, exp) {
            return decimalAdjust('floor', value, exp);
          };
        }
        // Decimal ceil
        if (!Math.ceil10) {
          Math.ceil10 = function (value, exp) {
            return decimalAdjust('ceil', value, exp);
          };
        }
      })();

      // 费用计算
      const comMedicalFee = computed(() => {
        if (totalDrugCost.value === -1) {
          return '计算中...';
        }
        // 医药费：如果是中药 药物合计 乘以 剂量
        let num = 1;
        if (formState.drugType === 1) num = formState.tisanes_detail.total_dosage;

        return Math.ceil10((totalDrugCost.value * num).toFixed(6), -2);
      });

      const comProcessCost = computed(() => {
        if (CMedicineList.value.length <= 0) {
          return 0;
        }

        if (totalDrugCost.value === -1) {
          return 0;
        }
        // 加工费：如果是代煎 需要乘以 剂量
        let num = 0;
        if (
          (formState.drugType === 1 && formState.tisanes_way === '代煎') ||
          formState.dosage_id === 2
        ) {
          num = formState.tisanes_detail.total_dosage;
        }
        return multiply(formState.process_fee, num);
      });

      const comConsultationFee = computed(() => {
        // 诊金
        return multiply(formState.consultation_fee, 1);
      });

      // function receiveDeleteNew(e){

      //   console.log(e.value,'-------')
      //   if(e.value == ''){
      //     yf.value = 0
      //   }else{
      //     yf.value = Number(e.value)
      //   }
      // }

      const comTotal = computed(() => {
        if (totalDrugCost.value === -1) {
          return '计算中...';
        }
        // 处方合计：医药费 + 加工费 + 诊金
        let total =
          Number(comMedicalFee.value) +
          Number(comProcessCost.value) +
          Number(comConsultationFee.value) +
          Number(formState.set_express_total);
        // -
        // Number(yf.value)
        return Math.ceil10(total.toFixed(6), -2);
      });

      const goBack = () => {
        proxy.$router.go(-1);
      };

      const getIdempotentTokenAction = () => {
        getIdempotentToken().then((res) => {
          idempotentToken.value = res.token;
          console.log('获取幂等Token', idempotentToken.value);
        });
      };

      return {
        submitPharmacy,
        prescriptionConfirmation,
        mubanModal,
        showRow,
        isMultiRow,
        ...toRefs(modelState),
        getDosageList,
        isDisabledSelect,
        getIcdList,
        icdList,
        handleBlurTable,
        handleBlur,
        goBack,
        warnMsgShow,
        loading,
        comConsultationFee,
        comMedicalFee,
        comProcessCost,
        comTotal,
        cmedicineRef,
        cmedicineRef2,
        useEnter,
        medicineNamevalue,
        numRef,
        numRef2,
        dosageForm,
        cancelModal,
        registerQrcodeModal,
        processingFee,
        getPatientsAction,
        onPatientChange,
        searchParams,
        prescriptionVisible,
        prescription,
        handleDetailWest,
        doctor,
        doctors,
        handleSubmit,
        pharmacyLists,
        patientMobileBlur,
        rules,
        formRef,
        formState,
        labelCol,
        wrapperCol,
        options,
        onSelect,
        onWestSelect,
        handleSearch,
        handleKeyPress,
        modelState,
        currentDecotions,
        registerPrescriptionDrawer,
        handlePrescriptionModel,
        handleChangeDosage,
        CMedicineList,
        handleDeleteMedicine,
        handleAddDecotion,
        handleCloseDecotion,
        decotionList,
        isDecotion,
        records,
        handleDoctorChange,
        handleSignName,
        handleAddDecotionItem,
        getfocus,
        handleSaveDecotion,
        totalDrugCost,
        medicineNumber,
        grammage,
        handleCheckMedicineStock,
        handleClear,
        handleClearU,
        registerTable,
        multiplie,
        handleWestStockCheck,
        westDeleteAble,
        medicamentOptionTimes,
        mtOptions,
        handleClearWest,
        onSearch,
        patientsSearchShow,
        patients,
        handleUpdateMedicineList,
        handleSavePrescriptionModel,
        saveModelClick,
        saveArray,
        isshow,
        close,
        issize,
        ischeck,
        closeModel,
        btnClick2,
        prescriptionModalCancel,
        prescriptionModalOk,
        tipsText,
        patientsSearchDisable,
        sonRef,
        tisanes_type,
        WMedicineListSum,
        // receiveDeleteNew,
        yf,
      };
    },
  });
</script>

<style lang="less">
  .submit-group {
    position: fixed;
    right: 70px;
    bottom: -5px;
    display: flex;
    z-index: 300;
    .btn {
      width: 140px;
      height: 40px;
      border-radius: 5px;
      border: 1px solid #cccccc;
      color: #808080;
      font-size: 16px;
      line-height: 40px;
      text-align: center;
    }
    .btn-spc {
      background: #1084ff;
      border: none;
      color: #fff;
      margin-left: 16px;
    }
  }
  .con {
    display: flex;
    padding: 0px 20px 20px 20px;
    position: fixed;
    bottom: 0px;
    background: #fff;
    width: 87%;
    line-height: 60px;
    height: 65px;
    z-index: 200;
  }
  .con-mb {
    margin-right: 25px;
    span {
      margin-left: 10px;
      color: #ff0000;
      font-weight: 700;
    }
  }
  .con-mb-title {
    font-weight: 700;
    color: #000;
    font-size: 16px;
  }
  .setting /deep/ .ant-form-item-control-input {
    min-height: 27px;
    .ant-radio-button-wrapper {
      height: 27px;
      line-height: 26px;
    }
    .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
      height: 27px;
    }
    .ant-select-single .ant-select-selector .ant-select-selection-item {
      line-height: 26px;
    }
  }
  .title-spc {
    display: inline-block;
    width: 150px;
    height: 32px;
    background: rgba(75, 163, 255, 0.1);
    opacity: 1;
    border: 1px solid #007cff;
    text-align: center;
    line-height: 32px;
    // margin-left: 10px;
    color: #1084ff;
    letter-spacing: 2px;
    margin-right: 17px;
    border-radius: 5px;
    font-size: 14px;
  }
  .title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .prescription-btn {
    margin-bottom: 20px;
  }

  .w-prescription-card {
    width: 90%;
    min-height: 300px;
    margin-bottom: 20px;
    position: relative;
    border: 1px solid #e8e8e8;
    .operate-group {
      position: absolute;
      bottom: 5px;
      display: flex;
      align-items: center;

      .ant-form-item {
        margin-bottom: 0;
      }
    }
    .operate-group-spc {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      .ant-form-item {
        margin-bottom: 0;
      }
      .btns {
        width: 160px;
        height: 30px;
        background: #f8f8f8;
        opacity: 1;
        border: 1px solid #cccccc;
        border-radius: 5px;
        cursor: pointer;
      }
      .btns-item {
        line-height: 30px;
        margin: 0px 0px 6px 12px;
        color: #9e9e9e;
      }
      .btns-item-rigth {
        margin-left: 10px;
      }
      .btns-item-spc {
        padding-right: 10px;
        border-right: 1px solid #cccccc;
      }
      .clearBtn {
        width: 86px;
        height: 30px;
        background: #f8f8f8;
        opacity: 1;
        border: 1px solid #cccccc;
        border-radius: 5px;
        color: #ff5368;
        line-height: 28px;
        margin-left: 20px;
        // margin-right: 27px;
        text-align: center;
        cursor: pointer;
      }
    }
  }

  .prescription-card {
    width: 100%;
    // min-width: 1080px;
    min-height: 284px;
    margin-bottom: 20px;
    padding: 10px 0px 0px 10px;
    border: 1px solid #e8e8e8;
    position: relative;
    .medicine-module {
      display: flex;
      flex-wrap: wrap;

      .medicine-item {
        width: 200px;
        // width: 199px;
        height: 71px;
        // padding: 7px 14px;
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
        .custom-decoction-prop-spc {
          position: absolute;
          left: 520px;
          top: calc(100% + 4px);
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
      .medicine-item-spc {
        width: 199px;
        margin-bottom: 5px;
        border: 1px solid #cccc;
        padding: 7px 14px;
      }
      .medicine-item-two {
        width: 100%;
        height: 35px;
      }
      .multiDan {
        width: 100%;
        background: none;
        height: 40px;
        border-bottom: 1px solid #e8e8e8;
        border-radius: 0px;
        padding: 7px 14px;
        .item-row {
          height: 40px;
          line-height: 27px;
          padding-left: 30px;
          color: #000;
          font-size: 14px;
        }
        .row-qian {
          background: #d2d2d2;
          padding: 3px;
          font-size: 12px;
          color: #1f1919;
          border-radius: 5px;
        }
        .row-delete {
          position: absolute;
          right: 25px;
          top: 6px;
          color: #ff3838;
          cursor: pointer;
        }
        &:nth-child(2n) {
          background: #fafafa;
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
    .operate-group-spc {
      display: flex;
      align-items: center;
      margin-bottom: 25px;
      .ant-form-item {
        margin-bottom: 0;
      }
      .btns {
        width: 160px;
        height: 30px;
        background: #f8f8f8;
        opacity: 1;
        border: 1px solid #cccccc;
        border-radius: 5px;
        cursor: pointer;
      }
      .btns-item {
        line-height: 30px;
        margin: 0px 0px 6px 12px;
        color: #9e9e9e;
      }
      .btns-item-rigth {
        margin-left: 10px;
      }
      .btns-item-spc {
        padding-right: 10px;
        border-right: 1px solid #cccccc;
      }
      .clearBtn {
        width: 86px;
        height: 30px;
        background: #f8f8f8;
        opacity: 1;
        border: 1px solid #cccccc;
        border-radius: 5px;
        color: #ff5368;
        line-height: 28px;
        margin-left: 27px;
        // margin-right: 27px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .prescription-card-spc {
    width: 770px;
    min-height: 284px;
    margin-bottom: 20px;
    padding: 10px 0px 0px 10px;
    border: 1px solid #e8e8e8;
    position: relative;
  }

  .usage-module {
    display: flex;
    flex-direction: column;

    .usage-item {
      display: flex;
      align-items: center;
      flex: 1;
      margin-bottom: 20px;

      .ant-form-item {
        margin-bottom: 0;
      }

      .usage-item-line {
        display: flex;
        align-items: center;
      }
    }
  }

  .line {
    width: 100%;
    height: 10px;
    opacity: 1;
    background: #f0f2f5;
    margin-bottom: 20px;
  }

  .model {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.3);

    .title {
      margin: 240px auto;
      width: 480px;
      background-color: #fff;
      padding: 20px;
      text-align: center;
      border-radius: 5px;
      position: relative;

      .title-label {
        .closes {
          position: absolute;
          right: 20px;
          top: 10px;
        }
      }
      .close {
        position: absolute;
        bottom: 0;
      }
      .array {
        // flex: 1;
        min-height: 60px;
        max-height: 300px;
        overflow: auto;
        text-align: left;
        padding-left: 30px;
        font-weight: 540;
      }
      .size {
        .you {
          color: #bebbbb;
        }
        .button {
          background: skyblue;
          padding: 10px 40px 10px 40px;
          box-sizing: border-box;
          color: white;
          border-radius: 7px;
          font-size: 20px;
        }
      }
    }
  }

  .decotion-list .active {
    border: solid 1px #409eff !important;
    color: #409eff;
  }
  .search-result {
    position: absolute;
    z-index: 999;
    width: 100%;
    height: auto;
    max-height: 500px;
    background: #fff;
    border: solid 1px #0960bd;
    border-top: none;
    margin-top: -1px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    padding-top: 5px;
    padding-bottom: 5px;
    overflow-y: auto;
    cursor: pointer;
    .search-item:hover {
      background: #d9d9d9;
    }
    .search-item {
      padding: 5px 10px;
      .search-phone {
        font-size: 12px;
        color: #2076d1;
      }
    }
  }
  .ant-form-item-label {
    text-align: left !important;
    padding-right: 10px !important;
  }
</style>
<style scoped>
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
