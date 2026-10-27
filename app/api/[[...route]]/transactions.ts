import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@clerk/hono";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import {subDays, parse} from 'date-fns';
import {db} from "@/db/drizzle";
import { accounts, categories, transactions  } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import {insertTransactionsSchema} from "@/db/schema";
import {z} from "zod";
import { id } from "zod/v4/locales";
import { error } from "console";
import { unauthorized } from "next/navigation";

const app = new Hono()

.get(
    "/", 
    zValidator('query', z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })),
    clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    const {from, to, accountId} = c.req.valid('query')

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401)
    }

   const defaultTo = new Date()
   const defaultFrom = subDays(defaultTo, 30)

   const startDate = from
   ? parse(from, "yyyy-MM-dd", new Date())
   : defaultFrom;

   const endDate = to
   ? parse(to, "yyyy-MM-dd", new Date())
   :defaultTo;

   const data = await db
      .select({
        id: transactions.id,
        date: transactions.date,
        categorie: categories.name,
        categoryId: transactions.categoryId,
        payee: transactions.payee,
        amount: transactions.amount,
        notes: transactions.notes,
        account:accounts.name,
        accountId:transactions.accountId
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories,eq(transactions.categoryId,categories.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .orderBy(desc(transactions.date))
    return c.json({ data });
  }
)

 .get(
  "/:id",
  clerkMiddleware(),
  zValidator(
    "param",
    z.object({ id: z.string().min(1) })
  ),
  async (c) => {
    const auth = getAuth(c)
    const { id } = c.req.valid("param")

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401)
    }

     const [data] = await db
      .select({
        id: transactions.id,
        date: transactions.date,
        categorie: categories.name,
        categoryId: transactions.categoryId,
        payee: transactions.payee,
        amount: transactions.amount,
        notes: transactions.notes,
        account:accounts.name,
        accountId:transactions.accountId
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories,eq(transactions.categoryId,categories.id))
      .where(
        and(
          eq(transactions.id, id),
          eq(accounts.userId, auth.userId)
        )
      )
      

    if (!data) {
      return c.json({ error: "not found" }, 404);
    }

   
    return c.json({ data })
  }
)

.post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
       insertTransactionsSchema.omit({
         id: true,
       })
    ),
    async (c) => {
      const auth = getAuth(c);
      const value = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .insert(transactions)
        .values({
          id: createId(),
          ...value,
        })
        .returning();

      return c.json({ data });
    }
)

.post(
  "/bulk-create",
  clerkMiddleware(),
  zValidator(
    "json",
    z.array(
      insertTransactionsSchema.omit({
        id: true,
      }),
    ),
  ),
  async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid("json");

    if (!auth?.userId) {
      return c.json({error: "unauthorized"}, 401)
    }

    const data = await db 
      .insert(transactions)
      .values(
        values.map((value)=>({
          id:createId(),
          ...value
        }))
      )
      .returning();

      return c.json({data})
  }
)

.post(
    "/bulk-delete",
     clerkMiddleware(),
     zValidator(
      "json",
      z.object({
        ids: z.array(z.string())
      }),
     ),
     async (c) => {
      const auth = getAuth(c)
      const value = c.req.valid("json")

      if (!auth?.userId) {
        return c.json({error: "Unauthorized"}, 401)
      }

     const transactionsToDelete = db.$with("transactions_to_delete").as(
      db.select({id: transactions.id}).from(transactions)
      .innerJoin(accounts, eq(transactions.accountId,accounts.id))
      .where(and(
        inArray(transactions.id, value.ids),
        eq(accounts.userId, auth.userId)
      ))
     )

      const data = await db
      .with(transactionsToDelete)
      .delete(transactions)
      .where(
        inArray(transactions.id, sql`(select id from  ${transactionsToDelete})`)
      )

      .returning({
        id: categories.id,
      })
      return c.json({data})
     }
)

.patch(
  "/:id",
  clerkMiddleware(),
  zValidator(
    "param",
    z.object({
      id: z.string().min(1),
    })
  ),
  zValidator(
    "json",
    insertTransactionsSchema.omit({
      id: true,
    }) 
  ),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");
    const values = c.req.valid("json");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

     const transactionsToUpdate = db.$with("transactions_to_update").as(
      db.select({id: transactions.id})
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId,accounts.id))
      .where(and(
        eq(transactions.id, id),
        eq(accounts.userId, auth.userId)
      )),
     )

    const [data] = await db
      .with(transactionsToUpdate)
      .update(transactions)
      .set(values)
      .where(
        inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`)
      )
       .returning();
     

    if (!data) {
      return c.json(
        { error: "Categories  not found" },
        404
      );
    }

    return c.json({ data });
  }
)

.delete(
  "/:id",
  clerkMiddleware(),
  zValidator(
    "param",
    z.object({
      id: z.string().min(1),
    })
  ),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const transactionsToDelete= db.$with("transactions_to_update").as(
      db.select({id: transactions.id})
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId,accounts.id))
      .where(and(
        eq(transactions.id, id),
        eq(accounts.userId, auth.userId)
      )),
     )

    const [data] = await db
      .with(transactionsToDelete)
      .delete(transactions)
      .where(
        inArray(
          transactions.id,
          sql`(select id from ${transactionsToDelete})`
        )
      )
      
      .returning({
        id: transactions.id,
      });

    if (!data) {
      return c.json(
        { error: "Categories not found" },
        404
      );
    }

    return c.json({ data });
  }
)
 
export default app;