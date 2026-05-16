import db from "@/lib/db";
import {
  BillingInterval,
  CompanyStatus,
  MembershipStatus,
  SubscriptionStatus,
  type Prisma,
} from "@/generated/prisma/client";
import type {
  CreateCompanyOwnerAccountInput,
  CreateWorkspaceForExistingUserInput,
} from "./types";

const developmentPlanName = "Development Manual Plan";
const developmentPlanInterval = BillingInterval.MONTHLY;

export async function findUserByEmail(email: string) {
  return db.user.findUnique({
    where: {
      email,
    },
    select: {
      userId: true,
    },
  });
}

export async function createCompanyOwnerAccount(
  input: CreateCompanyOwnerAccountInput,
) {
  return db.$transaction(async (tx) => {
    const subscriptionPlan = await findOrCreateDevelopmentSubscriptionPlan(tx);

    const user = await tx.user.create({
      data: {
        email: input.email,
        name: input.fullName,
        passwordHash: input.passwordHash,
        passwordLoginEnabled: true,
        mustChangePassword: false,
        passwordChangedAt: new Date(),
      },
    });

    const company = await tx.company.create({
      data: {
        name: input.companyName,
        email: input.email,
        phone: input.phoneNumber,
        status: CompanyStatus.ACTIVE,
        createdByUserId: user.userId,
      },
    });

    const ownerRole = await tx.companyRole.create({
      data: {
        companyId: company.companyId,
        name: "Owner",
        description: "Full company access for the workspace owner.",
        isSystem: true,
        isDefault: false,
      },
    });

    const membership = await tx.membership.create({
      data: {
        companyId: company.companyId,
        userId: user.userId,
        loginId: createLoginId(input.email),
        status: MembershipStatus.ACTIVE,
        isOwner: true,
      },
    });

    await tx.membershipRole.create({
      data: {
        membershipId: membership.membershipId,
        roleId: ownerRole.companyRoleId,
      },
    });

    await tx.subscription.create({
      data: {
        companyId: company.companyId,
        planId: subscriptionPlan.subscriptionPlanId,
        status: SubscriptionStatus.TRIALING,
        seatLimit: input.seatLimit,
        pricePerUserSnapshot: subscriptionPlan.pricePerUser,
        currencySnapshot: subscriptionPlan.currency,
      },
    });

    return {
      user,
      company,
      membership,
    };
  });
}

export async function createWorkspaceForExistingUser(
  input: CreateWorkspaceForExistingUserInput,
) {
  return db.$transaction(async (tx) => {
    const subscriptionPlan = await findOrCreateDevelopmentSubscriptionPlan(tx);

    const company = await tx.company.create({
      data: {
        name: input.companyName,
        email: input.email,
        phone: input.phoneNumber,
        status: CompanyStatus.ACTIVE,
        createdByUserId: input.userId,
      },
    });

    const ownerRole = await tx.companyRole.create({
      data: {
        companyId: company.companyId,
        name: "Owner",
        description: "Full company access for the workspace owner.",
        isSystem: true,
        isDefault: false,
      },
    });

    const membership = await tx.membership.create({
      data: {
        companyId: company.companyId,
        userId: input.userId,
        loginId: createLoginId(input.email ?? input.userId),
        status: MembershipStatus.ACTIVE,
        isOwner: true,
      },
    });

    await tx.membershipRole.create({
      data: {
        membershipId: membership.membershipId,
        roleId: ownerRole.companyRoleId,
      },
    });

    await tx.subscription.create({
      data: {
        companyId: company.companyId,
        planId: subscriptionPlan.subscriptionPlanId,
        status: SubscriptionStatus.TRIALING,
        seatLimit: input.seatLimit,
        pricePerUserSnapshot: subscriptionPlan.pricePerUser,
        currencySnapshot: subscriptionPlan.currency,
      },
    });

    return {
      company,
      membership,
    };
  });
}

async function findOrCreateDevelopmentSubscriptionPlan(
  tx: Prisma.TransactionClient,
) {
  return tx.subscriptionPlan.upsert({
    where: {
      name_interval: {
        name: developmentPlanName,
        interval: developmentPlanInterval,
      },
    },
    update: {
      isActive: true,
    },
    create: {
      name: developmentPlanName,
      description:
        "Development-only manual subscription plan used before billing is implemented.",
      pricePerUser: 0,
      currency: "IDR",
      interval: developmentPlanInterval,
      isActive: true,
    },
  });
}

function createLoginId(email: string) {
  return email.split("@")[0]?.slice(0, 100) || email.slice(0, 100);
}
