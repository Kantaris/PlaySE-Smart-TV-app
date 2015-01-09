var resButton = ["#resauto", "#res1", "#res2", "#res3", "#res4", "#res5"];
var bwidths = [0, 400000, 700000, 1200000, 2000000, 3000000];
var lbwidths = [400000, 700000, 1200000, 2000000, 3000000];
var target = 1200000;
var livetarget = 1200000;
var bandwidths = [];
var urls = [];

var Resolution =
{
   
};

Resolution.init = function()
{

    return true;
};



Resolution.displayRes = function(){
	var value = this.checkRes();
	alert(resButton[value]);
	$(resButton[value]).addClass('checked');
	target = bwidths[value];
	value = this.checkLiveRes();
	alert(reslButton[value]);
	$(reslButton[value]).addClass('checked');
	livetarget = lbwidths[value];
};

Resolution.getTarget = function(){
	return target;
	
};

Resolution.getCorrectStream = function(videoUrl, isLive, srtUrl){
	alert('target: ' + target);
	if(target > 0){
		$.support.cors = true;
		 $.ajax(
	   {
	       type: 'GET',
	       url: videoUrl,
			timeout: 15000,
	       success: function(data)
	       {
				var sa = data.split("\n");
				var ii = 0;
				for (ii = 0; ii < sa.length; ii++) {
					if(sa[ii].indexOf("#") > -1 && sa[ii].indexOf("#EXTM3U") < 0){
						var bTag = "BANDWIDTH=";
						var bandwidthString = sa[ii].substring(sa[ii].indexOf(bTag) + bTag.length);
						bandwidthString = bandwidthString.substring(0, bandwidthString.indexOf(","));
						bandwidths.push(bandwidthString);
		        	}
		        	else if(sa[ii].indexOf("#EXTM3U") < 0){
		        		urls.push(sa[ii]);
		        	}
				}
				var ij = 0;
				var current = 0;
				var currentId = 0;
				for (ij = 0; ij < bandwidths.length; ij++) {
					alert(bandwidths[ij]);
					if(isLive == 0){
						if(+bandwidths[ij] <= +target){
							alert(bandwidths[ij]);
							if(+bandwidths[ij] > +current){
								alert(bandwidths[ij]);
								current = bandwidths[ij];
								currentId = ij;
							}
						}
					}
					else{
						if(+bandwidths[ij] <= +livetarget){
							alert(bandwidths[ij]);
							if(+bandwidths[ij] > +current){
								alert(bandwidths[ij]);
								current = bandwidths[ij];
								currentId = ij;
							}
						}
					}
				}
				alert('current: ' + current);
		   Player.setVideoURL(urls[currentId] + "|COMPONENT=HLS", srtUrl);
				Player.playVideo();
				
	       }
	   });
	}
	else{
	    Player.setVideoURL(videoUrl + "|COMPONENT=HLS", srtUrl);
		Player.playVideo();
	}

};



Resolution.getCookie = function(cName){
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

Resolution.setCookie = function(cName,value,exdays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=cName + "=" + c_value;
};

Resolution.checkRes = function()
{
var res=this.getCookie("res");
var defa = 5;
if (res!=null && res!="")
  {
  return res;
  }
else 
  {
	return defa;
  }
};

Resolution.setRes = function(value)
{
	this.setCookie('res', value, 1000);
	target = bwidths[value];
};

Resolution.checkLiveRes = function()
{
var res=this.getCookie("liveres");
var defa = 4;
if (res!=null && res!="")
  {
  return res;
  }
else 
  {
	return defa;
  }
};

Resolution.setLiveRes = function(value)
{
	this.setCookie('liveres', value, 1000);
	target = bwidths[value];
};

