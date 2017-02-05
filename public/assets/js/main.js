/**
 * Created by medna on 25/01/2017.
 */
$("document").ready(function () {
    if($(window).width()<1100){
        $('.page-sidebar-menu').addClass('page-sidebar-menu-closed');
       $('body').toggleClass('page-sidebar-closed');
    }
    $('.nav-item').click(function () {
        $(this).toggleClass('active');
    });
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

    $(window).resize(function() {
        if($(window).width()<1100){
            $('body').addClass('page-sidebar-closed');
            $('.page-sidebar-menu').addClass('page-sidebar-menu-closed');
        }else{
            $('.page-sidebar-menu').removeClass('page-sidebar-menu-closed');
            $('body').removeClass('page-sidebar-closed');
        }

    });
});