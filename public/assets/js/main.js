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
    /* WIDGETS (DEMO)*/
    $(".widget-remove").on("click",function(){
        $(this).parents(".widget").fadeOut(400,function(){
            $(this).remove();
            $("body > .tooltip").remove();
        });
        return false;
    });
    /* END WIDGETS */
});