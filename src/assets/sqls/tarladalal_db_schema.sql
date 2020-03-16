DROP TABLE IF EXISTS "ingredient_master";
CREATE TABLE IF NOT EXISTS "ingredient_master" (
	"ingredient_id"	INTEGER,
	"type"	TEXT,
	"ingredient_name"	TEXT,
	"Name1"	TEXT
);
DROP TABLE IF EXISTS "recipe_ingredients";
CREATE TABLE IF NOT EXISTS "recipe_ingredients" (
	"recipe_id"	INTEGER,
	"ingredient_id"	INTEGER
);
DROP TABLE IF EXISTS "recipe_master";
CREATE TABLE IF NOT EXISTS "recipe_master" (
	"recipe_id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"recipe_name"	TEXT,
	"recipe_url"	TEXT,
	"recipe_img_url"	TEXT,
	"recipe_prep_time"	INTEGER,
	"recipe_cook_time"	INTEGER,
	"recipe_total_time"	INTEGER
);

DROP TABLE IF EXISTS "db_version";
CREATE TABLE "db_version" (
	"version"	TEXT NOT NULL,
	"version_date"	TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "favorites" (
	"recipe_id"	INTEGER NOT NULL
)

