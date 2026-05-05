"use client";

import {
  Badge,
  Button,
  Card,
  Col,
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  type TableProps,
} from "antd";
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Download,
  Plus,
  Search,
  Users,
} from "lucide-react";

type EmployeeRow = {
  key: string;
  employee: string;
  department: string;
  status: "Aktif" | "Cuti" | "Probation";
  attendance: number;
};

const employeeRows: EmployeeRow[] = [
  {
    key: "1",
    employee: "Ni Made Sri Utami",
    department: "People Operations",
    status: "Aktif",
    attendance: 98,
  },
  {
    key: "2",
    employee: "I Wayan Adi Pratama",
    department: "Payroll",
    status: "Probation",
    attendance: 92,
  },
  {
    key: "3",
    employee: "Kadek Dwi Lestari",
    department: "Recruitment",
    status: "Cuti",
    attendance: 86,
  },
];

const employeeColumns: TableProps<EmployeeRow>["columns"] = [
  {
    title: "Pegawai",
    dataIndex: "employee",
    key: "employee",
  },
  {
    title: "Unit",
    dataIndex: "department",
    key: "department",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: EmployeeRow["status"]) => {
      const color =
        status === "Aktif" ? "green" : status === "Cuti" ? "gold" : "blue";

      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    title: "Kehadiran",
    dataIndex: "attendance",
    key: "attendance",
    render: (attendance: number) => (
      <Progress percent={attendance} size="small" strokeColor="#0f766e" />
    ),
  },
];

const summaryCards = [
  {
    title: "Total Pegawai",
    value: 248,
    suffix: "orang",
    icon: <Users size={18} aria-hidden="true" />,
  },
  {
    title: "Kehadiran Hari Ini",
    value: 96,
    suffix: "%",
    icon: <CheckCircle2 size={18} aria-hidden="true" />,
  },
  {
    title: "Cuti Menunggu",
    value: 12,
    suffix: "pengajuan",
    icon: <CalendarDays size={18} aria-hidden="true" />,
  },
  {
    title: "Lowongan Aktif",
    value: 7,
    suffix: "posisi",
    icon: <BriefcaseBusiness size={18} aria-hidden="true" />,
  },
];

export function DashboardPreview() {
  return (
    <main className="min-h-screen bg-[#f6f8fb]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-none border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-teal-700">Raka HRIS</p>
            <h1 className="text-3xl font-semibold tracking-normal text-slate-950">
              Ringkasan Operasional SDM
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Pantau pegawai, absensi, cuti, dan kebutuhan rekrutmen dalam satu
              layar kerja.
            </p>
          </div>

          <Space wrap>
            <Button icon={<Search size={16} aria-hidden="true" />}>
              Cari
            </Button>
            <Button icon={<Download size={16} aria-hidden="true" />}>
              Ekspor
            </Button>
            <Button
              type="primary"
              icon={<Plus size={16} aria-hidden="true" />}
            >
              Tambah Pegawai
            </Button>
          </Space>
        </header>

        <Row gutter={[16, 16]}>
          {summaryCards.map((item) => (
            <Col xs={24} sm={12} lg={6} key={item.title}>
              <Card variant="outlined" className="h-full">
                <Space orientation="vertical" size={12} className="w-full">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-slate-500">
                      {item.title}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-50 text-teal-700">
                      {item.icon}
                    </span>
                  </div>
                  <Statistic value={item.value} suffix={item.suffix} />
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} align="stretch">
          <Col xs={24} lg={16}>
            <Card
              title="Daftar Pegawai Prioritas"
              extra={<Badge status="processing" text="Live" />}
              className="h-full"
            >
              <Table<EmployeeRow>
                columns={employeeColumns}
                dataSource={employeeRows}
                pagination={false}
                size="middle"
                scroll={{ x: 760 }}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Agenda SDM" className="h-full">
              <Space orientation="vertical" size={16} className="w-full">
                <div className="rounded-md border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Bell size={16} aria-hidden="true" />
                    Validasi cuti kuartal
                  </div>
                  <p className="m-0 text-sm leading-6 text-slate-600">
                    12 pengajuan perlu diproses sebelum rekap payroll.
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <CalendarDays size={16} aria-hidden="true" />
                    Evaluasi probation
                  </div>
                  <p className="m-0 text-sm leading-6 text-slate-600">
                    4 pegawai memasuki periode evaluasi akhir bulan ini.
                  </p>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </main>
  );
}
