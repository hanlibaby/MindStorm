import React, { useImperativeHandle, useRef, useState } from 'react';
import { Button, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { deleteCourseClassStudent, queryCourseClassStudent } from '@/services/courseclassstudent';
import StudentCreateForm from './StudentCreateForm';

const StudentTable = (props) => {
  const { currentClassId, childRef } = props;
  const actionRef = useRef();
  const [isModalVisible, setModalVisible] = useState(false);
  const [classId, setClassId] = useState(currentClassId);

  useImperativeHandle(childRef, () => ({
    setValue: (value) => {
      setClassId(value);
      actionRef?.current.reset();
    },
  }));

  const handleQueryCourseClassStudent = async (params) => {
    const res = await queryCourseClassStudent({
      ...params,
      pageIndex: params.current,
      pageSize: params.pageSize,
      classId,
    });
    const { records, total } = res.data.queryCourseClassStudentPage;
    return {
      data: records,
      total,
      success: res.success,
    };
  };

  const handleDeleteCourseClassStudent = async (courseClassStudentId) => {
    const res = await deleteCourseClassStudent(courseClassStudentId);
    if (res.success) {
      message.success(`移除成功！`);
      actionRef?.current.reset();
    } else {
      message.error(res.message);
    }
  };

  const columns = [
    {
      title: '真实姓名',
      dataIndex: 'realName',
    },
    {
      title: '学号',
      dataIndex: 'sno',
    },
    {
      title: '院系',
      dataIndex: 'academyName',
      search: false,
    },
    {
      title: '专业',
      dataIndex: 'professionName',
      search: false,
    },
    {
      title: '加入时间',
      dataIndex: 'gmtCreate',
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm
          key="delete"
          title={`你确定要将【${record.realName}】从这个班级移除吗？`}
          onConfirm={() => handleDeleteCourseClassStudent(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <a>移除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        rowKey={(record) => record.id}
        request={(params) => handleQueryCourseClassStudent(params)}
        dateFormatter="string"
        headerTitle="全部学生"
        pagination={{ defaultCurrent: 1, defaultPageSize: 10 }}
        options={{ fullScreen: true }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            新增学生
          </Button>,
        ]}
      />
      {!isModalVisible ? (
        ''
      ) : (
        <StudentCreateForm
          classId={classId}
          actionRef={actionRef}
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
        />
      )}
    </>
  );
};

export default StudentTable;
