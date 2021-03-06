import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import AcademyTable from './components/AcademyTable';

const AcademyList = () => {
  return (
    <>
      <PageContainer
        header={{
          ghost: true,
          title: '',
        }}
      >
        <AcademyTable />
      </PageContainer>
    </>
  );
};

export default AcademyList;
