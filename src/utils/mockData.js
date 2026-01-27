// 模拟数据
export const mockData = {
    // 业务数据列表模拟
    DescribeBizList: (params) => {
        const list = [
            {
                Id: 1,
                BizID: 'BIZ001',
                Project: '朔黄铁路扩能改造',
                Line: '朔黄线',
                PlanType: '月度计划',
                VarLevel: '220kV',
                PlanDate: '2025-01-20T00:00:00Z',
                MonthPlanNo: 'MP202501',
                DayPlanNo: 'DP2025012001',
                RegStation: '西柏坡站',
                Hb: '上行',
                WorkLocation: 'K23+100',
                DateInfo: '2025-01-20',
                ConstructionUnitAndPerson: '中铁三局/张三',
                CooperateUnitAndPerson: '电务段/李四',
                ContentAndInfluence: '更换接触网绝缘子，需停电作业',
                LimitAndChange: '限速45km/h',
                CreatedAt: '2025-01-01T10:00:00Z',
                UpdatedAt: '2025-01-01T10:00:00Z'
            },
            {
                Id: 2,
                BizID: 'BIZ002',
                Project: '信号系统升级',
                Line: '黄万线',
                PlanType: '临时计划',
                VarLevel: '110kV',
                PlanDate: '2025-01-21T00:00:00Z',
                MonthPlanNo: 'MP202501',
                DayPlanNo: 'DP2025012101',
                RegStation: '黄骅港站',
                Hb: '下行',
                WorkLocation: 'K100+500',
                DateInfo: '2025-01-21',
                ConstructionUnitAndPerson: '通信段/王五',
                CooperateUnitAndPerson: '工务段/赵六',
                ContentAndInfluence: '光缆接续，不影响行车',
                LimitAndChange: '无',
                CreatedAt: '2025-01-02T10:00:00Z',
                UpdatedAt: '2025-01-02T10:00:00Z'
            },
            {
                Id: 3,
                BizID: 'BIZ003',
                Project: '道岔更换',
                Line: '朔黄线',
                PlanType: '年度计划',
                VarLevel: 'N/A',
                PlanDate: '2025-01-22T00:00:00Z',
                MonthPlanNo: 'MP202501',
                DayPlanNo: 'DP2025012201',
                RegStation: '神池南站',
                Hb: '双向',
                WorkLocation: '站内',
                DateInfo: '2025-01-22',
                ConstructionUnitAndPerson: '工务段/孙七',
                CooperateUnitAndPerson: '电务段/周八',
                ContentAndInfluence: '更换12号道岔',
                LimitAndChange: '封闭线路4小时',
                CreatedAt: '2025-01-03T10:00:00Z',
                UpdatedAt: '2025-01-03T10:00:00Z'
            }
        ];

        // 简单筛选逻辑
        let result = list;
        if (params.Mark) {
            const keyword = params.Mark.toLowerCase();
            result = result.filter(item =>
                item.Project.includes(keyword) ||
                item.Line.includes(keyword) ||
                item.ConstructionUnitAndPerson.includes(keyword)
            );
        }

        return {
            TotalCount: result.length,
            BizList: result
        };
    },

    // 设备列表模拟 (DescribeEqList)
    DescribeEqList: (params) => {
        const list = [
            {
                ID: 1,
                EqID: 'EQ001',
                EqName: '变压器-T1',
                EqNo: 'NO-2023001',
                EqModel: 'S-2000',
                EqTypeID: 'TYPE-001',
                EqCountName: '变压器类',
                AssetNo: 'ASSET-1001',
                QrCode: 'QR-1001',
                Manufacturer: '西门子',
                Units: '台',
                EqAmount: 1,
                DkNum: 23.5000,
                LockVersion: 1,
                UseStatusName: '使用中',
                BorrowStatusName: '未借出',
                BelongDeptID: 'DEPT-001',
                BelongDeptName: '供电段',
                BelongStationID: 'ST-001',
                BelongStationName: '西柏坡站',
                EqPositionID: 'POS-001',
                FaultTimes: 0,
                RepairTimes: 2,
                OperationDate: '2020-05-15T00:00:00Z',
                ProductDate: '2020-01-01T00:00:00Z',
                CreateDate: '2020-05-20T00:00:00Z',
                UpdateDate: '2023-01-01T00:00:00Z',
                CreateUserID: 'USER-001',
                CreateStationID: 'ST-001',
                UpdateUserID: 'USER-002',
                SysWhdw: '系统A',
                CreatedAt: '2020-05-20T00:00:00Z',
                UpdatedAt: '2023-01-01T00:00:00Z'
            },
            {
                ID: 2,
                EqID: 'EQ002',
                EqName: '断路器-CB1',
                EqNo: 'NO-2023002',
                EqModel: 'CB-500',
                EqTypeID: 'TYPE-002',
                EqCountName: '开关类',
                AssetNo: 'ASSET-1002',
                QrCode: 'QR-1002',
                Manufacturer: 'ABB',
                Units: '台',
                EqAmount: 1,
                DkNum: 100.5000,
                LockVersion: 1,
                UseStatusName: '维修中',
                BorrowStatusName: '未借出',
                BelongDeptID: 'DEPT-001',
                BelongDeptName: '供电段',
                BelongStationID: 'ST-002',
                BelongStationName: '黄骅港站',
                EqPositionID: 'POS-002',
                FaultTimes: 1,
                RepairTimes: 3,
                OperationDate: '2021-03-20T00:00:00Z',
                ProductDate: '2021-01-01T00:00:00Z',
                CreateDate: '2021-03-25T00:00:00Z',
                UpdateDate: '2023-06-15T00:00:00Z',
                CreateUserID: 'USER-003',
                CreateStationID: 'ST-002',
                UpdateUserID: 'USER-004',
                SysWhdw: '系统B',
                CreatedAt: '2021-03-25T00:00:00Z',
                UpdatedAt: '2023-06-15T00:00:00Z'
            },
            {
                ID: 3,
                EqID: 'EQ003',
                EqName: '信号机-X1',
                EqNo: 'NO-2023003',
                EqModel: 'SIG-100',
                EqTypeID: 'TYPE-003',
                EqCountName: '信号类',
                AssetNo: 'ASSET-1003',
                QrCode: 'QR-1003',
                Manufacturer: '卡斯柯',
                Units: '架',
                EqAmount: 1,
                DkNum: 50.2000,
                LockVersion: 1,
                UseStatusName: '使用中',
                BorrowStatusName: '未借出',
                BelongDeptID: 'DEPT-002',
                BelongDeptName: '电务段',
                BelongStationID: 'ST-003',
                BelongStationName: '神池南站',
                EqPositionID: 'POS-003',
                FaultTimes: 0,
                RepairTimes: 1,
                OperationDate: '2019-01-10T00:00:00Z',
                ProductDate: '2018-12-01T00:00:00Z',
                CreateDate: '2019-01-15T00:00:00Z',
                UpdateDate: '2023-01-01T00:00:00Z',
                CreateUserID: 'USER-005',
                CreateStationID: 'ST-003',
                UpdateUserID: 'USER-006',
                SysWhdw: '系统C',
                CreatedAt: '2019-01-15T00:00:00Z',
                UpdatedAt: '2023-01-01T00:00:00Z'
            },
            {
                ID: 4,
                EqID: 'EQ004',
                EqName: '道岔-SW1',
                EqNo: 'NO-2023004',
                EqModel: 'SW-60',
                EqTypeID: 'TYPE-004',
                EqCountName: '轨道类',
                AssetNo: 'ASSET-1004',
                QrCode: 'QR-1004',
                Manufacturer: '中铁宝桥',
                Units: '组',
                EqAmount: 1,
                DkNum: 150.8000,
                LockVersion: 2,
                UseStatusName: '报废',
                BorrowStatusName: '未借出',
                BelongDeptID: 'DEPT-003',
                BelongDeptName: '工务段',
                BelongStationID: 'ST-004',
                BelongStationName: '肃宁北站',
                EqPositionID: 'POS-004',
                FaultTimes: 5,
                RepairTimes: 10,
                OperationDate: '2015-08-08T00:00:00Z',
                ProductDate: '2015-06-01T00:00:00Z',
                CreateDate: '2015-08-10T00:00:00Z',
                UpdateDate: '2025-01-15T00:00:00Z',
                CreateUserID: 'USER-007',
                CreateStationID: 'ST-004',
                UpdateUserID: 'USER-008',
                SysWhdw: '系统D',
                CreatedAt: '2015-08-10T00:00:00Z',
                UpdatedAt: '2025-01-15T00:00:00Z'
            }
        ];

        let result = list;
        if (params.Mark) {
            const keyword = params.Mark.toLowerCase();
            result = result.filter(item =>
                item.EqName.toLowerCase().includes(keyword) ||
                item.BelongDeptName.toLowerCase().includes(keyword) ||
                item.BelongStationName.toLowerCase().includes(keyword)
            );
        }

        return {
            TotalCount: result.length,
            EqList: result
        };
    },

    // 业务链上信息模拟
    DescribeBizChainInfo: (params) => {
        return {
            TxnId: '0x' + Math.random().toString(16).substr(2, 64),
            BlockNumber: Math.floor(Math.random() * 100000),
            BlockHash: '0x' + Math.random().toString(16).substr(2, 64)
        };
    },

    // 设备链上信息模拟
    DescribeEqChainInfo: (params) => {
        return {
            TxnId: '0x' + Math.random().toString(16).substr(2, 64),
            BlockNumber: Math.floor(Math.random() * 100000),
            BlockHash: '0x' + Math.random().toString(16).substr(2, 64)
        };
    }
};
