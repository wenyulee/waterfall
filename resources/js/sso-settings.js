var express = require('express');
var app = express();

app.get('/', function(req, res) {
	
	// READ FILE
	fs = require('fs')
	fs.readFile('sso-settings.txt', 'utf8', function (err,data) {
	  if (err) {
		res.type('application/json');
		res.jsonp({ success: false, data: err });
		return console.log(err);
	  }
	  
	 //INITIALIZE OBJECTS
	var objGroups = [];
	var objGroupItem = function() {
							this.groupId = '';
							this.groupText = '';
							this.member = [];
						};
	var objCurrentGroup = null;
	var pendingGroup = false;
	var objMemberItem = function() {
							this.memberId = '';
							this.memberUrl = '#';
							this.memberText = '';
							this.memberIcon = '';
							this.memberHandler= null;	
						};
	var objCurrentMemberItem = null;
						
	//SPLIT DATA
	var arrLine = data.split(/[\r\n]/);
	
	//LOOP THROUGH THE ARRAY
	for(var ctr=0; ctr<arrLine.length; ctr++)
	{
		//if line is empty or is a comment that starts with #, ignore it
		if(arrLine[ctr].trim().length <= 0 || arrLine[ctr].replace(/[ \t]/g,"").charAt(0) == "#") continue;
		
		//if first character is a whitespace, this is a member of current group, else add a new group
		if(arrLine[ctr].charAt(0).match(/[ \t]/))
		{
			//NEW ITEM
			
			//parse the member string
			
			//get entire line
			var strMemberName = arrLine[ctr].trim();
			
			//find first space
			var intSpace1 = strMemberName.indexOf(" ");
			var intSpace2 = 0;
			
			var intCurlyBracket = strMemberName.indexOf("{", intSpace1 + 1);
			var intSemiColon = strMemberName.indexOf(";", intSpace1 + 1);
			var strMemberAction = "";
			
			//check if there is a {, if there is, assume that action is a literal function
			if(intCurlyBracket>-1)
			{
				//find last }
				intCurlyBracket = strMemberName.indexOf("}", intSpace1 + 1);
				
				//save the action
				strMemberAction = strMemberName.substring(intSpace1+1,intCurlyBracket+1).trim();
				intSpace2 = strMemberName.indexOf(" ", intCurlyBracket + 1);
			}
			//check if there is a semicolon, if there is, assume javascript call
			else if(intSemiColon>-1)
			{
				intSpace2 = strMemberName.indexOf(" ", intSemiColon + 1);
				strMemberAction = strMemberName.substring(intSpace1+1,intSpace2).trim();
			}
			//filenames, urls, etc
			//WARNING!!! Function calls that do not end with a semicolon will be put here
			else
			{
				intSpace2 = strMemberName.indexOf(" ", intSpace1 + 1);
				strMemberAction = strMemberName.substring(intSpace1+1,intSpace2).trim();
			}
			
			var strMemberStyle = strMemberName.substring(intSpace2+1).trim();
			strMemberName = strMemberName.substring(0,intSpace1).trim();
			
			//initialize member object
			objCurrentMemberItem = new objMemberItem();
			
			//save the details
			objCurrentMemberItem.memberId = 'li' + strMemberName.replace(/ /g,"_");
			objCurrentMemberItem.memberText = strMemberName;
			
			//if action is #, contains a domain (domain.com, http://domain.com/test.html), or a filename make it link to that 
			//WARNING!!! This will match method calls whose method name is between 2-4 characters long (string.trim) if you call only that
			if(strMemberAction.charAt(0) == "#" || strMemberAction.match(/\w+\.\w{2,4}/g))
				objCurrentMemberItem.memberUrl = strMemberAction;
			//everything else, assume it is a function
			else
				objCurrentMemberItem.memberHandler = strMemberAction;
			objCurrentMemberItem.memberIcon = strMemberStyle;
			
			//insert into group
			if(pendingGroup) objCurrentGroup.member.push(objCurrentMemberItem);
		}
		else
		{
			//PUSH LAST GROUP IN IF IT EXISTS
			if(pendingGroup) objGroups.push(objCurrentGroup);
			pendingGroup = false;
			
			//NEW GROUP
			var strGroupName = arrLine[ctr].trim();
			objCurrentGroup = new objGroupItem();
			pendingGroup = true;
			
			//SET NAME AND ID
			objCurrentGroup.groupId = 'grp' + strGroupName.replace(/ /g,"_");
			objCurrentGroup.groupText = strGroupName;
		}
		
	}
	
	//PUSH LAST GROUP IN IF IT EXISTS
	if(pendingGroup) objGroups.push(objCurrentGroup);
	
	//RETURN JSON FORMATTED DATA  
	res.type('application/json');
	res.jsonp({ success: true, data: objGroups });
	});
});

app.listen(process.env.PORT || 8642);
console.log('Server running at http://127.0.0.1:8642/');