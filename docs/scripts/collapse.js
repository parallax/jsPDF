function hideAllButCurrent(){
    //by default all submenut items are hidden
    $("nav > ul > li > ul li").hide();
    
    //only current page (if it exists) should be opened
    var file = window.location.pathname.split("/").pop();
    $("nav > ul > li > a[href^='"+file+"']").parent().find("> ul li").show();
}
$( document ).ready(function() {
    hideAllButCurrent();
});