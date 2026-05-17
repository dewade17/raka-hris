import { Card, Skeleton, Space } from 'antd';

export default function EmployeeProfileLoading() {
  return (
    <Space
      orientation='vertical'
      size={16}
      style={{ width: '100%' }}
    >
      <Card variant='borderless'>
        <Skeleton
          active
          avatar
          paragraph={{ rows: 3 }}
        />
      </Card>
      <Card variant='borderless'>
        <Skeleton
          active
          paragraph={{ rows: 5 }}
        />
      </Card>
      <Card variant='borderless'>
        <Skeleton
          active
          paragraph={{ rows: 4 }}
        />
      </Card>
    </Space>
  );
}
