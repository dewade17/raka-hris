import { MembershipStatus, Prisma } from '@/generated/prisma/client';
import { assertEmailDeliveryConfigured, sendEmail } from '@/server/email';
import { hashPassword } from '@/server/password';
import {
  createCompanyEmployeeAccountRecord,
  deleteCreatedCompanyEmployeeAccount,
  findActiveCompanyDepartment,
  findActiveCompanyPosition,
  findCompanyEmployeeForManagement,
  findCompanyEmployeeList,
  findCompanyEmployeeProfile,
  findCompanySeatUsage,
  terminateCompanyEmployeeRecord,
  updateCompanyEmployeeRecord,
  updateEmployeeAssignmentRecords,
} from './repository';
import type {
  CompanyEmployeeListData,
  CompanyEmployeeProfile,
  EmployeeAssignmentMutationResult,
  EmployeeAssignmentSummary,
  CreateCompanyEmployeeInput,
  EmployeeCreateMutationResult,
  EmployeeTerminateMutationResult,
  EmployeeUpdateMutationResult,
  TerminateCompanyEmployeeInput,
  UpdateCompanyEmployeeInput,
  UpdateEmployeeAssignmentInput,
} from './types';

type CompanyEmployeeProfileRecord = NonNullable<Awaited<ReturnType<typeof findCompanyEmployeeProfile>>>;
type EmployeeDepartmentAssignmentRecord = CompanyEmployeeProfileRecord['employeeDepartments'][number];
type EmployeePositionAssignmentRecord = CompanyEmployeeProfileRecord['employeePositions'][number];

export async function createCompanyEmployee(companyId: string, companyName: string, input: CreateCompanyEmployeeInput): Promise<EmployeeCreateMutationResult> {
  const seatUsage = await findCompanySeatUsage(companyId);

  if (!seatUsage.hasSubscription) {
    return {
      success: false,
      status: 400,
      message: 'Employee account could not be created because this company does not have an active seat allocation.',
    };
  }

  if (seatUsage.usedSeats >= seatUsage.seatLimit) {
    return {
      success: false,
      status: 409,
      message: 'Your company has reached the current seat limit. Increase the seat limit before adding another employee.',
    };
  }

  try {
    assertEmailDeliveryConfigured();
  } catch {
    return {
      success: false,
      status: 500,
      message: 'Email delivery is not configured yet. Please configure the welcome email sender before creating employees.',
    };
  }

  const [department, position] = await Promise.all([
    findActiveCompanyDepartment(companyId, input.departmentId),
    findActiveCompanyPosition(companyId, input.positionId),
  ]);

  if (!department) {
    return {
      success: false,
      status: 400,
      message: 'Selected department is not available. Please choose an active department.',
    };
  }

  if (!position) {
    return {
      success: false,
      status: 400,
      message: 'Selected position is not available. Please choose an active position.',
    };
  }

  try {
    const passwordHash = await hashPassword(input.password);
    const employee = await createCompanyEmployeeAccountRecord(companyId, {
      ...input,
      passwordHash,
    });

    try {
      await sendEmployeeWelcomeEmail({
        companyName,
        fullName: input.fullName,
        email: input.email,
        password: input.password,
      });
    } catch {
      await deleteCreatedCompanyEmployeeAccount(employee.userId).catch(() => null);

      return {
        success: false,
        status: 502,
        message: 'Employee account could not be created because the welcome email could not be sent. Please check email settings and try again.',
      };
    }

    return {
      success: true,
      status: 201,
      message: 'Employee created successfully. The login details were sent by email.',
      id: employee.id,
    };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        status: 409,
        message: 'An account with this email address already exists.',
      };
    }

    return {
      success: false,
      status: 500,
      message: 'Employee account could not be created right now. Please try again.',
    };
  }
}

export async function getCompanyEmployeeList(companyId: string): Promise<CompanyEmployeeListData> {
  const employees = (await findCompanyEmployeeList(companyId)).map((employee) => {
    const primaryDepartment = employee.employeeDepartments[0]
      ? mapDepartmentAssignment(employee.employeeDepartments[0])
      : null;
    const primaryPosition = employee.employeePositions[0]
      ? mapPositionAssignment(employee.employeePositions[0])
      : null;
    const hasCompleteProfile = Boolean(
      employee.employeeProfile?.employeeNumber &&
        employee.employeeProfile.phone &&
        employee.employeeProfile.employmentType &&
        employee.employeeProfile.hireDate &&
        primaryDepartment &&
        primaryPosition,
    );

    return {
      id: employee.id,
      status: employee.status,
      isOwner: employee.isOwner,
      joinedAt: employee.joinedAt,
      user: employee.user,
      employeeNumber: employee.employeeProfile?.employeeNumber ?? null,
      employmentType: employee.employeeProfile?.employmentType ?? null,
      hireDate: employee.employeeProfile?.hireDate ?? null,
      primaryDepartment,
      primaryPosition,
      hasCompleteProfile,
    };
  });

  return {
    employees,
    summary: {
      total: employees.length,
      active: employees.filter((employee) => employee.status === MembershipStatus.ACTIVE).length,
      incompleteProfiles: employees.filter((employee) => !employee.hasCompleteProfile).length,
      withoutDepartment: employees.filter((employee) => !employee.primaryDepartment).length,
    },
  };
}

export async function getCompanyEmployeeProfile(companyId: string, membershipId: string): Promise<CompanyEmployeeProfile | null> {
  const employee = await findCompanyEmployeeProfile(companyId, membershipId);

  if (!employee) {
    return null;
  }

  const departments = employee.employeeDepartments.map(mapDepartmentAssignment);

  const positions = employee.employeePositions.map(mapPositionAssignment);

  return {
    id: employee.id,
    status: employee.status,
    isOwner: employee.isOwner,
    joinedAt: employee.joinedAt,
    lastLoginAt: employee.lastLoginAt,
    employmentEndedAt: employee.employmentEndedAt,
    user: employee.user,
    profile: employee.employeeProfile,
    departments,
    positions,
    primaryDepartment: departments.find((department) => department.isPrimary) ?? null,
    primaryPosition: positions.find((position) => position.isPrimary) ?? null,
  };
}

export async function updateCompanyEmployee(
  companyId: string,
  membershipId: string,
  input: UpdateCompanyEmployeeInput,
): Promise<EmployeeUpdateMutationResult> {
  try {
    const employee = await findCompanyEmployeeForManagement(companyId, membershipId);

    if (!employee) {
      return {
        success: false,
        status: 404,
        message: 'Employee could not be found.',
      };
    }

    if (employee.status === MembershipStatus.TERMINATED) {
      return {
        success: false,
        status: 400,
        message: 'Terminated employees cannot be updated.',
      };
    }

    if (employee.isOwner && input.status !== employee.status) {
      return {
        success: false,
        status: 400,
        message: 'The company owner status cannot be changed from employee profile.',
      };
    }

    await updateCompanyEmployeeRecord(employee.id, employee.userId, input);

    return {
      success: true,
      status: 200,
      message: 'Employee updated successfully.',
    };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        status: 409,
        message: 'An account with this email address already exists.',
      };
    }

    return {
      success: false,
      status: 500,
      message: 'Employee could not be updated right now. Please try again.',
    };
  }
}

export async function terminateCompanyEmployee(
  companyId: string,
  membershipId: string,
  terminatedByUserId: string,
  input: TerminateCompanyEmployeeInput,
): Promise<EmployeeTerminateMutationResult> {
  try {
    const employee = await findCompanyEmployeeForManagement(companyId, membershipId);

    if (!employee) {
      return {
        success: false,
        status: 404,
        message: 'Employee could not be found.',
      };
    }

    if (employee.isOwner) {
      return {
        success: false,
        status: 400,
        message: 'The company owner account cannot be terminated from employee CRUD.',
      };
    }

    if (employee.status === MembershipStatus.TERMINATED) {
      return {
        success: false,
        status: 400,
        message: 'This employee is already terminated.',
      };
    }

    await terminateCompanyEmployeeRecord(employee.id, terminatedByUserId, input);

    return {
      success: true,
      status: 200,
      message: 'Employee terminated successfully.',
    };
  } catch {
    return {
      success: false,
      status: 500,
      message: 'Employee could not be terminated right now. Please try again.',
    };
  }
}

export async function updateCompanyEmployeeAssignment(
  companyId: string,
  membershipId: string,
  input: UpdateEmployeeAssignmentInput,
): Promise<EmployeeAssignmentMutationResult> {
  try {
    const employee = await findCompanyEmployeeForManagement(companyId, membershipId);

    if (!employee) {
      return {
        success: false,
        status: 404,
        message: 'Employee could not be found.',
      };
    }

    if (employee.isOwner) {
      return {
        success: false,
        status: 400,
        message: 'The company owner account cannot be managed from employee CRUD.',
      };
    }

    if (employee.status === MembershipStatus.TERMINATED) {
      return {
        success: false,
        status: 400,
        message: 'Terminated employees cannot be updated.',
      };
    }

    if (input.departmentId) {
      const department = await findActiveCompanyDepartment(companyId, input.departmentId);

      if (!department) {
        return {
          success: false,
          status: 400,
          message: 'Selected department is not available. Please choose an active department.',
        };
      }
    }

    if (input.positionId) {
      const position = await findActiveCompanyPosition(companyId, input.positionId);

      if (!position) {
        return {
          success: false,
          status: 400,
          message: 'Selected position is not available. Please choose an active position.',
        };
      }
    }

    await updateEmployeeAssignmentRecords(employee.id, input);

    return {
      success: true,
      status: 200,
      message: 'Employee assignment updated successfully.',
    };
  } catch {
    return {
      success: false,
      status: 500,
      message: 'Employee assignment could not be updated right now. Please try again.',
    };
  }
}

async function sendEmployeeWelcomeEmail(input: {
  companyName: string;
  fullName: string;
  email: string;
  password: string;
}) {
  const loginUrl = getLoginUrl();
  const signInInstruction = loginUrl ? `Sign in here: ${loginUrl}` : 'Open your RAKA HRIS login page to sign in.';

  await sendEmail({
    to: input.email,
    subject: 'Your RAKA HRIS account is ready',
    text: [
      `Hi ${input.fullName},`,
      '',
      `${input.companyName} has created a RAKA HRIS account for you.`,
      '',
      `Email: ${input.email}`,
      `Temporary password: ${input.password}`,
      '',
      signInInstruction,
      'You will be asked to change this password after signing in.',
    ].join('\n'),
    html: [
      `<p>Hi ${escapeHtml(input.fullName)},</p>`,
      `<p>${escapeHtml(input.companyName)} has created a RAKA HRIS account for you.</p>`,
      '<p>',
      `<strong>Email:</strong> ${escapeHtml(input.email)}<br />`,
      `<strong>Temporary password:</strong> ${escapeHtml(input.password)}`,
      '</p>',
      `<p>${loginUrl ? `<a href="${escapeHtml(loginUrl)}">Sign in to RAKA HRIS</a>` : 'Open your RAKA HRIS login page to sign in.'}</p>`,
      '<p>You will be asked to change this password after signing in.</p>',
    ].join(''),
  });
}

function getLoginUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.APP_URL?.trim();

  if (!baseUrl) {
    return null;
  }

  try {
    return new URL('/login', baseUrl).toString();
  } catch {
    return null;
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

function mapDepartmentAssignment(assignment: EmployeeDepartmentAssignmentRecord): EmployeeAssignmentSummary {
  return {
    assignmentId: assignment.id,
    sourceId: assignment.department.id,
    name: assignment.department.name,
    isPrimary: assignment.isPrimary,
    isActive: assignment.department.isActive,
    deletedAt: assignment.department.deletedAt,
    createdAt: assignment.createdAt,
  };
}

function mapPositionAssignment(assignment: EmployeePositionAssignmentRecord): EmployeeAssignmentSummary {
  return {
    assignmentId: assignment.id,
    sourceId: assignment.position.id,
    name: assignment.position.name,
    isPrimary: assignment.isPrimary,
    isActive: assignment.position.isActive,
    deletedAt: assignment.position.deletedAt,
    createdAt: assignment.createdAt,
  };
}
