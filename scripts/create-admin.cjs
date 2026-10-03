const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@securetransfer.local";
  const password = "Admin@Secure2026!";
  const fullName = "System Administrator";

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      fullName,
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      fullName,
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("");
  console.log("========================================");
  console.log(" ADMIN ACCOUNT CREATED");
  console.log("========================================");
  console.log("Email:    " + admin.email);
  console.log("Password: " + password);
  console.log("Role:     " + admin.role);
  console.log("========================================");
  console.log("");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
