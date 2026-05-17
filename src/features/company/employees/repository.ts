import { MembershipStatus, SessionStatus, type Prisma } from '@/generated/prisma/client';
import db from '@/lib/db';
import type { CreateCompanyEmployeeInput, TerminateCompanyEmployeeInput, UpdateCompanyEmployeeInput } from './types';

const employeeDepartmentOrderBy: Prisma.EmployeeDepartmentOrderByWithRelationInput[] = [
  { isPrimary: 'desc' },
  { createdAt: 'asc' },
];

const employeePositionOrderBy: Prisma.EmployeePositionOrderByWithRelationInput[] = [
  { isPrimary: 'desc' },
  { createdAt: 'asc' },
];

const employeeListSelect = {
  membershipId: true,
  status: true,
  isOwner: true,
  joinedAt: true,
  user: {
    select: {
      name: true,
      email: true,
    },
  },
  employeeProfile: {
    select: {
      employeeNumber: true,
      employmentType: true,
      hireDate: true,
      phone: true,
    },
  },
  employeeDepartments: {
    orderBy: employeeDepartmentOrderBy,
    take: 1,
    select: {
      employeeDepartmentId: true,
      isPrimary: true,
      createdAt: true,
      department: {
        select: {
          departmentId: true,
          name: true,
          isActive: true,
          deletedAt: true,
        },
      },
    },
  },
  employeePositions: {
    orderBy: employeePositionOrderBy,
    take: 1,
    select: {
      employeePositionId: true,
      isPrimary: true,
      createdAt: true,
      position: {
        select: {
          positionId: true,
          name: true,
          isActive: true,
          deletedAt: true,
        },
      },
    },
  },
} as const;

const employeeProfileSelect = {
  membershipId: true,
  status: true,
  isOwner: true,
  joinedAt: true,
  lastLoginAt: true,
  employmentEndedAt: true,
  user: {
    select: {
      name: true,
      email: true,
    },
  },
  employeeProfile: {
    select: {
      employeeProfileId: true,
      employeeNumber: true,
      phone: true,
      emergencyContactName: true,
      emergencyContactPhone: true,
      birthDate: true,
      birthPlace: true,
      gender: true,
      maritalStatus: true,
      addressLine1: true,
      city: true,
      province: true,
      employmentType: true,
      hireDate: true,
      probationEndDate: true,
      photoUrl: true,
      notes: true,
      updatedAt: true,
    },
  },
  employeeDepartments: {
    orderBy: employeeDepartmentOrderBy,
    select: {
      employeeDepartmentId: true,
      isPrimary: true,
      createdAt: true,
      department: {
        select: {
          departmentId: true,
          name: true,
          isActive: true,
          deletedAt: true,
        },
      },
    },
  },
  employeePositions: {
    orderBy: employeePositionOrderBy,
    select: {
      employeePositionId: true,
      isPrimary: true,
      createdAt: true,
      position: {
        select: {
          positionId: true,
          name: true,
          isActive: true,
          deletedAt: true,
        },
      },
    },
  },
} as const;

export async function findCompanyEmployeeList(companyId: string) {
  return db.membership.findMany({
    where: {
      companyId,
    },
    orderBy: {
      joinedAt: 'desc',
    },
    select: employeeListSelect,
  });
}

export async function findCompanySeatUsage(companyId: string) {
  const [subscription, usedSeats] = await Promise.all([
    db.subscription.findFirst({
      where: {
        companyId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        seatLimit: true,
      },
    }),
    db.membership.count({
      where: {
        companyId,
        status: {
          in: [MembershipStatus.ACTIVE, MembershipStatus.SUSPENDED],
        },
      },
    }),
  ]);

  return {
    seatLimit: subscription?.seatLimit ?? 0,
    usedSeats,
    hasSubscription: Boolean(subscription),
  };
}

export async function findCompanyEmployeeMembership(companyId: string, membershipId: string) {
  return db.membership.findFirst({
    where: {
      companyId,
      membershipId,
    },
    select: {
      membershipId: true,
    },
  });
}

export async function findCompanyEmployeeForManagement(companyId: string, membershipId: string) {
  return db.membership.findFirst({
    where: {
      companyId,
      membershipId,
    },
    select: {
      membershipId: true,
      userId: true,
      isOwner: true,
      status: true,
    },
  });
}

export async function findCompanyEmployeeProfile(companyId: string, membershipId: string) {
  return db.membership.findFirst({
    where: {
      companyId,
      membershipId,
    },
    select: employeeProfileSelect,
  });
}

export async function updateCompanyEmployeeRecord(
  membershipId: string,
  userId: string,
  data: UpdateCompanyEmployeeInput,
) {
  return db.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        userId,
      },
      data: {
        name: data.fullName,
        email: data.email,
      },
    });

    await tx.membership.update({
      where: {
        membershipId,
      },
      data: {
        status: data.status,
        accessRevokedAt: data.status === MembershipStatus.SUSPENDED ? new Date() : null,
      },
    });

    if (data.status === MembershipStatus.SUSPENDED) {
      await tx.userSession.updateMany({
        where: {
          membershipId,
          status: SessionStatus.ACTIVE,
        },
        data: {
          status: SessionStatus.REVOKED,
          revokedAt: new Date(),
          revokedReason: 'Employee access suspended',
        },
      });
    }

    await tx.employeeProfile.upsert({
      where: {
        membershipId,
      },
      update: {
        employeeNumber: data.employeeNumber,
        phone: data.phone,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        birthDate: data.birthDate,
        birthPlace: data.birthPlace,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        addressLine1: data.addressLine1,
        city: data.city,
        province: data.province,
        employmentType: data.employmentType,
        hireDate: data.hireDate,
        probationEndDate: data.probationEndDate,
        photoUrl: data.photoUrl,
        notes: data.notes,
        deletedAt: null,
      },
      create: {
        membershipId,
        employeeNumber: data.employeeNumber,
        phone: data.phone,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        birthDate: data.birthDate,
        birthPlace: data.birthPlace,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        addressLine1: data.addressLine1,
        city: data.city,
        province: data.province,
        employmentType: data.employmentType,
        hireDate: data.hireDate,
        probationEndDate: data.probationEndDate,
        photoUrl: data.photoUrl,
        notes: data.notes,
      },
    });
  });
}

export async function terminateCompanyEmployeeRecord(
  membershipId: string,
  terminatedByUserId: string,
  data: TerminateCompanyEmployeeInput,
) {
  return db.$transaction(async (tx) => {
    await tx.membership.update({
      where: {
        membershipId,
      },
      data: {
        status: MembershipStatus.TERMINATED,
        employmentEndedAt: new Date(),
        terminationType: 'ADMIN_TERMINATION',
        terminationReason: data.terminationReason,
        terminatedByUserId,
        accessRevokedAt: new Date(),
      },
    });

    await tx.userSession.updateMany({
      where: {
        membershipId,
        status: SessionStatus.ACTIVE,
      },
      data: {
        status: SessionStatus.REVOKED,
        revokedAt: new Date(),
        revokedReason: 'Employee access terminated',
      },
    });
  });
}

export async function createCompanyEmployeeAccountRecord(
  companyId: string,
  data: CreateCompanyEmployeeInput & {
    passwordHash: string;
  },
) {
  return db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: data.email,
        name: data.fullName,
        passwordHash: data.passwordHash,
        passwordLoginEnabled: true,
        mustChangePassword: true,
        passwordChangedAt: null,
      },
      select: {
        userId: true,
      },
    });

    const membership = await tx.membership.create({
      data: {
        companyId,
        userId: user.userId,
        status: MembershipStatus.ACTIVE,
        isOwner: false,
      },
      select: {
        membershipId: true,
      },
    });

    await tx.employeeDepartment.create({
      data: {
        membershipId: membership.membershipId,
        departmentId: data.departmentId,
        isPrimary: true,
      },
    });

    await tx.employeePosition.create({
      data: {
        membershipId: membership.membershipId,
        positionId: data.positionId,
        isPrimary: true,
      },
    });

    return {
      userId: user.userId,
      membershipId: membership.membershipId,
    };
  });
}

export async function deleteCreatedCompanyEmployeeAccount(userId: string) {
  return db.user.deleteMany({
    where: {
      userId,
    },
  });
}

export async function findActiveCompanyDepartment(companyId: string, departmentId: string) {
  return db.department.findFirst({
    where: {
      companyId,
      departmentId,
      isActive: true,
      deletedAt: null,
    },
    select: {
      departmentId: true,
    },
  });
}

export async function findActiveCompanyPosition(companyId: string, positionId: string) {
  return db.position.findFirst({
    where: {
      companyId,
      positionId,
      isActive: true,
      deletedAt: null,
    },
    select: {
      positionId: true,
    },
  });
}

export async function updateEmployeeAssignmentRecords(
  membershipId: string,
  data: {
    departmentId?: string | null;
    positionId?: string | null;
  },
) {
  return db.$transaction(async (tx) => {
    if (data.departmentId !== undefined) {
      await tx.employeeDepartment.updateMany({
        where: {
          membershipId,
        },
        data: {
          isPrimary: false,
        },
      });

      if (data.departmentId) {
        await tx.employeeDepartment.upsert({
          where: {
            membershipId_departmentId: {
              membershipId,
              departmentId: data.departmentId,
            },
          },
          update: {
            isPrimary: true,
          },
          create: {
            membershipId,
            departmentId: data.departmentId,
            isPrimary: true,
          },
        });
      } else {
        await tx.employeeDepartment.deleteMany({
          where: {
            membershipId,
            isPrimary: true,
          },
        });
      }
    }

    if (data.positionId !== undefined) {
      await tx.employeePosition.updateMany({
        where: {
          membershipId,
        },
        data: {
          isPrimary: false,
        },
      });

      if (data.positionId) {
        await tx.employeePosition.upsert({
          where: {
            membershipId_positionId: {
              membershipId,
              positionId: data.positionId,
            },
          },
          update: {
            isPrimary: true,
          },
          create: {
            membershipId,
            positionId: data.positionId,
            isPrimary: true,
          },
        });
      } else {
        await tx.employeePosition.deleteMany({
          where: {
            membershipId,
            isPrimary: true,
          },
        });
      }
    }
  });
}
