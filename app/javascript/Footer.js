
var Footer =
{
   
};

Footer.display = function(mute)
{
	var leftcorner = '<div class="footer-left-r"></div>';
	var rightcorner = '<div class="footer-right-r"></div>';
	
	var html = leftcorner;
	if(mute){
		html+='<div class="footer-box-s"><img src="images/mute.png" alt="" border="0" /></div>';
		html+= rightcorner + leftcorner;
	}
	
	html+= '<div class="footer-box-r"><img src="images/menu.png" alt="" border="0" />Inställningar / Settings</div>';
	html+= rightcorner + leftcorner;
	html+= '<div class="footer-box-r"><img src="images/red.png" alt="" border="0" /><span id="recommended" >Rekommenderat</span></div>';
	html+= rightcorner + leftcorner;
	html+= '<div class="footer-box-r"><img src="images/green.png" alt="" border="0" /><span id="categories" >Kategorier</span></div>';
	html+= rightcorner + leftcorner; 
	html+= '<div class="footer-box-r"><img src="images/yellow.png" alt="" border="0" /><span id="channels">Kanaler & livesändningar</span></div>';
	html+= rightcorner + leftcorner; 
	html+= '<div class="footer-box-r"><img src="images/blue.png" alt="" border="0" /><span id="searchshow">Sök programtitlar</span></div>';
	html+= rightcorner;
   
	$('.footer-content').html(html);
    return true;
};





