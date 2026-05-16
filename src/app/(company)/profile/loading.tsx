import { Card, Skeleton, Space } from 'antd';

export default function CompanyProfileLoading() {
  return (
    <Space
      orientation='vertical'
      size={16}
      style={{ width: '100%' }}
    >
      <Card variant='borderless'>
        <Skeleton
          active
          paragraph={{ rows: 3 }}
        />
      </Card>
      <Card variant='borderless'>
        <Skeleton
          active
          paragraph={{ rows: 8 }}
        />
      </Card>
    </Space>
  );
}
