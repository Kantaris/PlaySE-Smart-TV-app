var timeout;
var oldKeyHandle;
var isSwedish=true;
var Language =
{
   
};

Language.init = function()
{
	var html = '<div class="language-content">';
	html += '<ul>';
	html += '<li class="title stitle"><a href="#">Language / Språk:</a></li>';
	html += '<li id="english" class="unselected"><a href="#">English</a></li>';
	html += '<li id="swedish" class="checked unselected"><a href="#">Svenska</a></li>';
	html += '</ul>';
	html += '</div>';
	html += '<div class="res-content">';
	html += '<ul>';
	html += '<li class="title"><a href="#">Resolution / Upplösning:</a></li>';
	html += '<li id="resauto" class="unselected"><a href="#">Auto</a></li>';
	html += '<li id="res1" class="unselected"><a href="#">256x144</a></li>';
	html += '<li id="res2" class="unselected"><a href="#">512x288</a></li>';
	html += '<li id="res3" class="unselected"><a href="#">768x432</a></li>';
	html += '<li id="res4" class="unselected"><a href="#">1024x576</a></li>';
	html += '<li id="res5" class="unselected"><a href="#">1280x720</a></li>';
	html += '</ul>';
	html += '</div>';
	html += '<div class="res-live-content">';
	html += '<ul>';
	html += '<li class="title"><a href="#">Resolution / Upplösning (Live):</a></li>';
	html += '<li id="resl1" class="unselected"><a href="#">256x144</a></li>';
	html += '<li id="resl2" class="unselected"><a href="#">512x288</a></li>';
	html += '<li id="resl3" class="unselected"><a href="#">768x432</a></li>';
	html += '<li id="resl4" class="unselected"><a href="#">1024x576</a></li>';
	html += '<li id="resl5" class="unselected"><a href="#">1280x720</a></li>';
	html += '</ul>';
	html += '</div>';
	$(".slider-language").html(html);
    return true;
};

Language.getisSwedish=function(){
return isSwedish;
};

Language.setLang = function(){
	var value = this.checkLanguage();
	alert(value);
	var src="url(images/name.png)";
	if(value == 'English'){
		$('#english').addClass('checked');
		$('#swedish').removeClass('checked');

		src="url(images/name-english.png)";
		$("#popular").text('Popular');
		$("#categories").text('Categories');
		$("#channels").text('Channels & live broadcasts');
		$("#searchshow").text('Search shows');
	

		$("#write").val('');
		$("#delete").text('Delete');
		$("#search").text('Search');
		
		var ltxt = $("#location").text();
		alert(ltxt);
		ltxt = ltxt.replace('Populärt', 'Popular');
		ltxt = ltxt.replace('Kategorier', 'Categories');
		ltxt = ltxt.replace('Kanaler & livesändningar', 'Channels & live broadcasts');
		ltxt = ltxt.replace('Sök:', 'Search:');
		$("#location").text(ltxt);
		isSwedish=false;
		
	}else {

		$('#swedish').addClass('checked');
		$('#english').removeClass('checked');

		$("#popular").text('Populärt');
		$("#categories").text('Kategorier');
		$("#channels").text('Kanaler & livesändningar');
		$("#searchshow").text('Sök programtitlar');
		
		$("#write").val('');
		$("#delete").text('Ta Bort');
		$("#search").text('Sök');
		
		var ltxt = $("#location").text();
		ltxt = ltxt.replace('Popular', 'Populärt');
		ltxt = ltxt.replace('Categories', 'Kategorier');
		ltxt = ltxt.replace('Channels & live broadcasts', 'Kanaler & livesändningar');
		ltxt = ltxt.replace('Search:', 'Sök:');
		$("#location").text(ltxt);
		isSwedish=true;
	}
	
	$('#companyName').css('background-image', src );
	
	if($("#aired").length > 0)
		this.setDetailLang();
	else if($("#shown_now").length > 0){
		this.setKanalerLang();
	}

};


Language.setDetailLang=function(){
	var value = this.checkLanguage();
	if(value == 'English'){
	
		$("#aired").text("Aired: ");		
		$("#available").text("Available to: ");		
		$("#duration").text("Duration: ");
		$("#playButton").text("Play");	
		$("#backButton").text("Return");
		
	}else {
		$("#aired").text("Sändes: ");
		$("#available").text("Tillgänglig till: ");
		$("#duration").text("Längd: ");
		$("#playButton").text("Spela upp");
		$("#backButton").text("Tillbaka");
	}
};

Language.setKanalerLang=function(){
	var value = this.checkLanguage();
	if(value == 'English'){
	
		$("#shown_now").text("Shown now: ");
		$("#begins").text("Begins: ");
		$("#duration").text("Duration: ");
		$("#playButton").text("Play");
		$("#backButton").text("Return");
		
	}else {
		$("#shown_now").text("Visas nu: ");
		$("#begins").text("Börjar: ");
		$("#duration").text("Längd: ");
		$("#playButton").text("Spela upp");
		$("#backButton").text("Tillbaka");
	}
};

Language.show = function()
{
	
	if(Buttons.getKeyHandleID() != 6){
		oldKeyHandle = Buttons.getKeyHandleID();
		Buttons.setKeyHandleID(6);
	}
	else{
		Buttons.setKeyHandleID(oldKeyHandle);
	}
	$(".slider-language").slideToggle(500, function() {});	

};

Language.hide = function()
{
	
	if(Buttons.getKeyHandleID() == 6){
		Buttons.setKeyHandleID(oldKeyHandle);
		$(".slider-language").slideToggle(500, function() {});	
	}
	

};


Language.getCookie = function(cName){
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
  {
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==cName)
    {
    return unescape(y);
    }
  }
};

Language.setCookie = function(cName,value,exdays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=cName + "=" + c_value;
};

Language.checkLanguage = function()
{
var language=this.getCookie("language");
if (language!=null && language!="")
  {
  return language;
  }
else 
  {
	return 'Swedish';
  }
};

Language.setLanguage = function(value)
{
	this.setCookie('language', value, 1000);
};

