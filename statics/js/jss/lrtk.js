$(function(){
   //toop()
     var winW = $(window).width();
     if(winW < 1280 && winW > 768){
     $("#header").width("1280px");
	 $(".indx_banner").width("1280px");
	 $(".about").width("1280px");
	 $(".products").width("1280px");
	 $(".video").width("1280px");
	 $(".youshi").width("1280px");
	 $(".news").width("1280px");
	 $(".wangdian").width("1280px");
	 $("#footer").width("1280px");
	 $(".footer_fot").width("1280px");
	 
   }else{
     $("#header").width("").css("max-width","");
	 $(".indx_banner").width("").css("max-width","");
	 $(".about").width("");
	 $(".products").width("");
	 $(".video").width("");
	 $(".youshi").width("");
	 $(".news").width("");
	 $(".wangdian").width("");
	 $("#footer").width("");
	 $(".footer_fot").width("");
   }
   
   $(".nav_box li").mouseenter(function(){
      var showsub=this.getAttribute("datasub");/*js 函数获取属性值，解决兼容问题*/
	  $(".nva_list").stop(true,true).slideDown(300,function(){
		for (var i = 1; i < 8; i++) {
		  if (showsub!='sublist'+i){
			 $("#sublist"+i).stop(true,true).fadeOut(300/*,function(){$('#'+showsub).fadeIn(300);}*/);
		  }else{
		     $('#sublist'+i).stop(true,true).fadeIn(300);
		  }
		}						
	  })
	  
	  $(".link_box").mouseleave(function(){
	    $(".nva_list").stop(true,true).slideUp(300);
	  })
	  
   });
   
   Hover($(".cp_cont .btn"), "hover")
   Scroll($(".cp_cont .list-in"),$(".cp_cont .prev"),$(".cp_cont .next"),240,1)
   
   //TitAutoHeight(".cp_cont li",".bt",210,28)
   //TitAutoHeight(".anli li",".tit",170,28)
});

var MyMar;
var speed = 1; //速度，越大越慢
var spec = 1; //每次滚动的间距, 越大滚动越快
var ipath = 'images/'; //图片路径
var thumbs = document.getElementsByClassName('thumb_img');
for (var i=0; i<thumbs.length; i++) {
    thumbs[i].onmouseover = function () {jQuery('main_img').src=this.rel; jQuery('main_img').link=this.link;};
    thumbs[i].onclick = function () {location = this.link}
}
jQuery('main_img').onclick = function () {location = this.link;}
//jQuery('gotop').onmouseover = function() {this.src = ipath + 'gotop2.gif'; MyMar=setInterval(gotop,speed);}
//jQuery('gotop').onmouseout = function() {this.src = ipath + 'gotop.gif'; clearInterval(MyMar);}
//jQuery('gobottom').onmouseover = function() {this.src = ipath + 'gobottom2.gif'; MyMar=setInterval(gobottom,speed);}
//jQuery('gobottom').onmouseout = function() {this.src = ipath + 'gobottom.gif'; clearInterval(MyMar);}
//function gotop() {jQuery('showArea').scrollTop-=spec;}
//function gobottom() {jQuery('showArea').scrollTop+=spec;}

Hover($(".t_control .btn"), "hover")
Scroll($(".t_control .list-in"),$(".t_control .prev"),$(".t_control .next"),89,0)

Hover($(".anli_box .btn"), "hover")
Scroll($(".anli_box .list-in"),$(".anli_box .prev"),$(".anli_box .next"),190,0)

Hover($(".ryzs_box .btn"), "hover")
Scroll($(".ryzs_box .list-in"),$(".ryzs_box .prev"),$(".ryzs_box .next"),89,0)

Hover($(".scsb_box .btn"), "hover")
Scroll($(".scsb_box .list-in"),$(".scsb_box .prev"),$(".scsb_box .next"),89,0)



function Hover(obj, calssName) {
	obj.hover(function(){
		$(this).addClass(calssName);
	},function(){
		$(this).removeClass(calssName);
	})
}

function toop(){
    $(".nav_box ul li").mouseenter(function(){
		//var $_this=$(this);
        var index=$(this).index();
		
        if(index==7){
			return false;
		}else{
            //$(this).addClass("on");
			$(".nva_list").slideDown("fast",function(){
                $(".minins").eq(index).fadeIn(300).siblings(".minins").fadeOut(300);
				//$(this).removeClass("on");
            })
        }
    })
    $(".link_box").mouseleave(function(){
		$(".nva_list").slideUp("fast");

    })

}

function TitAutoHeight (classpath,classname,Onheight,Offheight){
  	$(classpath).hover(function(){
	   $(this).find(classname).animate({"height":Onheight},300);
	},function(){
	   $(this).find(classname).animate({"height":Offheight},300);
	});
}

/*   $(".nav_box li").mouseenter(function(){
      $(".nva_list").stop(true,true).stop(true,true).slideDown(300,function(){
		for (var i = 1; i < 8; i++) {
		  $("#sublist"+i).fadeOut(300);
		}
		var showsub=$(this).attr("datasub")
		$(showsub).fadeIn(300);							
	  })
	  
	  $(".link_box").mouseleave(function(){
	    $(".nva_list").stop(true,true).slideUp(300);
	  })
	  
   });*/


    /*header*/
    //var _navLiW = $("#nav .nLi").width();
    //$("#nav .head-sub").find("p").width(_navLiW);
    //$("#nav .sub-nav-i").css({"margin-left":-_navLiW/2});
    $(".subli").mouseenter(function(){
        //$(".head-sub").stop(true,true).slideDown(300);
        var _subLiLength = $(this).find(".head-sub").find("p").length;
        //$(this).find(".head-sub").width(_navLiW*_subLiLength);
        //$(this).find(".head-sub").css({"margin-left":-_navLiW});
        $(this).find(".head-sub").width(100*_subLiLength);
        //$(this).find(".head-sub").css({"margin-left":-100});
        $(".head-nav-bg").stop(true,true).slideDown(300);
        $(this).find(".head-sub").stop(true,true).slideDown(300);
        $(this).find(".head-sub-row").fadeIn(300);
    })
    $(".sub-nav p").mouseleave(function(){
        $(this).find(".sub-nav-i").stop().animate({"width":0},300);
    })
    $(".sub-nav p").mouseenter(function(){
        $(this).find(".sub-nav-i").stop().animate({"width":"100%"},300);
    })
    $(".subli").mouseleave(function(){
        $(".head-sub").stop(true,true).slideUp(300);
        $(".head-nav-bg").stop(true,true).slideUp(300);
        $(this).find(".head-sub-row").fadeOut(300);
    })

    $("#head-search .search").click(function(){
        if($(this).attr("class").indexOf("on") != -1){
            $(".head-search-bg").stop(true,true).slideUp(300);
            $(this).removeClass("on");
        }else{
            $(".head-search-bg").stop(true,true).slideDown(300);
            $(this).addClass("on");
        }
    })
	$(".nav ul li").hover(function(){
		$(this).find("a").addClass("hover");
		$(this).addClass("show");
		$(this).find(".sonNav").stop(false,true).slideDown(300);	
	},function(){
		$(this).find("a").removeClass("hover");
		$(this).removeClass("show");
		$(this).find(".sonNav").stop(false,true).slideUp(300);		
	});

$(window).resize(function() {  
  var width = $(this).width();  
  var height = $(this).height();  
  if(width<1280 && width>768){
    $("#header").width("1280px");
	 $(".indx_banner").width("1280px");
	 $(".about").width("1280px");
	 $(".products").width("1280px");
	 $(".video").width("1280px");
	 $(".youshi").width("1280px");
	 $(".news").width("1280px");
	 $(".wangdian").width("1280px");
	 $("#footer").width("1280px");
	 $(".footer_fot").width("1280px");
	
  }else{
    $("#header").width("").css("max-width","");
	 $(".indx_banner").width("").css("max-width","");
	 $(".about").width("");
	 $(".products").width("");
	 $(".video").width("");
	 $(".youshi").width("");
	 $(".news").width("");
	 $(".wangdian").width("");
	 $("#footer").width("");
	 $(".footer_fot").width("");
  }
});
