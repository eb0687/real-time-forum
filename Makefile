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
	sqlite3 data.db < ./database/sql/schema.sql
