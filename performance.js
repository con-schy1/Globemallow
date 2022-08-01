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
 sizeLabel = (((decodedSize/1024/1024/1024).toPrecision(3)).toString() + arrayLabel[3]);
 } else if (decodedSize/1024/1024 > 1){
 sizeLabel = (((decodedSize/1024/1024).toPrecision(3)).toString() + arrayLabel[2]);
 } else if (decodedSize/1024 > 1){
 sizeLabel = (((decodedSize/1024).toPrecision(3)).toString() + arrayLabel[1]);
 } else if (decodedSize > 1){
 sizeLabel = (((decodedSize).toPrecision(3)).toString() + arrayLabel[0]);
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
let x1 = document.querySelector('body').outerHTML;
var regEX = /loading="lazy"/;
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
var fontRegex = /(@font-face)|(woff?2)|(fonts.googleapis)|(.tff)/;
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
var transferSize1 = 0;
var largeTrans = 0;
var largeTransArray = [];
var largeTransSrc;

const transferResources = performance.getEntriesByType('resource');
    
    
var max = transferResources[0].transferSize;
var maxIndex = 0;

for (var i = 0; i < transferResources.length; i++) {
   imgB.push(transferResources[i].transferSize);
   
    if(imgB[i] > max){
            maxIndex = i;
            max = imgB[i];
            
        }

   }
largeTransSrc = transferResources[maxIndex].name;
    
    
for (let i in imgB){
   transferSize1 += imgB[i];
   }
transferSize1 = parseFloat(transferSize1);

answerArray.push(transferSize1);
 
var transferLabel = 0;
    
 if (transferSize1/1024/1024/1024 > 1){
 transferLabel = (((transferSize1/1024/1024/1024).toPrecision(3)).toString() + arrayLabel[3]);
 } else if (transferSize1/1024/1024 > 1){
 transferLabel = (((transferSize1/1024/1024).toPrecision(3)).toString() + arrayLabel[2]);
 } else if (transferSize1/1024 > 1){
 transferLabel = (((transferSize1/1024).toPrecision(3)).toString() + arrayLabel[1]);
 } else if (transferSize1 > 1){
 transferLabel = (((transferSize1).toPrecision(3)).toString() + arrayLabel[0]);
 }
   else{
     transferLabel = (transferSize1).toString() + arrayLabel[0];
 }

/*console.log(transferResources);
console.log(largeTransSrc);*/
    
//if you see that issue 3.34xe1 it's from the toPrecision rounding it off

////////////////////////////////////////////////////

////////////////////////////////////////////////////
    
// Responsive Images
    
var x1Array = [];
var img1Count = document.getElementsByTagName("img");
var picTagCount = document.getElementsByTagName("picture").length;
var regSRC = /srcset/;
var ratio1 = 0;

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
         //console.log("0 srcset Images");
        }
    }
var ratioSS = x1Array.length/img1Count.length;
answerArray.push(ratioSS);

}
else{
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
    
  for (var i = 1 ; i < numStyleSheet; i++) {
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
var emptyURL = document.querySelectorAll('img[src=""]').length + document.querySelectorAll('script[src=""]').length + document.querySelectorAll('link[rel=stylesheet][href=""]').length + document.querySelectorAll('button[href=""]').length + document.querySelectorAll('a[href=""]').length;
    
answerArray.push(emptyURL);
    
    
///////////////////////////////////////////////////////
//Analytics Tracker Checker    

const regex1List = [/google\-analytics/,/googletagmanager/,/marketo/,/doubleclick/
,/scorecardresearch/,/connect\.facebook\.net/,/clarity\.ms/,
/go\-mpulse/,/analytics\.tiktok/,/quantcount/, /snap\.licdn/, /analytics\.similarweb/, /hotjar/, /pardot/,
/newrelic/, /foresee/, /smetrics\./, /tms\./, /crazyegg/, /krxd\.net/, /boomtrain/
, /cdn\.turner/, /optimizely/, /bounceexchange/, /visualime/, /tags\.tiqcdn/, /tealiumiq/,
/adobedtm/, /qualaroo/, /clicktale/, /funnelenvy/, /edge\.fullstory/, /tvsquared/, /heapanalytics/,
 /thebrighttag/, /s\.btstatic/, /raygun/, /ac\-target/, /demdex/, /utag/, /iperceptions/, /techtarget/, /bizible/,
 /6sc\.co/, /demandbase/, /engagio/, /akamai/, /qualtrics/, /rubiconproject/, /s\.yimg/,
  /cdn\.segment/, /marinsm/, /googlesyndication/, /chartbeat/, /gstatic/, /rlcdn/, /sojern/,
  /rmtag/, /impactradius\-event/, /bytedance/, /sprig/, /userleap/, /bat\.bing/, /adservice\.google/, /googleadservices/, /geoedge/, /taboola/, /ads\-twitter/, /sleeknote/, /pushcrew/, /onesignal/, /amazon\-adsystem/, /amplify\-outbrain/, /dianomi/, /s\-onetag/, /ads\.pubmatic/, /adroll/, /adnxs/, /crwdcntrl/, /redditstatic/, /ads.\linkedin/, /moatads/, /criteo/, /adlightning/, /turner\.com\/ads/, /quantserve/, /rubiconproject/, /mpulse/, /\.demex\.net\//, /gateway\.foresee\.com/, /\.scene7/, /googletagservices/, /analytics\.yahoo\.com/, /doubleverify/, /imrworldwide/, /analytics\.twitter/, /adsafeprotected/, /sc\-static/, /bidswitch/, /widgets\-outbrain/, /connect\.facebook\.net/, /igodigital/, /api\-segment/, /ad\-delivery/, /pix\.pub/, /nr\-data/, /c\.lytics/, /indexww/, /p1\.parsely/, /omtrdc/, /curalate/, /richrelevance/, /cquotient/, /api\.drift/, /app\.dynamics/, /pixel\.wp/, /s7\.addthis/, /webtrendslive/, /googleoptimize/, /px\-cloud\.net/, /liveperson/, /tamgrt/, /\.forter/, /piwik/, /3gl\.net/, /btttag/, /crwdcntrl\.net/, /exelator/, /helpscout/, /platform\.twitter/, /px\.ads\.linkedin/, /linkedin\.com\/li\/track/, /tvsquared/, /fullstory/, /powerreviews/, /mouseflow/, /brightcove/, /beacon\.walmart\.com/, /mathtag/, /\/clickstream\//, /\/gauge\/link\//, /\/gauge\/pageview\//, /adsrvr/, /bs\.serving\-sys/, /teads\.tv/, /tvpixel/, /monetate/, /dyntrace/, /custhelp/, /answerscloud/, /yotpo/, /kampyle/, /webcollage/, /salsify\-ecdn/, /ct\.pintrest/, /soptimize\.southwest/, /flashtalking/, /innovid/, /facebook\.com\/tr/, /everesttech/, /r\.turn/, /ads\.linkedin/, /content\.mink/, /siteimproveanalytics/, /newscgp/, /permutive/, /js\+ssdomvar\.js\+generic/, /apps\.bazaarvoice/, /snowplowanalytics/, /6sc\.co/, /bluekai/, /tapad/, /casalemedia/, /usabilla/, /xg4ken/, /api\.amplitude/, /\/b\/ss\//, /quantummetric/, /\/wt\.pl\?/, /spotxchange/, /mookie1/, /\/glassbox\/reporting\//, /\/ga\/gtag\.js/, /\/plugins\/like\.php/, /maxymiser\.net\//, /visualwebsiteoptimizer/, /d\.turn/, /ads\.stickyadstv/, /branch\.io/, /res\-x/, /narrativ/, /pubmatic\.com\/AdServer/, /ispot\.tv/, /dcf\.espn/, /bluecore/, /yjtag\.yahoo/, /ruxitagent/, /plausible\.io\/js/, /jscache/, /acuityplatform/, /cloudfront\.net\/form\-serialize/, /mr\.homedepot/, /static\/js\/t\.js/, /fwmrm\.net\/ad/, /dotmetrics\.net/, /hit\.xiti/, /plusone\.js/, /kaltura/, /tagcommander/, /boomerang\.js/, /techlab\-cdn/, /3lift/, /searchiq/, /\/js\/tealeaf/, /appboy\.com\/api/, /sharethis\.com/, /bizible/, /getclicky\.com\/js/, /track\.securedvisit/, /online\-metrix/, /dynamicyield/, /yottaa/, /atgvcs/, /agkn\.com/, /t\.co\//, /data\.microsoft/, /quantcast/, /cdn\.pdst/, /sgtm/, /flashtalking/, /owneriq/, /shoprunner/, /cxense/, /osano/, /gigya/, /log\.pinterest/, /hubspot/, /pinimg/, /\/opinionlab\//, /\.brsrvr/, /merkle\_track/, /ensighten/, /alexametrics/, /tr\.snapchat/, /c\.msn/, /advertising/, /keywee/, /bizographics\.com\/collect/, /adsymptotic/, /yahoo\.com\/admax/, /omnitagjs/, /yandex\.ru\/metrika\/a/, /evidon\-sitenotice\-tag\.js/, /dotomi/, /lijit/, /bluecava/, /data\.pendo\.io/, /heapanalytics/, /certona/, /sail\-horizon\.com\/spm/, /\.gumgum\.com/, /33across/, /mparticle/, /privy\.com\/collect/, /abtasty/, /dwin1/, /shopifycdn/, /uplift\-platform/, /w55c/, /liadm/, /sddan/, /sundaysky/, /\/atrk\.js/, /\/kinesis/, /zdassets/, /rfihub/, /ad\.360yield/, /ad\.wsod/, /ex\.co/];


var scripts = document.getElementsByTagName("script");



var scrptSrcs = [];
var strInMatches;
var foundArray = [];
var scrptCount = 0;

    for (var i = 0; i < scripts.length; i++) {
        scrptSrcs.push(scripts[i].src);
    }
    for (var i = 0; i < regex1List.length; i++) {
        strInMatches = scrptSrcs.filter(element => regex1List[i].test(element));
        foundArray.push(strInMatches);
        scrptCount += foundArray[i].length;
    }
//var scriptStr = scrptCount.toString();    
    
////////////////////////////////////////
// Image

var imgs = document.getElementsByTagName("img");

var imgSrcs = [];
var strImgMatches;
var foundImgArray = [];
var imgCount = 0;

    for (var i = 0; i < imgs.length; i++) {
        imgSrcs.push(imgs[i].src);
    }
    for (var i = 0; i < regex1List.length; i++) {
        strImgMatches = imgSrcs.filter(element => regex1List[i].test(element));
        foundImgArray.push(strImgMatches);
        imgCount += foundImgArray[i].length;
    }
    
////////////////////////////////////////
// Sub Frame

var iframes = document.getElementsByTagName("iframe");

var iframeSrcs = [];
var strIframeMatches;
var foundIframeArray = [];
var iframeCount = 0;

    for (var i = 0; i < iframes.length; i++) {
        iframeSrcs.push(iframes[i].src);
    }
    for (var i = 0; i < regex1List.length; i++) {
        strIframeMatches = iframeSrcs.filter(element => regex1List[i].test(element));
        foundIframeArray.push(strIframeMatches);
        iframeCount += foundIframeArray[i].length;
    }
    
    
    
 var totalAnal = scrptCount+imgCount+iframeCount;

    answerArray.push(totalAnal);
    
    
/////////////////////
var scoreArray = [];
var finalScore = 0;

// Decoded Body Size

switch (answerArray[0] >= 0){

case answerArray[0] <= 150000:
    finalScore += 3;
    break;
case answerArray[0] <= 600000:
    finalScore += 2.85;
    break;
case answerArray[0] <= 850000:
    finalScore += 2.65;
    break;
case answerArray[0] <= 1048576:
    finalScore += 2.45;
    break;
case answerArray[0] <= 1572864:
    finalScore += 2.2;
    break;
case answerArray[0] <= 2000000:
    finalScore += 2;
    break;
case answerArray[0] <= 2621440:
    finalScore += 1.85;
    break;
case answerArray[0] <= 3100000:
    finalScore += 1.65;
    break;
case answerArray[0] <= 3670016:
    finalScore += 1.45;
    break;
case answerArray[0] <= 5242880:
    finalScore += 1.25;
    break;
case answerArray[0] > 5242880:
    finalScore += 1;
    break;

}


//Lazy Loaded Image
switch (answerArray[1] >= 0){

    case answerArray[1] >= .65:
        finalScore += .4;
        break;
    case answerArray[1] >= .40:
        finalScore += .3;
        break;
   case answerArray[1] >= .25:
        finalScore += .2;
        break;
   case answerArray[1] > 0:
        finalScore += .1;
        break;
   case answerArray[1] == 0:
        finalScore += 0;
        break;

}

//Ratio of SVG Images
switch (answerArray[2] >= 0){

    case answerArray[2] >= .7:
        finalScore += .4;
        break;
    case answerArray[2] >= .5:
        finalScore += .3;
        break;
   case answerArray[2] >= .25:
        finalScore += .2;
        break;
   case answerArray[2] > 0:
        finalScore += .1;
        break;
   case answerArray[2] == 0:
        finalScore += 0;
        break;

}

//JS Heapsize
switch (answerArray[3] >= 0){

    case answerArray[3] <= 10000000:
        finalScore += 2;
        break;
    case answerArray[3] <= 15000000:
        finalScore += 1.75;
        break;
    case answerArray[3] <= 20000000:
        finalScore += 1.5;
        break;
   case answerArray[3] <= 25000000:
        finalScore += 1;
        break;
    case answerArray[3] <= 30000000:
        finalScore += .75;
        break;
   case answerArray[3] <= 40000000:
        finalScore += .5;
        break;
   case answerArray[3] > 40000000:
        finalScore += .25;
        break;

}

//HTML Length of Page
switch (answerArray[4] >= 0){

    case answerArray[4] <= 250000:
        finalScore += 1;
        break;
    case answerArray[4] <= 350000:
        finalScore += .85;
        break;
    case answerArray[4] <= 500000:
        finalScore += .75;
        break;
    case answerArray[4] <= 750000:
        finalScore += .65;
        break;
   case answerArray[4] <= 1000000:
        finalScore += .5;
        break;
   case answerArray[4] <= 4000000:
        finalScore += .25;
        break;
   case answerArray[4] > 4000000:
        finalScore += .1;
        break;

}

//Page Loadtime
switch (answerArray[5] >= 0){

    case answerArray[5] <= 2:
        finalScore += 2;
        break;
    case answerArray[5] <= 3.5:
        finalScore += 1.75;
        break;
    case answerArray[5] <= 5:
        finalScore += 1.5;
        break;
   case answerArray[5] <= 6:
        finalScore += 1;
        break;
   case answerArray[5] <= 8:
        finalScore += .75;
        break;
   case answerArray[5] > 8:
        finalScore += .5;
        break;

}

//Imported Fonts
switch (answerArray[6] >= 0){

    case answerArray[6] == 0:
        finalScore += .4;
        break;
    case answerArray[6] == 1:
        finalScore += .1;
        break;

}
    

    
// Transfer Size

switch (answerArray[7] >= 0){

case answerArray[7] <= 150000:
    finalScore += 4;
    break;
case answerArray[7] <= 600000:
    finalScore += 3.75;
    break;
case answerArray[7] <= 850000:
    finalScore += 3.5;
    break;
case answerArray[7] <= 1048576:
    finalScore += 3.25;
    break;
case answerArray[7] <= 1572864:
    finalScore += 3;
    break;
case answerArray[7] <= 2621440:
    finalScore += 2.75;
    break;
case answerArray[7] <= 3670016:
    finalScore += 2.5;
    break;
case answerArray[7] <= 5242880:
    finalScore += 2.25;
    break;
case answerArray[7] > 5242880:
    finalScore += 2;
    break;

}
    
// Responsive Images

switch (answerArray[8] >= 0){

case answerArray[8] >= .7:
    finalScore += .4;
    break;
case answerArray[8] >= .5:
    finalScore += .3;
    break;
case answerArray[8] >= .3:
    finalScore += .2;
    break;
case answerArray[8] > 0:
    finalScore += .1;
    break;
case answerArray[8] == 0:
    finalScore += 0;
    break;
}
    
// Internal Stylesheets

switch (answerArray[9] >= 0){

case answerArray[9] <= 2:
    finalScore += .2;
    break;
case answerArray[9] <= 5:
    finalScore += .1;
    break;
case answerArray[9] >= 5:
    finalScore += 0;
    break;
}
    
// Number of Stylesheet Files

switch (answerArray[10] >= 0){

case answerArray[10] <= 2:
    finalScore += .2;
    break;
case answerArray[10] <= 5:
    finalScore += .1;
    break;
case answerArray[10] >= 5:
    finalScore += 0;
    break;
}
    
// Number of Redirects

switch (answerArray[11] >= 0){

case answerArray[11] == 0:
    finalScore += .1;
    break;
case answerArray[11] <= 1:
    finalScore += 0;
    break;
}

 // Amount of Cookies

switch (answerArray[12] >= 0){

case answerArray[12] <=3:
    finalScore += .4;
    break;
case answerArray[12] <= 7:
    finalScore += .3;
    break;
case answerArray[12] <= 10:
    finalScore += .2;
    break;
case answerArray[12] <= 15:
    finalScore += .1;
    break;
case answerArray[12] >= 16:
    finalScore += 0;
    break;
}
        
        
 // Empty SRC Tags

switch (answerArray[13] >= 0){

case answerArray[13] <= 2:
    finalScore += .2;
    break;
case answerArray[13] <= 4:
    finalScore += .1;
    break;
case answerArray[13] >= 5:
    finalScore += 0;
    break;
} 

finalScore = finalScore/14.7;

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
var analChart = answerArray[14];

    
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



var counts = {finalGrade, sizeLabel, lazyLoadChart, svgChart, jsChart, htmlChart, loadTimeChart, importChart, decodedBodySizeChart, jssSizeLabel, duration, finalScore, transferSizeChart, lengthK, resImgChart, transferLabel, intStyleSheet, numStyleSheet, cookieLen, emptyURL, analChart, cookiesList, largeTransSrc, intStyleSheetTags, styleSheetSources}

chrome.runtime.sendMessage(counts);
    
}