run:
	echo running

build:
	echo building docker

destroy:
	echo destroying docker

generate:
	echo generating fake data

db:
	echo regenerate db with fake data

sqlc:
	@sqlc generate
	@sqlite3 data.db < ./database/sql/schema.sql
	@rm -rf database/db.go
	@echo -e '\n\n\n\n\npackage database\n\nimport (\n\t"database/sql"\n)\n\nfunc New(db *sql.DB) *Queries {\n\treturn &Queries{db: db}\n}\n\ntype Queries struct {\n\tdb *sql.DB\n}\n' > database/db.go
	@sed -i 's/Context(ctx, /(/g' database/*.go
	@sed -i 's/(ctx context.Context, /(/g' database/*.go
	@sed -i 's/(ctx context.Context/(/g' database/*.go
	@sed -i 's/--.*//g' database/*.go
	@sed -i '1,4d' database/*.go
	@sed -i '/"context"/d' database/*.go 

