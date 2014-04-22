var timeout;
var oldKeyHandle;
var isSwedish=true;
var Language =
{
   
};

Language.init = function()
{

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
		$("#recommended").text('Recommended');
		$("#categories").text('Categories');
		$("#channels").text('Channels & live broadcasts');
		$("#searchshow").text('Search shows');
	

		$("#write").val('');
		$("#delete").text('Delete');
		$("#search").text('Search');
		
		var ltxt = $("#location").text();
		alert(ltxt);
		ltxt = ltxt.replace('Rekommenderat', 'Recommended');
		ltxt = ltxt.replace('Kategorier', 'Categories');
		ltxt = ltxt.replace('Kanaler & livesändningar', 'Channels & live broadcasts');
		ltxt = ltxt.replace('Sök:', 'Search:');
		$("#location").text(ltxt);
		isSwedish=false;
		
	}else {

		$('#swedish').addClass('checked');
		$('#english').removeClass('checked');

		$("#recommended").text('Rekommenderat');
		$("#categories").text('Kategorier');
		$("#channels").text('Kanaler & livesändningar');
		$("#searchshow").text('Sök programtitlar');
		
		$("#write").val('');
		$("#delete").text('Ta Bort');
		$("#search").text('Sök');
		
		var ltxt = $("#location").text();
		ltxt = ltxt.replace('Recommended', 'Rekommenderat');
		ltxt = ltxt.replace('Categories', 'Kategorier');
		ltxt = ltxt.replace('Channels & live broadcasts', 'Kanaler & livesändningar');
		ltxt = ltxt.replace('Search:', 'Sök:');
		$("#location").text(ltxt);
		isSwedish=true;
	}
	
	document.getElementById("companyName").style.backgroundImage=src;

};


Language.setDetailLang=function(value){
	if(value == 'English'){
	
		var aid=document.getElementById("aired");
		aid.innerHTML="Aired: ";
		
		aid=document.getElementById("available");
		aid.innerHTML="Available to: ";
		
		aid=document.getElementById("duration");
		aid.innerHTML="Duration: ";
		
		aid=document.getElementById("playButton");
		aid.innerHTML="Play";
		
		aid=document.getElementById("backButton");
		aid.innerHTML="Return";
		
	}else {
		var aid=document.getElementById("aired");
		aid.innerHTML="Sändes: ";
		
		aid=document.getElementById("available");
		aid.innerHTML="Tillgänglig till: ";
		
		aid=document.getElementById("duration");
		aid.innerHTML="Längd: ";
		
		aid=document.getElementById("playButton");
		aid.innerHTML="Spela upp";
		
		aid=document.getElementById("backButton");
		aid.innerHTML="Tillbaka";
	}
};

Language.setKanalerLang=function(value){
	if(value == 'English'){
	
		var aid=document.getElementById("shown_now");
		aid.innerHTML="Shown now: ";
		
		aid=document.getElementById("begins");
		aid.innerHTML="Begins: ";
		
		aid=document.getElementById("duration");
		aid.innerHTML="Duration: ";
		
		aid=document.getElementById("playButton");
		aid.innerHTML="Play";
		
		aid=document.getElementById("backButton");
		aid.innerHTML="Return";
		
	}else {
		var aid=document.getElementById("shown_now");
		aid.innerHTML="Visas nu: ";
		
		aid=document.getElementById("begins");
		aid.innerHTML="Börjar: ";
		
		aid=document.getElementById("duration");
		aid.innerHTML="Längd: ";
		
		aid=document.getElementById("playButton");
		aid.innerHTML="Spela upp";
		
		aid=document.getElementById("backButton");
		aid.innerHTML="Tillbaka";
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

