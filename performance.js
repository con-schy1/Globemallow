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
    
    
//Total Size
/*var imgA = [];
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

answerArray.push(parseFloat(decodedSize));*/
    
  //Updated Script for all
////This function does the Transfer, Total (Page Size) and matching different requests to what they are. Largest Total, Largest Transfer and longest loading

//Transfer Size

var netA = [];
var netB = [];
var netC = [];
var transferSize1 = 0;
var largeTrans = 0;
var largeTransArray = [];
var largeTransSize;
var largeLoadTime;
var largeTotalSize;
var largeTotalSrc;
var arrayLabel = [' bytes','kb','mb','gb'];

var cssTransReq = /(.css)/;
var apiTransReq = /(api?s)/;
var jsTransReq = /(.js)|(.json)/;
var importedFontTransReq = /(@font-face)|(woff?2)|(fonts.googleapis)|(.tff)|(fonts.shopifycdn)|(cloud.typography)/;
var imageTransReq = /(.png)|(.jpeg)|(.gif)|(.jpg)|(.tiff)|(.svg)|(webp)|(avif)|(.ico)/;
var videoTransReq = /(mp4)|(swf)|(f4v)|(flv)/;
//Transfer size of External Style Sheets
var cssTransSize = 0;
var apiTransSize = 0;
var jsTransSize = 0;
var importedFontTransSize = 0;
var imageTransSize = 0;
var videoTransSize = 0;
var otherTransSize = 0;
var cssTransLabel;
var apiTransLabel;
var jsTransLabel;
var requestMatch;
//var v = 0;
var impFontReq = 0;
var cssTotSize = 0;
var apiTotSize = 0;
var jsTotSize = 0;
var importedFontTotSize = 0;
var imageTotSize = 0;
var videoTotSize = 0;
var otherTotSize = 0;

var transferTotal = 0;
var fullTotal = 0;

const transferResources = performance.getEntriesByType('resource');
    
var maxTotal = transferResources[0].decodedBodySize;    
var maxTrans = transferResources[0].transferSize;
var maxDur = transferResources[0].duration;
var maxTotalIndex = 0;
var maxTransIndex = 0;
var maxIndexDur = 0;

for (var i = 0; i < transferResources.length; i++) {
   netA.push(transferResources[i].decodedBodySize);
   netB.push(transferResources[i].transferSize);
   netC.push(transferResources[i].duration);

    transferTotal += parseFloat(transferResources[i].transferSize);

    fullTotal += parseFloat(transferResources[i].decodedBodySize);

    requestMatch = transferResources[i].name; 

    if (requestMatch.match(cssTransReq)){
        //v++;
        cssTransSize += transferResources[i].transferSize;
        cssTotSize += transferResources[i].decodedBodySize;
        console.log('CSS:'+transferResources[i].name);
    }
    else if (requestMatch.match(apiTransReq)){
        apiTransSize += transferResources[i].transferSize;
        apiTotSize += transferResources[i].decodedBodySize;
    }
    else if (requestMatch.match(jsTransReq)){
        jsTransSize += transferResources[i].transferSize;
        jsTotSize += transferResources[i].decodedBodySize;
    }
    else if (requestMatch.match(importedFontTransReq)){
        importedFontTransSize += transferResources[i].transferSize;
        importedFontTotSize += transferResources[i].decodedBodySize;
        console.log(transferResources[i].name);
    }
    else if (requestMatch.match(imageTransReq)){
        imageTransSize += transferResources[i].transferSize;
        imageTotSize += transferResources[i].decodedBodySize;
    }
    else if (requestMatch.match(videoTransReq)){
        videoTransSize += transferResources[i].transferSize;
        videoTotSize += transferResources[i].decodedBodySize;
    }
    else{
        otherTransSize += transferResources[i].transferSize;
        otherTotSize += transferResources[i].decodedBodySize;
    }
    
    //just do the import fonts script in here if it matches the regex it is true, and then if it's false just run the script to look in the header. Saving time. 

   }


largeTotalSize = transferResources[maxTotalIndex].decodedBodySize;
largeTotalSrc = transferResources[maxTotalIndex].name;
largeTransSize = transferResources[maxTransIndex].transferSize;
largeLoadTime = transferResources[maxIndexDur].duration;
    
largeLoadTime = largeLoadTime.toFixed(2);
    
//Put this in the above for loop to get the totals.    
for (let i in netB){
   transferSize1 += netB[i];
   }
transferSize1 = parseFloat(transferSize1);


//Ascending Order Arrays of largest to smallest

netA.sort(function(a, b){return b - a});
netB.sort(function(a, b){return b - a});
netC.sort(function(a, b){return b - a});

console.log('NetA: '+netA);
console.log('NetB: '+netB);
console.log('NetC: '+netC);

var largeTotalOneThree = [];
var num1TotSize;
var num2TotSize;
var num3TotSize;
var num1TotName;
var num2TotName;
var num3TotName;

var num1TransSize  = 0;
var num2TransSize  = 0;
var num3TransSize  = 0;
var num1TransName;
var num2TransName;
var num3TransName;

var num1LoadLength  = 0;
var num2LoadLength  = 0;
var num3LoadLength  = 0;
var num1LoadName;
var num2LoadName;
var num3LoadName;


//Find the Total Largest Loading Request and match them

for (var i = 0; i < transferResources.length; i++) {

    if (netA[0] == transferResources[i].decodedBodySize){
        //largeTotalOneThree.splice(0, 0, transferResources[i].name);
        //largeTotalOneThree.splice(1, 0, transferResources[i].decodedBodySize);
        num1TotSize = transferResources[i].decodedBodySize;
        num1TotName = transferResources[i].name;
    }
    else if (netA[1] == transferResources[i].decodedBodySize){
        //largeTotalOneThree.splice(2, 0, transferResources[i].name);
        //largeTotalOneThree.splice(3, 0, transferResources[i].decodedBodySize);
        num2TotSize = transferResources[i].decodedBodySize;
        num2TotName = transferResources[i].name;
    }
    else if (netA[2] == transferResources[i].decodedBodySize){
        //largeTotalOneThree.splice(4, 0, transferResources[i].name);
        //largeTotalOneThree.splice(5, 0, transferResources[i].decodedBodySize);
        num3TotSize = transferResources[i].decodedBodySize;
        num3TotName = transferResources[i].name;
    }
}


//Find the Transfered Largest Loading Request and match them. If 0, skip because everything is cached.

if (transferTotal > 0){

for (var i = 0; i < transferResources.length; i++) {

    if (netB[0] == transferResources[i].transferSize){
        num1TransSize = transferResources[i].transferSize;
        num1TransName = transferResources[i].name;
    }
    else if (netB[1] == transferResources[i].transferSize){
        num2TransSize = transferResources[i].transferSize;
        num2TransName = transferResources[i].name;
    }
    else if (netB[2] == transferResources[i].transferSize){
        num3TransSize = transferResources[i].transferSize;
        num3TransName = transferResources[i].name;
    }
}
}
else{

    num1TransName = 'All cached';
    num2TransName = 'All cached';
    num3TransName = 'All cached';

}


//Find the Longest Loading Requests and match them

for (var i = 0; i < transferResources.length; i++) {

    if (netC[0] == transferResources[i].duration){
        num1LoadLength = transferResources[i].duration;
        num1LoadName = transferResources[i].name;
    }
    else if (netC[1] == transferResources[i].duration){
        num2LoadLength = transferResources[i].duration;
        num2LoadName = transferResources[i].name;
    }
    else if (netC[2] == transferResources[i].duration){
        num3LoadLength = transferResources[i].duration;
        num3LoadName = transferResources[i].name;
    }
}

var num1LoadLab;
var num2LoadLab;
var num3LoadLab;

if (num1LoadLength/1000 >= 1){
   num1LoadLab = (num1LoadLength/1000).toFixed(2).toString() + " secs"; 
}
    else{
       num1LoadLab = num1LoadLength.toFixed(2).toString() + " ms"; 
    }

if (num2LoadLength/1000 >= 1){
   num2LoadLab = (num2LoadLength/1000).toFixed(2).toString() + " secs"; 
}
    else{
       num2LoadLab = num2LoadLength.toFixed(2).toString() + " ms"; 
    }

if (num3LoadLength/1000 >= 1){
   num3LoadLab = (num3LoadLength/1000).toFixed(2).toString() + " secs"; 
}
    else{
       num3LoadLab = num3LoadLength.toFixed(2).toString() + " ms"; 
    }



//////////////////////////////////////////////////////////////////////
//Total Page Size Labeling


var transferLabel;
    
 if (transferTotal/1024/1024/1024 > 1){
 transferLabel = (((transferTotal/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (transferTotal/1024/1024 > 1){
 transferLabel = (((transferTotal/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (transferTotal/1024 > 1){
 transferLabel = (((transferTotal/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (transferTotal > 1){
 transferLabel = (((transferTotal).toFixed(2)).toString() + arrayLabel[0]);
 }
   else{
     transferLabel = (transferTotal).toString() + arrayLabel[0];
 }



//////////////////////////////////////////////////////////////////////
//Total Transfer Size Labeling


 if (fullTotal/1024/1024/1024 > 1){
 sizeLabel = (((fullTotal/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (fullTotal/1024/1024 > 1){
 sizeLabel = (((fullTotal/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (fullTotal/1024 > 1){
 sizeLabel = (((fullTotal/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (fullTotal > 1){
 sizeLabel = (((fullTotal).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     sizeLabel = (fullTotal).toString() + arrayLabel[0];
 }



//////////////////////////////////////////////////////////////////////
//Total top 3 request Labeling

var num1TotSizeLab;
var num2TotSizeLab;
var num3TotSizeLab;

 if (num1TotSize/1024/1024/1024 > 1){
 num1TotSizeLab = (((num1TotSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (num1TotSize/1024/1024 > 1){
 num1TotSizeLab = (((num1TotSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (num1TotSize/1024 > 1){
 num1TotSizeLab = (((num1TotSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (num1TotSize > 1){
 num1TotSizeLab = (((num1TotSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     num1TotSizeLab = (num1TotSize).toString() + arrayLabel[0];
 }

if (num2TotSize/1024/1024/1024 > 1){
 num2TotSizeLab = (((num2TotSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (num2TotSize/1024/1024 > 1){
 num2TotSizeLab = (((num2TotSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (num2TotSize/1024 > 1){
 num2TotSizeLab = (((num2TotSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (num2TotSize > 1){
 num2TotSizeLab = (((num2TotSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     num2TotSizeLab = (num2TotSize).toString() + arrayLabel[0];
 }

if (num3TotSize/1024/1024/1024 > 1){
 num3TotSizeLab = (((num3TotSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (num3TotSize/1024/1024 > 1){
 num3TotSizeLab = (((num3TotSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (num3TotSize/1024 > 1){
 num3TotSizeLab = (((num3TotSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (num3TotSize > 1){
 num3TotSizeLab = (((num3TotSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     num3TotSizeLab = (num3TotSize).toString() + arrayLabel[0];
 }

//////////////////////////////////////////////////////////////////////
//Transfer top 3 request Labeling

var num1TransSizeLab;
var num2TransSizeLab;
var num3TransSizeLab;

if (transferTotal > 0){

 if (num1TransSize/1024/1024/1024 > 1){
 num1TransSizeLab = (((num1TransSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (num1TransSize/1024/1024 > 1){
 num1TransSizeLab = (((num1TransSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (num1TransSize/1024 > 1){
 num1TransSizeLab = (((num1TransSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (num1TransSize > 1){
 num1TransSizeLab = (((num1TransSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     num1TransSizeLab = (num1TransSize).toString() + arrayLabel[0];
 }

if (num2TransSize/1024/1024/1024 > 1){
 num2TransSizeLab = (((num2TransSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (num2TransSize/1024/1024 > 1){
 num2TransSizeLab = (((num2TransSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (num2TransSize/1024 > 1){
 num2TransSizeLab = (((num2TransSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (num2TransSize > 1){
 num2TransSizeLab = (((num2TransSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     num2TransSizeLab = (num2TransSize).toString() + arrayLabel[0];
 }

if (num3TransSize/1024/1024/1024 > 1){
 num3TransSizeLab = (((num3TransSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (num3TransSize/1024/1024 > 1){
 num3TransSizeLab = (((num3TransSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (num3TransSize/1024 > 1){
 num3TransSizeLab = (((num3TransSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (num3TransSize > 1){
 num3TransSizeLab = (((num3TransSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     num3TransSizeLab = (num3TransSize).toString() + arrayLabel[0];
 }

}

else{

    num1TransSizeLab = 'Cached';
    num2TransSizeLab = 'Cached';
    num3TransSizeLab = 'Cached';

}


//////////////////////////////////////////////////////////////////////
//CSS Transfer Labeling

var CSSSizeLab;

 if (cssTransSize/1024/1024/1024 > 1){
 CSSSizeLab = (((cssTransSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (cssTransSize/1024/1024 > 1){
 CSSSizeLab = (((cssTransSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (cssTransSize/1024 > 1){
 CSSSizeLab = (((cssTransSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (cssTransSize > 1){
 CSSSizeLab = (((cssTransSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     CSSSizeLab = (cssTransSize).toString() + arrayLabel[0];
 }

//////////////////////////////////////////////////////////////////////
//API Transfer Labeling

var APISizeLab;

 if (apiTransSize/1024/1024/1024 > 1){
 APISizeLab = (((apiTransSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (apiTransSize/1024/1024 > 1){
 APISizeLab = (((apiTransSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (apiTransSize/1024 > 1){
 APISizeLab = (((apiTransSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (apiTransSize > 1){
 APISizeLab = (((apiTransSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     APISizeLab = (apiTransSize).toString() + arrayLabel[0];
 }


//////////////////////////////////////////////////////////////////////
//JS Transfer Labeling

var jsSizeLab;

 if (jsTransSize/1024/1024/1024 > 1){
 jsSizeLab = (((jsTransSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (jsTransSize/1024/1024 > 1){
 jsSizeLab = (((jsTransSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (jsTransSize/1024 > 1){
 jsSizeLab = (((jsTransSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (jsTransSize > 1){
 jsSizeLab = (((jsTransSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     jsSizeLab = (jsTransSize).toString() + arrayLabel[0];
 }

//////////////////////////////////////////////////////////////////////
//imported Font Transfer Labeling

var importedFontSizeLab;

 if (importedFontTransSize/1024/1024/1024 > 1){
 importedFontSizeLab = (((importedFontTransSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (importedFontTransSize/1024/1024 > 1){
 importedFontSizeLab = (((importedFontTransSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (importedFontTransSize/1024 > 1){
 importedFontSizeLab = (((importedFontTransSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (importedFontTransSize > 1){
 importedFontSizeLab = (((importedFontTransSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     importedFontSizeLab = (importedFontTransSize).toString() + arrayLabel[0];
 }


//////////////////////////////////////////////////////////////////////
//Image Transfer Labeling

var imgTransSizeLab;

 if (imageTransSize/1024/1024/1024 > 1){
 imgTransSizeLab = (((imageTransSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (imageTransSize/1024/1024 > 1){
 imgTransSizeLab = (((imageTransSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (imageTransSize/1024 > 1){
 imgTransSizeLab = (((imageTransSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (imageTransSize > 1){
 imgTransSizeLab = (((imageTransSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     imgTransSizeLab = (imageTransSize).toString() + arrayLabel[0];
 }


//////////////////////////////////////////////////////////////////////
//Video Transfer Labeling

var videoTransSizeLab;

 if (videoTransSize/1024/1024/1024 > 1){
 videoTransSizeLab = (((videoTransSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (videoTransSize/1024/1024 > 1){
 videoTransSizeLab = (((videoTransSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (videoTransSize/1024 > 1){
 videoTransSizeLab = (((videoTransSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (videoTransSize > 1){
 videoTransSizeLab = (((videoTransSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     videoTransSizeLab = (videoTransSize).toString() + arrayLabel[0];
 }

//////////////////////////////////////////////////////////////////////
//Other Transfer Labeling

var otherTransSizeLab;

 if (otherTransSize/1024/1024/1024 > 1){
 otherTransSizeLab = (((otherTransSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (otherTransSize/1024/1024 > 1){
 otherTransSizeLab = (((otherTransSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (otherTransSize/1024 > 1){
 otherTransSizeLab = (((otherTransSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (otherTransSize > 1){
 otherTransSizeLab = (((otherTransSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     otherTransSizeLab = (otherTransSize).toString() + arrayLabel[0];
 }

//////////////////////////////////////////////////////////////////////
//CSS Total Labeling

var cssTotLab;

 if (cssTotSize/1024/1024/1024 > 1){
 cssTotLab = (((cssTotSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (cssTotSize/1024/1024 > 1){
 cssTotLab = (((cssTotSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (cssTotSize/1024 > 1){
 cssTotLab = (((cssTotSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (cssTotSize > 1){
 cssTotLab = (((cssTotSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     cssTotLab = (cssTotSize).toString() + arrayLabel[0];
 }

//////////////////////////////////////////////////////////////////////
//API Total Labeling

var apiTotLab;

 if (apiTotSize/1024/1024/1024 > 1){
 apiTotLab = (((apiTotSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (apiTotSize/1024/1024 > 1){
 apiTotLab = (((apiTotSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (apiTotSize/1024 > 1){
 apiTotLab = (((apiTotSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (apiTotSize > 1){
 apiTotLab = (((apiTotSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     apiTotLab = (apiTotSize).toString() + arrayLabel[0];
 }


//////////////////////////////////////////////////////////////////////
//JS Total Labeling

var jsTotLab;

 if (jsTotSize/1024/1024/1024 > 1){
 jsTotLab = (((jsTotSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (jsTotSize/1024/1024 > 1){
 jsTotLab = (((jsTotSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (jsTotSize/1024 > 1){
 jsTotLab = (((jsTotSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (jsTotSize > 1){
 jsTotLab = (((jsTotSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     jsTotLab = (jsTotSize).toString() + arrayLabel[0];
 }

//////////////////////////////////////////////////////////////////////
//Import Font Total Labeling

var impFontLab;

 if (importedFontTotSize/1024/1024/1024 > 1){
 impFontLab = (((importedFontTotSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (importedFontTotSize/1024/1024 > 1){
 impFontLab = (((importedFontTotSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (importedFontTotSize/1024 > 1){
 impFontLab = (((importedFontTotSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (importedFontTotSize > 1){
 impFontLab = (((importedFontTotSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     impFontLab = (importedFontTotSize).toString() + arrayLabel[0];
 }

//////////////////////////////////////////////////////////////////////
//Image Total Labeling

var imageLab;

 if (imageTotSize/1024/1024/1024 > 1){
 imageLab = (((imageTotSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (imageTotSize/1024/1024 > 1){
 imageLab = (((imageTotSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (imageTotSize/1024 > 1){
 imageLab = (((imageTotSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (imageTotSize > 1){
 imageLab = (((imageTotSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     imageLab = (imageTotSize).toString() + arrayLabel[0];
 }

//////////////////////////////////////////////////////////////////////
//Video Total Labeling

var videoLab;

 if (videoTotSize/1024/1024/1024 > 1){
 videoLab = (((videoTotSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (videoTotSize/1024/1024 > 1){
 videoLab = (((videoTotSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (videoTotSize/1024 > 1){
 videoLab = (((videoTotSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (videoTotSize > 1){
 videoLab = (((videoTotSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     videoLab = (videoTotSize).toString() + arrayLabel[0];
 }

//////////////////////////////////////////////////////////////////////
//Other Total Labeling

var otherLab;

 if (otherTotSize/1024/1024/1024 > 1){
 otherLab = (((otherTotSize/1024/1024/1024).toFixed(2)).toString() + arrayLabel[3]);
 } else if (otherTotSize/1024/1024 > 1){
 otherLab = (((otherTotSize/1024/1024).toFixed(2)).toString() + arrayLabel[2]);
 } else if (otherTotSize/1024 > 1){
 otherLab = (((otherTotSize/1024).toFixed(2)).toString() + arrayLabel[1]);
 } else if (otherTotSize > 1){
 otherLab = (((otherTotSize).toFixed(2)).toString() + arrayLabel[0]);
 }
 else{
     otherLab = (otherTotSize).toString() + arrayLabel[0];
 }


console.log(num1TotName+' '+num1TotSize+' '+num1TotSizeLab);
console.log(num2TotName+' '+num2TotSize+' '+num2TotSizeLab);
console.log(num3TotName+' '+num3TotSize+' '+num3TotSizeLab);


console.log('transferTotal '+transferTotal+' '+transferLabel);

console.log('fullTotal '+fullTotal+' '+sizeLabel);

console.log(num1TransName+' '+num1TransSize+' '+num1TransSizeLab);
console.log(num2TransName+' '+num2TransSize+' '+num2TransSizeLab);
console.log(num3TransName+' '+num3TransSize+' '+num3TransSizeLab);

console.log(num1LoadName+' '+num1LoadLength+' '+num1LoadLab);
console.log(num2LoadName+' '+num2LoadLength+' '+num2LoadLab);
console.log(num3LoadName+' '+num3LoadLength+' '+num3LoadLab);

console.log('CSS Trans: '+cssTransSize+' '+CSSSizeLab);
console.log('API Trans: '+apiTransSize+' '+APISizeLab);
console.log('JS Trans: '+jsTransSize+' '+jsSizeLab);
console.log('Imported Font Trans: '+importedFontTransSize+' '+importedFontSizeLab);
console.log('Image Trans: '+imageTransSize+' '+imgTransSizeLab);
console.log('Video Trans: '+videoTransSize+' '+videoTransSizeLab);
console.log('Other Trans: '+otherTransSize+' '+otherTransSizeLab);

console.log('CSS Tot: '+cssTotSize+' '+cssTotLab);
console.log('API Tot: '+apiTotSize+' '+apiTotLab);
console.log('JS Tot: '+jsTotSize+' '+jsTotLab);
console.log('Imported Font Tot: '+importedFontTotSize+' '+impFontLab);
console.log('Image Tot: '+imageTotSize+' '+imageLab);
console.log('Video Tot: '+videoTotSize+' '+videoLab);
console.log('Other Tot: '+otherTotSize+' '+otherLab);
    
    
    
////////////////////////////////////////////////////

/////////////////////////////////////////////////////
// Images that are lazy loaded

var xArray = [];
var imgNotLLArray = [];
var imgCount = document.getElementsByTagName("img");
let x1 = document.querySelector('html').outerHTML;
var regEX = /(loading="lazy")|(class="lozad")|(class="b-lazy")|(class="lazyloaded)|(class="lazy")/;
var result = "";
    
var lazyLoadVal = 0;

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
lazyLoadVal = ratioLL;
}
else{
lazyLoadVal = 1.1;
}

//Gets the images and puts them in report. uncomment out else statement above
/*var joinLLString = imgNotLLArray.join(",");
console.log(joinLLString);*/
    
////////////////////////////////////////////////////

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
    
var susFormatVal = 0;

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
susFormatVal = ratioSVG;
}
else{
susFormatVal = 1.1;
}
    
////////////////////////////////////////////////////
    
/////////////////////////////////////////////////////
//JS HeapSize

var JSHeapSize = window.performance.memory.usedJSHeapSize;


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
//answerArray.push(pagebytes);
    
////////////////////////////////////////////////////

////////////////////////////////////////////////////
//Page Load time

var timing = window.performance.getEntriesByType('navigation')[0];
    
var duration = (timing.loadEventStart / 1000).toPrecision(2);

duration = parseFloat(duration);

//answerArray.push(duration);


////////////////////////////////////////////////////

////////////////////////////////////////////////////

//Imported Fonts
var headText = document.head.innerHTML;
var fontRegex = /(@font-face)|(woff?2)|(fonts.googleapis)|(.tff)|(fonts.shopifycdn)|(cloud.typography)|(otf)|(eot)/;
var fontBoolean = 0;

if (headText.match(fontRegex)){
fontBoolean = 1;
//answerArray.push(fontBoolean);
}
else{
fontBoolean = 0;
//answerArray.push(fontBoolean);
}



////////////////////////////////////////////////////

////////////////////////////////////////////////////
    
//Transfer Size
/*    
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

console.log(transferResources);
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
var resImgArray = [];

if (picTagCount > 0){
ratio1 = picTagCount/img1Count.length;
//answerArray.push(ratio1);
resImgArray.push(ratio1);

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
//answerArray.push(ratioSS);
resImgArray.push(ratioSS);

}
else{
imgNotRes.push(img1Count);
//answerArray.push(1.1);
    resImgArray.push(1.1);
}   

////////////////////////////////////////////////////

////////////////////////////////////////////
//Internal Stylesheets
    
var intStyleSheet = document.getElementsByTagName('style').length;
    
    
////////////////////////////////////////////////////

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

//answerArray.push(numStyleSheet); 

////////////////////////////////////////////////////
   
////////////////////////////////////////////
//Site Redirects
    
var redirects = window.performance.navigation.redirectCount;

//answerArray.push(redirects);
    
////////////////////////////////////////////////////
   
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
//answerArray.push(cookieLen);
    
var cookiesList = document.cookie;

//console.log(cookiesList);
    
    
////////////////////////////////////////////////////
   
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

    
//answerArray.push(emptyURL);
 

    
    
////////////////////////////////////////
    
////////////////////////////////////////
//Cached
    
try{
var answerArray = [];
    
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
    
/*var cssTransReq = /(.css)/;
var apiTransReq = /(api?s)/;
var jsTransReq = /(.js)/;
var importedFontTransReq = /(@font-face)|(woff?2)|(fonts.googleapis)|(.tff)|(fonts.shopifycdn)|(cloud.typography)/;
var imageTransReq = /(.png)|(.jpeg)|(.gif)|(.jpg)|(.tiff)|(.svg)|(webp)|(avif)|(.ico)/;
var imgFormatType = 0;
    
   */ 
//Transfer size of External Style Sheets
/*
var cssTransSize = 0;
var apiTransSize = 0;
var jsTransSize = 0;
var cssTransLabel;
var apiTransLabel;
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
    else if (cssHREF.match(apiTransReq)){
        apiTransSize += transferResources[i].transferSize;
    }
    else if (cssHREF.match(jsTransSize)){
        jsTransSize += transferResources[i].transferSize;
    }
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
*/


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
switch (fullTotal >= 0){
        
case fullTotal <= 150000:
    finalScore += 3;
    sizeWeight = 3;
    break;
case fullTotal <= 500000:
    finalScore += 2.9;
    sizeWeight = 2.9;
    break;
case fullTotal <= 650000:
    finalScore += 2.8;
    sizeWeight = 2.8;
    break;
case fullTotal <= 850000:
    finalScore += 2.7;
    sizeWeight = 2.7;
    break;
case fullTotal <= 1076398:
    finalScore += 2.6;
    sizeWeight = 2.6;
    lowRec.push(300);
    break;
case fullTotal <= 1376398:
    finalScore += 2.5;
    sizeWeight = 2.5;
    lowRec.push(300);
    break;
case fullTotal <= 1572864:
    finalScore += 2.4;
    sizeWeight = 2.4;
    medRec.push(200);
    break;
case fullTotal <= 1750000:
    finalScore += 2.3;
    sizeWeight = 2.3;
    medRec.push(200);
    break;
case fullTotal <= 2000000:
    finalScore += 2.2;
    sizeWeight = 2.2;
    medRec.push(200);
    break;
case fullTotal <= 2300000:
    finalScore += 2.1;
    sizeWeight = 2.1;
    medRec.push(200);
    break;
case fullTotal > 2600000:
    finalScore += 2;
    sizeWeight = 2;
    medRec.push(200);
    break;
case fullTotal <= 3200000:
    finalScore += 1.9;
    sizeWeight = 1.9;
    medRec.push(200);
    break;
case fullTotal <= 3800000:
    finalScore += 1.8;
    sizeWeight = 1.8;
    medRec.push(200);
    break;
case fullTotal <= 4400000:
    finalScore += 1.7;
    sizeWeight = 1.7;
    highRec.push(100);
    break;
case fullTotal <= 5000000:
    finalScore += 1.6;
    sizeWeight = 1.6;
    highRec.push(100);
    break;
case fullTotal <= 5600000:
    finalScore += 1.5;
    sizeWeight = 1.5;
    highRec.push(100);
    break;
case fullTotal <= 6200000:
    finalScore += 1.4;
    sizeWeight = 1.4;
    highRec.push(100);
    break;
case fullTotal > 6800000:
    finalScore += 1.3;
    sizeWeight = 1.3;
    highRec.push(100);
    break;
case fullTotal <= 7400000:
    finalScore += 1.2;
    sizeWeight = 1.2;
    highRec.push(100);
    break;
case fullTotal <= 8000000:
    finalScore += 1.1;
    sizeWeight = 1.1;
    highRec.push(100);
    break;
case fullTotal > 8000001:
    finalScore += 1;
    sizeWeight = 1;
    highRec.push(100);
    break;

}



//Lazy Loaded Image
var LazyLoadWeight = 0;
switch (lazyLoadVal >= 0){

    case lazyLoadVal >= .65:
        finalScore += .4;
        LazyLoadWeight = .4;
        break;
    case lazyLoadVal >= .40:
        finalScore += .3;
        LazyLoadWeight = .3;
        lowRec.push(301);
        break;
   case lazyLoadVal >= .25:
        finalScore += .2;
        LazyLoadWeight = .2;
        medRec.push(201);
        break;
   case lazyLoadVal > 0:
        finalScore += .1;
        LazyLoadWeight = .1;
        medRec.push(201);
        break;
   case lazyLoadVal == 0:
        finalScore += 0;
        highRec.push(101);
        break;

}

//Ratio of SVG Images
var imgTypeWeight = 0;
switch (susFormatVal >= 0){

    case susFormatVal >= .7:
        finalScore += .4;
        imgTypeWeight = .4;
        break;
    case susFormatVal >= .5:
        finalScore += .3;
        imgTypeWeight = .3;
        lowRec.push(302);
        break;
   case susFormatVal >= .25:
        finalScore += .2;
        imgTypeWeight = .2;
        medRec.push(202);
        break;
   case susFormatVal > 0:
        finalScore += .1;
        imgTypeWeight = .1;
        medRec.push(202);
        break;
   case susFormatVal == 0:
        finalScore += 0;
        highRec.push(102);
        break;

}

//JS Heapsize
var jsWeight = 0;
switch (JSHeapSize >= 0){

    case JSHeapSize <= 10000000:
        finalScore += 2;
        jsWeight = 2;
        break;
    case JSHeapSize <= 15000000:
        finalScore += 1.75;
        jsWeight = 1.75;
        lowRec.push(303);
        break;
    case JSHeapSize <= 20000000:
        finalScore += 1.5;
        jsWeight = 1.5;
        lowRec.push(303);
        break;
   case JSHeapSize <= 25000000:
        finalScore += 1;
        jsWeight = 1;
        medRec.push(203);
        break;
    case JSHeapSize <= 30000000:
        finalScore += .75;
        jsWeight = .75;
        medRec.push(203);
        break;
   case JSHeapSize <= 40000000:
        finalScore += .5;
        jsWeight = .5;
        highRec.push(103);
        break;
   case JSHeapSize > 40000000:
        finalScore += .25;
        jsWeight = .25;
        highRec.push(103);
        break;

}

//HTML Length of Page
var lengthWeight = 0;
switch (pagebytes >= 0){

    case pagebytes <= 250000:
        finalScore += 1;
        lengthWeight = 1;
        break;
    case pagebytes <= 350000:
        finalScore += .85;
        lengthWeight = .85;
        lowRec.push(304);
        break;
    case pagebytes <= 500000:
        finalScore += .75;
        lengthWeight = .75;
        lowRec.push(304);
        break;
    case pagebytes <= 750000:
        finalScore += .65;
        lengthWeight = .65;
        medRec.push(204);
        break;
   case pagebytes <= 1000000:
        finalScore += .5;
        lengthWeight = .5;
        medRec.push(204);
        break;
   case pagebytes <= 4000000:
        finalScore += .25;
        lengthWeight = .25;
        highRec.push(104);
        break;
   case pagebytes > 4000000:
        finalScore += .1;
        lengthWeight = .1;
        highRec.push(104);
        break;

}

//Page Loadtime
var timeWeight = 0;
switch (duration >= 0){

    case duration <= 2:
        finalScore += 2;
        timeWeight = 2;
        break;
    case duration <= 3.5:
        finalScore += 1.75;
        timeWeight = 1.75;
        lowRec.push(305);
        break;
    case duration <= 5:
        finalScore += 1.5;
        timeWeight = 1.5;
        medRec.push(205);
        break;
   case duration <= 6:
        finalScore += 1;
        timeWeight = 1;
        medRec.push(205);
        break;
   case duration <= 8:
        finalScore += .75;
        timeWeight = .75;
        highRec.push(105);
        break;
   case duration > 8:
        finalScore += .5;
        timeWeight = .5;
        highRec.push(105);
        break;

}

//Imported Fonts
var fontWeight = 0;
switch (fontBoolean >= 0){

    case fontBoolean == 0:
        finalScore += .4;
        fontWeight = .4;
        break;
    case fontBoolean == 1:
        finalScore += .1;
        fontWeight = .1;
        medRec.push(206);
        break;

}
    
  
// Transfer Size
var transWeight = 0;
switch (transferTotal >= 0){

case transferTotal <= 150000:
    finalScore += 4;
    transWeight = 4;
    break;
case transferTotal <= 600000:
    finalScore += 3.75;
    transWeight = 3.75;
    break;
case transferTotal <= 850000:
    finalScore += 3.5;
    transWeight = 3.5;
    lowRec.push(307);
    break;
case transferTotal <= 1048576:
    finalScore += 3.25;
    transWeight = 3.25;
    lowRec.push(307);
    break;
case transferTotal <= 1572864:
    finalScore += 3;
    transWeight = 3;
    medRec.push(207);
    break;
case transferTotal <= 2621440:
    finalScore += 2.75;
    transWeight = 2.75;
    medRec.push(207);
    break;
case transferTotal <= 3670016:
    finalScore += 2.5;
    transWeight = 2.5;
    highRec.push(107);
    break;
case transferTotal <= 5242880:
    finalScore += 2.25;
    transWeight = 2.25;
    highRec.push(107);
    break;
case transferTotal > 5242880:
    finalScore += 2;
    transWeight = 2;
    highRec.push(107);
    break;

}
    
// Responsive Images
var resWeight = 0;
switch (resImgArray[0] >= 0){

case resImgArray[0] >= .7:
    finalScore += .4;
    resWeight = .4;
    break;
case resImgArray[0] >= .5:
    finalScore += .35;
    resWeight = .35;
    lowRec.push(308);
    break;
case resImgArray[0] >= .3:
    finalScore += .3;
    resWeight = .3;
    lowRec.push(308);
    break;
case resImgArray[0] > 0:
    finalScore += .25;
    resWeight = .25;
    medRec.push(208);
    break;
case resImgArray[0] == 0:
    finalScore += .2;
    resWeight = .2;
    highRec.push(108);
    break;
}
    
// Internal Stylesheets
var intSSWeight = 0;
switch (intStyleSheet >= 0){

case intStyleSheet <= 2:
    finalScore += .2;
    intSSWeight = .2;
    break;
case intStyleSheet <= 5:
    finalScore += .1;
    intSSWeight = .1;
    lowRec.push(309);
    break;
case intStyleSheet >= 5:
    finalScore += 0;
    medRec.push(209);
    break;
}
    
// Number of Stylesheet Files
var ssFileWeight = 0;
switch (numStyleSheet >= 0){
        
case cssTransLabel === 'All style sheets cached!':
    finalScore += .2;
    ssFileWeight = .2;
    break;
case numStyleSheet <= 2:
    finalScore += .2;
    ssFileWeight = .2;
    break;
case numStyleSheet <= 5:
    finalScore += .15;
    ssFileWeight = .15;
    lowRec.push(310);
    break;
case numStyleSheet >= 5:
    finalScore += .5;
    medRec.push(210);
    break;
}
    
// Number of Redirects
var redirectWeight = 0;
switch (redirects >= 0){

case redirects == 0:
    finalScore += .1;
    redirectWeight = .1;
    break;
case redirects <= 1:
    finalScore += 0;
    lowRec.push(311);
    break;
}

 // Amount of Cookies
var cookieWeight = 0;
switch (cookieLen >= 0){

case cookieLen <=3:
    finalScore += .4;
    cookieWeight = .4;
    break;
case cookieLen <= 7:
    finalScore += .3;
    cookieWeight = .3;
    lowRec.push(312);
    break;
case cookieLen <= 10:
    finalScore += .2;
    cookieWeight = .2;
    medRec.push(212);
    break;
case cookieLen <= 15:
    finalScore += .1;
    cookieWeight = .1;
    medRec.push(212);
    break;
case cookieLen >= 16:
    finalScore += 0;
    highRec.push(112);
    break;
}
        
    
 // Empty SRC Tags
var emptySRCWeight = 0;
switch (emptyURL >= 0){

case emptyURL <= 2:
    finalScore += .2;
    emptySRCWeight = .2;
    break;
case emptyURL <= 4:
    finalScore += .1;
    emptySRCWeight = .1;
    lowRec.push(313);
    break;
case emptyURL >= 5:
    finalScore += 0;
    medRec.push(213);
    break;
}
    
    
 // Cache Max Age
var cacheWeight = 0;

switch (true){

case answerArray[0] >= 31536000:
    finalScore += .4;
    cacheWeight = .4;
    break;
case answerArray[0] >= 86400:
    finalScore += .35;
    cacheWeight = .35;
    break;
case answerArray[0] >= 3600:
    finalScore += .3;
    cacheWeight += .3;
    lowRec.push(314);
    break;
case answerArray[0] >= 600:
    finalScore += .25;
    cacheWeight += .25;
    medRec.push(214);
    break;
case answerArray[0] >= 0:
    finalScore += .2;
    cacheWeight += .2;
    highRec.push(114);
    break;
case answerArray[0] == .5:
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

var decodedBodySizeChart = fullTotal;
var lazyLoadChart = (lazyLoadVal*100);
var svgChart = (susFormatVal*100);
var jsChart = JSHeapSize;
var htmlChart = pagebytes;
var loadTimeChart = duration;
var importChart = fontBoolean;
var transferSizeChart = transferTotal;
var lengthK = pagebytesLabel;
var resImgChart = (resImgArray[0]*100);
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
    
if (lazyLoadVal === 1.1){
    imgNotLLArray.push("Less than 6 images on page.");
    }
    else if(imgNotLLArray.length === 0){
    imgNotLLArray.push("0 Found");
    }
if (susFormatVal === 1.1){
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
    if (num1TransName.match(cssTransReq)){
        transFuncVar = 'Your largest Trans Size is a stylesheet.<br><br>';
    }
        else if(num1TransName.match(apiTransReq)){
        transFuncVar ='Your largest Trans Size is an api request.<br><br>';
    }
        else if(num1TransName.match(jsTransReq)){
        transFuncVar ='Your largest Trans Size is a javascript file.<br><br>';
    }
        else if(num1TransName.match(importedFontTransReq)){
        transFuncVar ='Your largest Trans Size is an imported font file. All together, imported fonts required '+imFontLabel+' in transfered data.<br><br>';
    }
        else if(num1TransName.match(imageTransReq)){
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
    if (num1LoadName.match(cssTransReq)){
        loadFuncVar = 'Your longest loading request is an external stylesheet.<br><br>';
    }
        else if(num1LoadName.match(apiTransReq)){
        loadFuncVar ='Your longest loading request is an api request.<br><br>';
    }
        else if(num1LoadName.match(jsTransReq)){
        loadFuncVar ='Your longest loading request is a javascript file.<br><br>';
    }
        else if(num1LoadName.match(importedFontTransReq)){
        loadFuncVar ='Your longest loading request is an imported font file. In total, Imported Fonts required ' +impFontReq +' seperate requests. <br><br>';
    }
        else if(num1LoadName.match(imageTransReq)){
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
 
//Placeholders just for testing
var cssTransLabel = 1;
    
    
console.log(num1LoadName+' '+num1LoadLength+' '+num1LoadLab);
console.log(num2LoadName+' '+num2LoadLength+' '+num2LoadLab);
console.log(num3LoadName+' '+num3LoadLength+' '+num3LoadLab);

    
//performance.getEntries(); For Web Vitals 
    
var counts = {finalGrade, sizeLabel, lazyLoadChart, svgChart, jsChart, htmlChart, loadTimeChart, importChart, decodedBodySizeChart, jssSizeLabel, duration, finalScore, transferSizeChart, lengthK, resImgChart, transferLabel, intStyleSheet, numStyleSheet, cookieLen, emptyURL, cookiesList, styleSheetSources, emptySRCVal, LazyLoadMax, emptySrcMax, cookieMax, redirectMax, ssFileMax, intSSMax, resMax, transMax, fontMax, timeMax, lengthMax, imgTypeMax, jsMax, sizeMax, cacheMax, cacheChart, cacheSeconds, cacheMinutes, cacheHours, cacheDays, colorScore, backGroundColor, colorMax, storedAt, hostURL, Sustainability, Score, imgNotLLArray, emptySRCArray, imgNotGoodFormat, imgNotRes, highRec1, medRec1, lowRec1, cssTransLabel, num1TransSizeLab, num2TransSizeLab, num3TransSizeLab, num1TransName, num2TransName, num3TransName, CSSSizeLab, jsSizeLab, importedFontSizeLab, imgTransSizeLab, otherTransSizeLab, num1LoadName, num2LoadName, num3LoadName, num1LoadLab, num2LoadLab, num3LoadLab}

chrome.runtime.sendMessage(counts);
    
}