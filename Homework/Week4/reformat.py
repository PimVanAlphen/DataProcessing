import json

file = open('KNMI_20151110.txt', 'r')
data = file.read().split("\n")

temperatures = []
dates = []

for line in data[13:378]:
    items = line.split(",")
    dates.append(items[1].strip())
    temperatures.append(items[2].strip())

preJson = []

for objects in range(0, len(dates)):
    tmpObject = []
    tmpObject.append(dates[objects])
    tmpObject.append(temperatures[objects])
    preJson.append(tmpObject)

with open('dump', 'wb') as fileJson:
    json.dump(preJson, fileJson)
