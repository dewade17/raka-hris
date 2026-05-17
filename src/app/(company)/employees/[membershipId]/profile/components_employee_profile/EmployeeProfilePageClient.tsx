'use client';

import { Alert, Col, Row } from 'antd';
import { BriefcaseBusiness, Building2, IdCard } from 'lucide-react';
import { useState } from 'react';
import type { EmployeeAssignmentOption, EmployeeProfileEditFormValues, EmployeeProfileViewModel } from '../types';
import { useTerminateEmployee } from '../hooks/useTerminateEmployee';
import { useUpdateEmployeeProfile } from '../hooks/useUpdateEmployeeProfile';
import { EmployeeAssignmentCard } from './EmployeeAssignmentCard';
import { EmployeeEmploymentCard } from './EmployeeEmploymentCard';
import { EmployeeProfileEditDrawer } from './EmployeeProfileEditDrawer';
import { EmployeeProfileHeader } from './EmployeeProfileHeader';
import { EmployeeIdentityCard } from './EmployeeIdentityCard';
import { EmployeeProfileSummaryCard } from './EmployeeProfileSummaryCard';

type EmployeeProfilePageClientProps = {
  employee: EmployeeProfileViewModel;
  canManage: boolean;
  departmentOptions: EmployeeAssignmentOption[];
  positionOptions: EmployeeAssignmentOption[];
};

export function EmployeeProfilePageClient({ employee, canManage, departmentOptions, positionOptions }: EmployeeProfilePageClientProps) {
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const { clearErrorMessage, errorMessage, isSubmitting, updateEmployeeProfile } = useUpdateEmployeeProfile(employee.membershipId);
  const { isSubmitting: isTerminating, terminateEmployee } = useTerminateEmployee(employee.membershipId);
  const canMutateEmployee = canManage && !employee.isOwner && employee.status !== 'TERMINATED';

  const handleSubmit = async (values: EmployeeProfileEditFormValues) => {
    const success = await updateEmployeeProfile(values);

    if (success) {
      setEditDrawerOpen(false);
    }
  };

  return (
    <section aria-labelledby='employee-profile-page-title'>
      <EmployeeProfileHeader
        employee={employee}
        canManage={canManage}
        isTerminating={isTerminating}
        onEdit={() => {
          clearErrorMessage();
          setEditDrawerOpen(true);
        }}
        onTerminate={() => {
          void terminateEmployee();
        }}
      />

      {!employee.profile ? (
        <Alert
          showIcon
          type='warning'
          title='This employee does not have complete profile details yet.'
          style={{ marginBottom: 16 }}
        />
      ) : null}

      <Row
        gutter={[12, 12]}
        style={{ marginBottom: 16 }}
      >
        <Col
          xs={24}
          md={8}
        >
          <EmployeeProfileSummaryCard
            icon={
              <IdCard
                size={17}
                aria-hidden='true'
                focusable='false'
              />
            }
            label='Employee number'
            value={employee.profile?.employeeNumber ?? 'Not set'}
            detail='Used as the visible employee identifier'
          />
        </Col>
        <Col
          xs={24}
          md={8}
        >
          <EmployeeProfileSummaryCard
            icon={
              <Building2
                size={17}
                aria-hidden='true'
                focusable='false'
              />
            }
            label='Primary department'
            value={employee.primaryDepartment?.name ?? 'Not assigned'}
            detail={employee.departments.length > 1 ? `${employee.departments.length} departments linked` : 'Department assignment'}
          />
        </Col>
        <Col
          xs={24}
          md={8}
        >
          <EmployeeProfileSummaryCard
            icon={
              <BriefcaseBusiness
                size={17}
                aria-hidden='true'
                focusable='false'
              />
            }
            label='Primary position'
            value={employee.primaryPosition?.name ?? 'Not assigned'}
            detail={employee.positions.length > 1 ? `${employee.positions.length} positions linked` : 'Position assignment'}
          />
        </Col>
      </Row>

      <Row
        gutter={[16, 16]}
        style={{ marginBottom: 16 }}
      >
        <Col
          xs={24}
          lg={12}
        >
          <EmployeeIdentityCard employee={employee} />
        </Col>
        <Col
          xs={24}
          lg={12}
        >
          <EmployeeEmploymentCard employee={employee} />
        </Col>
      </Row>

      <EmployeeAssignmentCard
        employee={employee}
        canManage={canMutateEmployee}
        departmentOptions={departmentOptions}
        positionOptions={positionOptions}
      />

      <EmployeeProfileEditDrawer
        open={editDrawerOpen}
        employee={employee}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onClearError={clearErrorMessage}
        onClose={() => {
          setEditDrawerOpen(false);
          clearErrorMessage();
        }}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
