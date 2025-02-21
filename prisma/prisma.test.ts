import { prisma } from "@/app/lib/prisma";

describe("Prisma Models", () => {
  beforeAll(async () => {
    await prisma.task.deleteMany(); // Cleanup before tests
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect(); // Close Prisma connection after tests
  });

  const testUser = {
    name: "Ali Noori",
    email: "ali@example.com",
    password: "hashedpassword123",
  };

  it("should create a user", async () => {
    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
      },
    });

    // Test if the user has the required properties
    expect(user).toHaveProperty("id");
    expect(user.name).toBe(testUser.name);
    expect(user.email).toBe(testUser.email);
    expect(user.password).toBe(testUser.password);
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
