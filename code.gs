function createSacramentMeetingAgenda() {
  //from today's date, get the correct row in the sheet
  //extract columns to fields in the docs template
  
  var sourceSheetId = "1Uwf9zLT8egb0-Vz6z9wz8ssqcTG16VLcuxkFUlxf1g4", //the sheet Id
      sourceRange = "A2:M2000", //the range of all topics
      
  //template 
  templateId = "1Rv4wFBGFpwSMrc6i9TTVgHgE0v0TyA9LMadqwpXIIlk";

  //log variables
  Logger.log("sourceSheetId: " + sourceSheetId.toString());
  Logger.log("sourceRange: " + sourceRange.toString());
  Logger.log("templateId: " + templateId.toString());
  
  //get all source data for later re-use
  var allValues = Sheets.Spreadsheets.Values.get(sourceSheetId, sourceRange).values;
  
  //from today's date, find the date that's just past today. That will give us next Sunday
  var nextRowId = 0;
  for (var rowId = 0;rowId < allValues.length; rowId++){
    //compare the next row's date to today's. find the row that is just greater than today. That's the row we want. Assume that 
    //when this script is run, the agenda will be for the next date
    nextRowId = rowId + 1;
    
    Logger.log(allValues[nextRowId][0]);
    if (typeof (allValues[nextRowId][0]) === undefined) {
     Logger.log("next line is undefined. reached end of sheet.")
     return; //reached the end of the sheet.       
    }
     
    var date = new Date(allValues[nextRowId][0]),
        today = new Date();
        
    if (date.valueOf() > today.valueOf()){
      Logger.log("row found: " + allValues[nextRowId][0])
      
      //use this row to gather the data and input to the docs template
      var openingHymn = allValues[nextRowId][3], 
          sacramentHymn = allValues[nextRowId][4],
          //first speaker
          firstSpeaker = allValues[nextRowId][5],
          firstSpeakerTopic = allValues[nextRowId][6], 
                  
          
          //2nd speaker
          secondSpeaker = allValues[nextRowId][7],
          secondSpeakerTopic = allValues[nextRowId][8], 
          
          //closing speaker
          intermediateHymn = allValues[nextRowId][9], 
          closingSpeaker = allValues[nextRowId][10],
          closingSpeakerTopic = allValues[nextRowId][11], 
          
          closingHymn = allValues[nextRowId][12], 
          
          conducting = allValues[nextRowId][1], 
          theme = allValues[nextRowId][2];
      
      //get the speaker topics
      if (typeof(firstSpeakerTopic) !== "undefined" && firstSpeakerTopic.toString().length > 0){
            firstSpeaker += " (" +  firstSpeakerTopic + ")";
      }
      if (typeof(secondSpeakerTopic) !== "undefined" && secondSpeakerTopic.toString().length > 0){
            secondSpeaker += " (" +  secondSpeakerTopic + ")";
      }
      if (typeof(closingSpeakerTopic) !== "undefined" && closingSpeakerTopic.toString().length > 0){
            closingSpeaker += " (" +  closingSpeakerTopic + ")";
      }
      
      //copy the template
      var docId = DriveApp.getFileById(templateId).makeCopy().getId();
      var dateFormatted = Utilities.formatDate(date, "CST", "MM/dd/YYYY");
      DriveApp.getFileById(docId).setName("Murray Ward Sacrament Meeting " + dateFormatted);
      
      //update the body
      var doc = DocumentApp.openById(docId);
      var body = doc.getBody();
      body.replaceText("##date##", dateFormatted);
      body.replaceText("##theme##", theme);
      body.replaceText("##conducting##", conducting);
      body.replaceText("##opening_hymn##", openingHymn);
      body.replaceText("##sacrament_hymn##", sacramentHymn);
      body.replaceText("##first_speaker##", firstSpeaker);
      body.replaceText("##second_speaker##", secondSpeaker);
      body.replaceText("##intermediate_hymn##", intermediateHymn);
      body.replaceText("##closing_speaker##", closingSpeaker);
      body.replaceText("##closing_hymn##", closingHymn);
      
      //share w counselors, exec secretary
      //doc.addEditors(["jshvernon@gmail.com", "wjandreas2@hotmail.com", "murrayexec@gmail.com"]);
      
      return; //found, no need to continue. 
    }    
  }
    
  Logger.log("done")
}
