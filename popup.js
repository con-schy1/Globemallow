chrome.tabs.query({
    active: true,currentWindow: true
}).then(tabs => {
    var tab = tabs[0];
    var url  = tabs[0]['url'];
    let domain = (new URL(url));
	domain = domain.hostname;
    chrome.storage.session.get("tab"+tab.id).then(data => {
        try{
 var x = data["tab"+tab.id];
            
         
/////////////////////////////////////////////////////////////////////////////
//Green Hosting Search
            
try{
            
	fetch('https://admin.thegreenwebfoundation.org/api/v3/greencheck/'+domain).then(function(response) {
	  response.json().then(function(resData) {
		if(resData.green == true){
			document.getElementById("greenBar").style.width = "240px"; 
            document.getElementById("greenBar").style.background = 'rgba(142, 202, 46, 0.5)';
            document.getElementById("greenBar").style.border = '1px solid green';
            document.getElementById("greenBar").innerHTML = 'Yes';
            
		}
		else if(resData.green == false){
			document.getElementById("greenBar").style.width = "30px"; 
            document.getElementById("greenBar").style.background = 'rgba(241, 137, 49, 0.5)';
            document.getElementById("greenBar").style.border = '1px solid orange';
            document.getElementById("greenBar").innerHTML = 'No'; 
		}
	  });
	});
}
  catch(e){
      console.log('Green Web Fail');
  }

//////////////////////////////////////////////////////////////////////////////////       
            
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
    

// This is for the Score Diff on Button click. Button stuff
document.getElementById('sampleVal').innerHTML = x.finalScore;
            
document.getElementById('LazyLoadVal').innerHTML = x.LazyLoadMax;
document.getElementById('emptySrcVal1').innerHTML = x.emptySrcMax;
document.getElementById('cookieVal').innerHTML = x.cookieMax;
document.getElementById('redirectVal').innerHTML = x.redirectsax;
document.getElementById('ssFileVal').innerHTML = x.ssFileMax;
document.getElementById('intSSsampleVal').innerHTML = x.intSSMax;
document.getElementById('resVal').innerHTML = x.resMax;
document.getElementById('transVal').innerHTML = x.transMax;
            
document.getElementById('fontVal').innerHTML = x.fontMax;
document.getElementById('timeVal').innerHTML = x.timeMax;
document.getElementById('lengthVal').innerHTML = x.lengthMax;
document.getElementById('imgTypeVal').innerHTML = x.imgTypeMax;
document.getElementById('jsVal').innerHTML = x.jsMax;
document.getElementById('sizeVal').innerHTML = x.sizeMax;
document.getElementById('cacheVal').innerHTML = x.cacheMax;
document.getElementById('colorVal').innerHTML = x.colorMax;
document.getElementById('backGrndVal').innerHTML = x.backGroundColor;
            
//This is for the Transfer Table Breakdown Toggle
            
document.getElementById("jsValBytes").innerHTML = x.jsSizeLab;
document.getElementById("imgValBytes").innerHTML = x.imgTransSizeLab;
document.getElementById("cssValBytes").innerHTML = x.CSSSizeLab;
document.getElementById("importValBytes").innerHTML = x.importedFontSizeLab;
document.getElementById("otherValBytes").innerHTML = x.otherTransSizeLab;
            
document.getElementById("Lab1ValBytes").innerHTML = x.num1TransSizeLab;
document.getElementById("Lab2ValBytes").innerHTML = x.num2TransSizeLab;
document.getElementById("Lab3ValBytes").innerHTML = x.num3TransSizeLab;
            
document.getElementById("jsValPercent").innerHTML = x.percentJS;
document.getElementById("imgValPercent").innerHTML = x.percentImg;
document.getElementById("cssValPercent").innerHTML = x.percentCSS;
document.getElementById("importValPercent").innerHTML = x.percentImFont;
document.getElementById("otherValPercent").innerHTML = x.otherImg;
            
document.getElementById("Lab1ValPercent").innerHTML = x.num1TransSizePercent;
document.getElementById("Lab2ValPercent").innerHTML = x.num2TransSizePercent;
document.getElementById("Lab3ValPercent").innerHTML = x.num3TransSizePercent;
            

            
//Put this here so the square in background color doesn't display while opening / closing the app. Only pushing the button displays it.           
document.getElementById("colorSquare").style.display = 'none';
document.getElementById("colorSquare").style.width = "0px";
document.getElementById("colorSquare").style.height = "0px";
            
            
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
//var yValues = [6 , 4];
var yValues = [x.finalScore, scoreDiff];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;  
        
 case x.finalScore >= 64:
var ctx = document.getElementById('myChart').getContext('2d');
//var yValues = [5 , 5];
var yValues = [x.finalScore, scoreDiff];
var barColors = [
  "#F77616",
  "#f2f2f2",

];
    break;
        
case x.finalScore >= 55:
var ctx = document.getElementById('myChart').getContext('2d');
//var yValues = [4 , 6];
var yValues = [x.finalScore, scoreDiff];
var barColors = [
  "#F77616",
  "#f2f2f2",

];
    break;


    case x.finalScore >= 50:
var ctx = document.getElementById('myChart').getContext('2d');
//var yValues = [3 , 7];
var yValues = [x.finalScore, scoreDiff];
var barColors = [
  "#ff0d21",
  "#f2f2f2",

];
    break;
    
case x.finalScore >= 40:
var ctx = document.getElementById('myChart').getContext('2d');
//var yValues = [2 , 8];
var yValues = [x.finalScore, scoreDiff];
var barColors = [
  "#ff0d21",
  "#f2f2f2",

];
    break;
    
case x.finalScore < 40:
var ctx = document.getElementById('myChart').getContext('2d');
//var yValues = [1 , 9];
var yValues = [x.finalScore, scoreDiff];
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
        
//Random Numbers
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
        


//Lazy Load Bar Size 
var lazyLoadChart = x.lazyLoadChart;
    
switch (lazyLoadChart >= 0){
    
    case lazyLoadChart == 110:
        document.getElementById("lazyBar").innerHTML = "< 5 Images on Page";
        document.getElementById("lazyBar").style.width = "240px";
        document.getElementById("lazyBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid green';
         
        break;
    case lazyLoadChart == 100:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "240px";
        document.getElementById("lazyBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid green';
         
        break;
    case lazyLoadChart >= 95:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "230px";
        document.getElementById("lazyBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid green';
         
        break;
    case lazyLoadChart >= 90:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "220px";
        document.getElementById("lazyBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid green';
         
        break;
    case lazyLoadChart >= 80:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "215px";
        document.getElementById("lazyBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid green';
         
        break;
    case lazyLoadChart >= 75:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "210px";
        document.getElementById("lazyBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid green';
         
        break;
    case lazyLoadChart >= 70:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "200px";
        document.getElementById("lazyBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid green';
         
        break;
    case lazyLoadChart >= 65:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "190px";
        document.getElementById("lazyBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid green';
         
        break;
    case lazyLoadChart >= 60:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "170px";
        document.getElementById("lazyBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid green';
        //document.getElementById("m4").innerHTML = "Grade increases to " + x.LazyLoadMax + " if all images were Lazy Loaded";
        break;
    case lazyLoadChart >= 55:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "150px";
        document.getElementById("lazyBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid yellow';
        //document.getElementById("mLL").innerHTML = x.LazyLoadMax;
//        document.getElementById("m4").innerHTML = "Grade increases to " + x.LazyLoadMax + " if all images were Lazy Loaded";
        break;
    case lazyLoadChart >= 55:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "130px";
        document.getElementById("lazyBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid yellow';
        //document.getElementById("mLL").innerHTML = x.LazyLoadMax;
//        document.getElementById("m4").innerHTML = "Grade increases to " + x.LazyLoadMax + " if all images were Lazy Loaded";
        break;
    case lazyLoadChart >= 40:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "110px";
        document.getElementById("lazyBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid yellow';
        //document.getElementById("mLL").innerHTML = x.LazyLoadMax;
//        document.getElementById("m4").innerHTML = "Grade increases to " + x.LazyLoadMax + " if all images were Lazy Loaded";
        break;
    case lazyLoadChart >= 30:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "90px";
        document.getElementById("lazyBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid yellow';
        //document.getElementById("mLL").innerHTML = x.LazyLoadMax;
//        document.getElementById("m4").innerHTML = "Grade increases to " + x.LazyLoadMax + " if all images were Lazy Loaded";
        break;
    case lazyLoadChart >= 20:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "70px";
        document.getElementById("lazyBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("lazyBar").style.border = '1px solid yellow';
        //document.getElementById("mLL").innerHTML = x.LazyLoadMax;
//        document.getElementById("m4").innerHTML = "Grade increases to " + x.LazyLoadMax + " if all images were Lazy Loaded";
        break;
    case lazyLoadChart >= 10:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "50px";
        document.getElementById("lazyBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("lazyBar").style.border = '1px solid orange';
        //document.getElementById("mLL").innerHTML = x.LazyLoadMax;
//        document.getElementById("m4").innerHTML = "Grade increases to " + x.LazyLoadMax + " if all images were Lazy Loaded";
        break;
    case lazyLoadChart >= 0:
        document.getElementById("lazyBar").innerHTML = x.lazyLoadChart + "%";
        document.getElementById("lazyBar").style.width = "30px";
        document.getElementById("lazyBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("lazyBar").style.border = '1px solid orange';
        //document.getElementById("mLL").innerHTML = x.LazyLoadMax;
//        document.getElementById("m4").innerHTML = "Grade increases to " + x.LazyLoadMax + " if all images were Lazy Loaded";
        break;
}



var svgChart = x.svgChart;

switch (svgChart >= 0){

    case svgChart == 110:
        document.getElementById("svgBar").innerHTML = "< 5 Images on Page";
        document.getElementById("svgBar").style.width = "240px";
        document.getElementById("svgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid green';
        break;
    case svgChart == 100:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "240px";
        document.getElementById("svgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid green';
         
        break;
    case svgChart >= 90:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "220px";
        document.getElementById("svgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid green';
         
        break;
    case svgChart >= 80:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "200px";
        document.getElementById("svgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid green';
         
        break;
    case svgChart >= 70:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "180px";
        document.getElementById("svgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid green';
         
        break;
    case svgChart >= 60:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "140px";
        document.getElementById("svgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid green';
         
        break;
    case svgChart >= 50:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "120px";
        document.getElementById("svgBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid yellow';
         
        break;
    case svgChart >= 40:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "100px";
        document.getElementById("svgBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid yellow';
         
        break;
    case svgChart >= 30:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "80px";
        document.getElementById("svgBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid yellow';
         
        break;
    case svgChart >= 20:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "60px";
        document.getElementById("svgBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("svgBar").style.border = '1px solid yellow';
         
        break;
    case svgChart >= 10:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "50px";
        document.getElementById("svgBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("svgBar").style.border = '1px solid orange';
         
        break;
    case svgChart >= 0:
        document.getElementById("svgBar").innerHTML = x.svgChart + "%";
        document.getElementById("svgBar").style.width = "30px";
        document.getElementById("svgBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("svgBar").style.border = '1px solid orange';
         
        break;
}


var decodedBodySizeChart = x.decodedBodySizeChart;

switch (decodedBodySizeChart >= 0){

    case decodedBodySizeChart <= 150000:
        document.getElementById("byteSizeBar").innerHTML = x.sizeLabel;
        document.getElementById("byteSizeBar").style.width = "240px";
        document.getElementById("byteSizeBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("byteSizeBar").style.border = '1px solid green';
         
        break;
    case decodedBodySizeChart <= 600000:
        document.getElementById("byteSizeBar").innerHTML = x.sizeLabel;
        document.getElementById("byteSizeBar").style.width = "220px";
        document.getElementById("byteSizeBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("byteSizeBar").style.border = '1px solid green';
         
        break;
    case decodedBodySizeChart <= 850000:
        document.getElementById("byteSizeBar").innerHTML = x.sizeLabel;
        document.getElementById("byteSizeBar").style.width = "200px";
        document.getElementById("byteSizeBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("byteSizeBar").style.border = '1px solid green';
        break;
    case decodedBodySizeChart <= 1048576:
        document.getElementById("byteSizeBar").innerHTML = x.sizeLabel;
        document.getElementById("byteSizeBar").style.width = "190px";
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
        document.getElementById("loadBar").style.width = "240px";
        document.getElementById("loadBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("loadTable").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid green';
        document.getElementById("num1LongNameID").innerHTML = x.num1LoadName; 
        document.getElementById("num2LongNameID").innerHTML = x.num2LoadName; 
        document.getElementById("num3LongNameID").innerHTML = x.num3LoadName;
        document.getElementById("num1LongLabID").innerHTML = x.num1LoadLab; 
        document.getElementById("num2LongLabID").innerHTML = x.num2LoadLab; 
        document.getElementById("num3LongLabID").innerHTML = x.num3LoadLab;
        break;
     case loadTimeChart <= 1.5:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "220px";
        document.getElementById("loadBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("loadTable").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid green';
        document.getElementById("num1LongNameID").innerHTML = x.num1LoadName; 
        document.getElementById("num2LongNameID").innerHTML = x.num2LoadName; 
        document.getElementById("num3LongNameID").innerHTML = x.num3LoadName;
        document.getElementById("num1LongLabID").innerHTML = x.num1LoadLab; 
        document.getElementById("num2LongLabID").innerHTML = x.num2LoadLab; 
        document.getElementById("num3LongLabID").innerHTML = x.num3LoadLab;
         
        break;
    case loadTimeChart <= 2:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "200px";
        document.getElementById("loadBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("loadTable").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid green';
        document.getElementById("num1LongNameID").innerHTML = x.num1LoadName; 
        document.getElementById("num2LongNameID").innerHTML = x.num2LoadName; 
        document.getElementById("num3LongNameID").innerHTML = x.num3LoadName;
        document.getElementById("num1LongLabID").innerHTML = x.num1LoadLab; 
        document.getElementById("num2LongLabID").innerHTML = x.num2LoadLab; 
        document.getElementById("num3LongLabID").innerHTML = x.num3LoadLab;
         
        break;
    case loadTimeChart <= 2.5:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "180px";
        document.getElementById("loadBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("loadTable").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid green';
        document.getElementById("num1LongNameID").innerHTML = x.num1LoadName; 
        document.getElementById("num2LongNameID").innerHTML = x.num2LoadName; 
        document.getElementById("num3LongNameID").innerHTML = x.num3LoadName;
        document.getElementById("num1LongLabID").innerHTML = x.num1LoadLab; 
        document.getElementById("num2LongLabID").innerHTML = x.num2LoadLab; 
        document.getElementById("num3LongLabID").innerHTML = x.num3LoadLab;
         
        break;
    case loadTimeChart <= 3:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "160px";
        document.getElementById("loadBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("loadTable").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid green';
        document.getElementById("num1LongNameID").innerHTML = x.num1LoadName; 
        document.getElementById("num2LongNameID").innerHTML = x.num2LoadName; 
        document.getElementById("num3LongNameID").innerHTML = x.num3LoadName;
        document.getElementById("num1LongLabID").innerHTML = x.num1LoadLab; 
        document.getElementById("num2LongLabID").innerHTML = x.num2LoadLab; 
        document.getElementById("num3LongLabID").innerHTML = x.num3LoadLab;
         
        break;
    case loadTimeChart <= 3.5:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "140px";
        document.getElementById("loadBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("loadTable").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid green';
        document.getElementById("num1LongNameID").innerHTML = x.num1LoadName; 
        document.getElementById("num2LongNameID").innerHTML = x.num2LoadName; 
        document.getElementById("num3LongNameID").innerHTML = x.num3LoadName;
        document.getElementById("num1LongLabID").innerHTML = x.num1LoadLab; 
        document.getElementById("num2LongLabID").innerHTML = x.num2LoadLab; 
        document.getElementById("num3LongLabID").innerHTML = x.num3LoadLab;
        break;
    case loadTimeChart <= 4:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "120px";
        document.getElementById("loadBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("loadTable").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid yellow';
        document.getElementById("num1LongNameID").innerHTML = x.num1LoadName; 
        document.getElementById("num2LongNameID").innerHTML = x.num2LoadName; 
        document.getElementById("num3LongNameID").innerHTML = x.num3LoadName;
        document.getElementById("num1LongLabID").innerHTML = x.num1LoadLab; 
        document.getElementById("num2LongLabID").innerHTML = x.num2LoadLab; 
        document.getElementById("num3LongLabID").innerHTML = x.num3LoadLab;
        break;
    case loadTimeChart <= 5:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "110px";
        document.getElementById("loadBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("loadTable").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid yellow';
        document.getElementById("num1LongNameID").innerHTML = x.num1LoadName; 
        document.getElementById("num2LongNameID").innerHTML = x.num2LoadName; 
        document.getElementById("num3LongNameID").innerHTML = x.num3LoadName;
        document.getElementById("num1LongLabID").innerHTML = x.num1LoadLab; 
        document.getElementById("num2LongLabID").innerHTML = x.num2LoadLab; 
        document.getElementById("num3LongLabID").innerHTML = x.num3LoadLab;
         
        break;
    case loadTimeChart <= 6:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "100px";
        document.getElementById("loadBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("loadTable").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid yellow';
        document.getElementById("num1LongNameID").innerHTML = x.num1LoadName; 
        document.getElementById("num2LongNameID").innerHTML = x.num2LoadName; 
        document.getElementById("num3LongNameID").innerHTML = x.num3LoadName;
        document.getElementById("num1LongLabID").innerHTML = x.num1LoadLab; 
        document.getElementById("num2LongLabID").innerHTML = x.num2LoadLab; 
        document.getElementById("num3LongLabID").innerHTML = x.num3LoadLab;
        break;
    case loadTimeChart <= 7:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "80px";
        document.getElementById("loadBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("loadTable").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid yellow';
        document.getElementById("num1LongNameID").innerHTML = x.num1LoadName; 
        document.getElementById("num2LongNameID").innerHTML = x.num2LoadName; 
        document.getElementById("num3LongNameID").innerHTML = x.num3LoadName;
        document.getElementById("num1LongLabID").innerHTML = x.num1LoadLab; 
        document.getElementById("num2LongLabID").innerHTML = x.num2LoadLab; 
        document.getElementById("num3LongLabID").innerHTML = x.num3LoadLab;
        break;
    case loadTimeChart <= 8:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "60px";
        document.getElementById("loadBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("loadTable").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid orange';
        document.getElementById("num1LongNameID").innerHTML = x.num1LoadName; 
        document.getElementById("num2LongNameID").innerHTML = x.num2LoadName; 
        document.getElementById("num3LongNameID").innerHTML = x.num3LoadName;
        document.getElementById("num1LongLabID").innerHTML = x.num1LoadLab; 
        document.getElementById("num2LongLabID").innerHTML = x.num2LoadLab; 
        document.getElementById("num3LongLabID").innerHTML = x.num3LoadLab;
        break;
    case loadTimeChart <= 10:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "45px";
        document.getElementById("loadBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("loadTable").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid orange';
        document.getElementById("num1LongNameID").innerHTML = x.num1LoadName; 
        document.getElementById("num2LongNameID").innerHTML = x.num2LoadName; 
        document.getElementById("num3LongNameID").innerHTML = x.num3LoadName;
        document.getElementById("num1LongLabID").innerHTML = x.num1LoadLab; 
        document.getElementById("num2LongLabID").innerHTML = x.num2LoadLab; 
        document.getElementById("num3LongLabID").innerHTML = x.num3LoadLab;
        break;
    case loadTimeChart > 10:
        document.getElementById("loadBar").innerHTML = x.loadTimeChart + " sec";
        document.getElementById("loadBar").style.width = "35px";
        document.getElementById("loadBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("loadTable").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("loadBar").style.border = '1px solid orange';
        document.getElementById("num1LongNameID").innerHTML = x.num1LoadName; 
        document.getElementById("num2LongNameID").innerHTML = x.num2LoadName; 
        document.getElementById("num3LongNameID").innerHTML = x.num3LoadName;
        document.getElementById("num1LongLabID").innerHTML = x.num1LoadLab; 
        document.getElementById("num2LongLabID").innerHTML = x.num2LoadLab; 
        document.getElementById("num3LongLabID").innerHTML = x.num3LoadLab;
        break;
}

//document.getElementById("jsBar").style.width = "150px";

var jsChart = x.jsChart;

switch (jsChart >= 0){

    case jsChart <= 10000000:
        document.getElementById("jsBar").innerHTML = x.jssSizeLabel;
        document.getElementById("jsBar").style.width = "240px";
        document.getElementById("jsBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("jsBar").style.border = '1px solid green';
         
        break;
    case jsChart <= 15000000:
        document.getElementById("jsBar").innerHTML = x.jssSizeLabel;
        document.getElementById("jsBar").style.width = "230px";
        document.getElementById("jsBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("jsBar").style.border = '1px solid green';
         
        break;
    case jsChart <= 20000000:
        document.getElementById("jsBar").innerHTML = x.jssSizeLabel;
        document.getElementById("jsBar").style.width = "220px";
        document.getElementById("jsBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("jsBar").style.border = '1px solid green';
         
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
         
        break;
    case jsChart <= 35000000:
        document.getElementById("jsBar").innerHTML = x.jssSizeLabel;
        document.getElementById("jsBar").style.width = "160px";
        document.getElementById("jsBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("jsBar").style.border = '1px solid yellow';
         
        break;
    case jsChart <= 40000000:
        document.getElementById("jsBar").innerHTML = x.jssSizeLabel;
        document.getElementById("jsBar").style.width = "140px";
        document.getElementById("jsBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("jsBar").style.border = '1px solid yellow';
         
        break;
    case jsChart <= 45000000:
        document.getElementById("jsBar").innerHTML = x.jssSizeLabel;
        document.getElementById("jsBar").style.width = "120px";
        document.getElementById("jsBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("jsBar").style.border = '1px solid orange';
         
        break;
    case jsChart <= 50000000:
        document.getElementById("jsBar").innerHTML = x.jssSizeLabel;
        document.getElementById("jsBar").style.width = "100px";
        document.getElementById("jsBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("jsBar").style.border = '1px solid orange';
         
        break;
    case jsChart > 50000000:
        document.getElementById("jsBar").innerHTML = x.jssSizeLabel;
        document.getElementById("jsBar").style.width = "80px";
        document.getElementById("jsBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("jsBar").style.border = '1px solid orange';
         
        break;
}






var importChart = x.importChart;


switch (importChart >= 0){

    case importChart == 0:
        document.getElementById("fontBar").style.width = "240px";
        document.getElementById("fontBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("fontBar").style.border = '1px solid green';
        document.getElementById("fontBar").innerHTML = 'No';
         
        break;
    case importChart == 1:
        document.getElementById("fontBar").style.width = "30px";
        document.getElementById("fontBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("fontBar").style.border = '1px solid orange';
        document.getElementById("fontBar").innerHTML = 'Yes';
         
        break;
}


var htmlChart = x.htmlChart;

switch (htmlChart >= 0){

    case htmlChart <= 200001:
        document.getElementById("htmlBar").innerHTML = x.lengthK;
        document.getElementById("htmlBar").style.width = "240px";
        document.getElementById("htmlBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("htmlBar").style.border = '1px solid green';
         
        break;
    case htmlChart <= 250001:
        document.getElementById("htmlBar").innerHTML = x.lengthK;
        document.getElementById("htmlBar").style.width = "230px";
        document.getElementById("htmlBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("htmlBar").style.border = '1px solid green';
         
        break;
    case htmlChart <= 300001:
        document.getElementById("htmlBar").innerHTML = x.lengthK;
        document.getElementById("htmlBar").style.width = "220px";
        document.getElementById("htmlBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("htmlBar").style.border = '1px solid green';
         
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
         
        break;
   case htmlChart <= 750001:
        document.getElementById("htmlBar").innerHTML = x.lengthK;
        document.getElementById("htmlBar").style.width = "140px";
        document.getElementById("htmlBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("htmlBar").style.border = '1px solid yellow';
         
        break;
   case htmlChart <= 1000001:
        document.getElementById("htmlBar").innerHTML = x.lengthK;
        document.getElementById("htmlBar").style.width = "120px";
        document.getElementById("htmlBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("htmlBar").style.border = '1px solid yellow';
         
        break;
    case htmlChart <= 2500000:
        document.getElementById("htmlBar").innerHTML = x.lengthK;
        document.getElementById("htmlBar").style.width = "100px";
        document.getElementById("htmlBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("htmlBar").style.border = '1px solid orange';
         
        break;
   case htmlChart <= 4000000:
        document.getElementById("htmlBar").innerHTML = x.lengthK;
        document.getElementById("htmlBar").style.width = "80px";
        document.getElementById("htmlBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("htmlBar").style.border = '1px solid orange';
         
        break;
   case htmlChart >= 4000000:
        document.getElementById("htmlBar").innerHTML = x.lengthK;
        document.getElementById("htmlBar").style.width = "60px";
        document.getElementById("htmlBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("htmlBar").style.border = '1px solid orange';
         
        break;
}
            
        
var transferSizeChart = x.transferSizeChart;

switch (transferSizeChart >= 0){

    case transferSizeChart == 0:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "240px";
        document.getElementById("transferBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid green';
        document.getElementById("num1TransSizeLabID").innerHTML = x.num1TransSizeLab;
        document.getElementById("num2TransSizeLabID").innerHTML = x.num2TransSizeLab;
        document.getElementById("num3TransSizeLabID").innerHTML = x.num3TransSizeLab;
        document.getElementById("num1TransNameID").innerHTML = x.num1TransName;
        document.getElementById("num2TransNameID").innerHTML = x.num2TransName;
        document.getElementById("num3TransNameID").innerHTML = x.num3TransName;
        document.getElementById("jsTableVal").innerHTML = x.jsSizeLab;
        document.getElementById("imgTableVal").innerHTML = x.imgTransSizeLab;
        document.getElementById("cssTableVal").innerHTML = x.CSSSizeLab;
        document.getElementById("importTableVal").innerHTML = x.importedFontSizeLab;
        document.getElementById("otherTableVal").innerHTML = x.otherTransSizeLab;
        break;
    case transferSizeChart <= 100000:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "240px";
        document.getElementById("transferBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid green';
        document.getElementById("num1TransSizeLabID").innerHTML = x.num1TransSizeLab;
        document.getElementById("num2TransSizeLabID").innerHTML = x.num2TransSizeLab;
        document.getElementById("num3TransSizeLabID").innerHTML = x.num3TransSizeLab;
        document.getElementById("num1TransNameID").innerHTML = x.num1TransName;
        document.getElementById("num2TransNameID").innerHTML = x.num2TransName;
        document.getElementById("num3TransNameID").innerHTML = x.num3TransName;
        document.getElementById("jsTableVal").innerHTML = x.jsSizeLab;
        document.getElementById("imgTableVal").innerHTML = x.imgTransSizeLab;
        document.getElementById("cssTableVal").innerHTML = x.CSSSizeLab;
        document.getElementById("importTableVal").innerHTML = x.importedFontSizeLab;
        document.getElementById("otherTableVal").innerHTML = x.otherTransSizeLab;
        break;
    case transferSizeChart <= 200000:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "230px";
        document.getElementById("transferBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid green';
        document.getElementById("num1TransSizeLabID").innerHTML = x.num1TransSizeLab;
        document.getElementById("num2TransSizeLabID").innerHTML = x.num2TransSizeLab;
        document.getElementById("num3TransSizeLabID").innerHTML = x.num3TransSizeLab;
        document.getElementById("num1TransNameID").innerHTML = x.num1TransName;
        document.getElementById("num2TransNameID").innerHTML = x.num2TransName;
        document.getElementById("num3TransNameID").innerHTML = x.num3TransName;
        document.getElementById("jsTableVal").innerHTML = x.jsSizeLab;
        document.getElementById("imgTableVal").innerHTML = x.imgTransSizeLab;
        document.getElementById("cssTableVal").innerHTML = x.CSSSizeLab;
        document.getElementById("importTableVal").innerHTML = x.importedFontSizeLab;
        document.getElementById("otherTableVal").innerHTML = x.otherTransSizeLab;
        break;
    case transferSizeChart <= 400000:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "220px";
        document.getElementById("transferBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid green';
        document.getElementById("num1TransSizeLabID").innerHTML = x.num1TransSizeLab;
        document.getElementById("num2TransSizeLabID").innerHTML = x.num2TransSizeLab;
        document.getElementById("num3TransSizeLabID").innerHTML = x.num3TransSizeLab;
        document.getElementById("num1TransNameID").innerHTML = x.num1TransName;
        document.getElementById("num2TransNameID").innerHTML = x.num2TransName;
        document.getElementById("num3TransNameID").innerHTML = x.num3TransName;
        document.getElementById("jsTableVal").innerHTML = x.jsSizeLab;
        document.getElementById("imgTableVal").innerHTML = x.imgTransSizeLab;
        document.getElementById("cssTableVal").innerHTML = x.CSSSizeLab;
        document.getElementById("importTableVal").innerHTML = x.importedFontSizeLab;
        document.getElementById("otherTableVal").innerHTML = x.otherTransSizeLab;
        break;
    case transferSizeChart <= 600000:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "200px";
        document.getElementById("transferBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid green';
        document.getElementById("num1TransSizeLabID").innerHTML = x.num1TransSizeLab;
        document.getElementById("num2TransSizeLabID").innerHTML = x.num2TransSizeLab;
        document.getElementById("num3TransSizeLabID").innerHTML = x.num3TransSizeLab;
        document.getElementById("num1TransNameID").innerHTML = x.num1TransName;
        document.getElementById("num2TransNameID").innerHTML = x.num2TransName;
        document.getElementById("num3TransNameID").innerHTML = x.num3TransName;
        document.getElementById("jsTableVal").innerHTML = x.jsSizeLab;
        document.getElementById("imgTableVal").innerHTML = x.imgTransSizeLab;
        document.getElementById("cssTableVal").innerHTML = x.CSSSizeLab;
        document.getElementById("importTableVal").innerHTML = x.importedFontSizeLab;
        document.getElementById("otherTableVal").innerHTML = x.otherTransSizeLab;
        break;
    case transferSizeChart <= 850000:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "180px";
        document.getElementById("transferBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid green';
        document.getElementById("num1TransSizeLabID").innerHTML = x.num1TransSizeLab;
        document.getElementById("num2TransSizeLabID").innerHTML = x.num2TransSizeLab;
        document.getElementById("num3TransSizeLabID").innerHTML = x.num3TransSizeLab;
        document.getElementById("num1TransNameID").innerHTML = x.num1TransName;
        document.getElementById("num2TransNameID").innerHTML = x.num2TransName;
        document.getElementById("num3TransNameID").innerHTML = x.num3TransName;
        document.getElementById("jsTableVal").innerHTML = x.jsSizeLab;
        document.getElementById("imgTableVal").innerHTML = x.imgTransSizeLab;
        document.getElementById("cssTableVal").innerHTML = x.CSSSizeLab;
        document.getElementById("importTableVal").innerHTML = x.importedFontSizeLab;
        document.getElementById("otherTableVal").innerHTML = x.otherTransSizeLab;
        break;
    case transferSizeChart <= 1048576:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "160px";
        document.getElementById("transferBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid green';
        document.getElementById("num1TransSizeLabID").innerHTML = x.num1TransSizeLab;
        document.getElementById("num2TransSizeLabID").innerHTML = x.num2TransSizeLab;
        document.getElementById("num3TransSizeLabID").innerHTML = x.num3TransSizeLab;
        document.getElementById("num1TransNameID").innerHTML = x.num1TransName;
        document.getElementById("num2TransNameID").innerHTML = x.num2TransName;
        document.getElementById("num3TransNameID").innerHTML = x.num3TransName;
        document.getElementById("jsTableVal").innerHTML = x.jsSizeLab;
        document.getElementById("imgTableVal").innerHTML = x.imgTransSizeLab;
        document.getElementById("cssTableVal").innerHTML = x.CSSSizeLab;
        document.getElementById("importTableVal").innerHTML = x.importedFontSizeLab;
        document.getElementById("otherTableVal").innerHTML = x.otherTransSizeLab;
        break
    case transferSizeChart <= 1348576:
    document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "140px";
        document.getElementById("transferBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid yellow';
        document.getElementById("num1TransSizeLabID").innerHTML = x.num1TransSizeLab;
        document.getElementById("num2TransSizeLabID").innerHTML = x.num2TransSizeLab;
        document.getElementById("num3TransSizeLabID").innerHTML = x.num3TransSizeLab;
        document.getElementById("num1TransNameID").innerHTML = x.num1TransName;
        document.getElementById("num2TransNameID").innerHTML = x.num2TransName;
        document.getElementById("num3TransNameID").innerHTML = x.num3TransName;
        document.getElementById("jsTableVal").innerHTML = x.jsSizeLab;
        document.getElementById("imgTableVal").innerHTML = x.imgTransSizeLab;
        document.getElementById("cssTableVal").innerHTML = x.CSSSizeLab;
        document.getElementById("importTableVal").innerHTML = x.importedFontSizeLab;
        document.getElementById("otherTableVal").innerHTML = x.otherTransSizeLab;
        break;
    case transferSizeChart <= 1572864:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "120px";
        document.getElementById("transferBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid yellow';
        document.getElementById("num1TransSizeLabID").innerHTML = x.num1TransSizeLab;
        document.getElementById("num2TransSizeLabID").innerHTML = x.num2TransSizeLab;
        document.getElementById("num3TransSizeLabID").innerHTML = x.num3TransSizeLab;
        document.getElementById("num1TransNameID").innerHTML = x.num1TransName;
        document.getElementById("num2TransNameID").innerHTML = x.num2TransName;
        document.getElementById("num3TransNameID").innerHTML = x.num3TransName;
        document.getElementById("jsTableVal").innerHTML = x.jsSizeLab;
        document.getElementById("imgTableVal").innerHTML = x.imgTransSizeLab;
        document.getElementById("cssTableVal").innerHTML = x.CSSSizeLab;
        document.getElementById("importTableVal").innerHTML = x.importedFontSizeLab;
        document.getElementById("otherTableVal").innerHTML = x.otherTransSizeLab;
        break;
    case transferSizeChart <= 2621440:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "100px";
        document.getElementById("transferBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid yellow';
        document.getElementById("num1TransSizeLabID").innerHTML = x.num1TransSizeLab;
        document.getElementById("num2TransSizeLabID").innerHTML = x.num2TransSizeLab;
        document.getElementById("num3TransSizeLabID").innerHTML = x.num3TransSizeLab;
        document.getElementById("num1TransNameID").innerHTML = x.num1TransName;
        document.getElementById("num2TransNameID").innerHTML = x.num2TransName;
        document.getElementById("num3TransNameID").innerHTML = x.num3TransName;
        document.getElementById("jsTableVal").innerHTML = x.jsSizeLab;
        document.getElementById("imgTableVal").innerHTML = x.imgTransSizeLab;
        document.getElementById("cssTableVal").innerHTML = x.CSSSizeLab;
        document.getElementById("importTableVal").innerHTML = x.importedFontSizeLab;
        document.getElementById("otherTableVal").innerHTML = x.otherTransSizeLab;
        break;
    case transferSizeChart <= 3670016:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "80px";
        document.getElementById("transferBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid yellow';
        document.getElementById("num1TransSizeLabID").innerHTML = x.num1TransSizeLab;
        document.getElementById("num2TransSizeLabID").innerHTML = x.num2TransSizeLab;
        document.getElementById("num3TransSizeLabID").innerHTML = x.num3TransSizeLab;
        document.getElementById("num1TransNameID").innerHTML = x.num1TransName;
        document.getElementById("num2TransNameID").innerHTML = x.num2TransName;
        document.getElementById("num3TransNameID").innerHTML = x.num3TransName;
        document.getElementById("jsTableVal").innerHTML = x.jsSizeLab;
        document.getElementById("imgTableVal").innerHTML = x.imgTransSizeLab;
        document.getElementById("cssTableVal").innerHTML = x.CSSSizeLab;
        document.getElementById("importTableVal").innerHTML = x.importedFontSizeLab;
        document.getElementById("otherTableVal").innerHTML = x.otherTransSizeLab;
        break;
    case transferSizeChart <= 5242880:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "60px";
        document.getElementById("transferBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid orange';
        document.getElementById("num1TransSizeLabID").innerHTML = x.num1TransSizeLab;
        document.getElementById("num2TransSizeLabID").innerHTML = x.num2TransSizeLab;
        document.getElementById("num3TransSizeLabID").innerHTML = x.num3TransSizeLab;
        document.getElementById("num1TransNameID").innerHTML = x.num1TransName;
        document.getElementById("num2TransNameID").innerHTML = x.num2TransName;
        document.getElementById("num3TransNameID").innerHTML = x.num3TransName;
        document.getElementById("jsTableVal").innerHTML = x.jsSizeLab;
        document.getElementById("imgTableVal").innerHTML = x.imgTransSizeLab;
        document.getElementById("cssTableVal").innerHTML = x.CSSSizeLab;
        document.getElementById("importTableVal").innerHTML = x.importedFontSizeLab;
        document.getElementById("otherTableVal").innerHTML = x.otherTransSizeLab;
        break;
    case transferSizeChart > 5242880:
        document.getElementById("transferBar").innerHTML = x.transferLabel;
        document.getElementById("transferBar").style.width = "40px";
        document.getElementById("transferBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("transferBar").style.border = '1px solid orange';
        document.getElementById("num1TransSizeLabID").innerHTML = x.num1TransSizeLab;
        document.getElementById("num2TransSizeLabID").innerHTML = x.num2TransSizeLab;
        document.getElementById("num3TransSizeLabID").innerHTML = x.num3TransSizeLab;
        document.getElementById("num1TransNameID").innerHTML = x.num1TransName;
        document.getElementById("num2TransNameID").innerHTML = x.num2TransName;
        document.getElementById("num3TransNameID").innerHTML = x.num3TransName;
        document.getElementById("jsTableVal").innerHTML = x.jsSizeLab;
        document.getElementById("imgTableVal").innerHTML = x.imgTransSizeLab;
        document.getElementById("cssTableVal").innerHTML = x.CSSSizeLab;
        document.getElementById("importTableVal").innerHTML = x.importedFontSizeLab;
        document.getElementById("otherTableVal").innerHTML = x.otherTransSizeLab;
        break;
}
            
            

var resImgChart = x.resImgChart;

switch (resImgChart >= 0){

    case resImgChart == 110:
        document.getElementById("resImgBar").innerHTML = "No Images on Page";
        document.getElementById("resImgBar").style.width = "240px";
        document.getElementById("resImgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid green';
        break;
    case resImgChart == 100:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "240px";
        document.getElementById("resImgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid green';
         
        break;
    case resImgChart >= 90:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "230px";
        document.getElementById("resImgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid green';
         
        break;
    case resImgChart >= 80:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "220px";
        document.getElementById("resImgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid green';
         
        break;
    case resImgChart >= 70:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "200px";
        document.getElementById("resImgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid green';
        document.getElementById("m4").innerHTML = "Grade increases to " + x.resMax + " if all images were responsive"; 
        break;
    case resImgChart >= 60:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "140px";
        document.getElementById("resImgBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid green';
        document.getElementById("m4").innerHTML = "Grade increases to " + x.resMax + " if all images were responsive"; 
        break;
    case resImgChart >= 50:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "120px";
        document.getElementById("resImgBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid yellow';
//        document.getElementById("m4").innerHTML = "Grade increases to " + x.resMax + " if all images were responsive"; 
        break;
    case resImgChart >= 40:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "100px";
        document.getElementById("resImgBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid yellow';
//        document.getElementById("m4").innerHTML = "Grade increases to " + x.resMax + " if all images were responsive"; 
        break;
    case resImgChart >= 30:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "80px";
        document.getElementById("resImgBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid yellow';
//        document.getElementById("m4").innerHTML = "Grade increases to " + x.resMax + " if all images were responsive"; 
        break;
    case resImgChart >= 20:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "60px";
        document.getElementById("resImgBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("resImgBar").style.border = '1px solid yellow';
         
        break;
    case resImgChart >= 10:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "50px";
        document.getElementById("resImgBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("resImgBar").style.border = '1px solid orange';
//        document.getElementById("m4").innerHTML = "Grade increases to " + x.resMax + " if all images were responsive"; 
        break;
    case resImgChart >= 0:
        document.getElementById("resImgBar").innerHTML = resImgChart + "%";
        document.getElementById("resImgBar").style.width = "30px";
        document.getElementById("resImgBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("resImgBar").style.border = '1px solid orange';
//        document.getElementById("m4").innerHTML = "Grade increases to " + x.resMax + " if all images were responsive"; 
        break;
}
            
var intStyleSheet = x.intStyleSheet;

switch (intStyleSheet >= 0){

    case intStyleSheet == 0:
        document.getElementById("intStyleBar").innerHTML = "0 found";
        document.getElementById("intStyleBar").style.width = "240px";
        document.getElementById("intStyleBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("intStyleBar").style.border = '1px solid green';
        break;
    case intStyleSheet == 1:
        document.getElementById("intStyleBar").innerHTML = "1";
        document.getElementById("intStyleBar").style.width = "240px";
        document.getElementById("intStyleBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("intStyleBar").style.border = '1px solid green';
        break;
    case intStyleSheet == 2:
        document.getElementById("intStyleBar").innerHTML = "2";
        document.getElementById("intStyleBar").style.width = "230px";
        document.getElementById("intStyleBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("intStyleBar").style.border = '1px solid green';
        break;
    case intStyleSheet == 3:
        document.getElementById("intStyleBar").innerHTML = "3";
        document.getElementById("intStyleBar").style.width = "220px";
        document.getElementById("intStyleBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("intStyleBar").style.border = '1px solid green';
        break;
    case intStyleSheet == 4:
        document.getElementById("intStyleBar").innerHTML = "4";
        document.getElementById("intStyleBar").style.width = "200px";
        document.getElementById("intStyleBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("intStyleBar").style.border = '1px solid green';
        break;
    case intStyleSheet == 5:
        document.getElementById("intStyleBar").innerHTML = "5";
        document.getElementById("intStyleBar").style.width = "140px";
        document.getElementById("intStyleBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("intStyleBar").style.border = '1px solid green';
        break;
    case intStyleSheet == 6:
        document.getElementById("intStyleBar").innerHTML = "6";
        document.getElementById("intStyleBar").style.width = "120px";
        document.getElementById("intStyleBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("intStyleBar").style.border = '1px solid yellow';
        break;
    case intStyleSheet == 7:
        document.getElementById("intStyleBar").innerHTML = "7";
        document.getElementById("intStyleBar").style.width = "100px";
        document.getElementById("intStyleBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("intStyleBar").style.border = '1px solid yellow';
        break;
    case intStyleSheet == 8:
        document.getElementById("intStyleBar").innerHTML = "8";
        document.getElementById("intStyleBar").style.width = "80px";
        document.getElementById("intStyleBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("intStyleBar").style.border = '1px solid yellow'; 
        break;
    case intStyleSheet == 9:
        document.getElementById("intStyleBar").innerHTML = "9";
        document.getElementById("intStyleBar").style.width = "60px";
        document.getElementById("intStyleBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("intStyleBar").style.border = '1px solid yellow'; 
        break;
    case intStyleSheet == 10:
        document.getElementById("intStyleBar").innerHTML = "10";
        document.getElementById("intStyleBar").style.width = "50px";
        document.getElementById("intStyleBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("intStyleBar").style.border = '1px solid orange';
        break;
    case intStyleSheet > 10:
        document.getElementById("intStyleBar").innerHTML = ">10";
        document.getElementById("intStyleBar").style.width = "30px";
        document.getElementById("intStyleBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("intStyleBar").style.border = '1px solid orange';
        break;
}
            
var numStyleSheet = x.numStyleSheet;
            
//numStyleSheet

switch (numStyleSheet >= 0){

    case numStyleSheet == 0:
        document.getElementById("numStyleBar").innerHTML = "0";
        document.getElementById("numStyleBar").style.width = "240px";
        document.getElementById("numStyleBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("numStyleBar").style.border = '1px solid green';
        document.getElementById('extStyleTextA').innerHTML = x.styleSheetSources;
        document.getElementById('extSSDiv').style.display = 'none';
        break;
    case x.cssTransLabel === 'All style sheets cached!':
        document.getElementById("numStyleBar").innerHTML = x.cssTransLabel;
        document.getElementById("numStyleBar").style.width = "240px";
        document.getElementById("numStyleBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("numStyleBar").style.border = '1px solid green';
        document.getElementById('extStyleTextA').innerHTML = x.styleSheetSources;
        document.getElementById('extStyleTextA').style.display = "block";
        document.getElementById('extStyleHeader').innerHTML = 'External Style Sheet Sources: ' + 'All style sheets cached!';
        document.getElementById("extSSDiv").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById('extStyleTextA').rows = "3";
        break;
    case numStyleSheet == 1:
        document.getElementById("numStyleBar").innerHTML = "1";
        document.getElementById("numStyleBar").style.width = "240px";
        document.getElementById("numStyleBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("numStyleBar").style.border = '1px solid green';
        document.getElementById('extStyleTextA').innerHTML = x.styleSheetSources;
        document.getElementById('extStyleTextA').style.display = "block";
        document.getElementById('extStyleHeader').innerHTML = 'External Style Sheet Sources: ' + numStyleSheet;
        document.getElementById("extSSDiv").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById('extStyleTextA').rows = "3";
        break;
    case numStyleSheet == 2:
        document.getElementById("numStyleBar").innerHTML = "2";
        document.getElementById("numStyleBar").style.width = "230px";
        document.getElementById("numStyleBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("numStyleBar").style.border = '1px solid green';
        document.getElementById('extStyleTextA').innerHTML = x.styleSheetSources;
        document.getElementById('extStyleTextA').style.display = "block";
        document.getElementById('extStyleHeader').innerHTML = 'External Style Sheet Sources: ' + numStyleSheet;
        document.getElementById("extSSDiv").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById('extStyleTextA').rows = "4";
        break;
    case numStyleSheet == 3:
        document.getElementById("numStyleBar").innerHTML = "3";
        document.getElementById("numStyleBar").style.width = "220px";
        document.getElementById("numStyleBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("numStyleBar").style.border = '1px solid green';
        document.getElementById('extStyleTextA').innerHTML = x.styleSheetSources;
        document.getElementById('extStyleTextA').style.display = "block";
        document.getElementById('extStyleHeader').innerHTML = 'External Style Sheet Sources: ' + numStyleSheet;
        document.getElementById("extSSDiv").style.background = 'rgba(142, 202, 46, 0.5)';
        break;
    case numStyleSheet == 4:
        document.getElementById("numStyleBar").innerHTML = "4";
        document.getElementById("numStyleBar").style.width = "200px";
        document.getElementById("numStyleBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("numStyleBar").style.border = '1px solid green';
        document.getElementById('extStyleTextA').innerHTML = x.styleSheetSources;
        document.getElementById('extStyleTextA').style.display = "block";
        document.getElementById('extStyleHeader').innerHTML = 'External Style Sheet Sources: ' + numStyleSheet;
        document.getElementById("extSSDiv").style.background = 'rgba(142, 202, 46, 0.5)'; 
        break;
    case numStyleSheet == 5:
        document.getElementById("numStyleBar").innerHTML = "5";
        document.getElementById("numStyleBar").style.width = "140px";
        document.getElementById("numStyleBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("extSSDiv").style.background = 'rgba(142, 202, 46, 0.3)';
        document.getElementById("numStyleBar").style.border = '1px solid green';
        document.getElementById('extStyleTextA').innerHTML = x.styleSheetSources;
        document.getElementById('extStyleTextA').style.display = "block";
        document.getElementById('extStyleHeader').innerHTML = 'External Style Sheet Sources: ' + numStyleSheet;
        document.getElementById("extSSDiv").style.background = 'rgba(142, 202, 46, 0.5)'; 
        break;
    case numStyleSheet == 6:
        document.getElementById("numStyleBar").innerHTML = "6";
        document.getElementById("numStyleBar").style.width = "120px";
        document.getElementById("numStyleBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("numStyleBar").style.border = '1px solid yellow';
        document.getElementById('extStyleTextA').innerHTML = x.styleSheetSources;
        document.getElementById('extStyleTextA').style.display = "block";
        document.getElementById('extStyleHeader').innerHTML = 'External Style Sheet Sources: ' + numStyleSheet;
        document.getElementById("extSSDiv").style.background = 'rgba(235, 220, 61, 0.5)';  
        break;
    case numStyleSheet == 7:
        document.getElementById("numStyleBar").innerHTML = "7";
        document.getElementById("numStyleBar").style.width = "100px";
        document.getElementById("numStyleBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("numStyleBar").style.border = '1px solid yellow';
        document.getElementById('extStyleTextA').innerHTML = x.styleSheetSources;
        document.getElementById('extStyleTextA').style.display = "block";
        document.getElementById('extStyleHeader').innerHTML = 'External Style Sheet Sources: ' + numStyleSheet;
        document.getElementById("extSSDiv").style.background = 'rgba(235, 220, 61, 0.5)';  
        break;
    case numStyleSheet == 8:
        document.getElementById("numStyleBar").innerHTML = "8";
        document.getElementById("numStyleBar").style.width = "80px";
        document.getElementById("numStyleBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("numStyleBar").style.border = '1px solid yellow';
        document.getElementById('extStyleTextA').innerHTML = x.styleSheetSources;
        document.getElementById('extStyleTextA').style.display = "block";
        document.getElementById('extStyleHeader').innerHTML = 'External Style Sheet Sources: ' + numStyleSheet;
        document.getElementById("extSSDiv").style.background = 'rgba(235, 220, 61, 0.5)';  
        break;
    case numStyleSheet == 9:
        document.getElementById("numStyleBar").innerHTML = "9";
        document.getElementById("numStyleBar").style.width = "60px";
        document.getElementById("numStyleBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("numStyleBar").style.border = '1px solid yellow';
        document.getElementById('extStyleTextA').innerHTML = x.styleSheetSources;
        document.getElementById('extStyleTextA').style.display = "block";
        document.getElementById('extStyleHeader').innerHTML = 'External Style Sheet Sources: ' + numStyleSheet;
        document.getElementById("extSSDiv").style.background = 'rgba(235, 220, 61, 0.5)'; 
        break;
    case numStyleSheet == 10:
        document.getElementById("numStyleBar").innerHTML = "10";
        document.getElementById("numStyleBar").style.width = "50px";
        document.getElementById("numStyleBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("numStyleBar").style.border = '1px solid orange';
        document.getElementById('extStyleTextA').innerHTML = x.styleSheetSources;
        document.getElementById('extStyleTextA').style.display = "block";
        document.getElementById('extStyleHeader').innerHTML = 'External Style Sheet Sources: ' + numStyleSheet;
        document.getElementById("extSSDiv").style.background = 'rgba(241, 137, 49, .5)'; 
        break;
    case numStyleSheet > 10:
        document.getElementById("numStyleBar").innerHTML = ">10";
        document.getElementById("numStyleBar").style.width = "30px";
        document.getElementById("numStyleBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("numStyleBar").style.border = '1px solid orange';
        document.getElementById('extStyleTextA').innerHTML = x.styleSheetSources;
        document.getElementById('extStyleTextA').style.display = "block";
        document.getElementById('extStyleHeader').innerHTML = 'External Style Sheet Sources: ' + numStyleSheet;
        document.getElementById("extSSDiv").style.background = 'rgba(241, 137, 49, .5)';
        break;
}
            
var redirects = x.redirects;


switch (redirects >= 0){

    case redirects == 0:
        document.getElementById("redirectBar").style.width = "240px";
        document.getElementById("redirectBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("redirectBar").style.border = '1px solid green';
        document.getElementById("redirectBar").innerHTML = 'No redirects';
         
        break;
    case redirects >= 1:
        document.getElementById("redirectBar").style.width = "30px";
        document.getElementById("redirectBar").style.background = 'rgba(241, 137, 49, 0.5)';
        document.getElementById("redirectBar").style.border = '1px solid orange';
        document.getElementById("redirectBar").innerHTML = 'Yes';
         
        break;
}
            
var cookieLen = x.cookieLen;

switch (cookieLen >= 0){
        
    
    case cookieLen == 1:
        document.getElementById("cookieBar").innerHTML = 0;
        document.getElementById("cookieBar").style.width = "240px";
        document.getElementById("cookieBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("cookieBar").style.border = '1px solid green';
        document.getElementById("cookDiv").style.background = 'rgba(142, 202, 46, 0.5)'; 
        document.getElementById('cookDiv').style.display = "none";
        break;
    case cookieLen == 2:
        document.getElementById("cookieBar").innerHTML = cookieLen;
        document.getElementById("cookieBar").style.width = "240px";
        document.getElementById("cookieBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("cookieBar").style.border = '1px solid green';
        document.getElementById("cookDiv").style.background = 'rgba(142, 202, 46, 0.5)'; 
        //document.getElementById('cookDiv').style.display = "none";
        document.getElementById('cookieTextA').innerHTML = x.cookiesList;
        document.getElementById('cookieTextA').style.display = "block";
        document.getElementById('cookieHeader').innerHTML = 'Cookies Found:';
        document.getElementById('cookieTextA').rows = "3";
        break;
    case cookieLen <= 2:
        document.getElementById("cookieBar").innerHTML = cookieLen;
        document.getElementById("cookieBar").style.width = "230px";
        document.getElementById("cookieBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("cookieBar").style.border = '1px solid green';
        document.getElementById("cookDiv").style.background = 'rgba(142, 202, 46, 0.5)'; 
        document.getElementById('cookieTextA').innerHTML = x.cookiesList;
        document.getElementById('cookieTextA').style.display = "block";
        document.getElementById('cookieHeader').innerHTML = 'Cookies Found:';
        document.getElementById('cookieTextA').rows = "3";
        break;
    case cookieLen <= 3:
        document.getElementById("cookieBar").innerHTML = cookieLen;
        document.getElementById("cookieBar").style.width = "220px";
        document.getElementById("cookieBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("cookieBar").style.border = '1px solid green';
        document.getElementById("cookDiv").style.background = 'rgba(142, 202, 46, 0.5)'; 
        document.getElementById('cookieTextA').innerHTML = x.cookiesList;
        document.getElementById('cookieTextA').style.display = "block";
        document.getElementById('cookieHeader').innerHTML = 'Cookies Found:';
        document.getElementById('cookieTextA').rows = "6";
        break;
    case cookieLen <= 4:
        document.getElementById("cookieBar").innerHTML = cookieLen;
        document.getElementById("cookieBar").style.width = "210px";
        document.getElementById("cookieBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("cookieBar").style.border = '1px solid green';
        document.getElementById("cookDiv").style.background = 'rgba(142, 202, 46, 0.5)'; 
        document.getElementById('cookieTextA').innerHTML = x.cookiesList;
        document.getElementById('cookieTextA').style.display = "block";
        document.getElementById('cookieHeader').innerHTML = 'Cookies Found:';
        break;
    case cookieLen <= 5:
        document.getElementById("cookieBar").innerHTML = cookieLen;
        document.getElementById("cookieBar").style.width = "200px";
        document.getElementById("cookieBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("cookieBar").style.border = '1px solid yellow';
        document.getElementById('cookieTextA').innerHTML = x.cookiesList;
        document.getElementById('cookieTextA').style.display = "block";
        document.getElementById('cookieHeader').innerHTML = 'Cookies Found:';
        document.getElementById("cookDiv").style.background = 'rgba(235, 220, 61, 0.5)';
        break;
    case cookieLen <= 6:
        document.getElementById("cookieBar").innerHTML = cookieLen;
        document.getElementById("cookieBar").style.width = "140px";
        document.getElementById("cookieBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("cookieBar").style.border = '1px solid yellow';
        document.getElementById('cookieTextA').innerHTML = x.cookiesList;
        document.getElementById('cookieTextA').style.display = "block";
        document.getElementById('cookieHeader').innerHTML = 'Cookies Found:';
        document.getElementById("cookDiv").style.background = 'rgba(235, 220, 61, 0.5)';
        break;
    case cookieLen <= 7:
        document.getElementById("cookieBar").innerHTML = cookieLen;
        document.getElementById("cookieBar").style.width = "120px";
        document.getElementById("cookieBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("cookieBar").style.border = '1px solid yellow';
        document.getElementById("cookDiv").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById('cookieTextA').innerHTML = x.cookiesList;
        document.getElementById('cookieTextA').style.display = "block";
        document.getElementById('cookieHeader').innerHTML = 'Cookies Found:';
        break;
    case cookieLen <= 8:
        document.getElementById("cookieBar").innerHTML = cookieLen;
        document.getElementById("cookieBar").style.width = "100px";
        document.getElementById("cookieBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("cookieBar").style.border = '1px solid yellow';       
        document.getElementById('cookieTextA').innerHTML = x.cookiesList;
        document.getElementById('cookieTextA').style.display = "block";
        document.getElementById('cookieHeader').innerHTML = 'Cookies Found:';
        document.getElementById("cookDiv").style.background = 'rgba(235, 220, 61, 0.5)';
        break;
    case cookieLen <= 9:
        document.getElementById("cookieBar").innerHTML = cookieLen;
        document.getElementById("cookieBar").style.width = "80px";
        document.getElementById("cookieBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("cookieBar").style.border = '1px solid yellow';
        document.getElementById('cookieTextA').innerHTML = x.cookiesList;
        document.getElementById('cookieTextA').style.display = "block";
        document.getElementById('cookieHeader').innerHTML = 'Cookies Found:';
        document.getElementById("cookDiv").style.background = 'rgba(241, 137, 49, .5)'; 
        break;
    case cookieLen <= 10:
        document.getElementById("cookieBar").innerHTML = cookieLen;
        document.getElementById("cookieBar").style.width = "60px";
        document.getElementById("cookieBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("cookieBar").style.border = '1px solid yellow';
        document.getElementById('cookieTextA').innerHTML = x.cookiesList;
        document.getElementById('cookieTextA').style.display = "block";
        document.getElementById('cookieHeader').innerHTML = 'Cookies Found:';
        document.getElementById("cookDiv").style.background = 'rgba(241, 137, 49, .5)';         
        break;
    case cookieLen <= 12:
        document.getElementById("cookieBar").innerHTML = cookieLen;
        document.getElementById("cookieBar").style.width = "50px";
        document.getElementById("cookieBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("cookieBar").style.border = '1px solid orange';
        document.getElementById("cookDiv").style.background = 'rgba(241, 137, 49, .5)'; 
        document.getElementById('cookieTextA').innerHTML = x.cookiesList;
        document.getElementById('cookieTextA').style.display = "block";
        document.getElementById('cookieHeader').innerHTML = 'Cookies Found:';
        break;
    case cookieLen >= 13:
        document.getElementById("cookieBar").innerHTML = cookieLen;
        document.getElementById("cookieBar").style.width = "30px";
        document.getElementById("cookieBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("cookieBar").style.border = '1px solid orange';
        document.getElementById("cookDiv").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById('cookieTextA').innerHTML = x.cookiesList;
        document.getElementById('cookieTextA').style.display = "block";
        document.getElementById('cookieHeader').innerHTML = 'Cookies Found:';
        break;
}
            
var emptyURL = x.emptyURL;

switch (emptyURL >= 0){

    case emptyURL == 0:
        document.getElementById("srcBar").innerHTML = emptyURL;
        document.getElementById("srcBar").style.width = "240px";
        document.getElementById("srcBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("srcBar").style.border = '1px solid green';
        document.getElementById('emptySrcDiv').style.display = "none"; 
        break;
    case emptyURL == 1:
        document.getElementById("srcBar").innerHTML = emptyURL;
        document.getElementById("srcBar").style.width = "230px";
        document.getElementById("srcBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("srcBar").style.border = '1px solid green';
        document.getElementById("emptySrcDiv").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById('emptySrcTextA').innerHTML = x.emptySRCVal;
        document.getElementById('emptySrcTextA').style.display = "block";
        document.getElementById('emptySrcHeader').innerHTML = 'Empty URL Sources:';
        break;
    case emptyURL == 2:
        document.getElementById("srcBar").innerHTML = emptyURL;
        document.getElementById("srcBar").style.width = "220px";
        document.getElementById("srcBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("srcBar").style.border = '1px solid green';
        document.getElementById("emptySrcDiv").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById('emptySrcTextA').innerHTML = x.emptySRCVal;
        document.getElementById('emptySrcTextA').style.display = "block";
        document.getElementById('emptySrcHeader').innerHTML = 'Empty URL Sources:';
        break;
    case emptyURL == 3:
        document.getElementById("srcBar").innerHTML = emptyURL;
        document.getElementById("srcBar").style.width = "200px";
        document.getElementById("srcBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("srcBar").style.border = '1px solid yellow';
        document.getElementById("emptySrcDiv").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById('emptySrcTextA').innerHTML = x.emptySRCVal;
        document.getElementById('emptySrcTextA').style.display = "block";
        document.getElementById('emptySrcHeader').innerHTML = 'Empty URL Sources:'; 
        break;
    case emptyURL == 4:
        document.getElementById("srcBar").innerHTML = emptyURL;
        document.getElementById("srcBar").style.width = "140px";
        document.getElementById("srcBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("srcBar").style.border = '1px solid yellow';
        document.getElementById("emptySrcDiv").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById('emptySrcTextA').innerHTML = x.emptySRCVal;
        document.getElementById('emptySrcTextA').style.display = "block";
        document.getElementById('emptySrcHeader').innerHTML = 'Empty URL Sources:'; 
        break;
    case emptyURL == 5:
        document.getElementById("srcBar").innerHTML = emptyURL;
        document.getElementById("srcBar").style.width = "100px";
        document.getElementById("srcBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("srcBar").style.border = '1px solid yellow';
        document.getElementById("emptySrcDiv").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById('emptySrcTextA').innerHTML = x.emptySRCVal;
        document.getElementById('emptySrcTextA').style.display = "block";
        document.getElementById('emptySrcHeader').innerHTML = 'Empty URL Sources:'; 
        break;
    case emptyURL == 6:
        document.getElementById("srcBar").innerHTML = emptyURL;
        document.getElementById("srcBar").style.width = "50px";
        document.getElementById("srcBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("srcBar").style.border = '1px solid orange';
        document.getElementById("emptySrcDiv").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById('emptySrcTextA').innerHTML = x.emptySRCVal;
        document.getElementById('emptySrcTextA').style.display = "block";
        document.getElementById('emptySrcHeader').innerHTML = 'Empty URL Sources:'; 
        break;
    case emptyURL >= 7:
        document.getElementById("srcBar").innerHTML = emptyURL.toString();
        document.getElementById("srcBar").style.width = "30px";
        document.getElementById("srcBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("srcBar").style.border = '1px solid orange';
        document.getElementById("emptySrcDiv").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById('emptySrcTextA').innerHTML = x.emptySRCVal;
        document.getElementById('emptySrcTextA').style.display = "block";
        document.getElementById('emptySrcHeader').innerHTML = 'Empty URL Sources:';
         
        break;
}
            
var cacheNum = x.cacheChart;

switch (cacheNum >= 0){

    case cacheNum >= 31536000:
        document.getElementById("cacheBar").innerHTML = x.cacheDays + " days, " + x.cacheHours + ' hrs';
        document.getElementById("cacheBar").style.width = "240px";
        document.getElementById("cacheBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("cacheBar").style.border = '1px solid green';
        break;
    case cacheNum >= 864000:
        document.getElementById("cacheBar").innerHTML = x.cacheDays + " days, " + x.cacheHours + ' hrs';
        document.getElementById("cacheBar").style.width = "230px";
        document.getElementById("cacheBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("cacheBar").style.border = '1px solid green';
        break;
    case cacheNum >= 86400:
        document.getElementById("cacheBar").innerHTML = x.cacheDays + " days, " + x.cacheHours + ' hrs';
        document.getElementById("cacheBar").style.width = "220px";
        document.getElementById("cacheBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("cacheBar").style.border = '1px solid green';
        break;
    case cacheNum >= 36000:
        document.getElementById("cacheBar").innerHTML = x.cacheHours + ' hrs, ' + x.cacheMinutes + ' min';
        document.getElementById("cacheBar").style.width = "200px";
        document.getElementById("cacheBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("cacheBar").style.border = '1px solid yellow';
        break;
    case cacheNum >= 3600:
        document.getElementById("cacheBar").innerHTML = x.cacheHours + ' hrs, ' + x.cacheMinutes + ' min';
        document.getElementById("cacheBar").style.width = "160px";
        document.getElementById("cacheBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("cacheBar").style.border = '1px solid yellow';
        break;
    case cacheNum >= 600:
        document.getElementById("cacheBar").innerHTML = x.cacheMinutes +  ' min, ' + x.cacheSeconds + ' sec';
        document.getElementById("cacheBar").style.width = "120px";
        document.getElementById("cacheBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("cacheBar").style.border = '1px solid yellow'; 
        break;
    case cacheNum >= 300:
        document.getElementById("cacheBar").innerHTML = x.cacheMinutes + ' min, ' + x.cacheSeconds + ' sec';
        document.getElementById("cacheBar").style.width = "90px";
        document.getElementById("cacheBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("cacheBar").style.border = '1px solid orange'; 
        break;
    case cacheNum >= 1:
        document.getElementById("cacheBar").innerHTML = x.cacheMinutes + ' min, ' + x.cacheSeconds + ' sec';
        document.getElementById("cacheBar").style.width = "70px";
        document.getElementById("cacheBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("cacheBar").style.border = '1px solid orange';
        break;
    case cacheNum == 0:
        document.getElementById("cacheBar").innerHTML = 'No Caching';
        document.getElementById("cacheBar").style.width = "70px";
        document.getElementById("cacheBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("cacheBar").style.border = '1px solid orange';
        break;
    case cacheNum == .5:
        document.getElementById("cacheBar").innerHTML = 'Script Blocked';
        document.getElementById("cacheBar").style.width = "240px";
        document.getElementById("cacheBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("cacheBar").style.border = '1px solid green';
        break;
    case cacheNum == .1:
        document.getElementById("cacheBar").innerHTML = 'Cloudflare Cache';
        document.getElementById("cacheBar").style.width = "240px";
        document.getElementById("cacheBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("cacheBar").style.border = '1px solid green';
        break;
    case cacheNum == .2:
        document.getElementById("cacheBar").innerHTML = 'No Cloudflare Cache';
        document.getElementById("cacheBar").style.width = "70px";
        document.getElementById("cacheBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("cacheBar").style.border = '1px solid orange';
        break;
    case cacheNum == .3:
        document.getElementById("cacheBar").innerHTML = 'No Cloudflare Dynamic Cache';
        document.getElementById("cacheBar").style.width = "90px";
        document.getElementById("cacheBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("cacheBar").style.border = '1px solid orange';
        break;
    case cacheNum == .4:
        document.getElementById("cacheBar").innerHTML = 'Cloudflare Dynamic Cache';
        document.getElementById("cacheBar").style.width = "240px";
        document.getElementById("cacheBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("cacheBar").style.border = '1px solid green';
         
        break;
}            
            

            
            
            
var colorScore = x.colorScore;

switch (colorScore){

    case 'black':
        document.getElementById("colorBar").innerHTML = colorScore;
        document.getElementById("colorBar").style.width = "240px";
        document.getElementById("colorBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("colorBar").style.border = '1px solid green';
        break;
    case 'black/grey':
        document.getElementById("colorBar").innerHTML = colorScore;
        document.getElementById("colorBar").style.width = "230px";
        document.getElementById("colorBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("colorBar").style.border = '1px solid green';
        break;
    case 'something':
        document.getElementById("colorBar").innerHTML = x.backGroundColor;
        document.getElementById("colorBar").style.width = "220px";
        document.getElementById("colorBar").style.background = 'rgba(142, 202, 46, 0.5)';
        document.getElementById("colorBar").style.border = '1px solid green';
        break;
    case 'white':
        document.getElementById("colorBar").innerHTML = colorScore;
        document.getElementById("colorBar").style.width = "200px";
        document.getElementById("colorBar").style.background = 'rgba(235, 220, 61, 0.5)';
        document.getElementById("colorBar").style.border = '1px solid yellow';
        break;
    case 'blue':
        document.getElementById("colorBar").innerHTML = colorScore;
        document.getElementById("colorBar").style.width = "90px";
        document.getElementById("colorBar").style.background = 'rgba(241, 137, 49, .5)';
        document.getElementById("colorBar").style.border = '1px solid orange';
        break;
}
            
            
            
            
//Recommendations
/*<p class = "recoClass" id= "reco1"></p>
<p class = "recoClass" id= "reco2"></p>
<p class = "recoClass" id= "reco3"></p>*/ 
document.getElementById("reco1").innerHTML = x.highRec1;
document.getElementById("reco2").innerHTML = x.medRec1;
document.getElementById("reco3").innerHTML = x.lowRec1;         
            
            
            
            
                     
            
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
	 //console.log('factview is clciked'); 
	 localStorage.setItem('selectedButtonId', 'factButton'); 
	 openDiv(evt,'Example1Div'); 
}
document.getElementById("devButton").onclick = function(evt) {
	 //console.log('devview is clciked'); 
	 localStorage.setItem('selectedButtonId', 'devButton'); 
	 openDiv(evt,'Example2Div'); 
}

/* This selection tab will persist when browsing and default fact view will be active*/
var selectedTab = localStorage.getItem('selectedButtonId');  
if(selectedTab)
	document.getElementById(selectedTab).click();
else
	document.getElementById("factButton").click();


//////////////////////////////////////////////////////////////////
// Info Div Fill on Button Clicks


/* button clicks calls */
document.getElementById('htmlButton').onclick = function(evt) {

	 localStorage.setItem('selectedButtonId1', 'htmlButton'); 
	 //openButton(evt1);
     document.getElementById("m1").innerHTML = "Page HTML";
     //document.getElementById('htmlButton').style.background = 'rgba(241, 137, 49, .5)';
    document.getElementById("m2").innerHTML = 'Page HTML counts the number of bytes on your page from HTML code. If it is significantly high- it can signal that there is too much content on your page. Is there any way to reduce the amount of content on this page? Have you considered just loading content on scroll? If content is being loaded beyond what the user is currently seeing, it is as waste of data.';
    
    var mayYou = document.getElementById('lengthVal').innerHTML;
    
    var may4You = document.getElementById('sampleVal').innerHTML;
    
    document.getElementById("colorSquare").style.display = 'none';
    document.getElementById("colorSquare").style.width = "0px";
    document.getElementById("colorSquare").style.height = "0px";
    
    if (may4You !== mayYou){
        document.getElementById("mLL").innerHTML = "Grade increases to " + mayYou + " if page content was simplified.";
        document.getElementById("mLL").style.display = 'block';
    }
    else{
        document.getElementById("mLL").style.display = 'none';
    }
     
}

document.getElementById('LLButton').onclick = function(evt) {
	  
	 localStorage.setItem('selectedButtonId1', 'LLButton'); 
	 //openButton(evt,'Example2Div');
     document.getElementById("m1").innerHTML = 'Lazy Loaded Images';
     //document.getElementById('LLButton').style.background = 'rgba(241, 137, 49, .5)';
     document.getElementById("m2").innerHTML = 'With "lazy loading", files are only loaded when they reach the visible area of the browser window, or shortly before it. Modern browsers allow to insert loading=“lazy“ as an attribute in the img element. Lazy loading is useful because it allows images lower on a page to not be loaded if it\'s not in immediate view. Looking for the following Lazy-Loading methods: loading="lazy", class="lozad", class="b-lazy", class="lazyloaded", and class="lazy".';
     /*var lazyLoadScore = document.getElementById("mLL").innerHTML;
//    document.getElementById("m4").innerHTML = "Grade increases to " + lazyLoadScore + " if all images were Lazy Loaded";
    document.getElementById("m4").style.display = "block";*/
    var mayYou = document.getElementById('LazyLoadVal').innerHTML;
    
    var may4You = document.getElementById('sampleVal').innerHTML;
    
    document.getElementById("colorSquare").style.display = 'none';
    document.getElementById("colorSquare").style.width = "0px";
    document.getElementById("colorSquare").style.height = "0px";
    
    if (may4You !== mayYou){
        document.getElementById("mLL").innerHTML = "Grade increases to " + mayYou + " if > 65% of images were lazy loaded";
        document.getElementById("mLL").style.display = 'block';
    }
    else{
        document.getElementById("mLL").style.display = 'none';
    }
    
    

}

document.getElementById('imgButton').onclick = function(evt) {
	  
	 localStorage.setItem('selectedButtonId1', 'imgButton'); 
	 //openButton(evt,'Example2Div');
     document.getElementById("m1").innerHTML = 'Image File Formats';
     //document.getElementById('LLButton').style.background = 'rgba(241, 137, 49, .5)';
     document.getElementById("m2").innerHTML = 'On most websites, images are the single largest contributors to page weight.The more images you use and the larger those image files, the more data needs to be transferred, increasing the energy that is used. Ask yourself, can my site be using Vector Imagery? Vector images are a cool, clean way to show icons. Could you use a vector graphic (or CSS styling) instead of a photo? The svg format is ideal for simple graphics without a high level of detail, such as icons and geometric representations. Try to do some research on emerging image file formats: WebP and Avif have a greatly reduced amount of data load. Most modern browsers support using the WebP format. It looks great for photographic images, and have a smaller byte size. WebP images typically have about a 30% smaller file size than JPEG. The newer file type AVIF can almost be half the file size of WebP depending on the image.';
    
    var mayYou = document.getElementById('imgTypeVal').innerHTML;
    
    var may4You = document.getElementById('sampleVal').innerHTML;
    
    document.getElementById("colorSquare").style.display = 'none';
    document.getElementById("colorSquare").style.width = "0px";
    document.getElementById("colorSquare").style.height = "0px";
    
    if (may4You !== mayYou){
        document.getElementById("mLL").innerHTML = "Grade increases to " + mayYou + " if image types were changed to either svg, webp, or avif.";
        document.getElementById("mLL").style.display = 'block';
    }
    else{
        document.getElementById("mLL").style.display = 'none';
    }
}

document.getElementById('importButton').onclick = function(evt) {
	  
	 localStorage.setItem('selectedButtonId1', 'importButton'); 
	 //openButton(evt,'Example2Div');
     document.getElementById("m1").innerHTML = 'Imported Fonts';
     //document.getElementById('LLButton').style.background = 'rgba(241, 137, 49, .5)';
     document.getElementById("m2").innerHTML = 'Imported Font Files cause an unnecessary amount of data loading on your page. Try to just use system fonts. If your imported Font file is .TFF it’s a less efficient font file format than .WOFF. Stick to modern web font file formats: WOFF and WOFF2, these use higher compression methods compared to TTF, SVG and OFT file formats. For imported fonts try to only include the characters needed for your website. Some font files will have distiction between styling \(i.e bolding). If styling is not being used, try removing this from the font file.';
    
    var mayYou = document.getElementById('fontVal').innerHTML;
    
    var may4You = document.getElementById('sampleVal').innerHTML;
    
    document.getElementById("colorSquare").style.display = 'none';
    document.getElementById("colorSquare").style.width = "0px";
    document.getElementById("colorSquare").style.height = "0px";
    
    if (may4You !== mayYou){
        document.getElementById("mLL").innerHTML = "Grade increases to " + mayYou + " if system fonts were used.";
        document.getElementById("mLL").style.display = 'block';
    }
    else{
        document.getElementById("mLL").style.display = 'none';
    }
}

document.getElementById('resImgButton').onclick = function(evt) {
	  
	 localStorage.setItem('selectedButtonId1', 'resImgButton'); 
	 //openButton(evt,'Example2Div');
     document.getElementById("m1").innerHTML = 'Responsive Images';
     //document.getElementById('LLButton').style.background = 'rgba(241, 137, 49, .5)';
     document.getElementById("m2").innerHTML = 'If a site is being loaded on tablet or smart phone it wastes data to load the same image you would on a desktop website. You can save bandwidth and speed up page load times by loading the most appropriate image for the viewer\'s display. Our scan is searching for the HTML \"picture\" tag, and for \"srcset\" when loading an image for different screen dimensions. Responsive web design has changed how websites can be created. Device detection is no longer needed to display separate “mobile” sites whenever the server detects a phone or tablet. Using srcset or picture HTML allow an image to be displayed at the correct dimensions for a user\'s device. If media queries are being used in the CSS to create responisve images you want to make sure that not all images are being downloaded at the same time.';
//     document.getElementById("m4").style.display = "block";
    
    var mayYou = document.getElementById('resVal').innerHTML;
    
    var may4You = document.getElementById('sampleVal').innerHTML;
    
    document.getElementById("colorSquare").style.display = 'none';
    document.getElementById("colorSquare").style.width = "0px";
    document.getElementById("colorSquare").style.height = "0px";
    
    if (may4You !== mayYou){
        document.getElementById("mLL").innerHTML = "Grade increases to " + mayYou + " if > 70% of images were responsive by screen size.";
        document.getElementById("mLL").style.display = 'block';
    }
    else{
        document.getElementById("mLL").style.display = 'none';
    }
    
}

document.getElementById('intSSButton').onclick = function(evt) {
	  
	 localStorage.setItem('selectedButtonId1', 'intSSButton'); 
	 //openButton(evt,'Example2Div');
     document.getElementById("m1").innerHTML = 'Internal Style Sheets';
     //document.getElementById('LLButton').style.background = 'rgba(241, 137, 49, .5)';
     document.getElementById("m2").innerHTML = 'Make sure CSS files are separate from page\’s HTML code. If CSS is in the HMTL body then the code must be sent for each page request- increasing the amount of data sent. If CSS is in separate files, the browser can store them in local cache.';
    
    var mayYou = document.getElementById('intSSsampleVal').innerHTML;
    
    var may4You = document.getElementById('sampleVal').innerHTML;
    
    document.getElementById("colorSquare").style.display = 'none';
    document.getElementById("colorSquare").style.width = "0px";
    document.getElementById("colorSquare").style.height = "0px";
    
    if (may4You !== mayYou){
        
        document.getElementById("mLL").innerHTML = "Grade increases to " + mayYou + ' if there were < 3 internal style sheets \(style=). ';
        
        document.getElementById("mLL").style.display = 'block';
    }
    else{
        document.getElementById("mLL").style.display = 'none';
    }
    
    
}

document.getElementById('fileSSButton').onclick = function(evt) {
	  
	 localStorage.setItem('selectedButtonId1', 'fileSSButton'); 
	 //openButton(evt,'Example2Div');
     document.getElementById("m1").innerHTML = 'Number of Style Sheet Files';
     //document.getElementById('LLButton').style.background = 'rgba(241, 137, 49, .5)';
     document.getElementById("m2").innerHTML = 'Reducing unnecessary files will help with overall page size. Reducing the number of CSS files reduces the number of HTTP requests that are required on page load. Ask yourself, can I just combine my multiple Style Sheets into one?';
    
    var mayYou = document.getElementById('ssFileVal').innerHTML;
    
    var may4You = document.getElementById('sampleVal').innerHTML;
    
    document.getElementById("colorSquare").style.display = 'none';
    document.getElementById("colorSquare").style.width = "0px";
    document.getElementById("colorSquare").style.height = "0px";
    
    if (may4You !== mayYou){
        document.getElementById("mLL").innerHTML = "Grade increases to " + mayYou + " if there were < 3 style sheet files.";
        document.getElementById("mLL").style.display = 'block';
    }
    else{
        document.getElementById("mLL").style.display = 'none';
    }
}

document.getElementById('pageLoadButton').onclick = function(evt) {
	  
	 localStorage.setItem('selectedButtonId1', 'pageLoadButton'); 
	 //openButton(evt,'Example2Div');
     document.getElementById("m1").innerHTML = 'Page Load Time';
     //document.getElementById('LLButton').style.background = 'rgba(241, 137, 49, .5)';
     document.getElementById("m2").innerHTML = 'Reducing your page load time can improve the energy required to render pages. Decreasing page load time can improve your SEO; which enables users to find the content they\'re looking for- faster. Google Search prioritizes pages with faster page load time. Decreasing load time improves the user experience for users with slower connection speeds.';
    
    var mayYou = document.getElementById('timeVal').innerHTML;
    
    var may4You = document.getElementById('sampleVal').innerHTML;
    
    document.getElementById("colorSquare").style.display = 'none';
    document.getElementById("colorSquare").style.width = "0px";
    document.getElementById("colorSquare").style.height = "0px";
    
    if (may4You !== mayYou){
        document.getElementById("mLL").innerHTML = "Grade increases to " + mayYou + " if page load time is decreased to less than 2 seconds.";
        document.getElementById("mLL").style.display = 'block';
    }
    else{
        document.getElementById("mLL").style.display = 'none';
    }
    
}

document.getElementById('pageSizeButton').onclick = function(evt) {
	  
	 localStorage.setItem('selectedButtonId1', 'pageSizeButton'); 
	 //openButton(evt,'Example2Div');
     document.getElementById("m1").innerHTML = 'Page Size';
     //document.getElementById('LLButton').style.background = 'rgba(241, 137, 49, .5)';
     document.getElementById("m2").innerHTML = 'Overall page size, is total amount of data required to load the page. This is the amount of data required to load your page for each unique user for the first time. It can also be thought of as the amount of data uploaded to servers.';
    
    var mayYou = document.getElementById('sizeVal').innerHTML;
    
    var may4You = document.getElementById('sampleVal').innerHTML;
    
    document.getElementById("colorSquare").style.display = 'none';
    document.getElementById("colorSquare").style.width = "0px";
    document.getElementById("colorSquare").style.height = "0px";
    
    if (may4You !== mayYou){
        document.getElementById("mLL").innerHTML = "Grade increases to " + mayYou + " if overall page size was decreased.";
        document.getElementById("mLL").style.display = 'block';
    }
    else{
        document.getElementById("mLL").style.display = 'none';
    }
}

document.getElementById('transferButton').onclick = function(evt) {
	  
	 localStorage.setItem('selectedButtonId1', 'transferButton'); 
	 //openButton(evt,'Example2Div');
     document.getElementById("m1").innerHTML = 'Transfer Data Size';
     //document.getElementById('LLButton').style.background = 'rgba(241, 137, 49, .5)';
     document.getElementById("m2").innerHTML = 'Reducing Transfer Data size is largely seen as one of the best ways to make your website more sustainable. Caching reduces the server load and the amount of data transferred, making websites more environmentally friendly. When more data is cached, less is transmitted and fewer server requests, pages are loaded much faster. Analytics and advertising script files can add significant weight, increase CPU usage, and slow websites down. Choose plugins that minimize server load and don’t add unnecessary weight on the front end. If you notice little difference between Total Byte Size, and Transfer Size it might mean that additional data can be cached. Transfer Size is the most heavily weighted metric in your Sustainability Grade. Reducing it will increase your Grade if decreased. If Transfer size is greater than 1MB- it\'s equivalent to 150,000 words in a HTML File. Are your images worth 1,000 words?';
    
    var mayYou = document.getElementById('transVal').innerHTML;
    
    var may4You = document.getElementById('sampleVal').innerHTML;
    
    document.getElementById("colorSquare").style.display = 'none';
    document.getElementById("colorSquare").style.width = "0px";
    document.getElementById("colorSquare").style.height = "0px";
    
    if (may4You !== mayYou){
        document.getElementById("mLL").innerHTML = "Grade increases to " + mayYou + " if transfer size was decreased.";
        document.getElementById("mLL").style.display = 'block';
    }
    else{
        document.getElementById("mLL").style.display = 'none';
    }
}

document.getElementById('jsButton').onclick = function(evt) {
	  
	 localStorage.setItem('selectedButtonId1', 'jsButton'); 
	 //openButton(evt,'Example2Div');
     document.getElementById("m1").innerHTML = 'JS Heap Size';
     //document.getElementById('LLButton').style.background = 'rgba(241, 137, 49, .5)';
     document.getElementById("m2").innerHTML = 'JavaScript impacts website efficiency by adding file weight to the web page. Increasing the amount of processing required by your device. JavaScript is processed on the your computer/phone requiring CPU usage, which in turn increases the energy consumption of the device. The amount of javascript having to be executed can isolate users with older devices, or smaller processors.';
    
    var mayYou = document.getElementById('jsVal').innerHTML;
    
    var may4You = document.getElementById('sampleVal').innerHTML;
    
    document.getElementById("colorSquare").style.display = 'none';
    document.getElementById("colorSquare").style.width = "0px";
    document.getElementById("colorSquare").style.height = "0px";
    
    if (may4You !== mayYou && mayYou !== 'undefined'){
        
        document.getElementById("mLL").innerHTML = "Grade increases to " + mayYou + ' if less JavaScript was executed on page.';
        
        document.getElementById("mLL").style.display = 'block';
    }
    else{
        document.getElementById("mLL").style.display = 'none';
    }
}

document.getElementById('hostButton').onclick = function(evt) {
	  
	 localStorage.setItem('selectedButtonId1', 'hostButton'); 
	 //openButton(evt,'Example2Div');
     document.getElementById("m1").innerHTML = 'Green Hosted';
     //document.getElementById('LLButton').style.background = 'rgba(241, 137, 49, .5)';
     document.getElementById("m2").innerHTML = 'Green Hosted is powered by the Green Web Foundation who defines the dataset as: "the largest dataset in the world of which sites use renewable power." Powering your site with renewables saves energy from energy produced by fossil fuels.';
    
    document.getElementById("mLL").style.display = 'none';
    
    document.getElementById("colorSquare").style.display = 'none';
    document.getElementById("colorSquare").style.width = "0px";
    document.getElementById("colorSquare").style.height = "0px";
}

document.getElementById('redirectButton').onclick = function(evt) {
	  
	 localStorage.setItem('selectedButtonId1', 'redirectButton'); 
	 //openButton(evt,'Example2Div');
     document.getElementById("m1").innerHTML = 'Redirects';
     //document.getElementById('LLButton').style.background = 'rgba(241, 137, 49, .5)';
     document.getElementById("m2").innerHTML = 'Redirects are an unnecessary use of resources. It causes additional data to be loaded.';
    
    document.getElementById("colorSquare").style.display = 'none';
    document.getElementById("colorSquare").style.width = "0px";
    document.getElementById("colorSquare").style.height = "0px";
    
    var mayYou = document.getElementById('redirectVal').innerHTML;
    
    var may4You = document.getElementById('sampleVal').innerHTML;
    
    if (may4You !== mayYou && mayYou !== 'undefined'){
        
        document.getElementById("mLL").innerHTML = "Grade increases to " + mayYou + ' ,if there were no redirects.';
        
        document.getElementById("mLL").style.display = 'block';
    }
    else{
        document.getElementById("mLL").style.display = 'none';
    }
}

document.getElementById('cookieButton').onclick = function(evt) {
	  
	 localStorage.setItem('selectedButtonId1', 'cookieButton'); 
	 //openButton(evt,'Example2Div');
     document.getElementById("m1").innerHTML = 'Number of Cookies';
     //document.getElementById('LLButton').style.background = 'rgba(241, 137, 49, .5)';
     document.getElementById("m2").innerHTML = 'Cookies are sent with every request, so they can worsen performance (especially for mobile data connections). Are all these cookies on your page necessary? Do you know the specific purpose of each cookie on your page? ';
    
    document.getElementById("colorSquare").style.display = 'none';
    document.getElementById("colorSquare").style.width = "0px";
    document.getElementById("colorSquare").style.height = "0px";
    
    var mayYou = document.getElementById('cookieVal').innerHTML;
    
    var may4You = document.getElementById('sampleVal').innerHTML;
    
    if (may4You !== mayYou){
        
        document.getElementById("mLL").innerHTML = "Grade increases to " + mayYou + ' if there were < 4 cookies set on page.';
        
        document.getElementById("mLL").style.display = 'block';
    }
    else{
        document.getElementById("mLL").style.display = 'none';
    }
    
}

document.getElementById('emptyButton').onclick = function(evt) {
	  
	 localStorage.setItem('selectedButtonId1', 'emptyButton'); 
	 //openButton(evt,'Example2Div');
     document.getElementById("m1").innerHTML = 'Empty URL Tags';
     //document.getElementById('LLButton').style.background = 'rgba(241, 137, 49, .5)';
     document.getElementById("m2").innerHTML = 'Having an empty href link is bad practice. Browser will call the directory in which the page is located if SRC Attribute is empty. This results in additional HTTP requests. For example, if http://www.test.com/ has script src="" it will make a request to all / in all browsers to the homepage of the domain. Doubling the traffic to your homepage.';
    
    document.getElementById("colorSquare").style.display = 'none';
    document.getElementById("colorSquare").style.width = "0px";
    document.getElementById("colorSquare").style.height = "0px";
    
    var mayYou = document.getElementById('emptySrcVal1').innerHTML;
    
    var may4You = document.getElementById('sampleVal').innerHTML;
    
    if (may4You !== mayYou){
        document.getElementById("mLL").innerHTML = "Grade increases to " + mayYou + " if there were no empty 'src' tags.";
        document.getElementById("mLL").style.display = 'block';
    }
    else{
        document.getElementById("mLL").style.display = 'none';
    }
}

document.getElementById('cacheButton').onclick = function(evt) {
	  
	 localStorage.setItem('selectedButtonId1', 'cacheButton'); 
	 //openButton(evt,'Example2Div');
     document.getElementById("m1").innerHTML = 'Browser Cache Set Time';
     //document.getElementById('LLButton').style.background = 'rgba(241, 137, 49, .5)';
     document.getElementById("m2").innerHTML = 'HTTP caching can speed up your page load time on repeat visits. Caching is great for sustainability since it prevents browsers from requesting all resources every time. A longer cache duration is not always better. Ultimately, it\'s up to you to decide what the optimal cache duration is for your resources.';
    
    var mayYou = document.getElementById('cacheVal').innerHTML;
    
    var may4You = document.getElementById('sampleVal').innerHTML;
    
    document.getElementById("colorSquare").style.display = 'none';
    document.getElementById("colorSquare").style.width = "0px";
    document.getElementById("colorSquare").style.height = "0px";
    
    if (may4You !== mayYou){
        document.getElementById("mLL").innerHTML = "Grade increases to " + mayYou + " if cache time is > 365 days.";
        document.getElementById("mLL").style.display = 'block';
    }
    else{
        document.getElementById("mLL").style.display = 'none';
    }
}

document.getElementById('colorButton').onclick = function(evt) {
	  
	 localStorage.setItem('selectedButtonId1', 'colorButton'); 
	 //openButton(evt,'Example2Div');
     document.getElementById("m1").innerHTML = 'Website Background Color';
     //document.getElementById('LLButton').style.background = 'rgba(241, 137, 49, .5)';
     document.getElementById("m2").innerHTML = 'Color choices play a role in making websites and other digital tools more or less energy efficient. A study conducted by Google showed: White: uses nearly 20% more power than blue. Blue uses 25% more power than Green or Red. Green and red use a very similar amount of power as one another. Black will use the least amount of power on OLED screens. An easy way to increase your grade is to allow users a \'night mode\' that allows them to toggle between a white and black screen.';
  
    
    document.getElementById("colorSquare").style.display = 'block';
    document.getElementById("colorSquare").style.width = "30px";
     document.getElementById("colorSquare").style.height = "20px";

    var bkgrnCol = document.getElementById('backGrndVal').innerHTML;
    document.getElementById("colorSquare").style.background = bkgrnCol;
    
    var mayYou = document.getElementById('colorVal').innerHTML;
    
    var may4You = document.getElementById('sampleVal').innerHTML;
    
    if (may4You !== mayYou){
        document.getElementById("mLL").innerHTML = "Grade increases to " + mayYou + " if website background color was black / dark gray.";
        document.getElementById("mLL").style.display = 'block';
    }
    else{
        document.getElementById("mLL").style.display = 'none';
    }
}

document.getElementById('byteButton').onclick = function(evt) {
    
    localStorage.setItem('selectedToggle', 'byteButton');
    
    var jsBytes = document.getElementById("jsValBytes").innerHTML;
    document.getElementById("jsTableVal").innerHTML= jsBytes;
    var imgBytes = document.getElementById("imgValBytes").innerHTML;
    document.getElementById("imgTableVal").innerHTML= imgBytes;
    var cssBytes = document.getElementById("cssValBytes").innerHTML;
    document.getElementById("cssTableVal").innerHTML= cssBytes;
    var importBytes = document.getElementById("importValBytes").innerHTML;
    document.getElementById("importTableVal").innerHTML= importBytes;
    var otherBytes = document.getElementById("otherValBytes").innerHTML;
    document.getElementById("otherTableVal").innerHTML= otherBytes;
            
    var lab1Bytes = document.getElementById("Lab1ValBytes").innerHTML;
    document.getElementById("num1TransSizeLabID").innerHTML= lab1Bytes;
    var lab2Bytes = document.getElementById("Lab2ValBytes").innerHTML;
    document.getElementById("num2TransSizeLabID").innerHTML= lab2Bytes;
    var lab3Bytes = document.getElementById("Lab3ValBytes").innerHTML;
    document.getElementById("num3TransSizeLabID").innerHTML= lab3Bytes;
    
    
    document.getElementById("percentButton").style.color = 'black';
    document.getElementById("percentButton").style.background = '#EAEAEA';
    document.getElementById("percentButton").style.border = '1px solid #F77616';
    
    document.getElementById("byteButton").style.color = 'white';
    document.getElementById("byteButton").style.background = '#E25B10';
    document.getElementById("byteButton").style.border = '1px solid #F77616';
    
    //document.getElementById("jsTableVal").innerHTML = '1 bytes';
    
    //document.getElementById("tableHeaderDiv").style.background = 'rgba(142, 202, 46, 0.5)'; 

}
document.getElementById('percentButton').onclick = function(evt) {
    
    localStorage.setItem('selectedToggle', 'percentButton');
    
    var js1 = document.getElementById("jsValPercent").innerHTML;
    document.getElementById("jsTableVal").innerHTML= js1;
    var img1 = document.getElementById("imgValPercent").innerHTML;
    document.getElementById("imgTableVal").innerHTML= img1;
    var css1 = document.getElementById("cssValPercent").innerHTML;
    document.getElementById("cssTableVal").innerHTML= css1;
    var import1 = document.getElementById("importValPercent").innerHTML;
    document.getElementById("importTableVal").innerHTML= import1;
    var other1 = document.getElementById("otherValPercent").innerHTML;
    document.getElementById("otherTableVal").innerHTML= other1;
            
    var lab1Per = document.getElementById("Lab1ValPercent").innerHTML;
    document.getElementById("num1TransSizeLabID").innerHTML= lab1Per;
    var lab2Per = document.getElementById("Lab2ValPercent").innerHTML;
    document.getElementById("num2TransSizeLabID").innerHTML= lab2Per;
    var lab3Per = document.getElementById("Lab3ValPercent").innerHTML;
    document.getElementById("num3TransSizeLabID").innerHTML= lab3Per;

    
    document.getElementById("byteButton").style.color = 'black';
    document.getElementById("byteButton").style.background = '#EAEAEA';
    document.getElementById("byteButton").style.border = '1px solid #F77616';
    
    document.getElementById("percentButton").style.color = 'white';
    document.getElementById("percentButton").style.background = '#E25B10';
    document.getElementById("percentButton").style.border = '1px solid #F77616';   
    
    //document.getElementById("jsTableVal").innerHTML = '2 %';
    
    //document.getElementById("tableHeaderDiv").style.background = 'rgba(241, 137, 49, .5)'; 

}

//Sets a default for Metric Info
var selectedTab1 = localStorage.getItem('selectedButtonId1');  
if(selectedTab1){
	document.getElementById(selectedTab1).click();
    document.getElementById(selectedTab1).focus();
}
else{
	document.getElementById('htmlButton').click();
    document.getElementById('htmlButton').focus();
}

//Sets a default for Byte / Percent Info
var selectedTab1 = localStorage.getItem('selectedToggle');  
if(selectedTab1){
	document.getElementById(selectedTab1).click();
}
else{
	document.getElementById('byteButton').click();
}

document.querySelector('#go-to-options').addEventListener('click', function() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});

document.querySelector('#go-to-options1').addEventListener('click', function() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});