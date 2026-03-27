 const var NUMOFSTRINGS = Globals.NUMOFSTRINGS;
 const var LOWESTNOTE = 52;
 const var HIGHESTNOTE = 88;
 
 const var OPENSTRING6NOTE = 52;
 const var OPENSTRING5NOTE = 57;
 const var OPENSTRING4NOTE = 62;
 const var OPENSTRING3NOTE = 67;
 const var OPENSTRING2NOTE = 71;
 const var OPENSTRING1NOTE = 76;
 
 
 namespace Stringtype
 {
 
     const var STRING1 = 0;
     const var STRING2 = 1;
     const var STRING3 = 2;
     const var STRING4 = 3;
     const var STRING5 = 4;
     const var STRING6 = 5;
 
 }
 
 
 const var string6Mute = Synth.getMidiProcessor("Container0String6Mute");
 const var string5Mute = Synth.getMidiProcessor("Container0String5Mute");
 const var string4Mute = Synth.getMidiProcessor("Container0String4Mute");
 const var string3Mute = Synth.getMidiProcessor("Container0String3Mute");
 const var string2Mute = Synth.getMidiProcessor("Container0String2Mute");
 const var string1Mute = Synth.getMidiProcessor("Container0String1Mute");
 
 //variables to correspond with the Fretdisplay
 Globals.stringNote1 = -1;
 Globals.stringNote2 = -1;
 Globals.stringNote3 = -1;
 Globals.stringNote4 = -1;
 Globals.stringNote5 = -1;
 Globals.stringNote6 = -1;

 /*
     stringNotes holds the note played by each string
    on each index. Index 0 holds note played by string 1 
    (the high string) while index 5 holds note played by
    string 5 (the low string)
 */
var stringNote = [];
stringNote.reserve(NUMOFSTRINGS);
for(var i = 0; i < NUMOFSTRINGS; i++){
	stringNote.push(-1);
}

var handPositionFret = 0;
//this is where the leftmost part of the virtual guitarist's hand is



//functions to ensure only one sampler plays a voice at a time

 inline function playString6(){
    string6Mute.setAttribute("Bypass", false);
    string5Mute.setAttribute("Bypass", true);
    string4Mute.setAttribute("Bypass", true);
    string3Mute.setAttribute("Bypass", true);
    string2Mute.setAttribute("Bypass", true);
    string1Mute.setAttribute("Bypass", true);
 }

 inline function playString5(){
     string6Mute.setAttribute("Bypass", true);
     string5Mute.setAttribute("Bypass", false);
     string4Mute.setAttribute("Bypass", true);
     string3Mute.setAttribute("Bypass", true);
		string2Mute.setAttribute("Bypass", true);
	string1Mute.setAttribute("Bypass", true);
 }

 inline function playString4(){
     string6Mute.setAttribute("Bypass", true);
     string5Mute.setAttribute("Bypass", true);
     string4Mute.setAttribute("Bypass", false);
     string3Mute.setAttribute("Bypass", true);
string2Mute.setAttribute("Bypass", true);
string1Mute.setAttribute("Bypass", true);
 }

 inline function playString3(){
     string6Mute.setAttribute("Bypass", true);
     string5Mute.setAttribute("Bypass", true);
     string4Mute.setAttribute("Bypass", true);
     string3Mute.setAttribute("Bypass", false);
string2Mute.setAttribute("Bypass", true);
string1Mute.setAttribute("Bypass", true);
 }
 
 inline function playString2(){
     string6Mute.setAttribute("Bypass", true);
     string5Mute.setAttribute("Bypass", true);
     string4Mute.setAttribute("Bypass", true);
     string3Mute.setAttribute("Bypass", true);
 string2Mute.setAttribute("Bypass", false);
 string1Mute.setAttribute("Bypass", true);
 }
 
 inline function playString1(){
     string6Mute.setAttribute("Bypass", true);
     string5Mute.setAttribute("Bypass", true);
     string4Mute.setAttribute("Bypass", true);
     string3Mute.setAttribute("Bypass", true);
 string2Mute.setAttribute("Bypass", true);
 string1Mute.setAttribute("Bypass", false);
 }
 
 inline function isBetweenIncl(num, lowBound, highBound){
 	 return num >= lowBound && num <= highBound;
 }
 

 
 inline function updateGlobals(){
	 Globals.stringNote1 = stringNote[Stringtype.STRING1];
	 Globals.stringNote2 = stringNote[Stringtype.STRING2];
	 Globals.stringNote3 = stringNote[Stringtype.STRING3];
	 Globals.stringNote4 = stringNote[Stringtype.STRING4];
	 Globals.stringNote5 = stringNote[Stringtype.STRING5];
	 Globals.stringNote6 = stringNote[Stringtype.STRING6];
 }
 
 
 
 inline function primitiveFretting(notePlayed){
	 
//fretting engine designed for going low to high string then going back down
//use primarily for quick debugging 
 
	 if (stringNote[Stringtype.STRING6] == -1){
	 	playString6();
	 	stringNote[Stringtype.STRING6] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[Stringtype.STRING5] == -1){
	 	playString5();
	 	stringNote[Stringtype.STRING5] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[Stringtype.STRING4] == -1){
	 	playString4();
	 	stringNote[Stringtype.STRING4] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[Stringtype.STRING3] == -1){
	 	playString3();
	 	stringNote[Stringtype.STRING3] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[Stringtype.STRING2] == -1){
	 	playString2();
	 	stringNote[Stringtype.STRING2] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[Stringtype.STRING1] == -1){
	 	playString1();
	 	stringNote[Stringtype.STRING1] = notePlayed;
	 	updateGlobals();
	 	return;
	 }
	 
	 
 }
 
 
 inline function naturalFretting(notePlayed, handPositionFret){
	 //the guitarist will only play as close as to their hands naturally are. 
	 
	 Console.print(handPositionFret);
	 Console.print(notePlayed);
	 
	 if(!isBetweenIncl(notePlayed, LOWESTNOTE, HIGHESTNOTE)){
		 return handPositionFret;
	 }
	 if(isBetweenIncl(notePlayed, OPENSTRING6NOTE, OPENSTRING6NOTE + 4 + handPositionFret)){
		 playString6();
		 stringNote[Stringtype.STRING6] = notePlayed;
		 updateGlobals();
		 
		 if(notePlayed < handPositionFret + OPENSTRING6NOTE){
			 return notePlayed - OPENSTRING6NOTE;
		 }
		 
		 return handPositionFret;
	 }else if(isBetweenIncl(notePlayed, OPENSTRING5NOTE + handPositionFret, OPENSTRING5NOTE + 4 + handPositionFret)){
		 playString5();
		 stringNote[Stringtype.STRING5] = notePlayed;
		 updateGlobals();
		 return handPositionFret;
	 }else if(isBetweenIncl(notePlayed, OPENSTRING4NOTE + handPositionFret, OPENSTRING4NOTE + 4 + handPositionFret)){
		 playString4();
		 stringNote[Stringtype.STRING4] = notePlayed;
		 updateGlobals();
		 return handPositionFret;
	 }else if(isBetweenIncl(notePlayed, OPENSTRING3NOTE + handPositionFret, OPENSTRING3NOTE + 3 + handPositionFret)){
		 playString3();
		 stringNote[Stringtype.STRING3] = notePlayed;
		 updateGlobals();
		 return handPositionFret;
	 }else if(isBetweenIncl(notePlayed, OPENSTRING2NOTE + handPositionFret, OPENSTRING2NOTE + 4 + handPositionFret)){
		 playString2();
		 stringNote[Stringtype.STRING2] = notePlayed;
		 updateGlobals();
		 return handPositionFret;
	 }else{
		 playString1();
		 stringNote[Stringtype.STRING1] = notePlayed;
		 updateGlobals();
		 if(notePlayed - handPositionFret < OPENSTRING1NOTE + 5){
			 return handPositionFret;
		 }else{
			 return notePlayed - OPENSTRING1NOTE - 4;
		 }
	 }
	 
 }
 
 
 inline function isEventStillPlaying(eventId)
 {
     for (var i = 0; i < 128; i++)
     {
         if (activeIds.getValue(i) == eventId)
             return true;
     }
     return false;
 }
 
 
 
 
 
 function onNoteOn()
{
	local notePlayed = Message.getNoteNumber();



	handPositionFret = naturalFretting(notePlayed, handPositionFret);
	
	

	
}
 function onNoteOff()
{
	local releasedNote = Message.getNoteNumber();
	
	if(stringNote[Stringtype.STRING6] == releasedNote){
		stringNote[Stringtype.STRING6] = -1;
	}else if(stringNote[Stringtype.STRING5] == releasedNote){
		stringNote[Stringtype.STRING5] = -1;
	}else if(stringNote[Stringtype.STRING4] == releasedNote){
		stringNote[Stringtype.STRING4] = -1;
	}else if(stringNote[Stringtype.STRING3] == releasedNote){
		stringNote[Stringtype.STRING3] = -1;
	}else if(stringNote[Stringtype.STRING2] == releasedNote){
		stringNote[Stringtype.STRING2] = -1;
	}else if(stringNote[Stringtype.STRING1] == releasedNote){
		stringNote[Stringtype.STRING1] = -1;
	}
	
	updateGlobals();
}
 function onController()
{
	
}
 function onTimer()
{
	
}
 function onControl(number, value)
{
	
}
 