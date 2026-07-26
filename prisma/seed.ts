import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const attackerEmail = "attacker@sfts.local";

  const existingAttacker = await prisma.user.findUnique({
    where: {
      email: attackerEmail,
    },
  });

  if (existingAttacker) {
    console.log("✓ Attacker account already exists.");
    return;
  }

  const hashedPassword = await hash("attacker123", 10);

  await prisma.user.create({
    data: {
      fullName: "System Attacker",
      email: attackerEmail,
      password: hashedPassword,
      role: Role.ATTACKER,
    },
  });

  console.log("==================================");
  console.log("Attacker account created!");
  console.log("----------------------------------");
  console.log("Email    : attacker@sfts.local");
  console.log("Password : attacker123");
  console.log("Role     : ATTACKER");
  console.log("==================================");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });