<template>
  <PageWrapper title="新闻资讯">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="default" class="ml-2" @click="handlDeleteBatch">批量删除</a-button>
        <a-button type="primary" class="ml-2" @click="handleNews"><plus-outlined />新增</a-button>
      </template>

      <template #status="{ record }">
        <span v-if="record.status == 1" style="color: #70b603">正常</span>
        <span v-if="record.status == 2" style="color: #aaaaaa">下架</span>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              label: '删除',
              color: 'error',
              popConfirm: {
                title: '是否确认删除菜单',
                confirm: handleDelete.bind(null, record),
              },
            },
            {
              label: '复制',
              popConfirm: {
                title: '是否复制',
                confirm: handleCopy.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <NewsDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getUserSearchFormSchema, getNewsColumns } from './data';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import NewsDrawer from './newsDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { GetNews, GetNewsDelete } from '/@/api/sys/news';
  import { ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { GetNewsCreate, GetNewsId, bianjis } from '/@/api/sys/news';

  const { createMessage } = useMessage();
  const { success, error } = createMessage;

  const userStore = useUserStoreWithOut();
  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload, getSelectRows }] = useTable({
    api: getNews,
    columns: getNewsColumns(),
    formConfig: {
      labelWidth: 80,
      schemas: getUserSearchFormSchema(),
      fieldMapToTime: [['fieldTime', ['created_at_start', 'created_at_end'], 'YYYY-MM-DD']],
    },
    useSearchForm: true,
    pagination: true,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
    rowSelection: {
      type: 'checkbox',
    },
    clickToRowSelect: false,
    striped: false,
  });

  async function getNews(params: any) {
    params['page_size'] = params.per_page;
    delete params.per_page;
    let data = [];
    await GetNews(params).then((res) => {
      data = res.data;
      data['data'] = data.list;
      delete data.list;
    });
    return data;
  }

  function handleNews() {
    openDrawer(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record) {
    openDrawer(true, {
      isUpdate: true,
      record,
    });
  }

  function handleDelete(record) {
    let id = record.id + '';
    GetNewsDelete(id).then((res) => {
      if (res.code == 200) {
        success('新闻资讯删除成功!');
        reload();
      }
    });
  }

  function handlDeleteBatch() {
    let data = getSelectRows();
    let id = '';
    if (data.length > 0) {
      data.map((item) => {
        id += item.id + ',';
      });

      console.log(id);
      GetNewsDelete(id).then((res) => {
        if (res.code == 200) {
          success('新闻资讯删除成功!');
          reload();
        }
      });
    }
  }

  function handleCopy(record) {
    GetNewsId(record.id).then((res) => {
      const Info = res.data;
      console.log(Info);
      let params = {
        title: Info.title,
        cover_img: Info.cover_img,
        source: Info.source,
        view_count_basic: Info.view_count_basic,
        content: Info.content,
        status: Info.status,
        is_recommend: Info.is_recommend,
        is_top: Info.is_top,
      };

      GetNewsCreate(params).then((res) => {
        if (res.code == 200) {
          success('复制成功');
          reload();
        } else {
          error(res.message);
        }
      });
    });
  }

  function handleSuccess() {
    reload();
  }
</script>

<style></style>
