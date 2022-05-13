<template>
  <div v-if="detail.physician_v3_pres_rel != ''">
    <div v-for="(item, index) in detail.physician_v3_pres_rel" :key="index">
      <div class="ypPrescriptionProgram program" v-if="item.prescript[0].drug_type == 1">
        <p class="titProgram"
          >中药处方方案{{ index + 1 }}
          <span>处方单号：{{ item.prescript[0].prescript_no }}</span></p
        >
        <Row :gutter="24">
          <Col :span="2" align="end" class="lableText">主诉：</Col>
          <Col :span="22">
            <span v-if="item.prescript[0].patient_descr">{{
              item.prescript[0].patient_descr
            }}</span>
            <span v-else>无</span>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col :span="2" align="end" class="lableText">诊断：</Col>
          <Col :span="22">
            <span v-if="item.prescript[0].icd_ids">{{ item.prescript[0].icd_ids }}</span>
            <span v-else>无</span>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col :span="2" align="end" class="lableText">R：</Col>
          <Col :span="22">
            <span v-if="item.prescript_drug.length">（共{{ item.prescript_drug.length }}味）</span>
            <br />
            <span class="drugMage" v-for="(i, index) in item.prescript_drug" :key="index">
              {{ i.drug_name }} {{ i.number }} {{ i.unit }}
              <span v-if="i.usage">（{{ i.usage }}）</span>
              <span class="seal" v-if="i.usage">{{ i.autograph }}</span>
            </span>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col :span="2" align="end" class="lableText">用法：</Col>
          <Col :span="22">
            {{ item.prescript[0].usage1 }}
            <span v-if="item.prescript[0].dosage_num">共 {{ item.prescript[0].dosage_num }}剂</span>
            {{ item.prescript[0].usage }}
          </Col>
        </Row>
        <Row :gutter="24">
          <Col :span="2" align="end" class="lableText">医嘱：</Col>
          <Col :span="22">
            <span v-if="item.prescript[0].matter">{{ item.prescript[0].matter }}</span>
            <span v-else>无</span>
          </Col>
        </Row>
        <p align="right"
          >医师签字：<span class="seal">{{ detail.doctor_name }}</span></p
        >
      </div>
      <div class="wmPrescriptionProgram program" v-else-if="item.prescript[0].drug_type == 2">
        <p class="titProgram"
          >西药处方方案{{ index + 1 }}
          <span>处方单号：{{ item.prescript[0].prescript_no }}</span></p
        >
        <Row :gutter="24">
          <Col :span="2" align="end" class="lableText">主诉：</Col>
          <Col :span="22">
            <span v-if="item.prescript[0].patient_descr">{{
              item.prescript[0].patient_descr
            }}</span>
            <span v-else>无</span>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col :span="2" align="end" class="lableText">诊断：</Col>
          <Col :span="22">
            <span v-if="item.prescript[0].icd_ids">{{ item.prescript[0].icd_ids }}</span>
            <span v-else>无</span>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col :span="2" align="end" class="lableText">R：</Col>
          <Col :span="22">
            <span v-if="item.prescript_drug.length"
              >（西药，共{{ item.prescript_drug.length }}种）</span
            >
            <br />
            <div class="drugMage" v-for="(i, index) in item.prescript_drug" :key="index">
              <span>
                {{ i.drug_name }} {{ i.number }} {{ i.unit }} <br />
                {{ i.specs }}
              </span>
              <br />
              <span v-if="i.usage">
                <b>用法：</b> {{ i.usage }} {{ i.day_times }}
                <span v-if="i.medication_days"> 用药{{ i.medication_days }}天</span>
              </span>
            </div>
          </Col>
        </Row>
        <p align="right"
          >医师签字：<span class="seal">{{ detail.doctor_name }}</span></p
        >
      </div>
      <!-- <div class="gfPrescriptionProgram program" v-else-if="item.prescript[0].drug_type==3">
      <p  class="titProgram">膏方处方方案三 <span>处方单号：101022</span></p>
      <Row :gutter="24">
          <Col :span="2" align="end" class="lableText">主诉：</Col>
          <Col :span="22">疱疹性咽颊炎，发热4天，最高39.2</Col>
      </Row>
      <Row :gutter="24">
          <Col :span="2" align="end" class="lableText">诊断：</Col>
          <Col :span="22">疱疹性咽颊炎</Col>
      </Row>
      <Row :gutter="24">
          <Col :span="2" align="end" class="lableText">R：</Col>
          <Col :span="22">
              （饮片，共4味）<br>
              党参10g（先煎） 党参10g（先煎） 莱菔子10g（先煎） 干姜5g
          </Col>
      </Row>
      <Row :gutter="24">
          <Col :span="2" align="end" class="lableText">辅料：</Col>
          <Col :span="22">蜂蜜</Col>
      </Row>
      <Row :gutter="24">
          <Col :span="2" align="end" class="lableText">用法：</Col>
          <Col :span="22">内服，共7剂，每天一次，一次2袋</Col>
      </Row>
      <Row :gutter="24">
          <Col :span="2" align="end" class="lableText">医嘱：</Col>
          <Col :span="22">饭前1小时服用；忌油腻、忌烟酒、忌辛辣</Col>
      </Row>
      <p align="right">医师签字：ddd</p>
  </div> -->
    </div>
    <br /><br /><br />
  </div>
  <div align="center" v-else>暂无数据<br /><br /><br /></div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch, nextTick } from 'vue';
  import { getPrescription } from '/@/api/sys/appointments';
  import { Row, Col } from 'ant-design-vue';

  export default defineComponent({
    components: { Row, Col },
    emits: ['changeTab'],
    props: {
      id: Number,
    },
    setup(props) {
      const detail = ref<any>({});
      watch(
        () => {
          return props.id;
        },
        (state) => {
          if (state) {
            nextTick(() => {
              getPrescriptionSync(props.id);
            });
          }
        },
        {
          immediate: true,
          deep: true,
        }
      );
      const getPrescriptionSync = (id) => {
        getPrescription(id).then((response) => {
          detail.value = response;
          console.log(detail.order_status);
        });
      };

      return {
        detail,
        getPrescriptionSync,
      };
    },
  });
</script>

<style type="text/css">
  .ypPrescriptionProgram {
    background: #efefef;
    font-size: 14px;
    line-height: 28px;
    padding: 15px;
  }
  .titProgram {
    display: block;
    height: 30px;
    font-size: 16px;
    font-weight: bold;
  }
  .titProgram span {
    float: right;
  }
  .ypPrescriptionProgram .lableText {
    font-weight: bold;
  }
  .ypPrescriptionProgram p .seal {
    border: solid 3px red;
    padding: 5px 10px;
    font-family: '楷体';
  }
</style>
