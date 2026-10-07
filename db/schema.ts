import { pgTable, text, integer,  } from "drizzle-orm/pg-core";
import { int } from "drizzle-orm/sqlite-core/columns";

export const accounts = pgTable("accounts",
 {
    id: text("id").primaryKey(),
    name:text("name").notNull(),
    userId:text("user_id").notNull(),
})

export const customerIndormation = pgTable("customerIndormation",
    {
      name: text("name").notNull(),
      age:int().notNull(),
      email:text("email").unique(),
      phone_no:int().notNull(),
    })