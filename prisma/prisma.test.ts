import { prisma } from "@/app/lib/prisma";

describe("Prisma Models", () => {
  beforeAll(async () => {
    await prisma.task.deleteMany(); // Cleanup before tests
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect(); // Close Prisma connection after tests
  });

  it("should create a user", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Ali Noori",
        email: "ali@example.com",
        password: "hashedpassword123",
      },
    });

    expect(user).toHaveProperty("id");
    expect(user.email).toBe("ali@example.com");
  });

  it("should create a task for the user", async () => {
    const user = await prisma.user.findFirst();
    expect(user).not.toBeNull();

    const task = await prisma.task.create({
      data: {
        title: "Setup Supabase",
        description: "Configure PostgreSQL with Prisma",
        status: "pending",
        priority: 1,
        userId: user!.id,
      },
    });

    expect(task).toHaveProperty("id");
    expect(task.title).toBe("Setup Supabase");
  });

  it("should retrieve user tasks", async () => {
    const user = await prisma.user.findFirst({
      include: { tasks: true },
    });

    expect(user?.tasks.length).toBeGreaterThan(0);
  });
});
