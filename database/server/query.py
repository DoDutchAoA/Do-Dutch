import pymysql.cursors

selectUserByName = "SELECT user_id FROM Users WHERE user_name = "

#Sign up
def usernameExist(username):

    return False

def usernamePwdMatch(username, pwd):
    return False

def getUserId(username):
    #SELECT user_id FROM Users WHERE user_name = ?
    return u_id




#Testing

# Connect to the database
connection = pymysql.connect(host='rds-mysql-godutch.czcwawa20gdf.us-west-2.rds.amazonaws.com',
                             user='godutchroot',
                             password='weareDutchers!',
                             db='GODUTCH',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)

connection.close()
