CREATE TABLE " transactions" (
	"id" text PRIMARY KEY,
	"amount" integer NOT NULL,
	"payee" text NOT NULL,
	"notes" text,
	"date" timestamp NOT NULL,
	"account_id" text NOT NULL,
	"categorie_id" text
);
--> statement-breakpoint
ALTER TABLE " transactions" ADD CONSTRAINT " transactions_account_id_accounts_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE " transactions" ADD CONSTRAINT " transactions_categorie_id_categories_id_fkey" FOREIGN KEY ("categorie_id") REFERENCES "categories"("id") ON DELETE SET NULL;