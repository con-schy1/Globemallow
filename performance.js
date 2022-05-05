//console.log('<----- Content script started running ----->');

chrome.runtime.onMessage.addListener(msg=> {
    if (document.readyState === 'complete') {
        greenFunction();
    } else {
        window.addEventListener('load', greenFunction);
    }
});


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
//console.log("0");
}
}
var ratioLL = xArray.length/imgCount.length;
answerArray.push(ratioLL);
}
else{
answerArray.push(1.1);
}

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
var fontRegex = /(@font-face)|(woff?2)|(fonts\.googleapis)/;
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

const transferResources = performance.getEntriesByType('resource');

for (var i = 0; i < transferResources.length; i++) {
   imgB.push(transferResources[i].transferSize);
   }
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
    
answerArray.push(intStyleSheet);
    

////////////////////////////////////////////
//# of Style Sheets Files Found
  
var numStyleSheet = document.styleSheets.length;

answerArray.push(numStyleSheet);    

////////////////////////////////////////////
//# of External HTTP Requests
    
var httpRequests = window.performance.getEntriesByType("resources").length;

answerArray.push(httpRequests);
    
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

    
////////////////////////////////////////////
//Amount of Empty URLs
var emptyURL = document.querySelectorAll('img[src=""]').length + document.querySelectorAll('script[src=""]').length + document.querySelectorAll('link[rel=stylesheet][href=""]').length + document.querySelectorAll('button[href=""]').length + document.querySelectorAll('a[href=""]').length;
    
answerArray.push(emptyURL);
    
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
    
// Number of Requests Sent

switch (answerArray[11] >= 0){

case answerArray[11] <= 20:
    finalScore += .4;
    break;
case answerArray[11] <= 50:
    finalScore += .3;
    break;
case answerArray[11] <= 75:
    finalScore += .2;
    break;
case answerArray[11] <= 100:
    finalScore += .1;
    break;
case answerArray[11] > 100:
    finalScore += 0;
    break;
}
    
// Number of Redirects

switch (answerArray[12] >= 0){

case answerArray[12] == 0:
    finalScore += .2;
    break;
case answerArray[12] <= 1:
    finalScore += .1;
    break;
case answerArray[12] >= 2:
    finalScore += 0;
    break;
}

 // Amount of Cookies

switch (answerArray[13] >= 0){

case answerArray[13] <=3:
    finalScore += .4;
    break;
case answerArray[13] <= 7:
    finalScore += .3;
    break;
case answerArray[13] <= 10:
    finalScore += .2;
    break;
case answerArray[13] <= 20:
    finalScore += .1;
    break;
case answerArray[13] >= 21:
    finalScore += 0;
    break;
}
        
        
 // Empty SRC Tags

switch (answerArray[14] >= 0){

case answerArray[14] <= 2:
    finalScore += .2;
    break;
case answerArray[14] <= 4:
    finalScore += .1;
    break;
case answerArray[14] >= 5:
    finalScore += 0;
    break;
} 

finalScore = finalScore/14.8;

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
var lazyLoadChart = (answerArray[1]*100).toPrecision(3);
var svgChart = (answerArray[2]*100).toPrecision(3);
var jsChart = answerArray[3];
var htmlChart = answerArray[4];
var loadTimeChart = answerArray[5];
var importChart = answerArray[6];
var transferSizeChart = answerArray[7];
var lengthK = pagebytesLabel;
var resImgChart = (answerArray[8]*100).toPrecision(3);


var counts = {finalGrade, sizeLabel, lazyLoadChart, svgChart, jsChart, htmlChart, loadTimeChart, importChart, decodedBodySizeChart, jssSizeLabel, duration, finalScore, transferSizeChart, lengthK, resImgChart, transferLabel, intStyleSheet, numStyleSheet, httpRequests, cookieLen, emptyURL}

chrome.runtime.sendMessage(counts);
    
}