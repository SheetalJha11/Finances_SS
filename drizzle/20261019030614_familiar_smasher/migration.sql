ALTER TABLE "transactions" DROP CONSTRAINT "transactions_categorie_id_categories_id_fkey";--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "category_id" text;--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "categorie_id";--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL;