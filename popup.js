chrome.tabs.query({
    active: true,currentWindow: true
}).then(tabs => {
    var tab = tabs[0];
    var url  = tabs[0]['url'];
    let domain = (new URL(url));
	domain = domain.hostname;
    chrome.storage.local.get("tab"+tab.id).then(data => {
        try{
 var x = data["tab"+tab.id];
            
            
document.getElementById("scoreHTML").innerHTML = x.finalGrade;
            
    
// CO2 + KWH Calculations - used from https://github.com/carbonalyser/Carbonalyser
    
const defaultCarbonIntensityFactorIngCO2PerKWh = 519;
const kWhPerByteDataCenter = 0.000000000072;
const kWhPerByteNetwork = 0.000000000152;
const kWhPerMinuteDevice = 0.00021;

var kwhDCT = 0;
var GESDCT = 0;
var kwhNT = 0;
var GESNT = 0;
var kwhDT = 0;
var GESDT = 0;

kwhDCT = x.transferSizeChart*kWhPerByteDataCenter;
GESDCT = kwhDCT*defaultCarbonIntensityFactorIngCO2PerKWh;
kwhNT = x.transferSizeChart*kWhPerByteNetwork;
GESNT = kwhNT*defaultCarbonIntensityFactorIngCO2PerKWh;
kwhDT = x.duration*kWhPerMinuteDevice;
GESDT = kwhDT*493;

var kwhTotal = 0;
var co2Total = 0;

kwhTotal = (((1000 * (kwhDCT + kwhNT + kwhDT)) / 1000) / 2);
co2Total = ((GESDCT + GESNT + GESDT) / 2).toPrecision(1);
    
document.getElementById("co2Total").innerHTML = co2Total + "g";

document.getElementById("kwhTotal").innerHTML = kwhTotal.toPrecision(2);
    

var scoreDiff = 100-x.finalScore;      

switch (x.finalScore >= 0){
    
case x.finalScore >= 92:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [x.finalScore, scoreDiff];
var barColors = [
  "#32a852",
  "#f2f2f2",

];
    break;
      case x.finalScore >= 78:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [x.finalScore, scoreDiff];
var barColors = [
  "#8ECA2E",
  "#f2f2f2",

];
    break;
    
   case x.finalScore >= 70:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [x.finalScore, scoreDiff];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;

case x.finalScore >= 67:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [6 , 4];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;  
        
 case x.finalScore >= 64:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [5 , 5];
var barColors = [
  "#F77616",
  "#f2f2f2",

];
    break;
        
case x.finalScore >= 55:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [4 , 6];
var barColors = [
  "#F77616",
  "#f2f2f2",

];
    break;


    case x.finalScore >= 50:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [3 , 7];
var barColors = [
  "#ff0d21",
  "#f2f2f2",

];
    break;
    
case x.finalScore >= 40:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [2 , 8];
var barColors = [
  "#ff0d21",
  "#f2f2f2",

];
    break;
    
case x.finalScore < 40:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [1 , 9];
var barColors = [
  "#ff0d21",
  "#f2f2f2",

];
    break;

}
            
new Chart(ctx, {
  type: "doughnut",
  data: {
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options:{
     tooltips:{
         enabled: false,
     } 
  }
});
    
// Factoid____________________________________________________________________
    
var co2_breath = co2Total * 0.5;

var treeAbsorb = Math.round(co2Total / 2);

var co2_breath = co2_breath.toString();

var treeAbsorb = treeAbsorb.toString();
            
var co2_candle = Math.round((co2Total / 1.6)*10);

var co2_candle = co2_candle.toString();
            
var co2_lighter = Math.round((co2Total/0.25)*60);

var co2_lighter = co2_lighter.toString();
            
var co2_textMessage = (co2Total / .014).toPrecision(3);
            
var co2_textMessage = co2_textMessage.toString();
            
//co2 metrics

var co2_MoreThan3 = [co2_breath, treeAbsorb, co2_candle];

var co2_3g = ['About the amount of CO2 released by a can of pop','It takes 1 mature tree 1.5 hours to absorb the CO2 emitted on page load', 'It would take 6 minutes of human breathing to emit the same amount of CO2', 'Same amount of CO2 released as burning a candle for ' + co2_candle  + ' minutes', 'Same amount of CO2 released as using a plastic lighter for '+ co2_lighter + ' seconds.', 'Sending ' + co2_textMessage + ' text messages takes the same amount of CO2 as loading this page.'];

var co2_2g = ['Amount of CO2 released as burning 1/3 of a charcoal briquette','About the amount of CO2 released by a can of pop','It would take 4 minutes of human breathing to emit the same amount of CO2','It would take 1 mature tree 1 hour to absorb the CO2 emitted*','Same amount of CO2 released as burning a candle for ' + co2_candle  + ' minutes', 'Same amount of CO2 released as using a plastic lighter for '+ co2_lighter + ' seconds.', 'Sending ' + co2_textMessage + ' text messages takes the same amount of CO2 as loading this page.'];

var co2_1g = ['It would take 2 minutes of human breathing to emit the same amount of CO2','It takes 1 mature tree 30 minutes to absorb the CO2 emitted on page load','Same amount of CO2 released as burning a candle for ' + co2_candle  + ' minutes.', 'Same amount of CO2 released as using a plastic lighter for '+ co2_lighter + ' seconds.', 'Sending ' + co2_textMessage + ' text messages takes the same amount of CO2 as loading this page.'];

var co2_halfg = ['It would take 1 minutes of human breathing to emit the same amount of CO2.','It takes 1 mature tree 15 minutes to absorb the CO2 emitted on page load.','Same amount of CO2 released as burning a candle for ' + co2_candle  + ' minutes.', 'Same amount of CO2 released as burning a plastic lighter for '+ co2_lighter + ' seconds.', 'Sending ' + co2_textMessage + ' text messages takes the same amount of CO2 as loading this page.'];

var kwh_IncanLightBulb = (kwhTotal / 0.00001).toPrecision(3);

var kwh_IncanLightBulb = kwh_IncanLightBulb.toString();

var kwh_LEDLightBulb = (kwhTotal / .0000023).toPrecision(3);
            
var kwh_LEDLightBulb = kwh_LEDLightBulb.toString();
            
var kwh_MicrowaveSec = (kwhTotal / .0001).toPrecision(2);
            
var kwh_MicrowaveSec = kwh_MicrowaveSec.toString();
            
var kwh_MiniFridgeSec = (kwhTotal / .00001).toPrecision(2);
            
var kwh_MiniFridgeSec = kwh_MiniFridgeSec.toString();

var kwh_AAABattery = Math.round((kwhTotal/.0018)*100);
            
var kwh_AAABattery = kwh_AAABattery.toString();

var kwh_OneCalorie = Math.round(kwhTotal/.001);
            
var kwh_OneCalorie = kwh_OneCalorie.toString();

var kwh_CellPhoneCharge = Math.round((kwhTotal/.006)*100);
            
var kwh_CellPhoneCharge = kwh_CellPhoneCharge.toString();

var kwh_LCDTVCharge = (kwhTotal/.00003).toPrecision(2);

var kwh_LCDTVCharge = kwh_LCDTVCharge.toString();

var kwh_CeilingFan = (kwhTotal/.000015).toPrecision(2);

var kwh_CeilingFan = kwh_CeilingFan.toString();
            
var kwh_ChristmasLights = (kwhTotal/.000036).toPrecision(2);

var kwh_ChristmasLights = kwh_ChristmasLights.toString();
        
var kwh_TurnSignal = Math.round(kwhTotal/.00008);

var kwh_TurnSignal = kwh_TurnSignal.toString();

var kwh_Cal = (kwhTotal * 860.42).toPrecision(2);
var amountOfSteps = Math.round(kwh_Cal*20);
            
            
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

var co2SelectorMoreThan3 = getRandomInt(3);
var co2Selector3 = getRandomInt(6);
var co2Selector2 = getRandomInt(7);
var co2Selector1 = getRandomInt(5);
var kwhSelectorMoreThan2Thou = getRandomInt(4);
var kwhMoreThan001 = getRandomInt(7);
var kwhMoreThan0002 = getRandomInt(9);
var kwhMoreThan0 = getRandomInt(5);

switch (kwhTotal >= 0){
    
  case co2Total > 3:
        if(co2SelectorMoreThan3 == 0){
          document.getElementById("actualFact").innerHTML = "It would take 1 mature tree " + treeAbsorb + " hours to absorb the CO2 emitted from page load.";  
        }
        else if(co2SelectorMoreThan3 == 1){
           document.getElementById("actualFact").innerHTML = 'Same amount of CO2 released as burning a candle for ' + co2_candle  + ' minutes.';
        }
        else{
           document.getElementById("actualFact").innerHTML = 'It would take '+ co2_breath + ' minutes of human breathing to emit the same amount of CO2.'; 
        }

    break;

  case co2Total >= 3:
    document.getElementById("actualFact").innerHTML = co2_3g[co2Selector3];

    break;
   
  case co2Total >= 2:
    document.getElementById("actualFact").innerHTML = co2_2g[co2Selector2];

    break;
        
  case co2Total >= .9:
    document.getElementById("actualFact").innerHTML = co2_1g[co2Selector1];

    break;

  case kwhTotal > 0.001:
    if(kwhMoreThan001 == 0){
          document.getElementById("actualFact").innerHTML = "Loading this page takes the same amount of energy as charging your phone " + kwh_CellPhoneCharge + "%.";  
        }
    else if(kwhMoreThan001 == 1 && kwhTotal <= .0018){
           document.getElementById("actualFact").innerHTML = 'Same amount of energy on page load as using ' + kwh_AAABattery  + '% of a AAA battery.';
        }
    else if(kwhMoreThan001 == 2){
           document.getElementById("actualFact").innerHTML = 'The energy required to run a ceiling fan ' + kwh_CeilingFan  + ' seconds.';
        }
    else if(kwhMoreThan001 == 3){
           document.getElementById("actualFact").innerHTML = 'Energy used to power a TV screen for ' + kwh_LCDTVCharge  + ' seconds.';
        }
    else if(kwhMoreThan001 == 4){
           document.getElementById("actualFact").innerHTML = 'Loading this page could power a 25ft strand of Christmas lights for ' + kwh_ChristmasLights  + ' seconds.';
        }
    else if(kwhMoreThan001 == 5){
           document.getElementById("actualFact").innerHTML = 'The energy to load this page could power a car\'s turn signal ' + kwh_TurnSignal  + ' times.';
        }
    else{
           document.getElementById("actualFact").innerHTML = kwh_Cal + " Calorie(s), about the same energy emitted as walking "+ amountOfSteps + " steps."; 
        }

    break;
        
  case co2Total >= .5:
    document.getElementById("actualFact").innerHTML = co2_halfg[co2Selector1];

    break;

  case kwhTotal > 0.0002:
    if(kwhMoreThan0002 == 0){
          document.getElementById("actualFact").innerHTML = "Loading this page takes the same amount of energy as charging your phone " + kwh_CellPhoneCharge + "%.";  
        }
    else if(kwhMoreThan0002 == 1){
           document.getElementById("actualFact").innerHTML = 'Same amount of energy on page load as using ' + kwh_AAABattery  + '% of a AAA battery.';
        }
    else if(kwhMoreThan0002 == 2){
           document.getElementById("actualFact").innerHTML = 'Loading this pages takes the same amount of energy as ' + kwh_MicrowaveSec  + ' seconds in a microwave.';
        }
    else if(kwhMoreThan0002 == 3){
           document.getElementById("actualFact").innerHTML = 'Loading this pages takes the same amount of energy as running a mini fridge ' + kwh_MiniFridgeSec  + ' seconds.';
        }
    else if(kwhMoreThan0002 == 4){
           document.getElementById("actualFact").innerHTML = 'The energy required to run a ceiling fan ' + kwh_CeilingFan  + ' seconds.';
        }
    else if(kwhMoreThan0002 == 5){
           document.getElementById("actualFact").innerHTML = 'Energy used to power a TV screen for ' + kwh_LCDTVCharge  + ' seconds.';
        }
    else if(kwhMoreThan0002 == 6){
           document.getElementById("actualFact").innerHTML = 'Loading this page could power a 25ft strand of Christmas lights for ' + kwh_ChristmasLights  + ' seconds.';
        }
    else if(kwhMoreThan0002 == 7){
           document.getElementById("actualFact").innerHTML = 'The energy to load this page could power a car\'s turn signal ' + kwh_TurnSignal  + ' times.';
        }
    else{
           document.getElementById("actualFact").innerHTML = kwh_Cal + " Calorie(s), about the same energy emitted as walking "+ amountOfSteps + " steps."; 
        }

    break;
    


  case kwhTotal >= 0:
        if(kwhMoreThan0 == 0){
            document.getElementById("actualFact").innerHTML = kwh_IncanLightBulb + " seconds running an incandescent lightbulb."; 
        }
        else if(kwhMoreThan0 == 1){
            document.getElementById("actualFact").innerHTML = 'Loading this pages takes the same amount of energy as running a mini fridge ' + kwh_MiniFridgeSec  + ' seconds.'; 
        }
        else if(kwhMoreThan0 == 2){
           document.getElementById("actualFact").innerHTML = 'The energy required to run a ceiling fan ' + kwh_CeilingFan  + ' seconds.';
        }
        else if(kwhMoreThan0 == 3){
           document.getElementById("actualFact").innerHTML = 'Loading this page could power a 25ft strand of Christmas lights for ' + kwh_ChristmasLights  + ' seconds.';
        }
        else{
           document.getElementById("actualFact").innerHTML = kwh_LEDLightBulb + " seconds running an LED lightbulb."; 
        }

    break;

        
document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('devButton');
    // onClick's logic below:
    link.addEventListener('click', function() {
        link.style.backgroundColor = "#ff0000"
    });
});        

}
//////////////////////////////////////////////
  
        //Arrays
        
var orangeArray = [];
var yellowArray = [];
var greenArray = [];
        
//Random Numbers
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
        
//Transfer Size Orange Major Recommendations Array
var lazyOArray = ['With "lazy loading", files are only loaded when they reach the visible area of the browser window, or shortly before it.', 'Modern browsers allow to insert loading=“lazy“ as an attribute in the img element.', 'Lazy loading is useful because it allows images lower on a page to not be loaded if it\'s not in immediate view.'];
var lazyOLengthVal = getRandomInt(lazyOArray.length);
var lazyOEntry = lazyOArray[lazyOLengthVal];
        
//Transfer Size Orange Major Recommendations Array
var transferOArray = ['Caching: With less transmitted data and fewer server requests, pages are loaded much faster.', 'Analytics and advertising script files can add significant weight, increase CPU usage, and slow websites down.', 'Choose plugins that minimize server load and don’t add unnecessary weight on the front end.', 'Caching reduces the server load and the amount of data transferred, making websites more environmentally friendly.', 'Reducing Transfer Data size is largely seen as one of the best ways to make your website more sustainable', 'If you notice little difference between Total Byte Size, and Transfer Size it might mean that additional data can be cached.', 'This is the most heavily weighted metric in your Sustainability Grade. Reducing it will increase your Grade.', 'If Transfer size is greater than 1MB- it\'s equivalent to 150,000 words in a HTML File. Are your images worth 1,000 words?', ];
var transferOLengthVal = getRandomInt(transferOArray.length);
var transferOEntry = transferOArray[transferOLengthVal];
    
//Page Load Time Orange Major Recommendations Array
var loadTimeOArray = ['Reducing your page load time can improve your SEO. Google Search prioritizes pages with faster page load time.', 'Reducing your page load time can improve the energy required to render pages.', 'Reducing your page load time can improve the user experience for users with slower connection speeds.'];
var loadTimeOLengthVal = getRandomInt(loadTimeOArray.length);
var loadTimeOEntry = loadTimeOArray[loadTimeOLengthVal];
        
//Imported Fonts Orange Major Recommendations Array
var fontOArray = ['If your imported Font file is .TFF it’s a less efficient font file format than .WOFF.', 'For imported fonts try to only include the characters needed for your website.', 'Stick to modern web font file formats: WOFF and WOFF2, these use higher compression methods compared to TTF, SVG and OFT file formats.', 'Some font files will have distiction between styling \(i.e bolding). If styling is not being used, try removing this from the font file.'];
var fontOLengthVal = getRandomInt(fontOArray.length);
var fontOEntry = fontOArray[fontOLengthVal];
        
//Image File Types Orange Major Recommendations Array
var imageOArray = ['The svg format is ideal for simple graphics without a high level of detail, such as icons and geometric representations.', 'Are your images being shown in a carousel? Could you just show 1 for the same effect?', 'On most websites, images are the single largest contributors to page weight.', 'The more images you use and the larger those image files, the more data needs to be transferred, increasing the energy that is used.', 'Could you use a vector graphic (or CSS styling) instead of a photo?', 'Try to do some research on emerging image file formats: WebP and Avif have a greatly reduced amount of data load.', 'Most modern browsers support using the WebP format. It looks great for photographic images, and have a smaller byte size.', 'WebP images typically have about a 30% smaller file size than JPEG.', 'The newer file type AVIF can almost be half the file size of WebP depending on the image.', 'Ask yourself, can my site be using Vector Imagery? Vector images are a cool, clean way to show icons'];
var imageOLengthVal = getRandomInt(imageOArray.length);
var imageOEntry = imageOArray[imageOLengthVal];
        
//JS Size Types Orange Major Recommendations Array
var jsOArray = ['JavaScript impacts website efficiency by adding file weight to the web page. Increasing the amount of processing required by your device.', 'JavaScript is processed on the your computer/phone requiring CPU usage, which in turn increases the energy consumption of the device.', 'The amount of javascript having to be executed can isolate users with older devices, or smaller processors.'];
var jsOLengthVal = getRandomInt(jsOArray.length);
var jsOEntry = jsOArray[jsOLengthVal];
        
//HTML Length Types Orange Major Recommendations Array
var htmlOArray = ['It seems like you have a lot going on on this page. Is there any way to reduce the amount of content on this page?', 'Have you considered just loading content on scroll?', 'If content is being loaded beyong what the user is currently seeing, it is as waste of data.'];
var htmlOLengthVal = getRandomInt(htmlOArray.length);
var htmlOEntry = htmlOArray[htmlOLengthVal];
            
var resImgOArray = ['You can save bandwidth and speed up page load times by loading the most appropriate image for the viewer\'s display.', 'Our scan is searching for the HTML \"picture\" tag, and for \"srcset\" when loading an image for different screen dimensions', 'Responsive web design has changed how websites can be created. Device detection is no longer needed to display separate “mobile” sites whenever the server detects a phone or tablet.', 'Using srcset or picture HTML allow an image to be displayed at the correct dimensions for a user\'s device', 'If a site is being loaded on tablet or smart phone it wastes data to load the same image you would on a desktop website.', 'If media queries are being used in the CSS to create responisve images you want to make sure that not all images are being downloaded at the same time.'];
var resImgOLengthVal  = getRandomInt(resImgOArray.length);
var resImgOEntry = resImgOArray[resImgOLengthVal];

//Lazy Load Bar Size 
var lazyLoadChart = x.lazyLoadChart;
    
switch (lazyLoadChart >= 0){
    
    case lazyLoadChart == 110:
        document.getElementById("lazyBar").innerHTML = "< 5 Images on Page";
        document.getElementById("lazyBar").style.width = "260px";
        document.getElementById("lazyBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid green';
        greenArray.push("Great Job, way to reduce the number of images!");
        break;
    case lazyLoadChart == 100:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "260px";
        document.getElementById("lazyBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid green';
        greenArray.push("Most images are being lazy loaded- good work!");
        break;
    case lazyLoadChart >= 95:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "255px";
        document.getElementById("lazyBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid green';
        greenArray.push("Most images are being lazy loaded- good work!");
        break;
    case lazyLoadChart >= 90:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "250px";
        document.getElementById("lazyBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid green';
        greenArray.push("Most images are being lazy loaded- good work!");
        break;
    case lazyLoadChart >= 80:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "230px";
        document.getElementById("lazyBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid green';
        greenArray.push("Most images are being lazy loaded- good work!");
        break;
    case lazyLoadChart >= 75:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "215px";
        document.getElementById("lazyBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid green';
        greenArray.push("Most images are being lazy loaded- good work!");
        break;
    case lazyLoadChart >= 70:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "200px";
        document.getElementById("lazyBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid green';
        greenArray.push("Most images are being lazy loaded- good work!");
        break;
    case lazyLoadChart >= 65:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "180px";
        document.getElementById("lazyBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid green';
        greenArray.push("Most images are being lazy loaded- good work!");
        break;
    case lazyLoadChart >= 60:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "160px";
        document.getElementById("lazyBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid green';
        break;
    case lazyLoadChart >= 55:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "140px";
        document.getElementById("lazyBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid yellow';
        orangeArray.push(lazyOEntry);
        break;
    case lazyLoadChart >= 55:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "120px";
        document.getElementById("lazyBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid yellow';
        orangeArray.push(lazyOEntry);
        break;
    case lazyLoadChart >= 40:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "100px";
        document.getElementById("lazyBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid yellow';
        orangeArray.push(lazyOEntry);
        break;
    case lazyLoadChart >= 30:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "80px";
        document.getElementById("lazyBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid yellow';
        orangeArray.push(lazyOEntry);
        break;
    case lazyLoadChart >= 20:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "60px";
        document.getElementById("lazyBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid yellow';
        orangeArray.push(lazyOEntry);
        break;
    case lazyLoadChart >= 10:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "50px";
        document.getElementById("lazyBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("lazyBar").style.border = '1px solid orange';
        orangeArray.push(lazyOEntry);
        break;
    case lazyLoadChart >= 0:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "30px";
        document.getElementById("lazyBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("lazyBar").style.border = '1px solid orange';
        orangeArray.push(lazyOEntry);
        break;
}



var svgChart = x.svgChart;

switch (svgChart >= 0){

    case svgChart == 110:
        document.getElementById("svgBar").innerHTML = "< 5 Images on Page";
        document.getElementById("svgBar").style.width = "260px";
        document.getElementById("svgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid green';
        break;
    case svgChart == 100:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "260px";
        document.getElementById("svgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid green';
        greenArray.push("All images are a light weight file type-- that's awesome!");
        break;
    case svgChart >= 90:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "240px";
        document.getElementById("svgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid green';
        greenArray.push("Most images are a light weight file type- that's awesome!");
        break;
    case svgChart >= 80:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "220px";
        document.getElementById("svgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid green';
        greenArray.push("Most images are a light weight file type- that's awesome!");
        break;
    case svgChart >= 70:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "200px";
        document.getElementById("svgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid green';
        greenArray.push("Most images are a light weight file type- that's awesome!");
        break;
    case svgChart >= 60:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "140px";
        document.getElementById("svgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid green';
        greenArray.push("Most images are a light weight file type- that's awesome!");
        break;
    case svgChart >= 50:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "120px";
        document.getElementById("svgBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid yellow';
        orangeArray.push(imageOEntry);
        break;
    case svgChart >= 40:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "100px";
        document.getElementById("svgBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid yellow';
        orangeArray.push(imageOEntry);
        break;
    case svgChart >= 30:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "80px";
        document.getElementById("svgBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid yellow';
        orangeArray.push(imageOEntry);
        break;
    case svgChart >= 20:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "60px";
        document.getElementById("svgBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid yellow';
        orangeArray.push(imageOEntry);
        break;
    case svgChart >= 10:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "50px";
        document.getElementById("svgBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("svgBar").style.border = '1px solid orange';
        orangeArray.push(imageOEntry);
        break;
    case svgChart >= 0:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "30px";
        document.getElementById("svgBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("svgBar").style.border = '1px solid orange';
        orangeArray.push(imageOEntry);
        break;
}


var decodedBodySizeChart = x.decodedBodySizeChart;

switch (decodedBodySizeChart >= 0){

    case decodedBodySizeChart <= 150000:
        document.getElementById("byteSizeBar").innerHTML = x.sizeLabel;
        document.getElementById("byteSizeBar").style.width = "260px";
        document.getElementById("byteSizeBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("byteSizeBar").style.border = '1px solid green';
        greenArray.push("This is an all-around light weight website- great job!");
        break;
    case decodedBodySizeChart <= 600000:
        document.getElementById("byteSizeBar").innerHTML = x.sizeLabel;
        document.getElementById("byteSizeBar").style.width = "240px";
        document.getElementById("byteSizeBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("byteSizeBar").style.border = '1px solid green';
        greenArray.push("This is an all-around light weight website- great job!");
        break;
    case decodedBodySizeChart <= 850000:
        document.getElementById("byteSizeBar").innerHTML = x.sizeLabel;
        document.getElementById("byteSizeBar").style.width = "220px";
        document.getElementById("byteSizeBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("byteSizeBar").style.border = '1px solid green';
        break;
    case decodedBodySizeChart <= 1048576:
        document.getElementById("byteSizeBar").innerHTML = x.sizeLabel;
        document.getElementById("byteSizeBar").style.width = "200px";
        document.getElementById("byteSizeBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("byteSizeBar").style.border = '1px solid green';
        break;
    case decodedBodySizeChart <= 1572864:
        document.getElementById("byteSizeBar").innerHTML = x.sizeLabel;
        document.getElementById("byteSizeBar").style.width = "180px";
        document.getElementById("byteSizeBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("byteSizeBar").style.border = '1px solid yellow';
        break;
    case decodedBodySizeChart <= 2000000:
        document.getElementById("byteSizeBar").innerHTML = x.sizeLabel;
        document.getElementById("byteSizeBar").style.width = "160px";
        document.getElementById("byteSizeBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("byteSizeBar").style.border = '1px solid yellow';
        break;
    case decodedBodySizeChart <= 2621440:
        document.getElementById("byteSizeBar").innerHTML = x.sizeLabel;
        document.getElementById("byteSizeBar").style.width = "140px";
        document.getElementById("byteSizeBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("byteSizeBar").style.border = '1px solid yellow';
        break;
    case decodedBodySizeChart <= 3100000:
        document.getElementById("byteSizeBar").innerHTML = x.sizeLabel;
        document.getElementById("byteSizeBar").style.width = "120px";
        document.getElementById("byteSizeBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("byteSizeBar").style.border = '1px solid yellow';
        break;
    case decodedBodySizeChart <= 3670016:
        document.getElementById("byteSizeBar").innerHTML = x.sizeLabel;
        document.getElementById("byteSizeBar").style.width = "100px";
        document.getElementById("byteSizeBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("byteSizeBar").style.border = '1px solid yellow';
        break;
    case decodedBodySizeChart <= 5242880:
        document.getElementById("byteSizeBar").innerHTML = x.sizeLabel;
        document.getElementById("byteSizeBar").style.width = "80px";
        document.getElementById("byteSizeBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("byteSizeBar").style.border = '1px solid orange';
        break;
    case decodedBodySizeChart > 5242880:
        document.getElementById("byteSizeBar").innerHTML = x.sizeLabel;
        document.getElementById("byteSizeBar").style.width = "45px";
        document.getElementById("byteSizeBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("byteSizeBar").style.border = '1px solid orange';
        break;
}


var loadTimeChart = x.loadTimeChart;

switch (loadTimeChart >= 0){

    case loadTimeChart <= 1:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "260px";
        document.getElementById("loadBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid green';
        greenArray.push("This page is loading really fast!");
        break;
     case loadTimeChart <= 1.5:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "240px";
        document.getElementById("loadBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid green';
        greenArray.push("This page is loading really fast!");
        break;
    case loadTimeChart <= 2:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "220px";
        document.getElementById("loadBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid green';
        greenArray.push("Great job with your page load time!");
        break;
    case loadTimeChart <= 2.5:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "200px";
        document.getElementById("loadBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid green';
        greenArray.push("Great job with your page load time!");
        break;
    case loadTimeChart <= 3:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "180px";
        document.getElementById("loadBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid green';
        greenArray.push("Great job with your page load time!");
        break;
    case loadTimeChart <= 3.5:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "160px";
        document.getElementById("loadBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid green';
        break;
    case loadTimeChart <= 4:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "140px";
        document.getElementById("loadBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid green';
        break;
    case loadTimeChart <= 5:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "120px";
        document.getElementById("loadBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid yellow';
        orangeArray.push(loadTimeOEntry);
        break;
    case loadTimeChart <= 6:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "100px";
        document.getElementById("loadBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid yellow';
        orangeArray.push(loadTimeOEntry);
        break;
    case loadTimeChart <= 7:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "80px";
        document.getElementById("loadBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid yellow';
        orangeArray.push(loadTimeOEntry);
        break;
    case loadTimeChart <= 8:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "60px";
        document.getElementById("loadBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid orange';
        orangeArray.push(loadTimeOEntry);
        break;
    case loadTimeChart <= 10:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "45px";
        document.getElementById("loadBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid orange';
        orangeArray.push(loadTimeOEntry);
        break;
    case loadTimeChart > 10:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "35px";
        document.getElementById("loadBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid orange';
        orangeArray.push(loadTimeOEntry);
        break;
}

//document.getElementById("jsBar").style.width = "150px";

var jsChart = x.jsChart;

switch (jsChart >= 0){

    case jsChart <= 10000000:
        document.getElementById("jsBar").innerHTML = x.jssSizeLabel;
        document.getElementById("jsBar").style.width = "260px";
        document.getElementById("jsBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("jsBar").style.border = '1px solid green';
        greenArray.push("Great job limiting the amount of Javascript running!");
        break;
    case jsChart <= 15000000:
        document.getElementById("jsBar").innerHTML = x.jssSizeLabel;
        document.getElementById("jsBar").style.width = "240px";
        document.getElementById("jsBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("jsBar").style.border = '1px solid green';
        greenArray.push("Great job limiting the amount of Javascript running!");
        break;
    case jsChart <= 20000000:
        document.getElementById("jsBar").innerHTML = x.jssSizeLabel;
        document.getElementById("jsBar").style.width = "220px";
        document.getElementById("jsBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("jsBar").style.border = '1px solid green';
        greenArray.push("Great job limiting the amount of Javascript running!");
        break;
    case jsChart <= 25000000:
        document.getElementById("jsBar").innerHTML = x.jssSizeLabel;
        document.getElementById("jsBar").style.width = "200px";
        document.getElementById("jsBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("jsBar").style.border = '1px solid green';
        break;
    case jsChart <= 30000000:
        document.getElementById("jsBar").innerHTML = x.jssSizeLabel;
        document.getElementById("jsBar").style.width = "180px";
        document.getElementById("jsBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("jsBar").style.border = '1px solid yellow';
        orangeArray.push(jsOEntry);
        break;
    case jsChart <= 35000000:
        document.getElementById("jsBar").innerHTML = x.jssSizeLabel;
        document.getElementById("jsBar").style.width = "160px";
        document.getElementById("jsBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("jsBar").style.border = '1px solid yellow';
        orangeArray.push(jsOEntry);
        break;
    case jsChart <= 40000000:
        document.getElementById("jsBar").innerHTML = x.jssSizeLabel;
        document.getElementById("jsBar").style.width = "140px";
        document.getElementById("jsBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("jsBar").style.border = '1px solid yellow';
        orangeArray.push(jsOEntry);
        break;
    case jsChart <= 45000000:
        document.getElementById("jsBar").innerHTML = x.jssSizeLabel;
        document.getElementById("jsBar").style.width = "120px";
        document.getElementById("jsBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("jsBar").style.border = '1px solid orange';
        orangeArray.push(jsOEntry);
        break;
    case jsChart <= 50000000:
        document.getElementById("jsBar").innerHTML = x.jssSizeLabel;
        document.getElementById("jsBar").style.width = "100px";
        document.getElementById("jsBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("jsBar").style.border = '1px solid orange';
        orangeArray.push(jsOEntry);
        break;
    case jsChart > 50000000:
        document.getElementById("jsBar").innerHTML = x.jssSizeLabel;
        document.getElementById("jsBar").style.width = "80px";
        document.getElementById("jsBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("jsBar").style.border = '1px solid orange';
        orangeArray.push(jsOEntry);
        break;
}






var importChart = x.importChart;


switch (importChart >= 0){

    case importChart == 0:
        document.getElementById("fontBar").style.width = "260px";
        document.getElementById("fontBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("fontBar").style.border = '1px solid green';
        document.getElementById("fontBar").innerHTML = 'No';
        greenArray.push("Looks like you're only using system fonts, way to go!");
        break;
    case importChart == 1:
        document.getElementById("fontBar").style.width = "30px";
        document.getElementById("fontBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("fontBar").style.border = '1px solid orange';
        document.getElementById("fontBar").innerHTML = 'Yes';
        orangeArray.push(fontOEntry);
        break;
}


var htmlChart = x.htmlChart;

switch (htmlChart >= 0){

    case htmlChart <= 200001:
        document.getElementById("htmlBar").innerHTML = x.lengthK;
        document.getElementById("htmlBar").style.width = "260px";
        document.getElementById("htmlBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("htmlBar").style.border = '1px solid green';
        greenArray.push("Looks like your page is loading a minimal amount of content, this is better for the planet, and your users!");
        break;
    case htmlChart <= 250001:
        document.getElementById("htmlBar").innerHTML = x.lengthK;
        document.getElementById("htmlBar").style.width = "240px";
        document.getElementById("htmlBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("htmlBar").style.border = '1px solid green';
        greenArray.push("Looks like your page is loading a minimal amount of content, this is better for the planet, and your users!");
        break;
    case htmlChart <= 300001:
        document.getElementById("htmlBar").innerHTML = x.lengthK;
        document.getElementById("htmlBar").style.width = "220px";
        document.getElementById("htmlBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("htmlBar").style.border = '1px solid green';
        greenArray.push("Looks like your page is loading a minimal amount of content, this is better for the planet, and your users!");
        break;
    case htmlChart <= 350001:
        document.getElementById("htmlBar").innerHTML = x.lengthK;
        document.getElementById("htmlBar").style.width = "200px";
        document.getElementById("htmlBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("htmlBar").style.border = '1px solid green';
        break;
   case htmlChart <= 400001:
        document.getElementById("htmlBar").innerHTML = x.lengthK;
        document.getElementById("htmlBar").style.width = "180px";
        document.getElementById("htmlBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("htmlBar").style.border = '1px solid green';
        break;
   case htmlChart <= 500001:
        document.getElementById("htmlBar").innerHTML = x.lengthK;
        document.getElementById("htmlBar").style.width = "160px";
        document.getElementById("htmlBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("htmlBar").style.border = '1px solid yellow';
        orangeArray.push(htmlOEntry);
        break;
   case htmlChart <= 750001:
        document.getElementById("htmlBar").innerHTML = x.lengthK;
        document.getElementById("htmlBar").style.width = "140px";
        document.getElementById("htmlBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("htmlBar").style.border = '1px solid yellow';
        orangeArray.push(htmlOEntry);
        break;
   case htmlChart <= 1000001:
        document.getElementById("htmlBar").innerHTML = x.lengthK;
        document.getElementById("htmlBar").style.width = "120px";
        document.getElementById("htmlBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("htmlBar").style.border = '1px solid yellow';
        orangeArray.push(htmlOEntry);
        break;
    case htmlChart <= 2500000:
        document.getElementById("htmlBar").innerHTML = x.lengthK;
        document.getElementById("htmlBar").style.width = "100px";
        document.getElementById("htmlBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("htmlBar").style.border = '1px solid orange';
        orangeArray.push(htmlOEntry);
        break;
   case htmlChart <= 4000000:
        document.getElementById("htmlBar").innerHTML = x.lengthK;
        document.getElementById("htmlBar").style.width = "80px";
        document.getElementById("htmlBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("htmlBar").style.border = '1px solid orange';
        orangeArray.push(htmlOEntry);
        break;
   case htmlChart >= 4000000:
        document.getElementById("htmlBar").innerHTML = x.lengthK;
        document.getElementById("htmlBar").style.width = "60px";
        document.getElementById("htmlBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("htmlBar").style.border = '1px solid orange';
        orangeArray.push(htmlOEntry);
        break;
}
        
var transferSizeChart = x.transferSizeChart;

switch (transferSizeChart >= 0){

    case transferSizeChart <= 100000:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "260px";
        document.getElementById("transferBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid green';
        greenArray.push("Great job limiting the amount of data transfered on page load!");
        break;
    case transferSizeChart <= 200000:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "240px";
        document.getElementById("transferBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid green';
        greenArray.push("Great job limiting the amount of data transfered on page load!");
        break;
    case transferSizeChart <= 400000:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "220px";
        document.getElementById("transferBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid green';
        greenArray.push("Great job limiting the amount of data transfered on page load!");
        break;
    case transferSizeChart <= 600000:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "200px";
        document.getElementById("transferBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid green';
        greenArray.push("Great job limiting the amount of data transfered on page load!");
        break;
    case transferSizeChart <= 850000:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "180px";
        document.getElementById("transferBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid green';
        break;
    case transferSizeChart <= 1048576:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "160px";
        document.getElementById("transferBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid green';
        break
    case transferSizeChart <= 1348576:
    document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "140px";
        document.getElementById("transferBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid yellow';
        orangeArray.push(transferOEntry);
        break;
    case transferSizeChart <= 1572864:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "120px";
        document.getElementById("transferBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid yellow';
        orangeArray.push(transferOEntry);
        break;
    case transferSizeChart <= 2621440:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "100px";
        document.getElementById("transferBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid yellow';
        orangeArray.push(transferOEntry);
        break;
    case transferSizeChart <= 3670016:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "80px";
        document.getElementById("transferBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid yellow';
        orangeArray.push(transferOEntry);
        break;
    case transferSizeChart <= 5242880:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "60px";
        document.getElementById("transferBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid orange';
        orangeArray.push(transferOEntry);
        break;
    case transferSizeChart > 5242880:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "40px";
        document.getElementById("transferBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid orange';
        orangeArray.push(transferOEntry);
        break;
}
            
            

var resImgChart = x.resImgChart;

switch (resImgChart >= 0){

    case resImgChart == 110:
        document.getElementById("resImgBar").innerHTML = "No Images on Page";
        document.getElementById("resImgBar").style.width = "260px";
        document.getElementById("resImgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid green';
        break;
    case resImgChart == 100:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "260px";
        document.getElementById("resImgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid green';
        greenArray.push("All images are being loaded responsively! Great job!");
        break;
    case resImgChart >= 90:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "240px";
        document.getElementById("resImgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid green';
        greenArray.push("Most images are being loaded responsively! Great job!");
        break;
    case resImgChart >= 80:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "220px";
        document.getElementById("resImgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid green';
        greenArray.push("Most images are being loaded responsively! Great job!");
        break;
    case resImgChart >= 70:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "200px";
        document.getElementById("resImgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid green';
        greenArray.push("Most images are being loaded responsively! Great job!");
        break;
    case resImgChart >= 60:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "140px";
        document.getElementById("resImgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid green';
        greenArray.push("Most images are being loaded responsively! Great job!");
        break;
    case resImgChart >= 50:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "120px";
        document.getElementById("resImgBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid yellow';
        orangeArray.push(resImgOEntry);
        break;
    case resImgChart >= 40:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "100px";
        document.getElementById("resImgBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid yellow';
        orangeArray.push(resImgOEntry);
        break;
    case resImgChart >= 30:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "80px";
        document.getElementById("resImgBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid yellow';
        orangeArray.push(resImgOEntry);
        break;
    case resImgChart >= 20:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "60px";
        document.getElementById("resImgBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid yellow';
        orangeArray.push(resImgOEntry);
        break;
    case resImgChart >= 10:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "50px";
        document.getElementById("resImgBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("resImgBar").style.border = '1px solid orange';
        orangeArray.push(resImgOEntry);
        break;
    case resImgChart >= 0:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "30px";
        document.getElementById("resImgBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("resImgBar").style.border = '1px solid orange';
        orangeArray.push(resImgOEntry);
        break;
}
  
/////////////////////////////////////////////////////////////////////////////
//Green Hosting Search
            
	fetch('https://admin.thegreenwebfoundation.org/api/v3/greencheck/'+domain).then(function(response) {
	  response.json().then(function(resData) {
		if(resData.green == true){
			document.getElementById("greenBar").style.width = "260px"; 
            document.getElementById("greenBar").style.background = 'rgba(142, 202, 46, 0.5)';
            document.getElementById("greenBar").style.border = '1px solid green';
            document.getElementById("greenBar").innerHTML = 'Yes';
            document.getElementById("p3").innerHTML = 'Your website is hosted with green energy sources!';
            
		}
		else if(resData.green == false){
			document.getElementById("greenBar").style.width = "30px"; 
            document.getElementById("greenBar").style.background = 'rgba(241, 137, 49, 0.5)';
            document.getElementById("greenBar").style.border = '1px solid orange';
            document.getElementById("greenBar").innerHTML = 'No'; 
            document.getElementById("m3").innerHTML = 'Try finding a data center to host your website with renewable energy.';
		}
	  });
	});

//////////////////////////////////////////////////////////////////////////////////
            

            
 if (orangeArray.length == 1) {
  document.getElementById("m1").innerHTML = orangeArray[0];
} else if (orangeArray.length == 2) {
  document.getElementById("m1").innerHTML = orangeArray[0];
  document.getElementById("m2").innerHTML = orangeArray[1];
} else if (orangeArray.length >= 3) {
  var orangeLength = orangeArray.length;
  var orangeRand = getRandomInt(orangeLength)
  document.getElementById("m1").innerHTML = orangeArray[orangeRand];
  var orangeRand = Math.abs(orangeRand-1);
  document.getElementById("m2").innerHTML = orangeArray[orangeRand];
}
 else{
     document.getElementById("m1").innerHTML = "No Major Recommendations, good work!";
 }
        
/* if (yellowArray.length == 1) {
  document.getElementById("r1").innerHTML = yellowArray[0];
} else if (yellowArray.length == 2) {
  document.getElementById("r1").innerHTML = yellowArray[0];
  document.getElementById("r2").innerHTML = yellowArray[1];
} else if (yellowArray.length >= 3) {
  var yellowLength = yellowArray.length;
  var yellowRand = getRandomInt(yellowLength)
  document.getElementById("r1").innerHTML = yellowArray[yellowRand];
  var yellowRand = Math.abs(yellowRand-1);
  document.getElementById("r2").innerHTML = yellowArray[yellowRand+1];
}
 else{
     //document.getElementById("r1").innerHTML = "";
 }   */     
        

if (greenArray.length == 1) {
  document.getElementById("p1").innerHTML = greenArray[0];
} else if (greenArray.length == 2) {
  document.getElementById("p1").innerHTML = greenArray[0];
  document.getElementById("p2").innerHTML = greenArray[1];
} else if (greenArray.length >= 3) {
  var greenLength = greenArray.length;
  var greenRand = getRandomInt(greenLength)
  document.getElementById("p1").innerHTML = greenArray[greenRand];
  var greenRand = Math.abs(greenRand-1);
  document.getElementById("p2").innerHTML = greenArray[greenRand];
}
 else{
     //document.getElementById("p1").innerHTML = "";
 }
            
        
       }
        catch(e) {
            //alert("Page is almost loaded")
        }
        });
    
});


/* The function use to show and hide the selected content as per button click  */
function openDiv(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

/* button clicks calls */
document.getElementById("factButton").onclick = function(evt) {
	 console.log('factview is clciked'); 
	 localStorage.setItem('selectedButtonId', 'factButton'); 
	 openDiv(evt,'Example1Div'); 
}
document.getElementById("devButton").onclick = function(evt) {
	 console.log('devview is clciked'); 
	 localStorage.setItem('selectedButtonId', 'devButton'); 
	 openDiv(evt,'Example2Div'); 
}

/* This selection tab will persist when browsing and default fact view will be active*/
var selectedTab = localStorage.getItem('selectedButtonId');  
if(selectedTab)
	document.getElementById(selectedTab).click();
else
	document.getElementById("factButton").click();