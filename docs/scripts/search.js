$( document ).ready(function() {
    var searchAttr = 'data-search-mode';
    jQuery.expr[':'].Contains = function(a,i,m){
        return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
    };
    //on search
    $("#nav-search").on("keyup", function(event) {
        var search = $(this).val();

        if (!search) {
            //no search, show all results
            document.documentElement.removeAttribute(searchAttr);
            $("nav > ul > li").not('.level-hide').show();

            if(typeof hideAllButCurrent === "function"){
                //let's do what ever collapse wants to do
                hideAllButCurrent();
            }
            else{
                //menu by default should be opened
                $("nav > ul > li > ul li").show();
            }
        }
        else{
            //we are searching
            document.documentElement.setAttribute(searchAttr, '');

            //show all parents
            $("nav > ul > li").show();
            //hide all results
            $("nav > ul > li > ul li").hide();
            //show results matching filter
            $("nav > ul > li > ul").find("a:Contains("+search+")").parent().show();
            //hide parents without children
            $("nav > ul > li").each(function(){
                if($(this).find("a:Contains("+search+")").length == 0 && $(this).children("ul").length === 0){
                    //has no child at all and does not contain text
                    $(this).hide();
                }
                else if($(this).find("a:Contains("+search+")").length == 0 && $(this).find("ul").children(':visible').length == 0){
                    //has no visible child and does not contain text
                    $(this).hide();
                }
            });
        }
    });
});