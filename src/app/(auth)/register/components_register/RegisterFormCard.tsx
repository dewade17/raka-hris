'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Alert, Button, Card, Checkbox, Divider, Form, Input, InputNumber, Typography, type FormProps } from 'antd';
import { ArrowRight, Building2, LockKeyhole, Mail, Phone, SatelliteDish, ShieldCheck, Users } from 'lucide-react';

type RegisterFormValues = {
  fullName: string;
  companyName: string;
  workEmail: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  seatLimit: number;
  acceptedTerms: boolean;
};

type RegisterResponsePayload = {
  message?: string;
  redirectUrl?: string;
};

type RegisterFormCardProps = {
  mode?: 'standard' | 'googleWorkspaceSetup';
  googleWorkspaceUser?: {
    name: string;
    email: string | null;
  };
};

const { Text, Title } = Typography;

const initialRegisterFormValues: RegisterFormValues = {
  fullName: '',
  companyName: '',
  workEmail: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  seatLimit: 10,
  acceptedTerms: false,
};

function getRegisterErrorMessage(payload: unknown) {
  if (payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string') {
    return payload.message;
  }

  return 'Pendaftaran belum berhasil. Periksa kembali data Anda, lalu coba lagi.';
}

function getRegisterRedirectUrl(payload: unknown, fallbackUrl: string) {
  if (payload && typeof payload === 'object' && 'redirectUrl' in payload && typeof payload.redirectUrl === 'string' && payload.redirectUrl.startsWith('/')) {
    return payload.redirectUrl;
  }

  return fallbackUrl;
}

function normalizePhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/\s+/g, '').trim();
}

export function RegisterFormCard({ mode = 'standard', googleWorkspaceUser }: RegisterFormCardProps) {
  const isGoogleWorkspaceSetup = mode === 'googleWorkspaceSetup';
  const [form] = Form.useForm<RegisterFormValues>();
  const [generalErrorMessage, setGeneralErrorMessage] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterSubmit: FormProps<RegisterFormValues>['onFinish'] = async (values) => {
    setGeneralErrorMessage(undefined);
    setSuccessMessage(undefined);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(isGoogleWorkspaceSetup
            ? {
                registrationMode: 'google-workspace',
              }
            : {
                fullName: values.fullName.trim(),
                email: values.workEmail.trim().toLowerCase(),
                password: values.password,
              }),
          companyName: values.companyName.trim(),
          phoneNumber: normalizePhoneNumber(values.phoneNumber),
          seatLimit: values.seatLimit,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as RegisterResponsePayload | Record<string, never>;

      if (!response.ok) {
        setGeneralErrorMessage(getRegisterErrorMessage(payload));
        return;
      }

      setSuccessMessage(isGoogleWorkspaceSetup ? 'Workspace perusahaan berhasil dibuat. Anda akan diarahkan ke dashboard.' : 'Akun Anda berhasil dibuat. Anda akan diarahkan ke halaman masuk.');
      window.location.href = getRegisterRedirectUrl(payload, isGoogleWorkspaceSetup ? '/dashboard-company' : '/login');
    } catch {
      setGeneralErrorMessage('Layanan pendaftaran belum dapat dihubungi. Periksa koneksi Anda, lalu coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby='register-form-title'
      className='order-1 mx-auto flex w-full max-w-xl flex-col lg:order-2 lg:mx-0 lg:justify-self-end'
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
                {isGoogleWorkspaceSetup ? 'Setup workspace' : 'Pendaftaran perusahaan'}
              </span>

              <Title
                id='register-form-title'
                level={1}
                className='!mb-0 !mt-6 !text-3xl !font-semibold !tracking-[-0.04em] !text-raka-dark sm:!text-4xl'
              >
                {isGoogleWorkspaceSetup ? 'Lengkapi Workspace' : 'Buat Akun Baru'}
              </Title>

              <Text className='mt-3 block !text-sm !leading-7 !text-slate-600'>{isGoogleWorkspaceSetup ? 'Daftarkan company untuk akun Google Anda.' : 'Daftarkan perusahaan Anda untuk mulai menggunakan Raka HRIS.'}</Text>
            </div>

            <span className='hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f8fafc] text-base font-bold tracking-tight text-raka-primary ring-1 ring-slate-200 sm:flex'>RH</span>
          </div>

          {generalErrorMessage ? (
            <Alert
              showIcon
              type='error'
              title={generalErrorMessage}
              className='mt-6 rounded-2xl'
            />
          ) : null}

          {successMessage ? (
            <Alert
              showIcon
              type='success'
              title={successMessage}
              className='mt-6 rounded-2xl'
            />
          ) : null}

          <Form<RegisterFormValues>
            form={form}
            layout='vertical'
            requiredMark={false}
            initialValues={{
              ...initialRegisterFormValues,
              ...(isGoogleWorkspaceSetup
                ? {
                    fullName: googleWorkspaceUser?.name ?? '',
                    workEmail: googleWorkspaceUser?.email ?? '',
                  }
                : {}),
            }}
            onFinish={handleRegisterSubmit}
            onValuesChange={() => {
              setGeneralErrorMessage(undefined);
              setSuccessMessage(undefined);
            }}
            className='mt-8'
          >
            {isGoogleWorkspaceSetup ? (
              <Alert
                showIcon
                type='info'
                title={googleWorkspaceUser?.email ?? 'Google account connected'}
                description='Lengkapi data company untuk membuka dashboard company.'
                className='!mb-6 rounded-2xl border-raka-blue-light/60 bg-raka-blue/10'
              />
            ) : (
              <Form.Item<RegisterFormValues>
                name='fullName'
                label={<span className='text-sm font-semibold text-raka-dark'>Nama Lengkap</span>}
                rules={[
                  {
                    required: true,
                    message: 'Nama lengkap wajib diisi.',
                  },
                  {
                    min: 3,
                    message: 'Nama lengkap minimal 3 karakter.',
                  },
                ]}
                validateTrigger={['onBlur', 'onSubmit']}
              >
                <Input
                  size='large'
                  autoComplete='name'
                  placeholder='Masukkan nama lengkap'
                  prefix={
                    <Users
                      size={18}
                      className='text-slate-400'
                      aria-hidden='true'
                    />
                  }
                  className='min-h-[3.25rem] rounded-2xl border-slate-200 text-sm font-medium'
                />
              </Form.Item>
            )}

            <Form.Item<RegisterFormValues>
              name='companyName'
              label={<span className='text-sm font-semibold text-raka-dark'>Nama Perusahaan</span>}
              rules={[
                {
                  required: true,
                  message: 'Nama perusahaan wajib diisi.',
                },
                {
                  min: 2,
                  message: 'Nama perusahaan minimal 2 karakter.',
                },
              ]}
              validateTrigger={['onBlur', 'onSubmit']}
            >
              <Input
                size='large'
                autoComplete='organization'
                placeholder='Contoh: PT Raka Teknologi Indonesia'
                prefix={
                  <Building2
                    size={18}
                    className='text-slate-400'
                    aria-hidden='true'
                  />
                }
                className='min-h-[3.25rem] rounded-2xl border-slate-200 text-sm font-medium'
              />
            </Form.Item>

            {!isGoogleWorkspaceSetup ? (
              <Form.Item<RegisterFormValues>
                name='workEmail'
                label={<span className='text-sm font-semibold text-raka-dark'>Email Kerja</span>}
                rules={[
                  {
                    required: true,
                    message: 'Email kerja wajib diisi.',
                  },
                  {
                    type: 'email',
                    message: 'Masukkan email kerja yang valid.',
                  },
                ]}
                validateTrigger={['onBlur', 'onSubmit']}
              >
                <Input
                  size='large'
                  type='email'
                  autoComplete='email'
                  placeholder='nama@perusahaan.com'
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
            ) : null}

            <Form.Item<RegisterFormValues>
              name='phoneNumber'
              label={<span className='text-sm font-semibold text-raka-dark'>Nomor Telepon</span>}
              rules={[
                {
                  required: true,
                  message: 'Nomor telepon wajib diisi.',
                },
                {
                  pattern: /^\+?[0-9\s-]{8,18}$/,
                  message: 'Gunakan nomor telepon yang valid, misalnya +6281234567890.',
                },
              ]}
              validateTrigger={['onBlur', 'onSubmit']}
            >
              <Input
                size='large'
                type='tel'
                autoComplete='tel'
                placeholder='+6281234567890'
                prefix={
                  <Phone
                    size={18}
                    className='text-slate-400'
                    aria-hidden='true'
                  />
                }
                className='min-h-[3.25rem] rounded-2xl border-slate-200 text-sm font-medium'
              />
            </Form.Item>

            <Form.Item<RegisterFormValues>
              name='seatLimit'
              label={<span className='text-sm font-semibold text-raka-dark'>Jumlah User / Seat</span>}
              extra={<span className='text-xs text-slate-500'>Termasuk owner company sebagai 1 seat.</span>}
              rules={[
                {
                  required: true,
                  message: 'Jumlah user wajib diisi.',
                },
                {
                  type: 'number',
                  min: 1,
                  message: 'Jumlah user minimal 1.',
                },
              ]}
              validateTrigger={['onBlur', 'onSubmit']}
            >
              <InputNumber
                size='large'
                min={1}
                max={10000}
                className='!min-h-[3.25rem] !w-full !rounded-2xl !border-slate-200 !text-sm !font-medium'
              />
            </Form.Item>

            {!isGoogleWorkspaceSetup ? (
              <>
                <Form.Item<RegisterFormValues>
                  name='password'
                  label={<span className='text-sm font-semibold text-raka-dark'>Password</span>}
                  extra={<span className='text-xs text-slate-500'>Minimal 8 karakter, gunakan kombinasi huruf dan angka.</span>}
                  rules={[
                    {
                      required: true,
                      message: 'Password wajib diisi.',
                    },
                    {
                      min: 8,
                      message: 'Password minimal 8 karakter.',
                    },
                    {
                      pattern: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                      message: 'Gunakan kombinasi huruf dan angka.',
                    },
                  ]}
                  validateTrigger={['onBlur', 'onSubmit']}
                >
                  <Input.Password
                    size='large'
                    autoComplete='new-password'
                    placeholder='Buat password'
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

                <Form.Item<RegisterFormValues>
                  name='confirmPassword'
                  label={<span className='text-sm font-semibold text-raka-dark'>Konfirmasi Password</span>}
                  dependencies={['password']}
                  rules={[
                    {
                      required: true,
                      message: 'Konfirmasi password wajib diisi.',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }

                        return Promise.reject(new Error('Konfirmasi password harus sama dengan password.'));
                      },
                    }),
                  ]}
                  validateTrigger={['onBlur', 'onSubmit']}
                >
                  <Input.Password
                    size='large'
                    autoComplete='new-password'
                    placeholder='Ulangi password'
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
              </>
            ) : null}

            <Form.Item<RegisterFormValues>
              name='acceptedTerms'
              valuePropName='checked'
              rules={[
                {
                  validator: (_, value) => {
                    if (value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('Anda perlu menyetujui syarat dan kebijakan privasi terlebih dahulu.'));
                  },
                },
              ]}
              className='!mb-5'
            >
              <Checkbox className='text-sm font-medium leading-6 text-slate-600'>
                Saya menyetujui{' '}
                <Link
                  href='/terms-of-service'
                  className='font-semibold text-raka-blue transition hover:text-raka-primary focus:outline-none focus:ring-2 focus:ring-raka-blue focus:ring-offset-2'
                >
                  Syarat & Ketentuan
                </Link>{' '}
                dan{' '}
                <Link
                  href='/privacy-policy'
                  className='font-semibold text-raka-blue transition hover:text-raka-primary focus:outline-none focus:ring-2 focus:ring-raka-blue focus:ring-offset-2'
                >
                  Kebijakan Privasi
                </Link>
                .
              </Checkbox>
            </Form.Item>

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
              {isSubmitting ? (isGoogleWorkspaceSetup ? 'Membuat workspace...' : 'Mendaftarkan akun...') : isGoogleWorkspaceSetup ? 'Buat Workspace' : 'Daftar Sekarang'}
            </Button>

            {!isGoogleWorkspaceSetup ? (
              <>
                <Divider className='!my-6'>
                  <span className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>atau</span>
                </Divider>

                <Button
                  type='default'
                  size='large'
                  block
                  icon={<SatelliteDish size={18} />}
                  onClick={() => {
                    window.location.href = '/api/auth/google/start';
                  }}
                  className='!min-h-[3.25rem] !rounded-2xl !border-slate-200 !bg-white !text-sm !font-semibold !text-raka-dark !shadow-sm transition hover:!-translate-y-0.5 hover:!border-raka-blue-light hover:!bg-[#f8fafc] hover:!text-raka-primary'
                >
                  Daftar dengan Google
                </Button>
              </>
            ) : null}
          </Form>

          {!isGoogleWorkspaceSetup ? (
            <div className='mt-6 text-center text-sm text-slate-600'>
              Sudah punya akun?{' '}
              <Link
                href='/login'
                className='font-semibold text-raka-blue transition hover:text-raka-primary focus:outline-none focus:ring-2 focus:ring-raka-blue focus:ring-offset-2'
              >
                Masuk
              </Link>
            </div>
          ) : null}
        </div>
      </Card>
    </section>
  );
}
