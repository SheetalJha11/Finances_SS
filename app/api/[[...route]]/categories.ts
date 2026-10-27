import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq, inArray } from "drizzle-orm";

import {db} from "@/db/drizzle";
import { categories  } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import {insertCategoriesSchema} from "@/db/schema"
import {z} from "zod"

const app = new Hono()

.get(
  "/",
  clerkMiddleware(),
  async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json(
        { error: "Unauthorized" },
        401
      );
    }

    try {
      const data = await db
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(eq(categories.userId, auth.userId));

      return c.json({ data });
    } catch (error) {
      console.error("Categories database error:", error);

      return c.json(
        { error: "Failed to fetch categories" },
        500
      );
    }
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
        id: categories .id,
        name: categories .name,
      })
      .from(categories )
      .where(
        and(
          eq(categories .userId, auth.userId),
          eq(categories .id, id)
        )
      );

    if (!data) {
      return c.json({ error: "categories  not found" }, 404);
    }

    return c.json({ data });
  }
)

.post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
       insertCategoriesSchema.pick({
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
        .insert(categories )
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
      .delete(categories)
      .where(
        and(
          eq(categories .userId, auth.userId),
          inArray(categories .id, value.ids)
        )
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
    insertCategoriesSchema.pick({
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
      .update(categories)
      .set({ name })
      .where(
        and(
          eq(categories.id, id),
          eq(categories .userId, auth.userId)
        )
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

    const [data] = await db
      .delete(categories )
      .where(
        and(
          eq(categories.id, id),
          eq(categories.userId, auth.userId)
        )
      )
      .returning({
        id: categories .id,
        name: categories.name,
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