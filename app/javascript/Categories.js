var widgetAPI = new Common.API.Widget();
var itemCounter = 0;
var columnCounter = 0;
var language;
var Categories =
{

};

Categories.onLoad = function()
{
	Header.display('Kategorier');
	Audio.init();
	Audio.showMuteFooter();
	Search.init();
	Language.init();
	ConnectionError.init();
	Language.setLang();
	Resolution.displayRes();
	this.loadXml();

	Buttons.enableKeys();

};

Categories.onUnload = function()
{

};


Categories.loadXml = function(){
	$.support.cors = true;
	 $.ajax(
    {
        type: 'GET',
        url: 'http://www.svtplay.se/program',
        tryCount : 0,
        retryLimit : 3,
		timeout: 15000,
        success: function(data)
        {
            alert('Success:' + this.url);
       
            $(data).find('a').filter(function() {
                return $(this).attr('class') == "play_category-grid__link";
            }).each(function(){
                var $video = $(this); 
                var Name = $($video.find('span')[0]).text();
		var Link = "http://www.svtplay.se"+$video.attr('href');
		//alert(Link);
		//var Description = $video.find('Description').text();
	        var ImgLink  = $video.find('img').attr('data-imagename');
                if (!ImgLink) ImgLink = $video.find('img').attr('src');
		ImgLink  = "http://www.svtplay.se"+ImgLink;
		var html;
		if(itemCounter % 2 == 0){
		    if(itemCounter > 0){
			html = '<div class="scroll-content-item topitem">';
		    }
		    else{
			html = '<div class="scroll-content-item selected topitem">';
		    }
		}
		else{
		    html = '<div class="scroll-content-item bottomitem">';
		}
		html += '<div class="scroll-item-img">';
		html += '<a href="categoryDetail.html?category=' + Link + '&history=Kategorier/' + Name +'/" class="ilink"><img src="' + ImgLink + '" width="240" height="135" alt="' + Name + '" /></a>';
		html += '</div>';
		html += '<div class="scroll-item-name">';
		html +=	'<p><a href="#">' + Name + '</a></p>';
		//html += '<span class="item-date">' + Description + '</span>';
		html += '</div>';
		html += '</div>';
		
		if(itemCounter % 2 == 0){
		    $('#topRow').append($(html));
		}
		else{
		    $('#bottomRow').append($(html));
		}
		
		itemCounter++;
		//
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown)
        {
          	if (textStatus == 'timeout') {
                this.tryCount++;
                if (this.tryCount <= this.retryLimit) {
                    //try again
                    $.ajax(this);
                    return;
                }            
                return;
            }
        	else{
        		alert('Failure');
        		ConnectionError.show();
        	}
         
        }
    });

};
//window.location = 'categoryDetail.html?category=' + ilink + '&history=Kategorier/' + iname +'/';


