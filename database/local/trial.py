import dbqueries
from connection import ConnectionWrapper

# cw = ConnectionWrapper()
# dbqueries.dropDB(cw)
# dbqueries.rebuilDB(cw, database)

dbqueries.dropDB(database)
dbqueries.createDB(database)
# dbqueries.useDB(cw, database)
dbqueries.createTables(database, "create_tables.sql")
