const express = require("express");
const bodyParser = require("body-parser");

const auth = require("./auth");
const userApi = require("./userapi"); 
const errandsApi = require("./errandsapi");
const messagesApi = require("./messagesapi");
const stateTransitionApi = require("./statetransitionapi");
const socket = require("./socket");
const { uuid } = require("uuidv4");
const SYSTEM = "SYSTEM";
const NOTIFICATION = "NOTIFICATION";

const messageDao = require("./messagesDao");
const stateTransitionDao = require("./statetransitiondao");

const app = express();
const port = process.env.PORT || 5000;
const server = app.listen(port, () => serverInit());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

auth(app);
userApi(app);
errandsApi(app);
messagesApi(app);
stateTransitionApi(app);
socket(server);

function serverInit(){
    console.log(`Listening on port ${port}`);
    checkTimedOutOffer();
};

function getNotificationForRunner(offer, content) {
    return {
        id: uuid(), createdAt: new Date(), isRead: 0, sender: SYSTEM, receiver: offer.sender, relatedUser: offer.receiver,
        type: NOTIFICATION, content: "offer id: " + offer.id + " " + content
    };
};

function getNotificationForPoster(offer, content) {
    return {
        id: uuid(), createdAt: new Date(), isRead: 0, sender: SYSTEM, receiver: offer.receiver, relatedUser: offer.sender,
        type: NOTIFICATION, content: "offer id: " + offer.id + " " + content
    };
};

function createTimeoutMessagesInDB(offer){
    const timeoutNotificationToRunner = getNotificationForRunner(offer, "canceled due to timeout");
    const timeoutNotificationToPoster = getNotificationForPoster(offer, "canceled due to timeout");

    messageDao.createNewMessage(timeoutNotificationToRunner, function (error, data) {
        if (error) console.log("There was error on creating timeout notification");
    });
    messageDao.createNewMessage(timeoutNotificationToPoster, function (error, data) {
        if (error) console.log("There was error on creating timeout notification");
    });
}

//TODO: if server runs before some offer's timeout AND somebody sign in, socket emit if timeout happens later..
function checkTimedOutOffer(){
    const oneMinute = 60 * 1000;
    messageDao.getMessagesByType("OFFER", function(error, data){
        if(error) console.log("There was error on fetching offers in server init");
        else{
            data.forEach(offer => {
                stateTransitionDao.getCurrentState(offer.id, function(error, data){
                    if(error) console.log("There was error on fetching offer's current state in server init");
                    
                    // if initial state
                    if(data.length === 0){
                        // if timeout
                        if(new Date() - offer.createdAt > oneMinute){
                            const transition = {object_id:offer.id, new_state:"canceled", timestamp:new Date()}
                            stateTransitionDao.createNewTransition(transition, function(error, data){
                                if(error) console.log("There was error on cancelling timed out offer");
                                else createTimeoutMessagesInDB(offer);
                            });
                        }
                        else{
                            const untilTimeout = offer.createdAt - new Date() + oneMinute;
                            setTimeout(()=>{
                                stateTransitionDao.getCurrentState(offer.id, function(error, data){
                                    if(error) console.log("There was error on fetching offer's current state after time out in server init");
                                    
                                    // still intial state after timeout
                                    if(data.length === 0){
                                        const transition = { object_id: offer.id, new_state: "canceled", timestamp: new Date() }
                                        stateTransitionDao.createNewTransition(transition, function (error, data) {
                                            if (error) console.log("There was error on cancelling timed out offer");
                                            else createTimeoutMessagesInDB(offer);
                                        });
                                    }
                                });
                            },untilTimeout);
                        }
                    }
                        
                    else{
                        if(data[0].new_state === "accepted"){
                            if(new Date()- data[0].timestamp > oneMinute){
                                const transition = { object_id: offer.id, new_state: "canceled", timestamp: new Date() }
                                stateTransitionDao.createNewTransition(transition, function (error, data) {
                                    if (error) console.log("There was error on cancelling timed out offer");
                                    else createTimeoutMessagesInDB(offer);
                                });
                            }
                            else{
                                const untilTimeout = data[0].timestamp - new Date() + oneMinute;
                                setTimeout(()=>{
                                    stateTransitionDao.getCurrentState(offer.id, function(error, data){
                                        if(error) console.log("There was error on fetching offer's current state after time out in server init");
                                        
                                        // still intial state after timeout
                                        if(data[0].new_state === "accepted"){
                                            const transition = { object_id: offer.id, new_state: "canceled", timestamp: new Date() }
                                            stateTransitionDao.createNewTransition(transition, function (error, data) {
                                            if (error) console.log("There was error on cancelling timed out offer");
                                            else createTimeoutMessagesInDB(offer);
                                        });
                                        }
                                    });
                                },untilTimeout);
                            }
                        }
                    }
                    
                });
            });
        }
    });
}
