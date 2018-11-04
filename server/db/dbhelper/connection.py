import data
import pymysql


class ConnectionWrapper:

    def __init__(
        self, db, hostname=data.HOSTNAME, user=data.USER,
        password=data.PASSWORD, charset=data.CHARSET,
    ):
        self.conn = pymysql.connect(
            host=hostname, user=user, password=password,
            db=db, charset=charset, port=data.PORT,
            cursorclass=data.CURSOR_C,
        )
        self.cursor = self.conn.cursor()

    def close(self):
        self.conn.close()
        self.conn = None
        self.cursor = None

    def isOn(self):
        return (self.conn != None)

    def commit(self):
        self.conn.commit()

    def getCursor(self):
        return self.cursor
