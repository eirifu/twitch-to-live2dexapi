//  Twitch Channel Point -> Live2DViewerEx Automatic Model Switcher
//  by Eiri Sanada
//  @eirifu - eiri.sanada at gmail dot com
//  Licence: GPLv3

//
//  DON'T EDIT THIS FILE, USE USERDATA.JS
//

var wsTwitch;
var wsExAPI;

var ExAPIstartupcheck = 0;
var verifyOnce;

var TwitchIDNo;

function nonce(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function logMsg(message){
	// Timestamp
	var time = new Date(Date.now());
	var timest = "["+(time.getHours() < 10 ? '0' : '')+time.getHours() + ":" + (time.getMinutes() < 10 ? '0' : '') + time.getMinutes() + "] ";
	
	$('.ws-output').append('\n'+timest+message);
    $('.ws-output').scrollTop($('.ws-output')[0].scrollHeight);
};


/////   STARTUP PART 1
$(function() {
	connect();
	$.ajax({
		url: "https://api.twitch.tv/helix/users",
		method: "GET",
		headers: {
			"Client-ID": clientId,
			"Authorization": "Bearer " + myOAuthToken
		}})
		.done(function(user) {
			var username = user.data[0].display_name;
			TwitchIDNo = user.data[0].id;
			$('#topic-label').text('User: ' + username + '  -  ID: ' +TwitchIDNo);
			//logMsg(JSON.stringify(user.data[0].id));
		});
});

// Required to prevent Twitch API from closing the connection
function heartbeat() {
    message = {
        type: 'PING'
    };
    logPing();
    wsTwitch.send(JSON.stringify(message));
}

///// STARTUP PART 2
function connect() {
	var heartbeatInterval = 1000 * 180; //ms between PINGs
    var reconnectInterval = 1000 * 3; //ms to wait before reconnect
    var heartbeatHandle;

///   TWITCH CONNECT AND RECIEVE
    wsTwitch = new WebSocket('wss://pubsub-edge.twitch.tv');
    wsTwitch.onopen = function(event) {
        logMsg('Connected to Twitch API!');
        heartbeat();
        heartbeatHandle = setInterval(heartbeat, heartbeatInterval);
    };

    wsTwitch.onerror = function(error) {
        logMsg('ERR: ' + JSON.stringify(error));
    };

    wsTwitch.onmessage = function(event) {
        message = JSON.parse(event.data);
        switch(message.type){
			case 'RECONNECT':
            logMsg('RECV: RECONNECT Request, Retrying...');
            setTimeout(connect, reconnectInterval);
			break;
		case 'MESSAGE':
			var message2 = JSON.parse(message.data.message);
			var title = message2.data.redemption.reward.title;
			logMsg('---- REDEMPTION ----\n        '+ title);
			setTimeout(sendToExAPI,3000,title);
			break;
		case 'PONG':
			$('#status-label').append(' PONG!');
			break;
		case 'RESPONSE':
			var errcheck = message.error;
			if (errcheck == ''){
				logMsg( (message.nonce==verifyOnce) ? 'LISTEN Auth Confirm!' : 'RECV: ' + JSON.stringify(message));
			} else {
				logMsg( 'ERROR: ' + errcheck);
			}
			break;
		default:
			logMsg('RECV: ' + JSON.stringify(message));
		}
		// DEBUG - reveal full strings in log
		// comment this out when not debugging!!
		//logMsg('RECV: ' + JSON.stringify(message));
    };

    wsTwitch.onclose = function() {
        logMsg('Twitch API connection was closed! Check the Auth!');
        clearInterval(heartbeatHandle);
        logMsg('Reconnecting...');
        setTimeout(connect, reconnectInterval);
    };
	
/// LIVE2DVIEWEREX CONNECT AND SEND
	
	wsExAPI = new WebSocket('ws://127.0.0.1:10086/api');
	
    wsExAPI.onopen = function(event) {
        logMsg('Connecting to Live2DViewerEX!');
		ExAPIstartupcheck = 1
    };

    wsExAPI.onclose = function() {
        logMsg(((ExAPIstartupcheck==0) ? 'Live2DViewerEx is not running!' : 'Live2DViewerEx connection lost!'));
    };
	
/// GOES TO STARTUP PART 3
	setTimeout(listen,3000);
}

/////STARTUP PART 3
function listen() {
	
	var topic = 'channel-points-channel-v1.' + TwitchIDNo;
	
	verifyOnce = nonce(15);
    message = {
        type: 'LISTEN',
        nonce: verifyOnce,
        data: {
            topics: [topic],
            auth_token: myOAuthToken
        }
    };
    logMsg('Requesting LISTEN to Channel Points');
    wsTwitch.send(JSON.stringify(message));
}

///// ACTUAL HANDLER TO SEND COMMANDS TO LIVE2DVIEWEREX
/// This is delayed by 3 seconds to react appropriately
function sendToExAPI(title){
	// The id here is for the Live2D model slot in Live2DViewerEX
	var slot0 = "{msg:13000,msgId:1,data:{id: 0, file: '";
	var slot1 = "{msg:13000,msgId:1,data:{id: 1, file: '";
	var slot2 = "{msg:13000,msgId:1,data:{id: 2, file: '";
	
	switch(title){
		case rewardA:
			wsExAPI.send(slot0 + rewardADir + "'}}");
			break;
		case rewardB:
			wsExAPI.send(slot0 + rewardBDir + "'}}");
			break;
		case rewardC:
			wsExAPI.send(slot0 + rewardCDir + "'}}");
			break;
		case rewardD:
			wsExAPI.send(slot0 + rewardDDir + "'}}");
			break;
		case rewardE:
			wsExAPI.send(slot0 + rewardEDir + "'}}");
			break;
		case rewardF:
			wsExAPI.send(slot0 + rewardFDir + "'}}");
			break;
		case rewardG:
			wsExAPI.send(slot0 + rewardGDir + "'}}");
			break;
		case rewardH:
			wsExAPI.send(slot0 + rewardHDir + "'}}");
			break;
		case rewardI:
			wsExAPI.send(slot0 + rewardIDir + "'}}");
			break;
		case rewardJ:
			wsExAPI.send(slot0 + rewardJDir + "'}}");
			break;
		default:
	}
	
};

// Attached to the 'Default Model' button on the webpage
function resetmodel(){
	sendToExAPI(rewardA);
}

// Separate log area to prevent clutter in the main box, see heartbeat()
function logPing(){
	// Timestamp
	var time = new Date(Date.now());
	var timest = "["+(time.getHours() < 10 ? '0' : '')+time.getHours() + ":" + (time.getMinutes() < 10 ? '0' : '') + time.getMinutes() + "] ";
	
	$('#status-label').text(''+timest+' Twitch PING!');
};