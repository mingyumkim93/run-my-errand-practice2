const messageDao = require("./messagesDao");
const stateTransitionDao = require("./statetransitiondao");
const tenSeconds = 1000 * 10;
const SYSTEM = "SYSTEM";
const NOTIFICATION = "NOTIFICATION";
const { uuid } = require("uuidv4");
let timersForOffer = {};

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

function createNotifications(io, offer, content) {
    const notificationToRunner = getNotificationForRunner(offer, content);
    const notificationToPoster = getNotificationForPoster(offer, content);
    messageDao.createNewMessage(notificationToRunner, function (err, data) {
        if (err) console.log(err);
        else {
            io.in(notificationToRunner.receiver).emit("message", notificationToRunner);
            io.in(notificationToRunner.receiver).emit("offer-state-changed");
        }
    });
    messageDao.createNewMessage(notificationToPoster, function (err, data) {
        if (err) console.log(err);
        else {
            io.in(notificationToPoster.receiver).emit("message", notificationToPoster);
            io.in(notificationToPoster.receiver).emit("offer-state-changed");
        }
    });
};

function setStateCheckTimeout(io, offer, lastTransitionTimestamp = undefined) {
    clearTimeout(timersForOffer[offer.id]);
    delete timersForOffer[offer.id];
    timersForOffer = {
        ...timersForOffer, [offer.id]: setTimeout(() => {
            stateTransitionDao.getCurrentState(offer.id, function (err, data) {
                if (err) console.log(err);
                else {
                    //if data===[]  >> no transition at all >> still initial state
                    if (!data[0]) createCanceledOfferStateTransition(io, offer);
                    //if there has been some state transition since the offer was created
                    else {
                        if (data[0].new_state === "accepted") createCanceledOfferStateTransition(io, offer);
                    }
                }
            });
        }, lastTransitionTimestamp ? lastTransitionTimestamp - new Date() + tenSeconds : offer.createdAt - new Date() + tenSeconds)
    };
};

function createCanceledOfferStateTransition(io, offer) {
    const transition = { object_id: offer.id, new_state: "canceled", timestamp: new Date() }
    stateTransitionDao.createNewTransition(transition, function (err, data) {
        if (err) console.log(err);
        else createNotifications(io, offer, "is canceled due to timeout");
    });
};

function createNewOfferStateTransition(io, object_id, new_state) {
    const transition = { object_id, new_state, timestamp: new Date() };
    stateTransitionDao.createNewTransition(transition, function (err, data) {
        if (err) console.log(err);
        else {
            messageDao.getMessageById(object_id, function (err, data) {
                const offer = data[0];
                if (err) console.log(err);
                else {
                    if (new_state === "canceled") createNotifications(io, offer, "is canceled");
                    else if (new_state === "accepted") {
                        createNotifications(io, offer, "is accepted");
                        setStateCheckTimeout(io, offer, new Date());
                    }
                    else createNotifications(io, offer, "is confirmed");
                };
            });
        };
    });
};

function messageHandler(io, socket, message) {
    message = { ...message, createdAt: new Date(), isRead: 0, id: uuid() };
    messageDao.createNewMessage(message, function (err, data) {
        if (err) socket.emit("message-error");
        else {
            //only chat and offer will be emited like this because there is no notification coming from client side
            io.in(message.receiver).emit("message", message);
            io.in(message.sender).emit("message", message);
            if (message.type === "OFFER") {
                createNotifications(io, message, "is sent");
                setStateCheckTimeout(io, message);
            }
        };
    });
};

function offerStateChangeHandler(io, socket, payload) {
    const object_id = payload.object_id;
    const new_state = payload.new_state;
    let currentState = "initial";
    stateTransitionDao.getCurrentState(object_id, function (err, data) {
        if (err) console.log(err);
        else {
            if (data[0]) currentState = data[0].new_state;
            switch (currentState) {
                case "canceled": {
                    socket.emit("not-allowed-offer-state-transition");
                    break;
                }
                case "initial": {
                    if (new_state === "canceled" || new_state === "accepted") {
                        createNewOfferStateTransition(io, object_id, new_state);
                    }
                    else socket.emit("not-allowed-offer-state-transition");
                    break;
                }
                case "accepted": {
                    if (new_state === "canceled" || new_state === "confirmed") {
                        createNewOfferStateTransition(io, object_id, new_state);
                    }
                    else socket.emit("not-allowed-offer-state-transition");
                    break;
                }
                case "confirmed": {
                    socket.emit("not-allowed-offer-state-transition");
                    break;
                }
                default: {
                    socket.emit("not-allowed-offer-state-transition");
                    break;
                }
            }
        }
    });
};

function initialCheckForTimeoutOffer(io) {
    messageDao.getMessagesByType("OFFER", function (err, data) {
        if (err) console.log(err);
        else {
            data.forEach(offer => {
                stateTransitionDao.getCurrentState(offer.id, function (err, data) {
                    if (err) console.log(err);
                    else {
                        //if initial state
                        if (data.length === 0) {
                            //if timeout
                            if (new Date() - offer.createdAt > tenSeconds) {
                                createCanceledOfferStateTransition(io, offer);
                            }
                            //not timeout yet
                            else {
                                setStateCheckTimeout(io, offer);
                            }
                        }
                        //not initial state (canceled, accepted, confirmed)
                        else {
                            if (data[0].new_state === "accepted") {
                                //if timeout
                                if (new Date() - data[0].timestamp > tenSeconds) {
                                    createCanceledOfferStateTransition(io, offer);
                                }
                                else {
                                    setStateCheckTimeout(io, offer, data[0].timestamp);
                                }
                            }
                        }
                    }
                });
            });
        }
    });
};

exports.messageHandler = messageHandler;
exports.offerStateChangeHandler = offerStateChangeHandler;
exports.initialCheckForTimeoutOffer = initialCheckForTimeoutOffer;