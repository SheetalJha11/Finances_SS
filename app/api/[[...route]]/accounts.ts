import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq, inArray } from "drizzle-orm";

import {db} from "@/db/drizzle";
import { accounts,  } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import {insertAccountSchema} from "@/db/schema"
import {z} from "zod"

const app = new Hono()

 .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    // Check authentication
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      // Fetch accounts belonging to the logged-in user
      const data = await db
        .select({
          id: accounts.id,
          name: accounts.name,
        })
        .from(accounts)
        .where(eq(accounts.userId, auth.userId));

      return c.json({ data });
    } catch (error) {
      console.error("Failed to fetch accounts:", error);

      return c.json(
        { error: "Failed to fetch accounts" },
        500
      );
    }
  })

.get(
   "/auth", clerkMiddleware(), async (c) => {
  const auth = getAuth(c);

  if (!auth.userId) {
    return c.json({
      loggedIn: false,
      account: null,
    });
  }

  const [account] = await db
    .select({
      id: accounts.id,
      name: accounts.name,
    })
    
    .from(accounts)
    .where(eq(accounts.userId, auth.userId))
    .limit(1);

  return c.json({
    loggedIn: true,
    account: account ?? null,
  });
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
    const auth = getAuth(c);
    const { id } = c.req.valid("param");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [data] = await db
      .select({
        id: accounts.id,
        name: accounts.name,
      })
      .from(accounts)
      .where(
        and(
          eq(accounts.userId, auth.userId),
          eq(accounts.id, id)
        )
      );

    if (!data) {
      return c.json({ error: "Account not found" }, 404);
    }

    return c.json({ data });
  }
)

.post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertAccountSchema.pick({
        name: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const value = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .insert(accounts)
        .values({
          id: createId(),
          userId: auth.userId,
          ...value,
        })
        .returning();

      return c.json({ data });
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

      const data = await db
      .delete(accounts)
      .where(
        and(
          eq(accounts.userId, auth.userId),
          inArray(accounts.id, value.ids)
        )
      )
      .returning({
        id: accounts.id,
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
    insertAccountSchema.pick({
      name: true,
    }) 
  ),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");
    const { name } = c.req.valid("json");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [data] = await db
      .update(accounts)
      .set({ name })
      .where(
        and(
          eq(accounts.id, id),
          eq(accounts.userId, auth.userId)
        )
      )
      .returning();

    if (!data) {
      return c.json(
        { error: "Account not found" },
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

    const [data] = await db
      .delete(accounts)
      .where(
        and(
          eq(accounts.id, id),
          eq(accounts.userId, auth.userId)
        )
      )
      .returning({
        id: accounts.id,
        name: accounts.name,
      });

    if (!data) {
      return c.json(
        { error: "Account not found" },
        404
      );
    }

    return c.json({ data });
  }
)
 
export default app;