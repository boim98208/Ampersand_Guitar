 const var POSINFINITY = 1/0;
 
 const var NUMOFSTRINGS = Globals.NUMOFSTRINGS;
 const var LOWESTNOTE = 52;
 const var HIGHESTNOTE = 97;
 
 const var OPENSTRING6NOTE = 52;
 const var OPENSTRING5NOTE = 57;
 const var OPENSTRING4NOTE = 62;
 const var OPENSTRING3NOTE = 67;
 const var OPENSTRING2NOTE = 71;
 const var OPENSTRING1NOTE = 76;
 const var OPENSTRINGNONOTE = 1000;
 
 const var OPENSTRINGNOTES = [OPENSTRING1NOTE, OPENSTRING2NOTE, OPENSTRING3NOTE, OPENSTRING4NOTE, OPENSTRING5NOTE, OPENSTRING6NOTE];
 
 OPENSTRINGNOTES.push(OPENSTRINGNONOTE);

 
 namespace Stringtype
 {
 
     const var STRING1 = 0;
     const var STRING2 = 1;
     const var STRING3 = 2;
     const var STRING4 = 3;
     const var STRING5 = 4;
     const var STRING6 = 5;
     const var NOSTRING = 6;
 
 }
 
 
 const var string6Mute = Synth.getMidiProcessor("Container0String6Mute");
 const var string5Mute = Synth.getMidiProcessor("Container0String5Mute");
 const var string4Mute = Synth.getMidiProcessor("Container0String4Mute");
 const var string3Mute = Synth.getMidiProcessor("Container0String3Mute");
 const var string2Mute = Synth.getMidiProcessor("Container0String2Mute");
 const var string1Mute = Synth.getMidiProcessor("Container0String1Mute");
 
/*
 string6Mute.setAttribute("Bypass", true);
 string5Mute.setAttribute("Bypass", true);
 string4Mute.setAttribute("Bypass", true);
 string3Mute.setAttribute("Bypass", true);
 string2Mute.setAttribute("Bypass", true);
 string1Mute.setAttribute("Bypass", true);
 */
 
 //variables to correspond with the Fretdisplay
 Globals.stringNote1 = -1;
 Globals.stringNote2 = -1;
 Globals.stringNote3 = -1;
 Globals.stringNote4 = -1;
 Globals.stringNote5 = -1;
 Globals.stringNote6 = -1;
 Globals.handPositionFret = 0;

 /*
     stringNotes holds the note played by each string
    on each index. Index 0 holds note played by string 1 
    (the high string) while index 5 holds note played by
    string 5 (the low string)
 */
var stringNote = [];
stringNote.reserve(NUMOFSTRINGS);
for(i = 0; i < NUMOFSTRINGS; i++){
	stringNote.push(-1);
}

//one more push to make up for the "NOSTRING" and not go out of bounds
stringNote.push(POSINFINITY);


//this is where the leftmost part of the virtual guitarist's hand is



//functions to ensure only one sampler plays a voice at a time


//setAttributes might be redundant right now but I'm too scared of it breaking
//so I'll leave it there for now


inline function playString6(){ 
string6Mute.setAttribute("Bypass", false);
Message.setChannel(6); 
}

inline function playString5(){ 
string5Mute.setAttribute("Bypass", false);
Message.setChannel(5); }

inline function playString4(){
string4Mute.setAttribute("Bypass", false);
 Message.setChannel(4); }

inline function playString3(){
string3Mute.setAttribute("Bypass", false);
 Message.setChannel(3); }

inline function playString2(){
	string2Mute.setAttribute("Bypass", false);
 Message.setChannel(2); }

inline function playString1(){ 
string1Mute.setAttribute("Bypass", false);
Message.setChannel(1); }


//this should only take the Stringtype enum
inline function playString(theStringType){
	
	//adding 1 because the enum starts on 0 but channels start on 1
	if(theStringType == Stringtype.STRING6){
		playString6();
	}else if(theStringType == Stringtype.STRING5){
		playString5();
	}else if(theStringType == Stringtype.STRING4){
		playString4();
	}else if(theStringType == Stringtype.STRING3){
		playString3();
	}else if(theStringType == Stringtype.STRING2){
		playString2();
	}else if(theStringType == Stringtype.STRING1){
		playString1();
	}
	
	Message.setChannel(theStringType + 1);
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
 
 inline function isPolyphonyPlaying(){
	 return Synth.getNumPressedKeys() >= 1;
 }
 
 //fretting engine designed for going low to high string then going back down
 //use primarily for quick debugging 
 
 inline function primitiveFretting(notePlayed){
 
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
 

 //old naturalFretting engine that didnt have the affordance of certain polyphony
 //try implementing naturalFretting2 instead
inline function naturalFretting1_0_0(notePlayed, currentHandPos){
	 
    if(!isBetweenIncl(notePlayed, LOWESTNOTE, HIGHESTNOTE)){
        return currentHandPos;
    }

    if(isBetweenIncl(notePlayed, OPENSTRING6NOTE, OPENSTRING6NOTE + 4 + currentHandPos) 
        && stringNote[Stringtype.STRING6] == -1){
        stringNote[Stringtype.STRING6] = notePlayed;
        playString6();
        updateGlobals();
        if(notePlayed < currentHandPos + OPENSTRING6NOTE)
            return notePlayed - OPENSTRING6NOTE;
        return currentHandPos;

    }else if(isBetweenIncl(notePlayed, OPENSTRING5NOTE + currentHandPos, OPENSTRING5NOTE + 4 + currentHandPos) 
        && stringNote[Stringtype.STRING5] == -1){
        playString5();
        stringNote[Stringtype.STRING5] = notePlayed;
        updateGlobals();
        return currentHandPos;

    }else if(isBetweenIncl(notePlayed, OPENSTRING4NOTE + currentHandPos, OPENSTRING4NOTE + 4 + currentHandPos) 
        && stringNote[Stringtype.STRING4] == -1){
        playString4();
        stringNote[Stringtype.STRING4] = notePlayed;
        updateGlobals();
        return currentHandPos;

    }else if(isBetweenIncl(notePlayed, OPENSTRING3NOTE + currentHandPos, OPENSTRING3NOTE + 3 + currentHandPos) 
        && stringNote[Stringtype.STRING3] == -1){
        playString3();
        stringNote[Stringtype.STRING3] = notePlayed;
        updateGlobals();
        return currentHandPos;

    }else if(isBetweenIncl(notePlayed, OPENSTRING2NOTE + currentHandPos, OPENSTRING2NOTE + 4 + currentHandPos) 
        && stringNote[Stringtype.STRING2] == -1){
        playString2();
        stringNote[Stringtype.STRING2] = notePlayed;
        updateGlobals();
        return currentHandPos;

    }else if(stringNote[Stringtype.STRING1] == -1){
        // string 1 is the catch-all for anything that doesn't fit elsewhere
        playString1();
        stringNote[Stringtype.STRING1] = notePlayed;
        updateGlobals();
        if(notePlayed - currentHandPos < OPENSTRING1NOTE + 5)
            return currentHandPos;
        else
            return notePlayed - OPENSTRING1NOTE - 4;

    }else{
        // all strings occupied, ignore the note
        Message.ignoreEvent(true);
        return currentHandPos;
    }
}
 



inline function stringWithClosestNote(notePlayed, currentHandPos){
	
	local currString = Stringtype.NOSTRING;
	//arbitrary big number to replace later
	local currDist = POSINFINITY;
	local distToCompare;
	
	//todo: implement forced string
	
	for(i = NUMOFSTRINGS - 1; i > -1; i--){
		if(stringNote[i] == -1){
		
		
		// the - 2 fixes it for some reason. It seems that without it the system just straight up misses notes
		distToCompare = Math.abs((notePlayed - OPENSTRINGNOTES[i] - 2) - currentHandPos);
		
			if(Math.min(currDist, distToCompare) == distToCompare){
				currString = i;
				currDist = distToCompare;
			}
		}
	}
	
	return currString;
	
	
}


inline function forceStringLogic(notePlayed, currentHandPos, fretSpaceToChange){

	local newFretFromForceString;
	local distanceBetweenForceAndAutoFret;

	if(isBetweenIncl(notePlayed, OPENSTRINGNOTES[Globals.forcedString], OPENSTRINGNOTES[Globals.forcedString] + 21) && stringNote[Globals.forcedString] == -1)
	{
	
	
	stringNote[Globals.forcedString] = notePlayed; 
	updateGlobals(); 
	playString(Globals.forcedString);
	
	newFretFromForceString = notePlayed - OPENSTRINGNOTES[Globals.forcedString];
	distanceBetweenForceAndAutoFret = Math.abs(newFretFromForceString - currentHandPos);
	
	Console.print(distanceBetweenForceAndAutoFret);
	
	//changes fret position if forceString's frets go a certain distance
	if(distanceBetweenForceAndAutoFret < fretSpaceToChange)
		{
		return currentHandPos;
		}
	else
		{
		Console.print(newFretFromForceString);
		if(newFretFromForceString > 17)
			return 17;
		else
			return newFretFromForceString;
		}
		
	}
	
}




/*
implementation of forceString and changing fret position from forceString if handPosition is automatic

*/
inline function naturalFretting2_1_0(notePlayed, currentHandPos){

	local fretSpaceToChange = 2;
	local stringToPlay;
	
	if(!isBetweenIncl(notePlayed, LOWESTNOTE, HIGHESTNOTE)){
	    return currentHandPos;
	}
	
	
	//Going to force string mode
	if(Globals.forcedString != -1)
	{

		if(isBetweenIncl(notePlayed, OPENSTRINGNOTES[Globals.forcedString], OPENSTRINGNOTES[Globals.forcedString] + 21) && stringNote[Globals.forcedString] == -1)
		{
		
			return forceStringLogic(notePlayed, currentHandPos, fretSpaceToChange);
			
		}
	}
	
	
	//no forced string and therefore just goes as normal
	
	stringToPlay = stringWithClosestNote(notePlayed, currentHandPos);
	stringNote[stringToPlay] = notePlayed;
	playString(stringToPlay);
	
	updateGlobals();
	
	if(stringToPlay == Stringtype.STRING1){
		if(notePlayed - currentHandPos < OPENSTRING1NOTE + 5)
            return currentHandPos;
        else
            return notePlayed - OPENSTRING1NOTE - 4;
	}
	
	if(stringToPlay == Stringtype.STRING6){
		if(notePlayed < currentHandPos + OPENSTRING6NOTE)
		            return notePlayed - OPENSTRING6NOTE;
	}
	
	return currentHandPos;
	
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
	
	//easy way to implement strumming system? Look into later
	//Message.delayEvent((notePlayed - LOWESTNOTE) * 1000);
	
	if(Globals.forcedHandPositionFret == -1){
		Globals.handPositionFret = naturalFretting2_1_0(notePlayed, Globals.handPositionFret);
	}else{
		Globals.handPositionFret = naturalFretting2_1_0(notePlayed, Globals.forcedHandPositionFret);
	}
	
	

	
}
 function onNoteOff()
{
    local releasedNote = Message.getNoteNumber();
    


    if(stringNote[Stringtype.STRING6] == releasedNote){
	    Console.print("releeeeeaaasse meeeeeeee");
    
        stringNote[Stringtype.STRING6] = -1;
        playString(Stringtype.STRING6);
    }else if(stringNote[Stringtype.STRING5] == releasedNote){
        stringNote[Stringtype.STRING5] = -1;
        playString(Stringtype.STRING5);
    }else if(stringNote[Stringtype.STRING4] == releasedNote){
        stringNote[Stringtype.STRING4] = -1;
        playString(Stringtype.STRING4);
    }else if(stringNote[Stringtype.STRING3] == releasedNote){
        stringNote[Stringtype.STRING3] = -1;
        playString(Stringtype.STRING3);
    }else if(stringNote[Stringtype.STRING2] == releasedNote){
        stringNote[Stringtype.STRING2] = -1;
        playString(Stringtype.STRING2);
    }else if(stringNote[Stringtype.STRING1] == releasedNote){
        stringNote[Stringtype.STRING1] = -1;
        playString(Stringtype.STRING1);
    }

    updateGlobals();
}function onController()
{
	
}
 function onTimer()
{
	
}
 function onControl(number, value)
{
	
}
 