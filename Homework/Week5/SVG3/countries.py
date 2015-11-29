import json

file = open('C:\Users\Pim\Desktop\DataProcessing\Homework\Week5\data.txt', 'r')
data = file.read()
data = data.strip()
file.close()

countries = []

for datas in data.split("\n"):
    tmpCountry = []
    stats = datas.split("\t")

    tmpCountry.append(stats[0])
    tmpCountry.append(stats[1].replace(",",""))

    countries.append(tmpCountry)

jsonData = json.dumps(countries)

newFile = open("countriesJson.txt", "w")
newFile.write(jsonData)
newFile.close()
