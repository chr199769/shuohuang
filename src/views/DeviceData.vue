<template>
  <div class="device-data-container">
    <div class="header">
      <h2>设备数据管理</h2>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="queryParams.Mark" placeholder="设备名/部门/车站" clearable />
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
      <el-table-column prop="EqID" label="设备ID" width="120" />
      <el-table-column prop="EqName" label="设备名称" width="150" show-overflow-tooltip />
      <el-table-column prop="EqNo" label="设备编号" width="120" />
      <el-table-column prop="Manufacturer" label="制造商" width="150" show-overflow-tooltip />
      <el-table-column prop="EqModel" label="型号" width="120" />
      <el-table-column prop="BelongDeptName" label="所属部门" width="120" />
      <el-table-column prop="BelongStationName" label="所属车站" width="120" />
      <el-table-column prop="UseStatusName" label="状态" width="100" />
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
      title="设备详情"
      width="60%"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="系统ID">{{ currentDetail.ID }}</el-descriptions-item>
        <el-descriptions-item label="设备ID">{{ currentDetail.EqID }}</el-descriptions-item>
        <el-descriptions-item label="设备名称">{{ currentDetail.EqName }}</el-descriptions-item>
        <el-descriptions-item label="设备编号">{{ currentDetail.EqNo }}</el-descriptions-item>
        <el-descriptions-item label="型号">{{ currentDetail.EqModel }}</el-descriptions-item>
        <el-descriptions-item label="类型ID">{{ currentDetail.EqTypeID }}</el-descriptions-item>
        <el-descriptions-item label="分类名称">{{ currentDetail.EqCountName }}</el-descriptions-item>
        <el-descriptions-item label="资产编号">{{ currentDetail.AssetNo }}</el-descriptions-item>
        <el-descriptions-item label="二维码">{{ currentDetail.QrCode }}</el-descriptions-item>
        <el-descriptions-item label="制造商">{{ currentDetail.Manufacturer }}</el-descriptions-item>
        <el-descriptions-item label="单位">{{ currentDetail.Units }}</el-descriptions-item>
        <el-descriptions-item label="数量">{{ currentDetail.EqAmount }}</el-descriptions-item>
        <el-descriptions-item label="DK号">{{ currentDetail.DkNum }}</el-descriptions-item>
        <el-descriptions-item label="锁定版本">{{ currentDetail.LockVersion }}</el-descriptions-item>
        <el-descriptions-item label="使用状态">{{ currentDetail.UseStatusName }}</el-descriptions-item>
        <el-descriptions-item label="借用状态">{{ currentDetail.BorrowStatusName }}</el-descriptions-item>
        <el-descriptions-item label="所属部门ID">{{ currentDetail.BelongDeptID }}</el-descriptions-item>
        <el-descriptions-item label="所属部门">{{ currentDetail.BelongDeptName }}</el-descriptions-item>
        <el-descriptions-item label="所属站ID">{{ currentDetail.BelongStationID }}</el-descriptions-item>
        <el-descriptions-item label="所属车站">{{ currentDetail.BelongStationName }}</el-descriptions-item>
        <el-descriptions-item label="位置ID">{{ currentDetail.EqPositionID }}</el-descriptions-item>
        <el-descriptions-item label="系统维护单位">{{ currentDetail.SysWhdw }}</el-descriptions-item>
        <el-descriptions-item label="投运日期">{{ formatDate(currentDetail.OperationDate) }}</el-descriptions-item>
        <el-descriptions-item label="出厂日期">{{ formatDate(currentDetail.ProductDate) }}</el-descriptions-item>
        <el-descriptions-item label="创建日期">{{ formatDate(currentDetail.CreateDate) }}</el-descriptions-item>
        <el-descriptions-item label="更新日期">{{ formatDate(currentDetail.UpdateDate) }}</el-descriptions-item>
        <el-descriptions-item label="故障次数">{{ currentDetail.FaultTimes }}</el-descriptions-item>
        <el-descriptions-item label="维修次数">{{ currentDetail.RepairTimes }}</el-descriptions-item>
        <el-descriptions-item label="创建用户ID">{{ currentDetail.CreateUserID }}</el-descriptions-item>
        <el-descriptions-item label="创建站ID">{{ currentDetail.CreateStationID }}</el-descriptions-item>
        <el-descriptions-item label="更新用户ID">{{ currentDetail.UpdateUserID }}</el-descriptions-item>
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
import { describeEqList, describeEqChainInfo } from '../api';
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
    const res = await describeEqList({
      Mark: queryParams.Mark,
      Date: queryParams.Date || '',
      Offset: offset
    });
    
    if (res) {
      tableData.value = res.EqList || [];
      total.value = res.TotalCount || 0;
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('获取设备数据失败');
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
    const res = await describeEqChainInfo({ EqID: row.EqID });
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
.device-data-container {
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
