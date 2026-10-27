import "dotenv/config";
import { db } from "@/db/drizzle";
import {
  accounts,
  categories,
  transactions,
} from "@/db/schema";

async function main() {
  console.log("Seeding database...");

  // Accounts
  await db.insert(accounts).values([
    {
      id: "account_1",
      name: "Cash",
      userId: "user_1",
    },
    {
      id: "account_2",
      name: "Bank Account",
      userId: "user_1",
    },
  ]);

  // Categories
  await db.insert(categories).values([
    {
      id: "category_1",
      name: "Food",
      userId: "user_1",
    },
    {
      id: "category_2",
      name: "Shopping",
      userId: "user_1",
    },
    {
      id: "category_3",
      name: "Salary",
      userId: "user_1",
    },
    {
      id: "category_4",
      name: "Transport",
      userId: "user_1",
    },
  ]);

  // Transactions
  await db.insert(transactions).values([
    {
      id: "transaction_1",
      amount: 2500,
      payee: "Grocery Store",
      notes: "Monthly groceries",
      date: new Date("2026-10-01"),
      accountId: "account_1",
      categoryId: "category_1",
    },
    {
      id: "transaction_2",
      amount: 5000,
      payee: "Clothing Store",
      notes: "New clothes",
      date: new Date("2026-10-05"),
      accountId: "account_2",
      categoryId: "category_2",
    },
    {
      id: "transaction_3",
      amount: 50000,
      payee: "Monthly Salary",
      notes: "October salary",
      date: new Date("2026-10-10"),
      accountId: "account_2",
      categoryId: "category_3",
    },
    {
      id: "transaction_4",
      amount: 500,
      payee: "Taxi",
      notes: "Travel expenses",
      date: new Date("2026-10-12"),
      accountId: "account_1",
      categoryId: "category_4",
    },
  ]);

  console.log("Database seeded successfully!");
}

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});