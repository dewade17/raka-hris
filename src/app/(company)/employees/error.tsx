'use client';

import { Alert, Button, Result } from 'antd';

export default function EmployeesError({ reset }: { reset: () => void }) {
  return (
    <Result
      status='error'
      title='Employees could not be loaded'
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
        message='The employee list is unavailable right now.'
      />
    </Result>
  );
}
