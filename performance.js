//console.log('<----- Content script started running ----->');

chrome.runtime.onMessage.addListener(msg=> {
    if (document.readyState === 'complete') {
        greenFunction();
    } else {
        window.addEventListener('load', greenFunction);
    }
});
/*window.addEventListener ("load", greenFunction, false);*/

function greenFunction(){
//decodedSize
var imgA = [];
var decodedSize = 0;
var answerArray = [];

const imgTag = performance.getEntriesByType('resource');

for (var i = 0; i < imgTag.length; i++) {
        imgA.push(imgTag[i].decodedBodySize);
}
for (let i in imgA){
decodedSize += imgA[i];
}

var arrayLabel = [' bytes','kb','mb','gb'];
var sizeLabel = '';

 if (decodedSize/1024/1024/1024 > 1){
 sizeLabel = (((decodedSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (decodedSize/1024/1024 > 1){
 sizeLabel = (((decodedSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (decodedSize/1024 > 1){
 sizeLabel = (((decodedSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (decodedSize > 1){
 sizeLabel = (((decodedSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     sizeLabel = (decodedSize).toString() + arrayLabel[0];
 }

answerArray.push(parseFloat(decodedSize));

/////////////////////////////////////////////////////

// Images that are lazy loaded
var xArray = [];
var imgNotLLArray = [];
var imgCount = document.getElementsByTagName("img");
let x1 = document.querySelector('html').outerHTML;
var regEX = /(loading="lazy")|(class="lozad")|(class="b-lazy")|(class="lazyloaded)|(class="lazy")/;
var result = "";

//5 is the best suggested number
if (imgCount.length > 5){
for (var i = 0; i < imgCount.length; i++){
var y = imgCount[i].outerHTML;
if (y.match(regEX)){
xArray.push(y);
}
else{
//imgNotLLArray.push(y);
imgNotLLArray.push(imgCount[i].src);
}
}
var ratioLL = xArray.length/imgCount.length;
answerArray.push(ratioLL);
}
else{
answerArray.push(1.1);
}

//Gets the images and puts them in report. uncomment out else statement above
/*var joinLLString = imgNotLLArray.join(",");
console.log(joinLLString);*/

/////////////////////////////////////////////////////
//Responsive & low-load images

 var imgs = document.getElementsByTagName("img");

 var imgSrcs = [];
 var regWEBP = /(webp)/;
 var regSVG = /(svg)/;
 var regAVIF = /(avif)/;
 var numSVG = 0;
 var numWEBP = 0;
 var numAVIF = 0;
    
var imgNotGoodFormat = [];

//5 is the best suggested number
if(imgs.length > 5){
for (var i = 0; i < imgs.length; i++) {
var pencil = imgs[i].src;
if (pencil.match(regSVG)){
    numSVG++;
}
else if(pencil.match(regAVIF)){
    numSVG++;
    numAVIF++;
}
else if(pencil.match(regWEBP)){
     numSVG++;
     numWEBP++;
}
else {
imgNotGoodFormat.push(pencil);
//console.log("0");
}
}
var ratioSVG = numSVG/imgs.length;
answerArray.push(ratioSVG);
}
else{
answerArray.push(1.1);
}
    
/////////////////////////////////////////////////////
//JS HeapSize

var JSHeapSize = window.performance.memory.usedJSHeapSize;

answerArray.push(JSHeapSize);

var jssSizeLabel = '';

 if (JSHeapSize/1024/1024/1024 > 1){
 jssSizeLabel = (((JSHeapSize/1024/1024/1024).toPrecision(3)).toString() + arrayLabel[3]);
 } else if (JSHeapSize/1024/1024 > 1){
 jssSizeLabel = (((JSHeapSize/1024/1024).toPrecision(3)).toString() + arrayLabel[2]);
 } else if (JSHeapSize/1024 > 1){
 jssSizeLabel = (((JSHeapSize/1024).toPrecision(3)).toString() + arrayLabel[1]);
 } else if (JSHeapSize > 1){
 jssSizeLabel = (((JSHeapSize).toPrecision(3)).toString() + arrayLabel[0]);
 }

////////////////////////////////////////////////////
// Length of Page

var pagebytes = document.querySelector('html').innerHTML.length;

pagebytes = parseFloat(pagebytes);

lengthArray = ['mil', 'k'];
    
 if (pagebytes/1000000 > 1){
 pagebytesLabel = (((pagebytes/1000000).toPrecision(2)).toString() + lengthArray[0]);
 } else {
 pagebytesLabel = (((pagebytes/1000).toPrecision(3)).toString() + lengthArray[1]);
 }
answerArray.push(pagebytes);

////////////////////////////////////////////////////
//Page Load time

var timing = window.performance.getEntriesByType('navigation')[0];
    
var duration = (timing.loadEventStart / 1000).toPrecision(2);

duration = parseFloat(duration);


answerArray.push(duration);



////////////////////////////////////////////////////

////////////////////////////////////////////////////

//Imported Fonts
var headText = document.head.innerHTML;
var fontRegex = /(@font-face)|(woff?2)|(fonts.googleapis)|(.tff)|(fonts.shopifycdn)|(cloud.typography)|(otf)|(eot)/;
var fontBoolean = 0;

if (headText.match(fontRegex)){
fontBoolean = 1;
answerArray.push(fontBoolean);
}
else{
fontBoolean = 0;
answerArray.push(fontBoolean);
}



////////////////////////////////////////////////////

////////////////////////////////////////////////////
    
//Transfer Size
    
var imgB = [];
var imgC = [];
var transferSize1 = 0;
var largeTrans = 0;
var largeTransArray = [];
var largeTransSrc;
var largeLoadRequest;

const transferResources = performance.getEntriesByType('resource');
    
    
var max = transferResources[0].transferSize;
var maxDur = transferResources[0].duration;
var maxIndex = 0;
var maxIndexDur = 0;

for (var i = 0; i < transferResources.length; i++) {
   imgB.push(transferResources[i].transferSize);
   imgC.push(transferResources[i].duration);
   
    if(imgB[i] > max){
            maxIndex = i;
            max = imgB[i];
            
        }
    if(imgC[i] > maxDur){
            maxIndexDur = i;
            maxDur = imgC[i];
            
        }

   }
    
largeTransSrc = transferResources[maxIndex].name;
var largeTransSize = transferResources[maxIndex].transferSize;
largeLoadRequest = transferResources[maxIndexDur].name;
var largeLoadTime = transferResources[maxIndexDur].duration;
    
largeLoadTime = largeLoadTime.toFixed(2);
    
    
for (let i in imgB){
   transferSize1 += imgB[i];
   }
transferSize1 = parseFloat(transferSize1);

answerArray.push(transferSize1);
 
var transferLabel = 0;
    
 if (transferSize1/1024/1024/1024 > 1){
 transferLabel = (((transferSize1/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (transferSize1/1024/1024 > 1){
 transferLabel = (((transferSize1/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (transferSize1/1024 > 1){
 transferLabel = (((transferSize1/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (transferSize1 > 1){
 transferLabel = (((transferSize1).toFixed(2)).toString() + arrayLabel[0]);
 }
   else{
     transferLabel = (transferSize1).toString() + arrayLabel[0];
 }
    
 var transferSizeLabel;
    
 if (largeTransSize/1024/1024/1024 > 1){
 transferSizeLabel = (((largeTransSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (largeTransSize/1024/1024 > 1){
 transferSizeLabel = (((largeTransSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (largeTransSize/1024 > 1){
 transferSizeLabel = (((largeTransSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (largeTransSize > 1){
 transferSizeLabel = (((largeTransSize).toFixed(2)).toString() + arrayLabel[0]);
 }
   else{
     transferSizeLabel = (transferSize1).toString() + arrayLabel[0];
 }
    
var largeLoadLabel;
    
if (largeLoadTime/1000 >= 1){
   largeLoadLabel = (largeLoadTime/1000).toFixed(2).toString() + " secs"; 
}
    else{
       largeLoadLabel = largeLoadTime.toString() + " ms"; 
    }

/*console.log(transferResources);
console.log(largeTransSrc);*/
    
//if you see that issue 3.34xe1 it's from the toPrecision rounding it off - 10/19/22 changed to toFixed

////////////////////////////////////////////////////

////////////////////////////////////////////////////
    
// Responsive Images
    
var x1Array = [];
var img1Count = document.getElementsByTagName("img");
var picTagCount = document.getElementsByTagName("picture").length;
var regSRC = /srcset/;
var ratio1 = 0;
    
var imgNotRes = [];

if (picTagCount > 0){
ratio1 = picTagCount/img1Count.length;
answerArray.push(ratio1);

}
else if (img1Count.length >= 1){
for (var i = 0; i < img1Count.length; i++){
var y = img1Count[i].outerHTML;
    if (y.match(regSRC)){
        x1Array.push(y);
    }else{
        imgNotRes.push(img1Count[i].src);
         //console.log("0 srcset Images");
        }
    }
var ratioSS = x1Array.length/img1Count.length;
answerArray.push(ratioSS);

}
else{
imgNotRes.push(img1Count);
answerArray.push(1.1);
}   


////////////////////////////////////////////
//Internal Stylesheets
    
var intStyleSheet = document.getElementsByTagName('style').length;
    
if(intStyleSheet > 0){
var intStyleSheetTags = document.getElementsByTagName('style')[0].outerHTML;
}
    else{
        //
    }
    
answerArray.push(intStyleSheet);
//console.log(intStyleSheetTags);
    

////////////////////////////////////////////
//# of Style Sheets Files Found
  
var numStyleSheet = document.styleSheets.length;
var styleSheetArray = [];
var styleSheetSrcs;
    
  for (var i = 0 ; i < numStyleSheet; i++) {
    styleSheetSrcs = document.styleSheets[i].href;
    styleSheetArray.push(styleSheetSrcs);
}

var styleSheetSources = styleSheetArray.toString();
    
//console.log(styleSheetSources);

answerArray.push(numStyleSheet); 

    
////////////////////////////////////////////
//Site Redirects
    
var redirects = window.performance.navigation.redirectCount;

answerArray.push(redirects);
    
////////////////////////////////////////////
//Amount of Cookies
    
var theCookies = document.cookie.split(';');
var aString = '';
var cookieArray = [];
var cookieLen = 0;
  for (var i = 1 ; i <= theCookies.length; i++) {
        //aString += i + ' ' + theCookies[i-1] + "\n";
       cookieArray.push(aString);
    }
    
cookieLen = cookieArray.length;
answerArray.push(cookieLen);
    
var cookiesList = document.cookie;

//console.log(cookiesList);
    
    
    
////////////////////////////////////////////
//Amount of Empty URLs
//var emptyURL = document.querySelectorAll('img[src=""]').length + document.querySelectorAll('script[src=""]').length + document.querySelectorAll('link[rel=stylesheet][href=""]').length + document.querySelectorAll('button[href=""]').length + document.querySelectorAll('a[href=""]').length;
    
var emptySrcURL1 = document.querySelectorAll('img[src=""]');
var emptySrcURL2 = document.querySelectorAll('script[src=""]');
var emptySrcURL3 = document.querySelectorAll('link[rel=stylesheet][href=""]');
var emptySrcURL4 = document.querySelectorAll('button[href=""]');
var emptySrcURL5 = document.querySelectorAll('a[href=""]');
var emptySRCArray = [];
var try4;
var emptySrcType = [];

if (emptySrcURL1.length >= 1){
  for (var i = 1 ; i < emptySrcURL1.length; i++) {
    try4 = emptySrcURL1[i].outerHTML;
    emptySRCArray.push(try4);
    emptySrcType.push(1);
  }

}
if(emptySrcURL2.length >= 1){
    for (var i = 1 ; i < emptySrcURL2.length; i++) {
    try4 = emptySrcURL2[i].outerHTML;
    emptySRCArray.push(try4);
    emptySrcType.push(2); 
  }
}
if(emptySrcURL3.length >= 1){
    for (var i = 1 ; i < emptySrcURL3.length; i++) {
    try4 = emptySrcURL3[i].outerHTML;
    emptySRCArray.push(try4);
    emptySrcType.push(3);     
  }
}
if(emptySrcURL4.length >= 1){
    for (var i = 1 ; i < emptySrcURL4.length; i++) {
    try4 = emptySrcURL4[i].outerHTML;
    emptySRCArray.push(try4);
    emptySrcType.push(4);
  }
}
if(emptySrcURL5.length >= 1){
    for (var i = 1 ; i < emptySrcURL5.length; i++) {
    try4 = emptySrcURL5[i].outerHTML;
    emptySRCArray.push(try4);
    emptySrcType.push(5);
  }
}
    
//try26 = emptySRCArray.toString();
    

var emptySRCVal = emptySRCArray.toString();    

var emptyURL = emptySRCArray.length;

    
answerArray.push(emptyURL);
 

    
    
////////////////////////////////////////
////////////////////////////////////////
//Cached
    
try{
var req = new XMLHttpRequest();

req.open('GET', document.location, false);

req.send(null);

var header = req.getResponseHeader("Cache-Control");

//console.log(header);

var cfHeader = req.getResponseHeader("cf-cache-status");
    
//console.log(cfHeader);
    
var combined = header + cfHeader + 'far';

var cfCacheControlRegexHit = /(HIT)/;

var cfDynCacheControlRegex = /(DYNAMIC)/;

var maxAgeRegex = /(max-age)/;

var maxAgeString = '';

var cfCacheString = '';

var noCacheRegex = /(no-cache)|(max-age=0)|(no-store)/;

var cfNoCacheRegex = /(BYPASS)|(MISS)/;   

var maxAgeInt = 0;

var cacheArray = [];

var exactCacheArray = [];

var cfDynVar = '';

var sMaxCacheVal = [];

var sMaxRegex = /(s-maxage)/;

var cacheScore = 0;


     if (combined.match(cfCacheControlRegexHit)){
         
         exactCacheArray.push(1);
        
    }

    else if (combined.match(sMaxRegex)){

           sMaxCacheVal = header.split(',');

           //console.log(sMaxCacheVal[0]);

           for (var i = 0; i < sMaxCacheVal.length; i++){

                if (sMaxCacheVal[i].match(sMaxRegex)){

                    header = sMaxCacheVal[i].replace('s-maxage=','');

                }
                else{
                    //nothing
                }
           }

           exactCacheArray.push(3);

        }
    
    else if (combined.match(noCacheRegex)){

            exactCacheArray.push(2);
         }

    else if (combined.match(maxAgeRegex)){

            
           cacheArray = header.split(',');

          // console.log(sMaxCacheVal[0]);

           for (var i = 0; i < cacheArray.length; i++){

                if (cacheArray[i].match(maxAgeRegex)){

                    header = cacheArray[i].replace('max-age=', '');

                }
                else{
                    //nothing
                }
           }

            //console.log(header);
        
            exactCacheArray.push(3);
         }

    else if (combined.match(cfDynCacheControlRegex)){

        //cfCacheString = aHeaders[i].replace('cf-cache-status: ', '');
       // cfCacheString = cfCacheString.replace('\r','');

            exactCacheArray.push(5);
        
    }

   else if (combined.match(cfNoCacheRegex)){
           exactCacheArray.push(4);
        }

    else {
        exactCacheArray.push(6);
    }


if (parseInt(header) === 0){

    cacheArray = combined.split(',');

    for (var i = 0; i < cacheArray.length; i++){

                if (cacheArray[i].match(maxAgeRegex)){

                    header = cacheArray[i].replace('max-age=', '');

                }
                else{
                    //nothing
                }
           }


}
else {
    
//made a change here in 3.1- it used to just have // in this else statement
exactCacheArray.push(6);

}
var cacheTime = 0;
switch (exactCacheArray.length > 0){
  case exactCacheArray.includes(1):
    //console.log('Cloudflare Cache: '+ cfHeader);
    cacheScore = .1;
    answerArray.push(31536000);
    break;
  case exactCacheArray.includes(4):
    //console.log("No Cloudflare Cache: " + cfCacheString);
    //console.log("No Cloudflare Cache: ");
    cacheScore = .2;
    answerArray.push(0);
    break;
  case exactCacheArray.includes(5) && exactCacheArray.includes(2):
    //console.log('Dynamic Cloudflare Cache not set up');
    cacheScore = .3;
    answerArray.push(0);
    break;
  case exactCacheArray.includes(2):
    cacheScore = 0;
    answerArray.push(cacheScore);
    //console.log("No Cache: ");
    break;
  case exactCacheArray.includes(5):
    cacheScore = .4;
    answerArray.push(31536000);
    //console.log('Cloudflare Dynamic Content Cache: ');
    break;
  case exactCacheArray.includes(3):
    //console.log("Max Age: "+ parseInt(header));
    cacheScore = parseInt(header);
    var cacheTime = cacheScore;   
    answerArray.push(cacheScore);
    break;
  case exactCacheArray.includes(6):
    //console.log("None such caching");
    cacheScore = 0;
    answerArray.push(cacheScore);
    break;
}
}
catch(e){
cacheScore = .5;
answerArray.push(31536000);
//console.log('Script Blocked');
}
    
       
var seconds = 1;
var minute = 60;
var hour= 3600;
var day = 86400;

var cacheDays = Math.floor(cacheTime / day);
var cacheHours = Math.floor((cacheTime-(day*cacheDays)) / hour);
var cacheMinutes = Math.floor((cacheTime-((cacheDays*day)+(cacheHours*hour)))/minute);
var cacheSeconds = Math.floor((cacheTime-((cacheDays*day)+(cacheHours*hour)+(cacheMinutes*minute)))/seconds); 
    
    
    

/////////////////////////////////////////
///////////////////////////////////////// 
//Background Color    

var backGroundColor = window.getComputedStyle( document.body ,null).getPropertyValue('background-color');
//console.log(backGroundColor);

var colorVar1 = '';

var colorArray = [];

var rgbaMatch = /(rgba)/;
var rgbMatch = /(rgb)/;

var colorScore = '';

if (backGroundColor.match(rgbaMatch)){

    colorVar1 = backGroundColor.replace('rgba(','');
    colorVar1 = colorVar1.replace(')','');

    colorArray = colorVar1.split(',');


    var combineColor = parseInt(colorArray[0])+parseInt(colorArray[1])+parseInt(colorArray[2])+parseInt(colorArray[3]);
    
    if (combineColor === 0){
        colorScore = 'white';
        
    }

    else if (combineColor === 1){
        colorScore = 'black';

    }
    else if (parseInt(colorArray[2]) > 220) {

        colorScore = 'blue';
    }

    else{

        colorScore = 'something';

    }
    
}

else if (backGroundColor.match(rgbMatch)){

    colorVar1 = backGroundColor.replace('rgb(','');
    colorVar1 = colorVar1.replace(')','');

    colorArray = colorVar1.split(',');

    var combineColor = parseInt(colorArray[0])+parseInt(colorArray[1])+parseInt(colorArray[2]);
    
    var subComColor = (Math.abs(parseInt(colorArray[0])-parseInt(colorArray[1])) + Math.abs(parseInt(colorArray[2])-parseInt(colorArray[1]))+Math.abs(parseInt(colorArray[0])-parseInt(colorArray[2])));

    var subComColor = subComColor/3;

    if (combineColor === 0){
        colorScore = 'black';
    }

    else if (combineColor >= 765){
        colorScore = 'white';

    }
    else if (subComColor <= 30){
        colorScore = 'black/grey';

    }
    else if (parseInt(colorArray[2]) > 220) {

        colorScore = 'blue';
    }

    else{

        colorScore = 'something';

    }


}
else{

    colorScore = 'something';
}

//console.log(backGroundColor);
    
 //Transfer Size of Stylesheets, but could be more
    
//Identify File of Largest Transfer Size
    
var cssTransReq = /(.css)/;
var apiTransReq = /(api?s)/;
var jsTransReq = /(.js)/;
var importedFontTransReq = /(@font-face)|(woff?2)|(fonts.googleapis)|(.tff)|(fonts.shopifycdn)|(cloud.typography)/;
var imageTransReq = /(.png)|(.jpeg)|(.gif)|(.jpg)|(.tiff)|(.svg)|(webp)|(avif)|(.ico)/;
var imgFormatType = 0;
    
    
//Transfer size of External Style Sheets
var cssTransSize = 0;
/*var apiTransSize = 0;*/
var jsTransSize = 0;
var cssTransLabel;
/*var apiTransLabel;*/
var jsTransLabel;
var cssHREF;
//var v = 0;
var impFontReq = 0;

for (var i = 0; i < transferResources.length; i++) {

    cssHREF = transferResources[i].name; 

    if (cssHREF.match(cssTransReq)){
        //v++;
        cssTransSize += transferResources[i].transferSize;      
    }
   /* else if (cssHREF.match(apiTransReq)){
        apiTransSize += transferResources[i].transferSize;
    }
    else if (cssHREF.match(jsTransSize)){
        jsTransSize += transferResources[i].transferSize;
    }*/
    else{
        //
    }
}

if (cssTransSize === 0){
   cssTransLabel = 'All style sheets cached!' 
}  else if(cssTransSize/1024/1024/1024 > 1){
 cssTransLabel = (((cssTransSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (cssTransSize/1024/1024 > 1){
 cssTransLabel = (((cssTransSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (cssTransSize/1024 > 1){
 cssTransLabel = (((cssTransSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (cssTransSize > 1){
 cssTransLabel = (((cssTransSize).toFixed(2)).toString() + arrayLabel[0]);
 }
   else{
     cssTransLabel = (cssTransSize).toString() + arrayLabel[0];
 }


//console.log('Css Requests: '+v);
// v variable is the amount of Css Requests
    
    
    
    
    

//Recommendation Arrays
var highRec = [];
var medRec = [];
var lowRec = [];
     
    
    
/////////////////////////////////////////
/////////////////////////////////////////   
    
    
/////////////////////
var scoreArray = [];
var finalScore = 0;

// Decoded Body Size
var sizeWeight = 0;
switch (answerArray[0] >= 0){
        
case answerArray[0] <= 150000:
    finalScore += 3;
    sizeWeight = 3;
    break;
case answerArray[0] <= 500000:
    finalScore += 2.9;
    sizeWeight = 2.9;
    break;
case answerArray[0] <= 650000:
    finalScore += 2.8;
    sizeWeight = 2.8;
    break;
case answerArray[0] <= 850000:
    finalScore += 2.7;
    sizeWeight = 2.7;
    break;
case answerArray[0] <= 1076398:
    finalScore += 2.6;
    sizeWeight = 2.6;
    lowRec.push(300);
    break;
case answerArray[0] <= 1376398:
    finalScore += 2.5;
    sizeWeight = 2.5;
    lowRec.push(300);
    break;
case answerArray[0] <= 1572864:
    finalScore += 2.4;
    sizeWeight = 2.4;
    medRec.push(200);
    break;
case answerArray[0] <= 1750000:
    finalScore += 2.3;
    sizeWeight = 2.3;
    medRec.push(200);
    break;
case answerArray[0] <= 2000000:
    finalScore += 2.2;
    sizeWeight = 2.2;
    medRec.push(200);
    break;
case answerArray[0] <= 2300000:
    finalScore += 2.1;
    sizeWeight = 2.1;
    medRec.push(200);
    break;
case answerArray[0] > 2600000:
    finalScore += 2;
    sizeWeight = 2;
    medRec.push(200);
    break;
case answerArray[0] <= 3200000:
    finalScore += 1.9;
    sizeWeight = 1.9;
    medRec.push(200);
    break;
case answerArray[0] <= 3800000:
    finalScore += 1.8;
    sizeWeight = 1.8;
    medRec.push(200);
    break;
case answerArray[0] <= 4400000:
    finalScore += 1.7;
    sizeWeight = 1.7;
    highRec.push(100);
    break;
case answerArray[0] <= 5000000:
    finalScore += 1.6;
    sizeWeight = 1.6;
    highRec.push(100);
    break;
case answerArray[0] <= 5600000:
    finalScore += 1.5;
    sizeWeight = 1.5;
    highRec.push(100);
    break;
case answerArray[0] <= 6200000:
    finalScore += 1.4;
    sizeWeight = 1.4;
    highRec.push(100);
    break;
case answerArray[0] > 6800000:
    finalScore += 1.3;
    sizeWeight = 1.3;
    highRec.push(100);
    break;
case answerArray[0] <= 7400000:
    finalScore += 1.2;
    sizeWeight = 1.2;
    highRec.push(100);
    break;
case answerArray[0] <= 8000000:
    finalScore += 1.1;
    sizeWeight = 1.1;
    highRec.push(100);
    break;
case answerArray[0] > 8000001:
    finalScore += 1;
    sizeWeight = 1;
    highRec.push(100);
    break;

}



//Lazy Loaded Image
var LazyLoadWeight = 0;
switch (answerArray[1] >= 0){

    case answerArray[1] >= .65:
        finalScore += .4;
        LazyLoadWeight = .4;
        break;
    case answerArray[1] >= .40:
        finalScore += .3;
        LazyLoadWeight = .3;
        lowRec.push(301);
        break;
   case answerArray[1] >= .25:
        finalScore += .2;
        LazyLoadWeight = .2;
        medRec.push(201);
        break;
   case answerArray[1] > 0:
        finalScore += .1;
        LazyLoadWeight = .1;
        medRec.push(201);
        break;
   case answerArray[1] == 0:
        finalScore += 0;
        highRec.push(101);
        break;

}

//Ratio of SVG Images
var imgTypeWeight = 0;
switch (answerArray[2] >= 0){

    case answerArray[2] >= .7:
        finalScore += .4;
        imgTypeWeight = .4;
        break;
    case answerArray[2] >= .5:
        finalScore += .3;
        imgTypeWeight = .3;
        lowRec.push(302);
        break;
   case answerArray[2] >= .25:
        finalScore += .2;
        imgTypeWeight = .2;
        medRec.push(202);
        break;
   case answerArray[2] > 0:
        finalScore += .1;
        imgTypeWeight = .1;
        medRec.push(202);
        break;
   case answerArray[2] == 0:
        finalScore += 0;
        highRec.push(102);
        break;

}

//JS Heapsize
var jsWeight = 0;
switch (answerArray[3] >= 0){

    case answerArray[3] <= 10000000:
        finalScore += 2;
        jsWeight = 2;
        break;
    case answerArray[3] <= 15000000:
        finalScore += 1.75;
        jsWeight = 1.75;
        lowRec.push(303);
        break;
    case answerArray[3] <= 20000000:
        finalScore += 1.5;
        jsWeight = 1.5;
        lowRec.push(303);
        break;
   case answerArray[3] <= 25000000:
        finalScore += 1;
        jsWeight = 1;
        medRec.push(203);
        break;
    case answerArray[3] <= 30000000:
        finalScore += .75;
        jsWeight = .75;
        medRec.push(203);
        break;
   case answerArray[3] <= 40000000:
        finalScore += .5;
        jsWeight = .5;
        highRec.push(103);
        break;
   case answerArray[3] > 40000000:
        finalScore += .25;
        jsWeight = .25;
        highRec.push(103);
        break;

}

//HTML Length of Page
var lengthWeight = 0;
switch (answerArray[4] >= 0){

    case answerArray[4] <= 250000:
        finalScore += 1;
        lengthWeight = 1;
        break;
    case answerArray[4] <= 350000:
        finalScore += .85;
        lengthWeight = .85;
        lowRec.push(304);
        break;
    case answerArray[4] <= 500000:
        finalScore += .75;
        lengthWeight = .75;
        lowRec.push(304);
        break;
    case answerArray[4] <= 750000:
        finalScore += .65;
        lengthWeight = .65;
        medRec.push(204);
        break;
   case answerArray[4] <= 1000000:
        finalScore += .5;
        lengthWeight = .5;
        medRec.push(204);
        break;
   case answerArray[4] <= 4000000:
        finalScore += .25;
        lengthWeight = .25;
        highRec.push(104);
        break;
   case answerArray[4] > 4000000:
        finalScore += .1;
        lengthWeight = .1;
        highRec.push(104);
        break;

}

//Page Loadtime
var timeWeight = 0;
switch (answerArray[5] >= 0){

    case answerArray[5] <= 2:
        finalScore += 2;
        timeWeight = 2;
        break;
    case answerArray[5] <= 3.5:
        finalScore += 1.75;
        timeWeight = 1.75;
        lowRec.push(305);
        break;
    case answerArray[5] <= 5:
        finalScore += 1.5;
        timeWeight = 1.5;
        medRec.push(205);
        break;
   case answerArray[5] <= 6:
        finalScore += 1;
        timeWeight = 1;
        medRec.push(205);
        break;
   case answerArray[5] <= 8:
        finalScore += .75;
        timeWeight = .75;
        highRec.push(105);
        break;
   case answerArray[5] > 8:
        finalScore += .5;
        timeWeight = .5;
        highRec.push(105);
        break;

}

//Imported Fonts
var fontWeight = 0;
switch (answerArray[6] >= 0){

    case answerArray[6] == 0:
        finalScore += .4;
        fontWeight = .4;
        break;
    case answerArray[6] == 1:
        finalScore += .1;
        fontWeight = .1;
        medRec.push(206);
        break;

}
    
  
// Transfer Size
var transWeight = 0;
switch (answerArray[7] >= 0){

case answerArray[7] <= 150000:
    finalScore += 4;
    transWeight = 4;
    break;
case answerArray[7] <= 600000:
    finalScore += 3.75;
    transWeight = 3.75;
    break;
case answerArray[7] <= 850000:
    finalScore += 3.5;
    transWeight = 3.5;
    lowRec.push(307);
    break;
case answerArray[7] <= 1048576:
    finalScore += 3.25;
    transWeight = 3.25;
    lowRec.push(307);
    break;
case answerArray[7] <= 1572864:
    finalScore += 3;
    transWeight = 3;
    medRec.push(207);
    break;
case answerArray[7] <= 2621440:
    finalScore += 2.75;
    transWeight = 2.75;
    medRec.push(207);
    break;
case answerArray[7] <= 3670016:
    finalScore += 2.5;
    transWeight = 2.5;
    highRec.push(107);
    break;
case answerArray[7] <= 5242880:
    finalScore += 2.25;
    transWeight = 2.25;
    highRec.push(107);
    break;
case answerArray[7] > 5242880:
    finalScore += 2;
    transWeight = 2;
    highRec.push(107);
    break;

}
    
// Responsive Images
var resWeight = 0;
switch (answerArray[8] >= 0){

case answerArray[8] >= .7:
    finalScore += .4;
    resWeight = .4;
    break;
case answerArray[8] >= .5:
    finalScore += .35;
    resWeight = .35;
    lowRec.push(308);
    break;
case answerArray[8] >= .3:
    finalScore += .3;
    resWeight = .3;
    lowRec.push(308);
    break;
case answerArray[8] > 0:
    finalScore += .25;
    resWeight = .25;
    medRec.push(208);
    break;
case answerArray[8] == 0:
    finalScore += .2;
    resWeight = .2;
    highRec.push(108);
    break;
}
    
// Internal Stylesheets
var intSSWeight = 0;
switch (answerArray[9] >= 0){

case answerArray[9] <= 2:
    finalScore += .2;
    intSSWeight = .2;
    break;
case answerArray[9] <= 5:
    finalScore += .1;
    intSSWeight = .1;
    lowRec.push(309);
    break;
case answerArray[9] >= 5:
    finalScore += 0;
    medRec.push(209);
    break;
}
    
// Number of Stylesheet Files
var ssFileWeight = 0;
switch (answerArray[10] >= 0){
        
case cssTransLabel === 'All style sheets cached!':
    finalScore += .2;
    ssFileWeight = .2;
    break;
case answerArray[10] <= 2:
    finalScore += .2;
    ssFileWeight = .2;
    break;
case answerArray[10] <= 5:
    finalScore += .15;
    ssFileWeight = .15;
    lowRec.push(310);
    break;
case answerArray[10] >= 5:
    finalScore += .5;
    medRec.push(210);
    break;
}
    
// Number of Redirects
var redirectWeight = 0;
switch (answerArray[11] >= 0){

case answerArray[11] == 0:
    finalScore += .1;
    redirectWeight = .1;
    break;
case answerArray[11] <= 1:
    finalScore += 0;
    lowRec.push(311);
    break;
}

 // Amount of Cookies
var cookieWeight = 0;
switch (answerArray[12] >= 0){

case answerArray[12] <=3:
    finalScore += .4;
    cookieWeight = .4;
    break;
case answerArray[12] <= 7:
    finalScore += .3;
    cookieWeight = .3;
    lowRec.push(312);
    break;
case answerArray[12] <= 10:
    finalScore += .2;
    cookieWeight = .2;
    medRec.push(212);
    break;
case answerArray[12] <= 15:
    finalScore += .1;
    cookieWeight = .1;
    medRec.push(212);
    break;
case answerArray[12] >= 16:
    finalScore += 0;
    highRec.push(112);
    break;
}
        
    
 // Empty SRC Tags
var emptySRCWeight = 0;
switch (answerArray[13] >= 0){

case answerArray[13] <= 2:
    finalScore += .2;
    emptySRCWeight = .2;
    break;
case answerArray[13] <= 4:
    finalScore += .1;
    emptySRCWeight = .1;
    lowRec.push(313);
    break;
case answerArray[13] >= 5:
    finalScore += 0;
    medRec.push(213);
    break;
}
    
    
 // Cache Max Age
var cacheWeight = 0;

switch (true){

case answerArray[14] >= 31536000:
    finalScore += .4;
    cacheWeight = .4;
    break;
case answerArray[14] >= 86400:
    finalScore += .35;
    cacheWeight = .35;
    break;
case answerArray[14] >= 3600:
    finalScore += .3;
    cacheWeight += .3;
    lowRec.push(314);
    break;
case answerArray[14] >= 600:
    finalScore += .25;
    cacheWeight += .25;
    medRec.push(214);
    break;
case answerArray[14] >= 0:
    finalScore += .2;
    cacheWeight += .2;
    highRec.push(114);
    break;
case answerArray[14] == .5:
    finalScore += .4;
    cacheWeight += .4;
    break;
}        
  
// Background Color
var colorWeight = 0;
switch (colorScore){

case 'black':
    finalScore += .2;
    colorWeight = .2;
    break;
case 'black/grey':
    finalScore += .2;
    colorWeight = .2;
    break;
case 'something':
    finalScore += .15;
    colorWeight = .15;
    break;
case 'white':
    finalScore += .13;
    colorWeight = .13;
    lowRec.push(315);
    break;
case 'blue':
    finalScore += .1;
    colorWeight = .1;
    medRec.push(215);
    break;
}
   
var maxScore = 15.3;

//////////////////////////////////////
//Metric Weight Calc
// Lazy Load
//var LazyLoadMax = ((((finalScore-LazyLoadWeight)+.4)/14.7)*100).toPrecision(2);
var LazyLoadMax = Math.round((((finalScore-LazyLoadWeight)+.4)/maxScore)*100);
    
//Empty Src Tags
//var emptySrcMax = ((((finalScore-emptySRCWeight)+.2)/14.7)*100).toPrecision(2);
var emptySrcMax = Math.round((((finalScore-emptySRCWeight)+.2)/maxScore)*100);    

// Cookies
//var cookieMax = ((((finalScore-cookieWeight)+.4)/14.7)*100).toPrecision(2);
var cookieMax = Math.round((((finalScore-cookieWeight)+.4)/maxScore)*100);    
    
// Redirects   
//var redirectMax = ((((finalScore-redirectWeight)+.1)/14.7)*100).toPrecision(2); 
var redirectMax = Math.round((((finalScore-redirectWeight)+.1)/maxScore)*100);     
    
// Style Sheet Files   
//var ssFileMax = ((((finalScore-ssFileWeight)+.2)/14.7)*100).toPrecision(2); 
var ssFileMax = Math.round((((finalScore-ssFileWeight)+.2)/maxScore)*100);    
    
// Internal Style Sheet   
//var intSSMax = ((((finalScore-intSSWeight)+.2)/14.7)*100).toPrecision(2);
var intSSMax = Math.round((((finalScore-intSSWeight)+.2)/maxScore)*100);    
    
// Responsive Images
//var resMax = ((((finalScore-resWeight)+.4)/14.7)*100).toPrecision(2);
var resMax = Math.round((((finalScore-resWeight)+.4)/maxScore)*100);
    
    
 // Transfer Size
//var transMax = ((((finalScore-transWeight)+4)/14.7)*100).toPrecision(2);
var transMax = Math.round((((finalScore-transWeight)+4)/maxScore)*100);
    
    
// Imported Fonts
//var fontMax = ((((finalScore-fontWeight)+.4)/14.7)*100).toPrecision(2);
var fontMax = Math.round((((finalScore-fontWeight)+.4)/maxScore)*100);  
    
    
// Page Load Time
//var timeMax = ((((finalScore-timeWeight)+2)/14.7)*100).toPrecision(2);
var timeMax = Math.round((((finalScore-timeWeight)+2)/maxScore)*100); 
    
    
// Length Weight
//var lengthMax = ((((finalScore-lengthWeight)+1)/14.7)*100).toPrecision(2);
var lengthMax = Math.round((((finalScore-lengthWeight)+1)/maxScore)*100);
    

// Img Type Weight
//var imgTypeMax = ((((finalScore-imgTypeWeight)+.4)/14.7)*100).toPrecision(2);
var imgTypeMax = Math.round((((finalScore-imgTypeWeight)+.4)/maxScore)*100); 
    
    
// JS
//var jsMax = ((((finalScore-jsWeight)+2)/14.7)*100).toPrecision(2);
var jsMax = Math.round((((finalScore-jsWeight)+2)/maxScore)*100);    
    
  
// Page Size
//var sizeMax = ((((finalScore-sizeWeight)+3)/14.7)*100).toPrecision(2);
var sizeMax = Math.round((((finalScore-sizeWeight)+3)/maxScore)*100);     

cacheWeight
// Caching
var cacheMax = Math.round((((finalScore-cacheWeight)+.4)/maxScore)*100);
    
colorWeight
// Caching
var colorMax = Math.round((((finalScore-colorWeight)+.2)/maxScore)*100); 




finalScore = finalScore/maxScore;
finalScore = Math.round(finalScore*100)
var finalGrade = "";

switch (finalScore >= 0){

    case finalScore >= 95:
        finalGrade = "A+";
        break;
    case finalScore >= 92:
        finalGrade = "A";
        break;
    case finalScore >= 88:
        finalGrade = "A-";
        break;
    case finalScore >= 85:
        finalGrade = "B+";
        break;
    case finalScore >= 82:
        finalGrade = "B";
        break;
    case finalScore >= 78:
        finalGrade = "B-";
        break;
    case finalScore >= 75:
        finalGrade = "C+";
        break;
    case finalScore >= 73:
        finalGrade = "C";
        break;
    case finalScore >= 68:
        finalGrade = "C-";
        break;
    case finalScore >= 63:
        finalGrade = "D+";
        break;
    case finalScore >= 59:
        finalGrade = "D";
        break;
    case finalScore >= 55:
        finalGrade = "D-";
        break;
    case finalScore < 55:
        finalGrade = "F";
        break;
}

var decodedBodySizeChart = answerArray[0];
var lazyLoadChart = (answerArray[1]*100);
var svgChart = (answerArray[2]*100);
var jsChart = answerArray[3];
var htmlChart = answerArray[4];
var loadTimeChart = answerArray[5];
var importChart = answerArray[6];
var transferSizeChart = answerArray[7];
var lengthK = pagebytesLabel;
var resImgChart = (answerArray[8]*100);
//var resImgChart = (answerArray[8]*100).toPrecision(3);
var cacheChart = cacheScore;
var colorChart = colorScore;

////////////////////////////////
//For Options Chart - added time to sort out
const storedAt = Date.now();    

//displaying url for options chart label
var hostURL = window.location.host;
    
var Sustainability = 0;
var Score = finalScore;

    
//Responsive images were sometimes showing > 100% and .848% showing off bar

if(resImgChart >= 111){
       resImgChart = 100;
    }
else if(resImgChart > 1 && resImgChart < 111){
    resImgChart = resImgChart.toPrecision(3);
}
 else {
     resImgChart = resImgChart.toPrecision(2);
 }
    
//Responsive images were sometimes showing > 100% and .848% showing off bar
if(svgChart >= 111){
       svgChart = 100;
    }
else if(svgChart > 1 && svgChart < 111){
    svgChart = svgChart.toPrecision(3);
}
 else {
     svgChart = svgChart.toPrecision(2);
 }
    
//Responsive images were sometimes showing > 100% and .848% showing off bar
if(lazyLoadChart >= 111){
       lazyLoadChart = 100;
    }
else if(lazyLoadChart > 1 && lazyLoadChart < 111){
    lazyLoadChart = lazyLoadChart.toPrecision(3);
}
 else {
     lazyLoadChart = lazyLoadChart.toPrecision(2);
 }

//Sustainable Remediations
    
if (answerArray[1] === 1.1){
    imgNotLLArray.push("Less than 6 images on page.");
    }
    else if(imgNotLLArray.length === 0){
    imgNotLLArray.push("0 Found");
    }
if (answerArray[2] === 1.1){
    imgNotGoodFormat.push("Less than 6 images on page.");
    }
    else if(imgNotGoodFormat.length === 0){
    imgNotGoodFormat.push("0 Found");
    }
if (picTagCount > 0){
    imgNotRes.push("Images loading responsively.");
    }
    else if (imgNotRes.length === 0){
    imgNotRes.push("0 Found");
    }
    
    
    

    
    
//Here starts Recommendation Engine

var imFontSize = 0;
var imFontLabel;
var imFontHREF;
    
var highRec1 = [];
var medRec1 = [];
var lowRec1 = [];

//Recommendation Engine
    
//Transfer Size Function
 if (highRec.includes(107)){
    highRec1.push(transferFunction());
}
    else if(medRec.includes(207)){
        highRec1.push(transferFunction());
    }
    else if(lowRec.includes(307)){
        highRec1.push(transferFunction());
    }
    else{
        //highRec1.push('');
    }

//Page Loadtime Function
if(highRec.includes(105)){
        highRec1.push(loadTimeFunction());
    }
    else if(medRec.includes(205)){
        highRec1.push(loadTimeFunction());
    }
    else if(lowRec.includes(305)){
        highRec1.push(loadTimeFunction());
    }
    else{
       // highRec1.push('');
    }
    
//Empty SRC Tags Function  
if(medRec.includes(213)){
        medRec1.push(emptySRCFunction());
    }
    else if(lowRec.includes(313)){
        lowRec1.push(emptySRCFunction());
    }
    else{
       // highRec1.push('');
    }
    
//Imported Fonts Function
if(medRec.includes(206)){

//Imported Font Function

for (var i = 0; i < transferResources.length; i++) {

    imFontHREF = transferResources[i].name; 
    
    if (imFontHREF.match(importedFontTransReq)){
        imFontSize += transferResources[i].transferSize;
        impFontReq++;
    }
    else{
        //
    }
}
    

if (imFontSize === 0){
        //imFontLabel = 'Your imported font files are cached!';
        //medRec1.push(imFontLabel);
}  else if(imFontSize/1024/1024/1024 > 1){
        imFontLabel = (((imFontSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
        medRec1.push("Your imported fonts equate to "+ imFontLabel +', or '+((imFontSize/transferSize1)*100).toFixed(2)+'% of your total transfered size.<br>');
 } else if (imFontSize/1024/1024 > 1){
        imFontLabel = (((imFontSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
        medRec1.push("Your imported fonts equate to "+ imFontLabel +', or '+((imFontSize/transferSize1)*100)+'% of your total transfered size.<br>');
 } else if (imFontSize/1024 > 1){
        imFontLabel = (((imFontSize/1024).toFixed(2)).toString() + arrayLabel[1]);
        medRec1.push("Your imported fonts equate to "+ imFontLabel +', or '+((imFontSize/transferSize1)*100).toFixed(2)+'% of your total transfered size.<br>');
 } else if (imFontSize > 1){
        imFontLabel = (((imFontSize).toFixed(2)).toString() + arrayLabel[0]);
        medRec1.push("Your imported fonts equate to "+ imFontLabel +', or '+((imFontSize/transferSize1)*100).toFixed(2)+'% of your total transfered size.<br>');
 }
   else{
        imFontLabel = (imFontSize).toString() + arrayLabel[0];
 }
        
    }
    else{
       // highRec1.push('');
    }

//JS Heapsize Function
if(highRec.includes(103)){
    highRec1.push(jsFunction())
}
    else if(medRec.includes(203)){
        lowRec1.push(jsFunction());
    }
    else if(lowRec.includes(303)){
        lowRec1.push(jsFunction());
    }
    else{
        //
    }
    
    
var transFuncVar;   
//Transfer Function
function transferFunction(){
    if (largeTransSrc.match(cssTransReq)){
        transFuncVar = 'Your largest Trans Size is a stylesheet.<br><br>';
    }
        else if(largeTransSrc.match(apiTransReq)){
        transFuncVar ='Your largest Trans Size is an api request.<br><br>';
    }
        else if(largeTransSrc.match(jsTransReq)){
        transFuncVar ='Your largest Trans Size is a javascript file.<br><br>';
    }
        else if(largeTransSrc.match(importedFontTransReq)){
        transFuncVar ='Your largest Trans Size is an imported font file. All together, imported fonts required '+imFontLabel+' in transfered data.<br><br>';
    }
        else if(largeTransSrc.match(imageTransReq)){
        transFuncVar ='Your largest Transfered Request is an image. Have you considered using an image compression tool? There are a lot found online, and they make a significant difference in image size.<br><br>';
    }
         else{
        //transFuncVar = 'This is your largest Transfer Request '+largeTransSrc+' <br><br>';
    }
    
    return transFuncVar;
    
}
 
    
var loadFuncVar;
//Transfer Function
function loadTimeFunction(){
    if (largeLoadRequest.match(cssTransReq)){
        loadFuncVar = 'Your longest loading request is an external stylesheet.<br><br>';
    }
        else if(largeLoadRequest.match(apiTransReq)){
        loadFuncVar ='Your longest loading request is an api request.<br><br>';
    }
        else if(largeLoadRequest.match(jsTransReq)){
        loadFuncVar ='Your longest loading request is a javascript file.<br><br>';
    }
        else if(largeLoadRequest.match(importedFontTransReq)){
        loadFuncVar ='Your longest loading request is an imported font file. In total, Imported Fonts required ' +impFontReq +' seperate requests. <br><br>';
    }
        else if(largeLoadRequest.match(imageTransReq)){
        loadFuncVar ='Your longest loading request is an image. Have you considered using an image compression tool? There are a lot found online, and they make a significant difference in image size.<br><br>';
    }
         else{
            //loadFuncVar = 'This is your longest loading request Request '+largeLoadRequest+' <br><br>';
    }
    
    return loadFuncVar;
    
}
    
    
var emptySrcVar;
//Transfer Function
function emptySRCFunction(){
    if (emptySrcType.length > 0){
        emptySrcVar = '';
    }
    if (emptySrcType.includes(1)){
        emptySrcVar += 'Instances of < img src=""> were found on page.<br><br>';
    }
    if(emptySrcType.includes(2)){
        emptySrcVar += 'Instances of < script src=""> were found on page.<br><br>';
    }
    if(emptySrcType.includes(3)){
        emptySrcVar += 'Instances of < link rel=stylesheet href=""> were found on page.<br><br>';
    }
    if(emptySrcType.includes(4)){
        emptySrcVar += 'Instances of < button href=""> were found on page.<br><br>';
    }
    if(emptySrcType.includes(5)){
        emptySrcVar += 'Instances of < a href=""> were found on page.<br><br>';
    }
        else{
            //emptySrcVar = 'You have a lot of empty srcs<br><br>';
    }
    
    return emptySrcVar;
    
}
 
    
var jsFuncVar;
function jsFunction(){
    
for (var i = 0; i < transferResources.length; i++) {

    cssHREF = transferResources[i].name; 

    if (cssHREF.match(jsTransSize)){
        jsTransSize += transferResources[i].transferSize;
    }
    else{
        //
    }
} 

if (jsTransSize === 0){
   //jsTransLabel = 'All Javascript requests are cached!' 
}  else if(jsTransSize/1024/1024/1024 > 1){
    jsTransLabel = (((jsTransSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
    jsFuncVar = 'The total amount of all transfered Javascript Requests: '+jsTransLabel+'.<br><br>';
 } else if (jsTransSize/1024/1024 > 1){
    jsTransLabel = (((jsTransSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
    jsFuncVar = 'The total amount of all transfered Javascript Requests: '+jsTransLabel+'.<br><br>';
 } else if (jsTransSize/1024 > 1){
    jsTransLabel = (((jsTransSize/1024).toFixed(2)).toString() + arrayLabel[1]);
    jsFuncVar = 'The total amount of all transfered Javascript Requests: '+jsTransLabel+'.<br><br>';
 } else if (jsTransSize > 1){
    jsTransLabel = (((jsTransSize).toFixed(2)).toString() + arrayLabel[0]);
    jsFuncVar = 'The total amount of all transfered Javascript Requests: '+jsTransLabel+'.<br><br>';
 }
   else{
     jsTransLabel = (jsTransSize).toString() + arrayLabel[0];
     jsFuncVar = 'The total amount of all transfered Javascript Requests: '+jsTransLabel+'.<br><br>';
 }
    
 //If their JS is high and their transfersize is low then it must mean that they have a lot of Analytics and Ads running 
    
// Show the usedJSHeapSize / Total to show how much JavaScript is being used. 
        
   return jsFuncVar; 
}
 
    

    
//performance.getEntries(); For Web Vitals  
    
var counts = {finalGrade, sizeLabel, lazyLoadChart, svgChart, jsChart, htmlChart, loadTimeChart, importChart, decodedBodySizeChart, jssSizeLabel, duration, finalScore, transferSizeChart, lengthK, resImgChart, transferLabel, intStyleSheet, numStyleSheet, cookieLen, emptyURL, cookiesList, largeTransSrc, intStyleSheetTags, styleSheetSources, emptySRCVal, LazyLoadMax, emptySrcMax, cookieMax, redirectMax, ssFileMax, intSSMax, resMax, transMax, fontMax, timeMax, lengthMax, imgTypeMax, jsMax, sizeMax, cacheMax, cacheChart, cacheSeconds, cacheMinutes, cacheHours, cacheDays, colorScore, backGroundColor, colorMax, storedAt, hostURL, Sustainability, Score, imgNotLLArray, emptySRCArray, imgNotGoodFormat, imgNotRes, largeLoadRequest, transferSizeLabel, largeLoadLabel, highRec1, medRec1, lowRec1, cssTransLabel}

chrome.runtime.sendMessage(counts);
    
}