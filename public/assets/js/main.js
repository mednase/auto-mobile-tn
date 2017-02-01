/**
 * Created by medna on 25/01/2017.
 */
$("document").ready(function () {
    $('.active').each(function () {
        $(this).removeClass("active");
    });
    if ($("#menuSelected").length) {
        $("." + $("#menuSelected").data('menu')).addClass('active');
    }
});