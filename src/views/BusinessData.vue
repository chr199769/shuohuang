<template>
  <div class="business-data-container">
    <div class="header">
      <h2>业务数据管理</h2>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="queryParams.Mark" placeholder="搜索线路/内容/人员/类型" clearable />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="queryParams.Date"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column prop="BizID" label="业务ID" width="120" />
      <el-table-column prop="Project" label="项目" width="150" show-overflow-tooltip />
      <el-table-column prop="Line" label="线路" width="120" />
      <el-table-column prop="PlanType" label="计划类型" width="120" />
      <el-table-column prop="WorkLocation" label="工作地点" width="150" show-overflow-tooltip />
      <el-table-column prop="PlanDate" label="计划日期" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.PlanDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="ConstructionUnitAndPerson" label="施工单位及人员" show-overflow-tooltip />
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleView(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="业务详情"
      width="60%"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="ID">{{ currentDetail.Id }}</el-descriptions-item>
        <el-descriptions-item label="业务ID">{{ currentDetail.BizID }}</el-descriptions-item>
        <el-descriptions-item label="项目" :span="2">{{ currentDetail.Project }}</el-descriptions-item>
        <el-descriptions-item label="线路">{{ currentDetail.Line }}</el-descriptions-item>
        <el-descriptions-item label="计划类型">{{ currentDetail.PlanType }}</el-descriptions-item>
        <el-descriptions-item label="电压等级">{{ currentDetail.VarLevel }}</el-descriptions-item>
        <el-descriptions-item label="计划日期">{{ formatDate(currentDetail.PlanDate) }}</el-descriptions-item>
        <el-descriptions-item label="月计划号">{{ currentDetail.MonthPlanNo }}</el-descriptions-item>
        <el-descriptions-item label="日计划号">{{ currentDetail.DayPlanNo }}</el-descriptions-item>
        <el-descriptions-item label="登记站">{{ currentDetail.RegStation }}</el-descriptions-item>
        <el-descriptions-item label="行别">{{ currentDetail.Hb }}</el-descriptions-item>
        <el-descriptions-item label="工作地点" :span="2">{{ currentDetail.WorkLocation }}</el-descriptions-item>
        <el-descriptions-item label="日期信息" :span="2">{{ currentDetail.DateInfo }}</el-descriptions-item>
        <el-descriptions-item label="施工单位及人员" :span="2">{{ currentDetail.ConstructionUnitAndPerson }}</el-descriptions-item>
        <el-descriptions-item label="配合单位及人员" :span="2">{{ currentDetail.CooperateUnitAndPerson }}</el-descriptions-item>
        <el-descriptions-item label="内容及影响" :span="2">{{ currentDetail.ContentAndInfluence }}</el-descriptions-item>
        <el-descriptions-item label="限制及变更" :span="2">{{ currentDetail.LimitAndChange }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDate(currentDetail.CreatedAt) }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ formatDate(currentDetail.UpdatedAt) }}</el-descriptions-item>
      </el-descriptions>

      <!-- 区块链信息 -->
      <div v-if="chainInfo" class="chain-info-section">
        <h3>区块链存证信息</h3>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="交易哈希 (TxnId)">
            <el-tag type="success">{{ chainInfo.TxnId }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="区块高度 (BlockNumber)">{{ chainInfo.BlockNumber }}</el-descriptions-item>
          <el-descriptions-item label="区块哈希 (BlockHash)">{{ chainInfo.BlockHash }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { describeBizList, describeBizChainInfo } from '../api';
import { ElMessage } from 'element-plus';

const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const dialogVisible = ref(false);
const currentDetail = ref({});
const chainInfo = ref(null);

const queryParams = reactive({
  Mark: '',
  Date: ''
});

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString();
};

const fetchData = async () => {
  loading.value = true;
  try {
    const offset = (currentPage.value - 1) * pageSize.value;
    const res = await describeBizList({
      Mark: queryParams.Mark,
      Date: queryParams.Date || '',
      Offset: offset,
      Limit: pageSize.value // Although the backend seems to hardcode limit to 10 in one place, passing it might help if updated.
    });
    
    if (res) {
      tableData.value = res.BizList || [];
      total.value = res.TotalCount || 0;
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('获取数据失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchData();
};

const resetQuery = () => {
  queryParams.Mark = '';
  queryParams.Date = '';
  handleSearch();
};

const handleView = async (row) => {
  currentDetail.value = row;
  chainInfo.value = null; // 重置链上信息
  dialogVisible.value = true;

  // 获取链上信息
  try {
    const res = await describeBizChainInfo({ BizID: row.BizID });
    if (res) {
      chainInfo.value = res;
    }
  } catch (error) {
    console.error('获取链上信息失败', error);
    // 不阻塞详情展示，仅提示
    // ElMessage.warning('获取链上信息失败');
  }
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchData();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchData();
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.business-data-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header {
  margin-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}

.search-bar {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
