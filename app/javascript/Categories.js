var widgetAPI = new Common.API.Widget();
var itemCounter = 0;
var columnCounter = 0;
var language;
var Categories =
{

};

Categories.onLoad = function()
{
	language=Language.checkLanguage();
	Language.setLang(language);
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
        url: 'http://188.40.102.5/Categories.ashx',
		timeout: 15000,
        success: function(data)
        {
            alert('Success');
       
        $(data).find('categorie').each(function(){
            var $video = $(this); 
            var Name = $video.find('Name').text();
			var Link = $video.find('Link').text();
			//alert(Link);
			//var Description = $video.find('Description').text();
			var ImgLink  = "http://www.svtplay.se"+$video.find('ImgLink').text();
			alert(ImgLink);
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
            alert('Failure');
			ConnectionError.show();
         
        }
    });

}
//window.location = 'categoryDetail.html?category=' + ilink + '&history=Kategorier/' + iname +'/';


