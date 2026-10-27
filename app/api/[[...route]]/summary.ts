import { db } from "@/db/drizzle";
import { accounts, categories, transactions } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { subDays, parse, differenceInDays } from "date-fns";
import { sql, sum, eq, and, lt, gte, lte, desc } from "drizzle-orm";
import {calculcatePercentagechange} from "@/lib/utils"
import {filMissingDays} from "@/lib/utils"
import { Hono } from "hono";
import z, { date } from "zod";

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;

      const endDate = to
        ? parse(to, "yyyy-MM-dd", new Date())
        : defaultTo;

      const periodLength = differenceInDays(endDate, startDate) + 1;
      const lastPeriodStart = subDays(startDate, periodLength);
      const lastPeriodEnd = subDays(endDate, periodLength);

      async function  fetchFinancialData(
        userId: string,
        startDate: Date,
        endDate: Date
      ) {
        return await db
        .select({
            income: sql `SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
            expenses: sql `SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
            remaining: sum(transactions.amount).mapWith(Number)
        })

        .from(transactions)
        .innerJoin(
            accounts,
            eq(
                transactions.accountId,
                accounts.id,
            ),
        )
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId): undefined,
            eq(accounts.userId, userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)

          )
        )
      }

      const [currentPeriod] = await fetchFinancialData(
        auth.userId,
        startDate,
        endDate
      );
      const [lastPeriod] =  await fetchFinancialData(
        auth.userId,
        lastPeriodStart,
        lastPeriodEnd
      );

      const incomeChange  = calculcatePercentagechange(
        currentPeriod.income,
        lastPeriod.income
      )

      const expensesChange  = calculcatePercentagechange(
        currentPeriod.expenses,
        lastPeriod.expenses
      )
      
      const remainingChange = calculcatePercentagechange(
      currentPeriod.remaining ?? 0,
       lastPeriod.remaining ?? 0
     );

     const category = await db
       .select({
        name: categories.name,
        value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
       })
       .from(transactions)
       .innerJoin(
        accounts,
        eq(
          transactions.accountId,
          accounts.id,
        )
       )
       .innerJoin(
        categories,
        eq(
          transactions.categoryId,
          categories.id,
        )
       )
       .where(
          and(
            accountId ? eq(transactions.accountId, accountId): undefined,
            eq(accounts.userId, auth.userId),
            // lt(transactions.amount, 0),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)

          )
        )

       .groupBy(categories.name) 
       .orderBy(desc(
        sql`SUM(ABS(${transactions.amount}))`
       ))
       
//        const debugTransactions = await db
//   .select({
//     id: transactions.id,
//     amount: transactions.amount,
//     accountId: transactions.accountId,
//     categoryId: transactions.categoryId,
//     date: transactions.date,
//   })
//   .from(transactions)
//   .innerJoin(
//     accounts,
//     eq(transactions.accountId, accounts.id)
//   )
//   .where(eq(accounts.userId, auth.userId));

// console.log("MY TRANSACTIONS:", debugTransactions);

       const topCategories = category.slice(0, 3)
       const othCategories = category.slice(3)
       const otherSum = othCategories.reduce(
        (sum, current) => sum + current.value,
         0
         );

         const finalCategories = topCategories;
         if (othCategories.length> 0) {
           finalCategories.push({
             name: "Outh",
             value: otherSum,
           })
         }
console.log("Category query result:", category);
console.log("Final categories:", finalCategories);
       
const activeDays = await db
  .select({
    date: transactions.date,

    income: sql<number>`
      COALESCE(
        SUM(
          CASE
            WHEN ${transactions.amount} >= 0
            THEN ${transactions.amount}
            ELSE 0
          END
        ),
        0
      )
    `.mapWith(Number),

    expenses: sql<number>`
      COALESCE(
        SUM(
          CASE
            WHEN ${transactions.amount} < 0
            THEN ABS(${transactions.amount})
            ELSE 0
          END
        ),
        0
      )
    `.mapWith(Number),
  })
  .from(transactions)
  .innerJoin(
    accounts,
    eq(transactions.accountId, accounts.id)
  )
  .where(
    and(
      accountId
        ? eq(transactions.accountId, accountId)
        : undefined,
      eq(accounts.userId, auth.userId),
      gte(transactions.date, startDate),
      lte(transactions.date, endDate)
    )
  )
  .groupBy(transactions.date)
  .orderBy(transactions.date);


const days = filMissingDays(
  activeDays,
  startDate,
  endDate
);
      return c.json({
       data: {
        remainingAmount: currentPeriod.remaining, 
        remainingChange,
        incomeAmount : currentPeriod.income,
        incomeChange,
        expensesAmount : currentPeriod.expenses, 
        expensesChange,
        categories: finalCategories,
        days
        
       }
      });
    }
  );

export default app;