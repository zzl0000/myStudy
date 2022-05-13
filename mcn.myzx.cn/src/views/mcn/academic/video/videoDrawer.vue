<template>
  <BasicDrawer
    :title="getTitle"
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    width="40%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" style="width: 90%">
      <template #title="{ model, field }">
        <a-input v-model:value="model[field]" placeholder="请输入视频标题" />
      </template>

      <template #Picture="{ model, field }">
        <a-input
          type="file"
          @change="tirggerFile($event)"
          class="inputs"
          accept="image/png,image/jpeg"
        />
        <img style="width: 100px; height: 100px" id="img1" :src="defaultUrl" alt="" />
        <div style="color: red"> 封面格式JPG、JPEG、PNG，文件≤5MB，建议参考为1920*1080</div>
        <div v-if="ispicture" style="color: #ed6f6f">请上传封面图</div>
      </template>

      <template #video="{ model, field }">
        <UploadAuth @upload="uploadVideo" />
        <video :src="VideoUrls" controls class="video" v-if="showVideo"></video>
        <div style="color: red">建议视频文件不超过100M</div>
        <div v-if="isvideo" style="color: #ed6f6f">请上传视频</div>
      </template>

      <template #Author="{ model, field }">
        <a-select
          v-model:value="model[field]"
          show-search
          placeholder="请输入医生姓名"
          style="width: 200px"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          :options="data"
          @search="handleSearch"
          @change="handleChange"
        />
        <div style="color: #ed6f6f; margin-top: 5px" v-if="isShow">请输入医生姓名</div>
      </template>

      <template #kid="{ model, field }">
        <a-cascader
          v-model:value="model[field]"
          :fieldNames="{ label: 'name', value: 'kid', children: '1' }"
          :options="treeData"
          placeholder="请选择科室"
          @change="handelTreeData"
        />
        <div style="color: #ed6f6f; margin-top: 5px" v-if="isShow1">请输入科室</div>
      </template>

      <template #main_tag_id="{ model, field }">
        <a-select
          v-model:value="model[field]"
          show-search
          :default-active-first-option="false"
          :show-arrow="false"
          label-in-value
          placeholder="  请输入主标签搜索"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="state.fetching ? undefined : null"
          :options="state.data"
          @search="fetchUser"
          @focus="focus(1)"
          @change="handelFocus"
        >
          <template v-if="state.fetching" #notFoundContent>
            <a-spin size="small" />
          </template>
        </a-select>
        <div style="color: #ed6f6f; margin-top: 5px" v-if="isShow3">请输入主标签搜索</div>
      </template>

      <template #tags_ids="{ model, field }">
        <a-select
          v-model:value="model[field]"
          mode="multiple"
          label-in-value
          placeholder="  请输入副标签搜索"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="state.fetching1 ? undefined : null"
          :options="state.data1"
          @search="fetchUser"
          @focus="focus(2)"
          @change="handelFocus1"
        >
          <template v-if="state.fetching1" #notFoundContent>
            <a-spin size="small" />
          </template>
        </a-select>
        <div style="color: #ed6f6f; margin-top: 5px" v-if="isShow4">请输入副标签搜索</div>
      </template>

      <template #dname="{ model, field }">
        <a-select
          v-model:value="model[field]"
          show-search
          placeholder="请输入疾病名称"
          style="width: 200px"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          :autocomplete="false"
          :options="data1"
          @search="handleSearch1"
          @change="handleChange1"
        />
        <div style="color: #ed6f6f; margin-top: 5px" v-if="isShow2">请输入疾病名称</div>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref, unref, reactive, computed } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { expertFormSchema } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { GetExpertAdvis } from '/@/api/sys/expertadvisory';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { GetDiseases } from '/@/api/sys/experts';
  import {
    UpLoadImg,
    GetSearchTip,
    GetVideoParams,
    GetVideoDetail,
    GetVideoCreate,
    GetVideoSearch,
    GetVideoEdit,
  } from '/@/api/sys/video';
  import { debounce } from 'lodash-es';
  import { GetDepartments } from '/@/api/sys/experts';
  import UploadAuth from '/@/components/UploadAuth.vue';

  const emit = defineEmits(['success']);
  const defaultUrl = ref('');

  const { createMessage } = useMessage();
  const { success, error } = createMessage;

  const VideoUrls = ref();
  const showVideo = ref();

  const isShow = ref(false);
  const isShow1 = ref(false);
  const isShow2 = ref(false);
  const isShow3 = ref(false);
  const isShow4 = ref(false);

  const state = reactive({
    data: [],
    data1: [],
    value: [],
    fetching: false,
    fetching1: false,
    focusNmu: 0,
  });

  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    schemas: expertFormSchema,
    showActionButtonGroup: false,
  });

  const treeData = ref<[]>([]);
  const isUpdate = ref(true);
  const Info = ref();
  const DnameBloon = ref(false);
  const DnameBloon1 = ref(false);
  const ispicture = ref(false);
  const isvideo = ref(false);
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = data.isUpdate;

    if (unref(treeData.value).length === 0) {
      treeData.value = await GetDepartments();
    }

    isShow.value = false;
    isShow1.value = false;
    isShow2.value = false;
    isShow3.value = false;
    isShow4.value = false;
    ispicture.value = false;
    isvideo.value = false;

    // await GetVideoParams().then((res) => {
    //   console.log(res);
    // });

    if (isUpdate.value) {
      defaultUrl.value = '';
      VideoUrl.value = '';
      showVideo.value = false;
      ispicture.value = false;
      isvideo.value = false;
    }

    if (!isUpdate.value) {
      await GetVideoDetail({ id: data.record.id }).then((res) => {
        Info.value = res.data;

        const data = res.data;
        defaultUrl.value = data.img_address.middle;
        data.kid = [data.kid];
        data.main_tag_id = { value: data.main_tag_id, label: data.main_tag };
        const tagsArray = data.tags.substr(0, data.tags.length - 1).split(',');
        const tagsIdsArray = data.tags_ids.substr(0, data.tags_ids.length - 1).split(',');
        const arr = [];
        tagsArray.map((element, index) => {
          arr.push({
            value: tagsIdsArray[index],
            label: element,
          });
        });
        data.tags_ids = arr;
        data.type = data.video_specification;

        VideoUrls.value = data.url;
        if (data.url) {
          showVideo.value = true;
        } else {
          showVideo.value = false;
        }

        setFieldsValue({
          ...data,
        });
        DnameBloon.value = true;
        DnameBloon1.value = true;
      });
    }
  });

  const getTitle = computed(() => (!unref(!isUpdate.value) ? '新增视频' : '编辑视频'));

  const VideoUrl = ref();
  const VideoUrlBloon = ref(false);
  function uploadVideo(val) {
    VideoUrls.value = val;
    if (val) {
      showVideo.value = true;
      isvideo.value = false;
    } else {
      showVideo.value = false;
      isvideo.value = true;
    }
    VideoUrl.value = val;
    VideoUrlBloon.value = true;
  }

  //封面图上传

  const defaultImg = ref('');
  const ImgUrlBloon = ref(false);
  const tirggerFile = (event) => {
    var file = event.target.files;

    if (!(file[0].type === 'image/jpeg' || file[0].type === 'image/png')) {
      return error('只能上传jpg和png格式');
    }
    if (file[0].size / 1024 / 1024 > 5) {
      return error('图片必须小于5M!');
    }
    var reader = new FileReader(); //读取文件
    reader.readAsDataURL(file[0]);
    const files = file[0];
    reader.onload = function () {
      document.getElementById('img1').src = reader.result;
    };
    var formdata = new FormData();
    formdata.append('image', file[0]);
    UpLoadImg(formdata).then((res) => {
      defaultUrl.value = res.data.origin;
      defaultImg.value = res.data.id;
      ImgUrlBloon.value = true;
      ispicture.value = false;
    });
    document.getElementsByClassName('inputs').value = null;
  };

  const authodId = ref();
  const dnameName = ref();

  //医生名字1，疾病搜索2
  let timeout: any;
  let currentValue = '';

  function fetch(value: string, callback: any) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;

    function fake() {
      let params = {
        name: value,
      };
      GetVideoSearch(params)
        .then((response) => response.data)
        .then((d) => {
          if (currentValue === value) {
            const result = d;
            const data: any[] = [];
            result.forEach((r: any) => {
              data.push({
                value: r.did,
                label: r.name,
              });
            });
            callback(data);
            DnameBloon1.value = false;
          }
        });
    }

    timeout = setTimeout(fake, 300);
  }

  function fetch1(value: string, callback: any) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    function fake1() {
      currentValue = value;

      let params = {
        keywords: value,
      };
      GetDiseases(params)
        .then((response) => response)
        .then((d) => {
          if (currentValue === value) {
            const result = d;
            const data: any[] = [];
            result.forEach((r: any) => {
              data.push({
                value: r.id,
                label: r.name,
              });
            });
            callback(data);
            DnameBloon.value = false;
          }
        });
    }

    timeout = setTimeout(fake1, 300);
  }

  const changeData = ref();
  const changeData2 = ref();

  const data = ref<any[]>([]);
  const data1 = ref<any[]>([]);
  const handleSearch = (val: string) => {
    fetch(val, (d: any[]) => {
      data.value = d;
      authodId.value = d;
    });
  };
  const handleChange = (val: string) => {
    fetch(val, (d: any[]) => {
      data.value = d;
      changeData.value = val;
      isShow.value = false;
    });
  };

  const handleSearch1 = (val: string) => {
    fetch1(val, (d: any[]) => {
      data1.value = d;
      dnameName.value = d;
    });
  };
  const handleChange1 = (val: string) => {
    fetch1(val, (d: any[]) => {
      data1.value = d;
      changeData2.value = val;
      isShow2.value = false;
    });
  };

  const TreeData = ref();
  const handelTreeData = (val) => {
    if (val) {
      isShow1.value = false;
      TreeData.value = val;
    }
  };

  const kidName = ref();
  //主副标签搜索

  function focus(val: number) {
    state.focusNmu = val;
  }
  const fetchUser = debounce(async (value) => {
    if (state.focusNmu === 1) {
      state.data = [];
      state.fetching = true;
      await GetSearchTip({ name: value })
        .then((response) => response.data)
        .then((body) => {
          const data = body.map((item) => ({
            label: item.name,
            value: item.id,
          }));
          state.data = data;
          isShow3.value = false;
          state.fetching = false;
        });
    }
    if (state.focusNmu === 2) {
      state.data1 = [];
      state.fetching1 = true;
      await GetSearchTip({ name: value })
        .then((response) => response.data)
        .then((body) => {
          const data = body.map((item) => ({
            label: item.name,
            value: item.id,
          }));
          state.data1 = data;
          isShow4.value = true;
          // kidName.value = state.data1;
          state.fetching1 = false;
        });
    }
  }, 300);

  const FocusChange = ref();
  const handelFocus = (val) => {
    if (val) {
      isShow3.value = false;
      FocusChange.value = val;
    }
  };

  const FocusChange1 = ref();
  const handelFocus1 = (val) => {
    if (val) {
      isShow4.value = false;
      FocusChange1.value = val;
    }
  };

  //提交
  async function handleSubmit() {
    if (isUpdate.value) {
      if (defaultUrl.value) {
        ispicture.value = false;
      } else {
        ispicture.value = true;
      }
      if (VideoUrl.value) {
        isvideo.value = false;
      } else {
        isvideo.value = true;
      }

      if (changeData.value) {
        isShow.value = false;
      } else {
        isShow.value = true;
      }

      if (TreeData.value) {
        isShow1.value = false;
      } else {
        isShow1.value = true;
      }

      if (changeData2.value) {
        isShow2.value = false;
      } else {
        isShow2.value = true;
      }

      if (FocusChange.value) {
        isShow3.value = false;
      } else {
        isShow3.value = true;
      }

      if (FocusChange1.value) {
        isShow4.value = false;
      } else {
        isShow4.value = true;
      }
    }
    try {
      const values = await validate();
      console.log(values);
      if (isUpdate.value) {
        let tagId = '';
        let tagName = '';
        values.tags_ids.forEach((element) => {
          tagId += element.value + ',';
          tagName += element.label + ',';
        });

        dnameName.value.forEach((item) => {
          if (item.value === values.dname) {
            values.dname = item.label;
          }
        });
        const did = ref();
        authodId.value.forEach((item) => {
          if (item.value == values.author) {
            values.author = item.label;
            did.value = item.value;
          }
        });
        let kidName = '';
        treeData.value.forEach((item) => {
          if (item.kid == values.kid[0]) {
            kidName = item.name;
          }
        });
        let params = {
          title: values.title,
          img: Number(defaultImg.value),
          url: VideoUrl.value,
          did: did.value,
          author: values.author,
          description: values.description,
          kid: values.kid[0],
          main_tag_id: values.main_tag_id.value,
          main_tag: values.main_tag_id.label,
          tags_ids: tagId,
          tags: tagName,
          dname: values.dname,
          type: values.type,
          status: values.status,
          is_app_recommend: values.is_app_recommend,
          is_app_top: values.is_app_top,
          kid_name: kidName,
        };
        // console.log(params);
        GetVideoCreate(params).then((res) => {
          if (res.code === 200) {
            setDrawerProps({ confirmLoading: false });
            closeDrawer();
            success('添加成功');
            emit('success');
          } else {
            error(res.message);
          }
        });
      }

      if (!isUpdate.value) {
        let tagId = '';
        let tagName = '';
        values.tags_ids.forEach((element) => {
          tagId += element.value + ',';
          tagName += element.label + ',';
        });

        if (!DnameBloon.value) {
          dnameName.value.forEach((item) => {
            if (item.value === values.dname) {
              values.dname = item.label;
            }
          });
        }

        if (!DnameBloon1.value) {
          authodId.value.forEach((item) => {
            if (item.value == values.author) {
              values.author = item.label;
              values['did'] = item.value;
            }
          });
        } else {
          values['did'] = Info.value.did;
        }

        treeData.value.forEach((item) => {
          if (item.kid == values.kid[0]) {
            values['kid_name'] = item.name;
          }
        });

        if (ImgUrlBloon.value) {
          values.img = defaultImg.value;
        }

        if (VideoUrlBloon.value) {
          values.url = VideoUrl.value;
        }

        let params = {
          title: values.title,
          img: Number(values.img),
          url: values.url,
          id: Info.value.id,
          did: values.did,
          author: values.author,
          description: values.description,
          kid: values.kid[0],
          main_tag_id: values.main_tag_id.value,
          main_tag: values.main_tag_id.label,
          tags_ids: tagId,
          tags: tagName,
          dname: values.dname,
          type: values.type,
          status: values.status,
          is_app_recommend: values.is_app_recommend,
          is_app_top: values.is_app_top,
          kid_name: values.kid_name,
        };
        // console.log(params);
        GetVideoEdit(params).then((res) => {
          if (res.code === 200) {
            setDrawerProps({ confirmLoading: false });
            closeDrawer();
            success('修改成功');
            emit('success');
          } else {
            error(res.message);
          }
        });
      }
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
<style type="text/css" scoped>
  .inputs {
    display: block;
    position: absolute;
    height: 100px;
    opacity: 0.01;
    z-index: 999;
    left: -3px;
    width: 100px;
  }
  .image {
    width: 100px;
    height: 100px;
    position: relative;
    cursor: pointer;
  }
</style>
