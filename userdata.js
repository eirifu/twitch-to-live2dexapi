var clientId = 'tme4ycjv51u831gyle98xlv38s99j7'; 
// You don't need to change this unless you're doing your own Twitch Dev key

var myOAuthToken = 'xxxxxx';
// This expires in 60 days! If you see ERR_BADAUTH in the log,
// go to https://twitchapps.com/tokengen/ and generate a new key!
// put this as the scope: channel:read:redemptions

/*  
	HOW TO ASSIGN CHANNEL POINT REWARDS

	1. Copy-paste the exact reward name into the rewardX variable
	2. Copy-paste the exact file location of the model3.json file 
		into the rewardXdir variable

	IMPORTANT!!!  
	-> Make sure the directory slashes are / and not \ !! 
	-> and don't forget to enclose the text in ' !!
	
	REMOVING REWARDS
	1. Replace the reward name with invalid text like a single letter.
	
	---
	ADVANCED USERS ONLY
	If the reward slots are insufficient, go to sendToExAPI() in main.js
	and expand/modify as necessary.
*/

//rewardA also doubles as the default when you press "Default Model"
var rewardA = 'Change! Default Outfit';
var rewardADir = 'D:/Live2DModels/default.model3.json';

var rewardB = 'Change! Teacher Outfit';
var rewardBDir = 'D:/Live2DModels/teacher.model3.json';

var rewardC = 'Change! Witch Outfit';
var rewardCDir = 'D:/Live2DModels//witch.model3.json';

var rewardD = 'd';
var rewardDDir = '';

var rewardE = 'e';
var rewardEDir = '';

var rewardF = 'f';
var rewardFDir = '';

var rewardG = 'g';
var rewardGDir = '';

var rewardH = 'h';
var rewardHDir = '';

var rewardI = 'i';
var rewardIDir = '';

var rewardJ = 'j';
var rewardJDir = '';