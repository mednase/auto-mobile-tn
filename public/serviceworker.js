// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/5.5.7/firebase.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    "apiKey": "AIzaSyCMdNeXrGpCk2Vm6oV9ArwPDKDnPtX8jdY",
    "authDomain": "alloambu-fc54b.firebaseapp.com",
    "databaseURL": "https://alloambu-fc54b.firebaseio.com",
    "projectId": "alloambu-fc54b",
    "storageBucket": "alloambu-fc54b.appspot.com",
    "messagingSenderId": "593992581807"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const fb_messaging = firebase.messaging();

// Buffer to save multipart messages
var messagesBuffer = {};

// Gets the number of keys in a dictionary
var countKeys = function (dic) {
    var count = 0;
    for (var i in dic) {
        count++;
    }
    return count;
};

// Parses the Realtime messages using multipart format
var parseRealtimeMessage = function (message) {
    // Multi part
    var regexPattern = /^(\w[^_]*)_{1}(\d*)-{1}(\d*)_{1}([\s\S.]*)$/;
    var match = regexPattern.exec(message);

    var messageId = null;
    var messageCurrentPart = 1;
    var messageTotalPart = 1;
    var lastPart = false;

    if (match && match.length > 0) {
        if (match[1]) {
            messageId = match[1];
        }
        if (match[2]) {
            messageCurrentPart = match[2];
        }
        if (match[3]) {
            messageTotalPart = match[3];
        }
        if (match[4]) {
            message = match[4];
        }
    }

    if (messageId) {
        if (!messagesBuffer[messageId]) {
            messagesBuffer[messageId] = {};
        }
        messagesBuffer[messageId][messageCurrentPart] = message;
        if (countKeys(messagesBuffer[messageId]) == messageTotalPart) {
            lastPart = true;
        }
    }
    else {
        lastPart = true;
    }

    if (lastPart) {
        if (messageId) {
            message = "";

            // Aggregate all parts
            for (var i = 1; i <= messageTotalPart; i++) {
                message += messagesBuffer[messageId][i];
                delete messagesBuffer[messageId][i];
            }

            delete messagesBuffer[messageId];
        }

        return message;
    } else {
        // We don't have yet all parts, we need to wait ...
        return null;
    }
}

// Shows a notification
function showNotification(payload) {
    // In this example we are assuming the message is a simple string
    // containing the notification text. The target link of the notification
    // click is fixed, but in your use case you could send a JSON message with
    // a link property and use it in the click_url of the notification

    // The notification title
    const notificationTitle = payload.title;

    // The notification properties
    const notificationOptions = {
        body: parseRealtimeMessage(payload.body),
        icon: 'img/realtime-logo.jpg',
        data: {
            click_url:payload.link
        },
        tag: Date.now()
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
}

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
fb_messaging.setBackgroundMessageHandler(function(payload) {
    console.log('Received background message ', payload);
    // Customize notification here
    if(payload.notification) {
        return showNotification(payload.notification);
    }
});

// Forces a notification
self.addEventListener('message', function (evt) {
    evt.waitUntil(showNotification(evt));
});

// The user has clicked on the notification ...
self.addEventListener('notificationclick', function(event) {
    console.log('Clicked notification', event.notification);
    // Android doesn’t close the notification when you click on it
    // See: http://crbug.com/463146
    event.notification.close();

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(clients.matchAll({
        type: "window"
    }).then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url == '/' && 'focus' in client)
                return client.focus();
        }
        if (clients.openWindow)
            return clients.openWindow('/');
    }));
});


