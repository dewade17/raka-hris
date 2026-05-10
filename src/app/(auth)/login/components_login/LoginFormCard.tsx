'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Alert, Button, Card, Checkbox, Divider, Form, Input, Typography, type FormProps } from 'antd';
import { ArrowRight, LockKeyhole, Mail, SatelliteDish, ShieldCheck } from 'lucide-react';

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type LoginResponsePayload = {
  message?: string;
  redirectUrl?: string;
};

const { Text, Title } = Typography;

const initialLoginFormValues: LoginFormValues = {
  email: '',
  password: '',
  rememberMe: false,
};

function getLoginErrorMessage(payload: unknown) {
  if (payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string') {
    return payload.message;
  }

  return 'Invalid email or password. Please try again.';
}

function getLoginRedirectUrl(payload: unknown) {
  if (payload && typeof payload === 'object' && 'redirectUrl' in payload && typeof payload.redirectUrl === 'string' && payload.redirectUrl.startsWith('/')) {
    return payload.redirectUrl;
  }

  return '/home';
}

export function LoginFormCard() {
  const [form] = Form.useForm<LoginFormValues>();
  const [generalErrorMessage, setGeneralErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit: FormProps<LoginFormValues>['onFinish'] = async (values) => {
    setGeneralErrorMessage(undefined);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email.trim(),
          password: values.password,
          rememberMe: Boolean(values.rememberMe),
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as LoginResponsePayload | Record<string, never>;

      if (!response.ok) {
        setGeneralErrorMessage(getLoginErrorMessage(payload));
        return;
      }

      window.location.href = getLoginRedirectUrl(payload);
    } catch {
      setGeneralErrorMessage('We could not reach the sign-in service. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby='login-form-title'
      className='order-1 mx-auto flex w-full max-w-xl flex-col lg:order-2'
    >
      <Card
        className='overflow-hidden rounded-[2rem] border-slate-200 shadow-2xl shadow-raka-blue/10'
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <div className='bg-white p-6 sm:p-8'>
          <div className='flex items-start justify-between gap-5'>
            <div>
              <span className='inline-flex items-center gap-2 rounded-full border border-raka-blue-light/60 bg-raka-blue/10 px-4 py-2 text-sm font-semibold text-raka-primary'>
                <ShieldCheck
                  size={16}
                  aria-hidden='true'
                />
                Secure login
              </span>

              <Title
                id='login-form-title'
                level={1}
                className='!mb-0 !mt-6 !text-3xl !font-semibold !tracking-[-0.04em] !text-raka-dark sm:!text-4xl'
              >
                Sign in to your account
              </Title>

              <Text className='mt-3 block !text-sm !leading-7 !text-slate-600'>Enter your credentials to continue to your RAKA HRIS workspace.</Text>
            </div>

            <span className='hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f8fafc] ring-1 ring-slate-200 sm:flex'>
              <Image
                src='/RAKA HRIS solutions logo.png'
                alt=''
                width={40}
                height={40}
                className='h-10 w-10 object-contain'
              />
            </span>
          </div>

          {generalErrorMessage ? (
            <Alert
              showIcon
              type='error'
              title={generalErrorMessage}
              className='mt-6 rounded-2xl'
            />
          ) : null}

          <Form<LoginFormValues>
            form={form}
            layout='vertical'
            requiredMark={false}
            initialValues={initialLoginFormValues}
            onFinish={handleLoginSubmit}
            onValuesChange={() => setGeneralErrorMessage(undefined)}
            className='mt-8'
          >
            <Form.Item<LoginFormValues>
              name='email'
              label={<span className='text-sm font-semibold text-raka-dark'>Email address</span>}
              rules={[
                {
                  required: true,
                  message: 'Email address is required.',
                },
                {
                  type: 'email',
                  message: 'Please enter a valid email address.',
                },
              ]}
              validateTrigger={['onBlur', 'onSubmit']}
            >
              <Input
                size='large'
                type='email'
                autoComplete='email'
                placeholder='you@company.com'
                prefix={
                  <Mail
                    size={18}
                    className='text-slate-400'
                    aria-hidden='true'
                  />
                }
                className='min-h-[3.25rem] rounded-2xl border-slate-200 text-sm font-medium'
              />
            </Form.Item>

            <Form.Item<LoginFormValues>
              name='password'
              label={
                <div className='flex w-full items-center justify-between gap-4'>
                  <span className='text-sm font-semibold text-raka-dark'>Password</span>
                  <Link
                    href='/forgot-password'
                    className='text-sm font-semibold text-raka-blue transition hover:text-raka-primary focus:outline-none focus:ring-2 focus:ring-raka-blue focus:ring-offset-2'
                  >
                    Forgot password?
                  </Link>
                </div>
              }
              rules={[
                {
                  required: true,
                  message: 'Password is required.',
                },
              ]}
              validateTrigger={['onBlur', 'onSubmit']}
            >
              <Input.Password
                size='large'
                autoComplete='current-password'
                placeholder='Enter your password'
                prefix={
                  <LockKeyhole
                    size={18}
                    className='text-slate-400'
                    aria-hidden='true'
                  />
                }
                className='min-h-[3.25rem] rounded-2xl border-slate-200 text-sm font-medium'
              />
            </Form.Item>

            <div className='mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <Form.Item<LoginFormValues>
                name='rememberMe'
                valuePropName='checked'
                noStyle
              >
                <Checkbox className='text-sm font-medium text-slate-600'>Remember me</Checkbox>
              </Form.Item>
              <Text className='!text-sm !text-slate-500'>Need access? Contact your HR administrator.</Text>
            </div>

            <Button
              htmlType='submit'
              type='primary'
              size='large'
              block
              loading={isSubmitting}
              icon={!isSubmitting ? <ArrowRight size={17} /> : undefined}
              iconPlacement='end'
              className='!min-h-[3.25rem] !rounded-2xl !border-raka-accent !bg-raka-accent !text-sm !font-semibold !shadow-lg !shadow-raka-accent/20 transition hover:!-translate-y-0.5 hover:!border-raka-accent-soft hover:!bg-raka-accent-soft'
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>

            <Divider className='!my-6'>
              <span className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>or</span>
            </Divider>

            <Button
              type='default'
              size='large'
              block
              icon={<SatelliteDish size={18} />}
              onClick={() => setGeneralErrorMessage('Google sign-in is not configured yet. Please use your email and password or contact your HR administrator.')}
              className='!min-h-[3.25rem] !rounded-2xl !border-slate-200 !bg-white !text-sm !font-semibold !text-raka-dark !shadow-sm transition hover:!-translate-y-0.5 hover:!border-raka-blue-light hover:!bg-[#f8fafc] hover:!text-raka-primary'
            >
              Sign in with Google
            </Button>
          </Form>

          <SecurityNotice />

          <div className='mt-6 text-center'>
            <Link
              href='/home'
              className='text-sm font-semibold text-raka-blue transition hover:text-raka-primary focus:outline-none focus:ring-2 focus:ring-raka-blue focus:ring-offset-2'
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
}

function SecurityNotice() {
  return (
    <Alert
      showIcon
      type='info'
      icon={<ShieldCheck size={20} />}
      title={<span className='font-semibold text-raka-dark'>Protected access</span>}
      description='Your access is protected with secure authentication and role-based permissions.'
      className='mt-6 rounded-2xl border-raka-blue-light/60 bg-raka-blue/10'
    />
  );
}
