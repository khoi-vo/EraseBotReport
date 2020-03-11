from bs4 import BeautifulSoup
import xlrd
import numpy as np
from matplotlib import pyplot as plt
#Initiliaze soup Object
soup = BeautifulSoup(open("C:\\Working\\Project\\ImagePolice\\report.html"),'html.parser')
#Find tag of feedbackTable
feedbackTable = soup.find(id="feedbackTable")
#Find tag of body Table
tbodyTag = feedbackTable.find("tbody")
#Stringify the javascript to draw pie chart and histogram
scriptChartString = "function drawChart(){var a=google.visualization.arrayToDataTable([['Feedback','Number of Feedback'],['Modified',modifiedNumber],['Unmodified',unmodifiedNumber]]),i=google.visualization.arrayToDataTable(histogramData);new google.visualization.PieChart(document.getElementById('piechart')).draw(a,{title:'Modified and Unmodified Feedback',width:450,height:300,colors:['#90ee90','red'],is3D:!0,fontSize:13}),new google.visualization.Histogram(document.getElementById('Histogram')).draw(i,{title:'Number of Attachment Distribution',legend:{position:'none'},width:1000,height:500,fontSize:14,histogram: { bucketSize: 2 }})}google.charts.load('current',{packages:['corechart']}),google.charts.setOnLoadCallback(drawChart);"

#########################################################
#load excel file and save it into workbook
locationOfFeedbackFile = ("C:\\Working\\Project\\ImagePolice\\samplereport1.xlsx")
workbookFeedback = xlrd.open_workbook(locationOfFeedbackFile)
#Initialize sheet object by open first sheet
sheetFeedback = workbookFeedback.sheet_by_index(0)

##########################################################
#locationOfAttachmentFile = ("C:\\Working\\Project\\ImagePolice\\samplereport1.xlsx")
#workbookAttachment = xlrd.open_workbook(locationOfAttachmentFile)
sheetAttachment = workbookFeedback.sheet_by_index(1)
numberOfRowsAttachment = sheetAttachment.nrows
attachmentData={}
print(sheetAttachment.nrows)
for row in range(1,numberOfRowsAttachment):
    rowData = sheetAttachment.row_values(row)
    key = attachmentData.setdefault(str(rowData[0]),[])
    for i in range (2,len(rowData)):
        if i == 5:
            if type(rowData[i]) is float:
                rowData[i] = int(rowData[i])
                rowData[i] = str(rowData[i])
        elif i == 7:
            if rowData[i] == 0:
                rowData[i] = "False"
            else:
                rowData[i] = "True"
        else:
            rowData[i] = str(int(rowData[i]))
    key.append(list(map(str,rowData[1::])))
noOfAttachmentByFBID = []
for key in attachmentData:
    noOfAttachmentByFBID.append([key[:-2],len(attachmentData.get(key))])
noOfAttachmentByFBID.insert(0,["FeedbackID","AttachmentNumber"])
scriptChartString = scriptChartString.replace("histogramData",str(noOfAttachmentByFBID))
#hist,bins = np.histogram(noOfAttachmentByFBID,bins = max(noOfAttachmentByFBID)//2)
#print(len(hist))
#print(len(bins))
#print(hist)
#print(bins)
#histogramData = list(zip(hist,bins))

#print(histogramData)
#Get number of total rows
numberOfRows = sheetFeedback.nrows
numberOfUnmodified = 0
#Iterate each row
for row in range(1,numberOfRows):
    #Get data of current row, the data is save as an array of rowData
    rowData = sheetFeedback.row_values(row)
    #Create new tag "tr" for append to tbody of feedback table
    newtrTag = soup.new_tag("tr")
    tbodyTag.append(newtrTag)
    #Check the index 2nd of array rowData which is updated status such as 0 or 1 and change it in to "False" or "True" respectively
    for index,value in enumerate(rowData): 
        #Create new tag "td"
        newtdTag = soup.new_tag("td")   
        if index == 1:
            newtdTag.string = value == 0 and "False" or "True"
            if value == 0:
                numberOfUnmodified = numberOfUnmodified + 1
        elif index == 0:
            linkTag = soup.new_tag("a", href="#attachmentTable")
            if str(value) in attachmentData:
                linkTag['data-attachment'] = str(attachmentData.get(str(value)))
            linkTag.string = str(int(value))
            newtdTag.append(linkTag)
        else:
            newtdTag.string = str(int(value))
        newtrTag.append(newtdTag)

numberOfModified = numberOfRows - numberOfUnmodified
scriptChartString = scriptChartString.replace("modifiedNumber",str(numberOfModified),1)
scriptChartString = scriptChartString.replace("unmodifiedNumber",str(numberOfUnmodified))
headTag = soup.find("head")
scriptChartTag = headTag.find(id="scriptChart")
scriptChartTag.string = scriptChartString

summaryTableRow=soup.find(id="summaryTable").findAll("tr")[1]
summaryTableRow.findAll("td")[0].string = str(numberOfModified)
summaryTableRow.findAll("td")[1].string = str(numberOfUnmodified)
summaryTableRow.findAll("td")[2].string = str(numberOfRows)

with open("C:\\Working\\Project\\ImagePolice\\reportTest.html", "w",encoding="utf-8") as file:
    file.write(str(soup))