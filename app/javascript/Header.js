
var Header =
{
   
};

Header.display = function(location)
{
	
	var html = '<div class="logo">';
    html += '<a href="index.html"><img src="images/weeb2.png" alt="" border="0" /></a>';
    html += 'Version: 0.3.0</div>';
    html += '<div class="socials">';
    html += '<p><a href="#" class="social-fb" id="companyName">Utvecklad av Christofer Persson åt Kantaris Co.Ltd</a></p>';
    html += '</div>';
    html += '<div class="topmenu">';
    html += '<ul class="dropdown">';
    html += '<li class="root-item"><a href="index.html" class="active" id="location">' + location + '</a></li>';
    html += '</ul>';
    html += '</div>';
    html += '<div class="clear">';
    html += '</div>';
   
	$('.header').html(html);
    return true;
};





