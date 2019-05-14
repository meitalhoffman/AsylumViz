'''
this is a script to get the NYTimes data about asylum seekers for each month from 
January 2015 until January 2019
Created by: Meital Hoffman
Created on: 5/4/2019
'''
import config
import requests
import random
import time

key = config.NYTInfo["Key"]
secretKey = config.NYTInfo["Secret"]
baseURL = "https://api.nytimes.com/svc/archive/v1/"
end = ".json?api-key="+key

asylum = {}

#iterate through the years we have
# for year in range(2015, 2020):
#     #iterate through each month
#     for month in range(1, 13):
#         print("getting article for: "+str(month)+"/" + str(year))
#         time.sleep(6)
#         monthly = []
#         middle = "/" + str(year) + "/" + str(month)
#         resp = requests.get(baseURL + middle + end)
#         if resp.status_code != 200:
#             # This means something went wrong.
#             print('GET /tasks/ {}'.format(resp.status_code))

#         json = resp.json()["response"]["docs"]
#         addedArticle = False
#         for article in json:
#             for keyword in article["keywords"]:
#                 if(addedArticle):
#                     break
#                 if("Asylum, Right of" in keyword["value"]):
#                     monthly.append(article)
#                     addedArticle = True
#             addedArticle = False
#         file = open(str(month) + "-" + str(year)+".txt", "w")
#         file.write(str(monthly))
#         file.close
#         if(month == 1 and year == 2019):
#             break


addOn = "/2018/3.json?api-key="+key

resp = requests.get(baseURL+addOn)
if resp.status_code != 200:
    # This means something went wrong.
    raise ApiError('GET /tasks/ {}'.format(resp.status_code))

json = resp.json()["response"]["docs"]
asylum = []
addedArticle = False
for article in json:
    # headlines.append(article["headline"]["main"])
    print("checking article")
    for keyword in article["keywords"]:
        print("checking keyword")
        if(addedArticle):
            print("already added this one")
            break
        if("Immigration" in keyword["value"]):
            print("found a match, adding article")
            asylum.append(article)
            addedArticle = True
    addedArticle = False
        

display = open("3-2018.txt", "w")
display.write(str(asylum))
display.close() 

