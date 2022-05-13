<template>
  <Row style="padding: 0 20px 40px 20px; line-height: 36px; font-size: 14px">
    <Col span="8"> <span style="font-weight: 600">患者姓名:</span> {{ detail?.patient_name }} </Col>
    <Col span="4"> <span style="font-weight: 600">性别:</span> {{ detail?.sex }} </Col>
    <Col span="4"> <span style="font-weight: 600">年龄:</span> {{ detail?.age }} </Col>
    <Col span="4"> <span style="font-weight: 600">身高:</span> {{ detail?.height }}cm </Col>
    <Col span="4"> <span style="font-weight: 600">体重:</span> {{ detail?.weight }}Kg </Col>

    <Col span="8">
      <span style="font-weight: 600">联系方式:</span> {{ detail?.patient_phone }}
    </Col>
    <Col span="8"> <span style="font-weight: 600">所在城市:</span> {{ detail?.province }} </Col>
    <Col span="8"> </Col>

    <Col span="8"> <span style="font-weight: 600">问诊医生:</span> {{ detail?.doctor_name }} </Col>
    <Col span="8"> <span style="font-weight: 600">就诊时间:</span> {{ detail?.dial_time }} </Col>
    <Col span="8"> <span style="font-weight: 600">就诊科室:</span> {{ detail?.ks2name }} </Col>
    <Col span="8"> <span style="font-weight: 600">就诊方式:</span> {{ detail?.visit_type }} </Col>
    <Col span="20"> <span style="font-weight: 600">病情描述:</span> {{ detail?.content }} </Col>

    <Col v-if="detail.sex != '男'" span="20">
      <span style="font-weight: 600">特殊期:</span> {{ detail?.special_period_enum }}
    </Col>

    <Col span="20"> <span style="font-weight: 600">过敏史:</span> {{ detail?.allergy_text }} </Col>

    <Col span="20">
      <span style="font-weight: 600">既往病史:</span> {{ detail?.medical_history_text }}
    </Col>

    <Col span="20">
      <Row>
        <Col span="3"><span style="font-weight: 600">检查资料:</span></Col>
        <Col span="21">
          <div
            v-if="detail?.cases_checkdata_imgs && detail.cases_checkdata_imgs.length >= 1"
            style="display: inline-block; padding-top: 12px"
          >
            <Image
              v-for="(item, index) in detail?.cases_checkdata_imgs"
              :key="index"
              :src="detail.cases_checkdata_imgs[index]"
              :preview-src-list="detail.cases_checkdata_imgs"
              class="showImage"
            >
            </Image>
          </div>
          <span v-else>无</span>
        </Col>
      </Row>
    </Col>

    <Col span="20">
      <Row>
        <Col span="3"><span style="font-weight: 600">舌面照片:</span></Col>
        <Col span="21">
          <div
            v-if="detail?.tongue_face_imgs && detail.tongue_face_imgs.length >= 1"
            style="display: inline-block; padding-top: 12px"
          >
            <Image
              v-for="(item, index) in detail.tongue_face_imgs"
              :key="index"
              :src="detail.tongue_face_imgs[index]"
              :preview-src-list="detail.tongue_face_imgs[index]"
              class="showImage"
            >
            </Image>
          </div>
          <span v-else>无</span>
        </Col>
      </Row>
    </Col>

    <Col span="20">
      <Row>
        <Col span="3"><span style="font-weight: 600">通用问诊单:</span></Col>
        <Col span="21">
          <ul
            v-if="detail?.preliminary_data == 1"
            class="order"
            style="line-height: 20px; padding-top: 12px"
          >
            <li v-for="(i, index) in detail?.interrogation_single" :key="index">
              <p style="margin-bottom: 8px; color: rgba(0, 0, 0, 0.6)"
                >{{ index + 1 }}. {{ i.title }}</p
              >
              <p class="fontD" style="text-indent: 18px">
                <span v-for="(item, index) in i.values" :key="index">{{ item }}</span>
              </p>
            </li>
          </ul>
          <span v-else>无</span>
        </Col>
      </Row>
    </Col>
  </Row>
</template>

<script lang="ts">
  import { defineComponent, ref, watch, nextTick } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getConsultation } from '/@/api/sys/appointments';
  import { Row, Col, Image } from 'ant-design-vue';

  export default defineComponent({
    components: { BasicForm, useForm, Row, Col, Image },
    props: {
      id: Number,
    },
    emits: ['changeTab'],
    setup(props) {
      const detail = ref<any>({ caseList: [], tongueList: [] });
      watch(
        () => {
          return props.id;
        },
        (state) => {
          console.log(state);
          if (state) {
            nextTick(async () => {
              getConsultationSync(props.id);
            });
          }
        },
        {
          immediate: true,
          deep: true,
        }
      );

      const getConsultationSync = (id: any) => {
        getConsultation(id).then((response) => {
          response.sex = response.sex === 1 ? '男' : '女';
          response.comm_way = '无';
          if (detail.comm_way === 1) {
            response.comm_way = '图文';
          } else if (response.comm_way === 2) {
            response.comm_way = '电话';
          } else if (response.comm_way === 3) {
            response.comm_way = '视频';
          }
          response.doctor_name = response.doctor_name ? response.doctor_name : '无';
          response.dial_time = response.dial_time ? response.dial_time : '无';
          response.ks2name = response.ks2name ? response.ks2name : '无';
          response.content = response.content ? response.content : '无';
          response.special_period_enum = response.special_period_enum
            ? response.special_period_enum
            : '无';
          response.allergy_text = response.allergy_text ? response.allergy_text : '无';
          response.medical_history_text = response.medical_history_text
            ? response.medical_history_text
            : '无';
          detail.value = response;
          console.log(detail.order_status);
        });
      };

      return {
        detail,
        getConsultationSync,
      };
    },
  });
</script>

<style type="text/css">
  .showImage {
    width: 200px;
    height: 200px;
    margin-right: 30px;
  }
</style>
