var PathHistory =
{

}

PathHistory.urldecode = function(str) {
   return decodeURIComponent((str+'').replace(/\+/g, '%20'));
}

PathHistory.GetPath = function(){
    var url = document.location.href;

	var parse;
	alert(url);
	if (url.indexOf("&")>0)
	{
		parse = url.substring(url.indexOf("=") + 1 , url.length);
		parse = parse.substring(parse.indexOf("y=") + 2 , parse.length);
		document.title = parse;
		var html = '';
		var title = "";
		while(parse.indexOf("/")>0){
			title = parse.substring(0, parse.indexOf("/"));
			title = this.urldecode(title);
			parse = parse.substring(parse.indexOf("/") + 1 , parse.length);
			html +='<li class="root-item"><a href="index.html" class="active">' + title + '</a></li>';
		}
		$('.dropdown').html($(html));
	}
	
};