import "dotenv/config";
import { PrismaClient, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

const defaultPermissions = [
  {
    key: "users.manage",
    name: "Manage Users",
    description: "Create, update, suspend and delete users.",
  },
  {
    key: "users.invite",
    name: "Invite Users",
    description: "Send and manage invitations for new users.",
  },
  {
    key: "roles.manage",
    name: "Manage Roles",
    description: "Create and edit roles and their permissions.",
  },
  {
    key: "categories.view",
    name: "View Categories",
    description: "Read access to task categories.",
  },
  {
    key: "categories.edit",
    name: "Edit Categories",
    description: "Create, update and delete task categories.",
  },
  {
    key: "tasks.view",
    name: "View Tasks",
    description: "Read access to tasks.",
  },
  {
    key: "tasks.edit",
    name: "Edit Tasks",
    description: "Create, update and complete tasks.",
  },
] as const;

const defaultRoles: Array<{
  key: string;
  name: string;
  description: string;
  permissions: string[];
}> = [
  {
    key: "SUPERADMIN",
    name: "Super Admin",
    description: "Full access to every resource and permission.",
    permissions: defaultPermissions.map((permission) => permission.key),
  },
  {
    key: "ADMIN",
    name: "Admin",
    description: "Manage users, roles and operational data.",
    permissions: [
      "users.manage",
      "users.invite",
      "roles.manage",
      "categories.view",
      "categories.edit",
      "tasks.view",
      "tasks.edit",
    ],
  },
  {
    key: "MANAGER",
    name: "Manager",
    description: "Manage operational data and view users.",
    permissions: ["users.invite", "categories.view", "categories.edit", "tasks.view", "tasks.edit"],
  },
  {
    key: "VIEWER",
    name: "Viewer",
    description: "Read-only access to categories and tasks.",
    permissions: ["categories.view", "tasks.view"],
  },
];

async function seedPermissions() {
  const createdPermissions = await Promise.all(
    defaultPermissions.map((permission) =>
      prisma.permission.upsert({
        where: { key: permission.key },
        update: {
          name: permission.name,
          description: permission.description,
        },
        create: {
          key: permission.key,
          name: permission.name,
          description: permission.description,
        },
      }),
    ),
  );

  return new Map(createdPermissions.map((permission) => [permission.key, permission.id]));
}

async function seedRoles(permissionMap: Map<string, string>) {
  for (const role of defaultRoles) {
    const permissionIds = role.permissions.map((key) => {
      const permissionId = permissionMap.get(key);

      if (!permissionId) {
        throw new Error(`Cannot create role ${role.key}: permission ${key} is missing`);
      }

      return permissionId;
    });

    const createdRole = await prisma.role.upsert({
      where: { key: role.key },
      update: {
        name: role.name,
        description: role.description,
      },
      create: {
        key: role.key,
        name: role.name,
        description: role.description,
      },
    });

    await prisma.rolePermission.deleteMany({ where: { roleId: createdRole.id } });
    await prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({
        roleId: createdRole.id,
        permissionId,
      })),
      skipDuplicates: true,
    });
  }
}

async function seedSuperAdmin(superAdminRoleId: string) {
  const superAdminEmail = (process.env.SUPERADMIN_EMAIL ?? "superadmin@example.com").toLowerCase();
  const superAdminName = process.env.SUPERADMIN_NAME ?? "Super Admin";

  const superAdminUser = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {
      name: superAdminName,
      status: UserStatus.ACTIVE,
      deletedAt: null,
    },
    create: {
      email: superAdminEmail,
      name: superAdminName,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.userRole.createMany({
    data: [
      {
        userId: superAdminUser.id,
        roleId: superAdminRoleId,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Super admin available at ${superAdminEmail}`);

  return superAdminUser;
}

async function seedCategoryAndTask(userId: string) {
  const category = await prisma.category.upsert({
    where: { slug: "seed-category" },
    update: {
      name: "Seed Category",
      description: "A sample category created by the seed script",
      userId,
    },
    create: {
      slug: "seed-category",
      name: "Seed Category",
      description: "A sample category created by the seed script",
      userId,
    },
  });

  await prisma.task.deleteMany({
    where: {
      categoryId: category.id,
      description: "A sample task created by the seed script",
    },
  });

  await prisma.task.create({
    data: {
      description: "A sample task created by the seed script",
      checked: false,
      categoryId: category.id,
      userId,
    },
  });

  console.log(`✅ Created seed category and task for user ${userId}`);
}

async function main() {
  const permissionMap = await seedPermissions();
  await seedRoles(permissionMap);

  const superAdminRole = await prisma.role.findUnique({ where: { key: "SUPERADMIN" } });

  if (!superAdminRole) {
    throw new Error("SUPERADMIN role was not created correctly.");
  }

  const superAdminUser = await seedSuperAdmin(superAdminRole.id);
  await seedCategoryAndTask(superAdminUser.id);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌ Error while seeding database", error);
    await prisma.$disconnect();
    process.exit(1);
  });
