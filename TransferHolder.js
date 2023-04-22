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



//Updated Script for all
//Largest Total, Largest Transfer and longest loading

//Transfer Size

var netA = [];
var netB = [];
var netC = [];
var transferSize1 = 0;
var largeTrans = 0;
var largeTransArray = [];
var largeTransSrc;
var largeLoadRequest;
var largeTransSize;
var largeLoadTime;
var largeTotalSize;
var largeTotalSrc;
var arrayLabel = [' bytes','kb','mb','gb'];

var cssTransReq = /(.css)/;
var apiTransReq = /(api?s)/;
var jsTransReq = /(.js)/;
var importedFontTransReq = /(@font-face)|(woff?2)|(fonts.googleapis)|(.tff)|(fonts.shopifycdn)|(cloud.typography)/;
var imageTransReq = /(.png)|(.jpeg)|(.gif)|(.jpg)|(.tiff)|(.svg)|(webp)|(avif)|(.ico)/;
//Transfer size of External Style Sheets
var cssTransSize = 0;
var apiTransSize = 0;
var jsTransSize = 0;
var importedFontTransSize = 0;
var imageTransSize = 0;
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
    }
    else if (requestMatch.match(apiTransReq)){
        apiTransSize += transferResources[i].transferSize;
        apiTotSize += transferResources[i].decodedBodySize;
    }
    else if (requestMatch.match(jsTransSize)){
        jsTransSize += transferResources[i].transferSize;
        jsTotSize += transferResources[i].decodedBodySize;
    }
    else if (requestMatch.match(importedFontTransReq)){
        importedFontTransSize += transferResources[i].transferSize;
        importedFontTotSize += transferResources[i].decodedBodySize;
    }
    else if (requestMatch.match(imageTransReq)){
        imageTransSize += transferResources[i].transferSize;
        imageTotSize += transferResources[i].decodedBodySize;
    }
    else{
        //
    }
    
    //just do the import fonts script in here if it matches the regex it is true, and then if it's false just run the script to look in the header. Saving time. 

   }


largeTotalSize = transferResources[maxTotalIndex].decodedBodySize;
largeTotalSrc = transferResources[maxTotalIndex].name;
largeTransSrc = transferResources[maxTransIndex].name;
largeTransSize = transferResources[maxTransIndex].transferSize;
largeLoadRequest = transferResources[maxIndexDur].name;
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

console.log('NetA: '+netA);
console.log('NetB: '+netB);

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

//////////////////////////////////////////////////////////////////////
//Total Labeling

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
//Transfer Labeling

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


console.log(num1TotName+' '+num1TotSize+' '+num1TotSizeLab);
console.log(num2TotName+' '+num2TotSize+' '+num2TotSizeLab);
console.log(num3TotName+' '+num3TotSize+' '+num3TotSizeLab);


console.log('transferTotal '+transferTotal);

console.log('fullTotal '+fullTotal);

console.log(num1TransName+' '+num1TransSize+' '+num1TransSizeLab);
console.log(num2TransName+' '+num2TransSize+' '+num2TransSizeLab);
console.log(num3TransName+' '+num3TransSize+' '+num3TransSizeLab);

console.log('CSS Trans: '+cssTransSize+' '+CSSSizeLab);
console.log('API Trans: '+apiTransSize+' '+APISizeLab);
console.log('JS Trans: '+jsTransSize+' '+jsSizeLab);
console.log('Imported Font Trans: '+importedFontTransSize+' '+importedFontSizeLab);
console.log('Image Trans: '+imageTransSize+' '+imgTransSizeLab);

console.log('CSS Tot: '+cssTotSize+' '+cssTotLab);
console.log('API Tot: '+apiTotSize+' '+apiTotLab);
console.log('JS Tot: '+jsTotSize+' '+jsTotLab);
console.log('Imported Font Tot: '+importedFontTotSize+' '+impFontLab);
console.log('Image Tot: '+imageTotSize+' '+imageLab);




