var widgetAPI = new Common.API.Widget();
var itemCounter = 0;
var columnCounter = 0;
var historyPath;
var language;
var categoryDetail =
{

};

categoryDetail.onLoad = function()
{
	Header.display('Populärt');
	Audio.init();
	Audio.showMuteFooter();
	Search.init();
	Language.init();
	ConnectionError.init();
	Language.setLang();
	Resolution.displayRes();
	this.loadXml();
	PathHistory.GetPath();
	// Enable key event processing
	Buttons.enableKeys();
//	widgetAPI.sendReadyEvent();
};

categoryDetail.onUnload = function()
{

};
// categoryDetail.html?category=/barn&history=Kategorier/Barn
categoryDetail.Geturl=function(){
    var url = document.location.href;
	var parse;
    var name="";
    if (url.indexOf("category=")>0)
    {
		// parse = url.substring(url.indexOf("=")+13,url.length);
		parse = url.substring(url.indexOf("=")+1,url.length);
		if (url.indexOf("&")>0)
		{
			name = parse.substring(0,parse.indexOf("&"));
			
		}
		else{
			name = parse;
		}
	}
    return name.replace("tvcategories\/", "");
};


categoryDetail.loadXml = function(){
	$.support.cors = true;
	 $.ajax(
    {
        type: 'GET',
        url: this.Geturl(),
        tryCount : 0,
        retryLimit : 3,
		timeout: 15000,
        success: function(data)
        {
            alert('Success:' + this.url);
            var $alphaData = $(data).find('div').filter(function() {
                return $(this).attr('id') == "playJs-alphabetic-list";
            });
            data = null;
            $alphaData.find('article').each(function(){
		
		
                var $video = $(this); 
                var Name = $video.attr('data-title');
                // alert("Name:" + Name);
	        var Link = "http://www.svtplay.se"+$video.find('a').attr('href');
	        // alert(Link);
	        var ImgLink  = $video.find('img').attr('data-imagename');
                if (!ImgLink) ImgLink = $video.find('img').attr('src');
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
	        html += '<a href="showList.html?name=' + Link + '&history=' + document.title  + Name + '/" class="ilink"><img src="' + ImgLink + '" width="240" height="135" alt="' + Name + '" /></a>';
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


//window.location = 'showList.html?name=' + ilink + '&history=' + historyPath + iname + '/';
