/**
 * Created by medna on 25/01/2017.
 */
$("document").ready(function () {
    initNotification();

    if ($(window).width() < 1100) {
        $('.page-sidebar-menu').addClass('page-sidebar-menu-closed');
        $('body').toggleClass('page-sidebar-closed');
    }
    $('.nav-item').click(function () {
        if (!$(this).hasClass('nav-list'))
            $('.active').each(function () {
                $(this).removeClass("active");
            });

        $(this).addClass("active");
    });

    $('.active').each(function () {
        $(this).removeClass("active");
    });

    if ($("#menuSelected").length) {
        $("." + $("#menuSelected").data('menu')).addClass('active');
    }
    /* WIDGETS (DEMO)*/
    $(".widget-remove").on("click", function () {
        $(this).parents(".widget").fadeOut(400, function () {
            $(this).remove();
            $("body > .tooltip").remove();
        });
        return false;
    });
    /* END WIDGETS */

    $(window).resize(function () {
        if ($(window).width() < 1100) {
            $('body').addClass('page-sidebar-closed');
            $('.page-sidebar-menu').addClass('page-sidebar-menu-closed');
        } else {
            $('.page-sidebar-menu').removeClass('page-sidebar-menu-closed');
            $('body').removeClass('page-sidebar-closed');
        }

    });
});

function initNotification() {
    // Initialize Firebase
    firebase.initializeApp({
        "apiKey": "AIzaSyCMdNeXrGpCk2Vm6oV9ArwPDKDnPtX8jdY",
        "authDomain": "alloambu-fc54b.firebaseapp.com",
        "databaseURL": "https://alloambu-fc54b.firebaseio.com",
        "projectId": "alloambu-fc54b",
        "storageBucket": "alloambu-fc54b.appspot.com",
        "messagingSenderId": "593992581807"
    });
// Retrieve Firebase Messaging object.
    var messaging = firebase.messaging();
    navigator.serviceWorker.register('./public/serviceworker.js')
        .then(function(registration) {
        messaging.useServiceWorker(registration);
        messaging.requestPermission().then(function () {
            if (!isTokenSentToServer())
                getRegistrationToken();
        }).catch(function (err) {
            console.log('Unable to get permission to notify.', err);
        });
    });


// Get Instance ID token. Initially this makes a network call, once retrieved
    function getRegistrationToken() {
        // subsequent calls to getToken will return from cache.
        messaging.getToken().then(function (currentToken) {
            if (currentToken) {
                console.log(currentToken);
                setTokenSentToServer(currentToken);
            } else {
                // Show permission request.
                console.log('No Instance ID token available. Request permission to generate one.');
                setTokenSentToServer(false);
            }
        }).catch(function (err) {
            console.log('An error occurred while retrieving token. ', err);
            setTokenSentToServer(false);
        });
    }

    function setTokenSentToServer(sent) {
        window.localStorage.setItem('sentToServer', sent ? '1' : '0');
    }

    function isTokenSentToServer() {
        return window.localStorage.getItem('sentToServer') === '1';
    }
}