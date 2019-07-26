function hideAllButCurrent(){
    //by default all submenut items are hidden
    document.querySelectorAll("nav > ul > li > ul li").forEach(function(parent) {
        parent.style.display = "none";
    });
    
    //only current page (if it exists) should be opened
    var file = window.location.pathname.split("/").pop();
    document.querySelectorAll("nav > ul > li > a[href^='"+file+"']").forEach(function(parent) {
        parent.parentNode.querySelectorAll("ul li").forEach(function(elem) {
            elem.style.display = "block";
        });
    });
}

hideAllButCurrent();