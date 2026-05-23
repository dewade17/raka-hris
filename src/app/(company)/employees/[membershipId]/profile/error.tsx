'use client';

import { Alert, Button, Result } from 'antd';

export default function EmployeeProfileError({ reset }: { reset: () => void }) {
  return (
    <Result
      status='error'
      title='Employee profile could not be loaded'
      subTitle='Please refresh the page or try again in a moment.'
      extra={
        <Button
          type='primary'
          onClick={reset}
        >
          Try again
        </Button>
      }
    >
      <Alert
        showIcon
        type='error'
        title='The employee profile page is unavailable right now.'
      />
    </Result>
  );
}
