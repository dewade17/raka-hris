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
      id: true,
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
        createdByUserId: user.id,
      },
    });

    const ownerRole = await tx.companyRole.create({
      data: {
        companyId: company.id,
        name: "Owner",
        description: "Full company access for the workspace owner.",
        isSystem: true,
        isDefault: false,
      },
    });

    const membership = await tx.membership.create({
      data: {
        companyId: company.id,
        userId: user.id,
        status: MembershipStatus.ACTIVE,
        isOwner: true,
      },
    });

    await tx.membershipRole.create({
      data: {
        membershipId: membership.id,
        roleId: ownerRole.id,
      },
    });

    await tx.subscription.create({
      data: {
        companyId: company.id,
        planId: subscriptionPlan.id,
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
        companyId: company.id,
        name: "Owner",
        description: "Full company access for the workspace owner.",
        isSystem: true,
        isDefault: false,
      },
    });

    const membership = await tx.membership.create({
      data: {
        companyId: company.id,
        userId: input.userId,
        status: MembershipStatus.ACTIVE,
        isOwner: true,
      },
    });

    await tx.membershipRole.create({
      data: {
        membershipId: membership.id,
        roleId: ownerRole.id,
      },
    });

    await tx.subscription.create({
      data: {
        companyId: company.id,
        planId: subscriptionPlan.id,
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
