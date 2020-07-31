#Create database
import pymongo


client = pymongo.MongoClient("mongodb+srv://projectcultureadmin:cultureadminpassword@projectculture.mciiv.mongodb.net/ProjectCulture?retryWrites=true&w=majority")
cluster = client.main
users_collection = cluster.users
#posts_collection = clusters.posts




#def upvote()





