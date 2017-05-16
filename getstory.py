#!/Users/K/AppData/Local/Programs/Python/Python35-32
#This shebang for school!
#!/usr/local/bin/python3

from cgi import FieldStorage, escape

from cgitb import enable
enable ()


import pymysql as db

getdata=FieldStorage()
pagenumber=1
texttosend=""

# This is going to take the page number from the modal box and send
# back the relevant data from the html

print('Content-Type: text/plain')
print()

try :
    pagenumber=escape(getdata.getfirst("pageno",""))

    if not pagenumber :
        pagenumber = 1

    connection = db.connect('cs1.ucc.ie', 'km32', 'pohcuche', 'csdipact2017_km32')
    cursor = connection.cursor(db.cursors.DictCursor)

    cursor.execute("""SELECT story from gingerman WHERE line = %s""" , (pagenumber))

    texttosend=cursor.fetchone()
    print(texttosend["story"])

    cursor.close()
    connection.close()

except db.Error :
    print("Ooooops.....the gingerbread man has ran away please try later....")

