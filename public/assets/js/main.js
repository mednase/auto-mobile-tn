/**
 * Created by medna on 25/01/2017.
 */
$("document").ready(function () {
    console.log("aaaaaa");
    $('.active').each(function () {
        console.log($(this));

        $(this).removeClass("active");
    });
    if ($("#menuSelected").length) {
        $("." + $("#menuSelected").data('menu')).addClass('active');
    }
});