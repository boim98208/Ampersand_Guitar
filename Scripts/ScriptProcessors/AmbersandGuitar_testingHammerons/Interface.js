Globals.forcedHandPositionFret = -1;
Globals.forcedString = -1;
Globals.handPositionFret = 0;

Globals.stringNote1 = -1;
Globals.stringNote2 = -1;
Globals.stringNote3 = -1;
Globals.stringNote4 = -1;
Globals.stringNote6 = -1;


include("KeyswitchConstants.js");

include("NoteRangeAndOpenStringNote.js");

Globals.resetNotes = false;

Globals.frettingEngine = 1;
Globals.legatoRange = 2;

Globals.releaseVolume = 5;

Globals.articulationPlaying = 0;

Globals.timeStretchRatio = 1;
var timeStretchRatioBeforeDisabling = 1;

const var NOTESPERSTRING = 22;
const var NUMOFSTRINGS = 6;

const var NONOTE = -1;


namespace StringType
{
    const var STRING1 = 0;
    const var STRING2 = 1;
    const var STRING3 = 2;
    const var STRING4 = 3;
    const var STRING5 = 4;
    const var STRING6 = 5;
}

namespace PerformanceType
{
	const var SUSTAIN = 0;
	const var LEGATOUP = 1;
	const var LEGATODOWN = 2;
	const var MUTE = 3;
	const var HARMONIC = 4;
	const var TREMOLO = 5;
	//SFX will just be separate keys down low
}


namespace KeyboardColors{
	const var KEYSWITCHES = Colours.withAlpha(Colours.red, 0.5);
	const var NOTES = Colours.withAlpha(Colours.cyan, 0.5);
	const var PERCUSSION = Colours.withAlpha(Colours.green, 0.5);
	const var LEGATO = Colours.withAlpha(Colours.cornflowerblue, 0.5);
	const var FORCEFRETHAND = Colours.withAlpha(Colours.deeppink, 0.5);
}



Globals.stringPerformance = [];
Globals.stringPerformance.reserve(NUMOFSTRINGS);
for(var i = 0; i < NUMOFSTRINGS; i++){
	Globals.stringPerformance[i] = PerformanceType.SUSTAIN;
}


//size of this constant array is number of enums in PerformanceType
const var stringPerformanceImgs = [0, 0, 0];

stringPerformanceImgs[PerformanceType.SUSTAIN] = "{PROJECT_FOLDER}PlayingMode_FretIndicator.png";
stringPerformanceImgs[PerformanceType.LEGATOUP] = "{PROJECT_FOLDER}PlayingMode_FretIndicator_Legatoup.png";
stringPerformanceImgs[PerformanceType.LEGATODOWN] = "{PROJECT_FOLDER}PlayingMode_FretIndicator_Legatodown.png";



inline function displayFret(fretImg, stringNum)
{

	if(Globals.stringPerformance[stringNum] == PerformanceType.SUSTAIN)
	{
		fretImg.set("fileName", stringPerformanceImgs[PerformanceType.SUSTAIN]);
	}
	else if(Globals.stringPerformance[stringNum] == PerformanceType.LEGATOUP)
	{
	
		fretImg.set("fileName", stringPerformanceImgs[PerformanceType.LEGATOUP]);
	}
	else if(Globals.stringPerformance[stringNum] == PerformanceType.LEGATODOWN)
	{
	Console.print("issue is at " + stringNum);

		fretImg.set("fileName", stringPerformanceImgs[PerformanceType.LEGATODOWN]);
		
	}
			
	fretImg.set("visible", true);
}



inline function onResetGlobalRRButtonControl(component, value)
{
	if(value){
		Globals.stringNote1 = -1;
		Globals.stringNote2 = -1;
		Globals.stringNote3 = -1;
		Globals.stringNote4 = -1;
		Globals.stringNote5 = -1;
		Globals.stringNote6 = -1; 
		
		//some notes have a problem of just hanging and not getting off the stringNote array in FrettingEngine
		Globals.resetNotes = true;
		//Globals.resetNotes is put back to false in FrettingEngine after it recognizes it
	}
	
	Engine.allNotesOff();
	
};

Content.getComponent("ResetGlobalRRButton").setControlCallback(onResetGlobalRRButtonControl);



//making sure an array is completely uniform
inline function isUniform(buffer, bufferSize){
	local checker = buffer[0];


	for(var i = 1; i < bufferSize; i++){
		if(checker != buffer[i])
			return false;
	}

	
	return true;
	
}




//every index is a fret
const var xPosOfFretBorder = [0, 5, 50, 87, 116, 146, //0
							 170, 193, 210, 230, 246, //6
							 264, 279, 295, 312, 330, //10
							 346, 364, 380, 395, 407, 
							 421, 432, 115, 125];



Globals.string6ActiveRR = "not playing";
Globals.string5ActiveRR = "not playing";
Globals.string4ActiveRR = "not playing";
Globals.string3ActiveRR = "not playing";
Globals.string2ActiveRR = "not playing";
Globals.string1ActiveRR = "not playing";


Synth.deferCallbacks(true);
 Content.makeFrontInterface(1020, 600);
 
//connecting with fret markers on the UI

const var NOTESPERSTRING = 22;
Globals.NUMOFSTRINGS = 6;
Globals.pitchBendOffset = 0;



const var handPositionFretLabel = Content.getComponent("handPositionFretLabel");




const var HandPositionFretForceKnob = Content.getComponent("HandPositionFretForceKnob");

inline function handPositionFretForceKnobChange(value){

	Globals.forcedHandPositionFret = value - 2;
	
	

}

inline function onHandPositionFretForceKnobControl(component, value)
{
	handPositionFretForceKnobChange(value);
};

Content.getComponent("HandPositionFretForceKnob").setControlCallback(onHandPositionFretForceKnobControl);



const var StringForceKnob = Content.getComponent("StringForceKnob");


inline function onStringForceKnobControl(component, value)
{
	Globals.forcedString = value - 2;
	moveForceString(Globals.forcedString);
	//Console.print(Globals.forcedString);
};

Content.getComponent("StringForceKnob").setControlCallback(onStringForceKnobControl);




const var FrettingEngineComboBox = Content.getComponent("FrettingEngineComboBox");


inline function onFrettingEngineComboBoxControl(component, value)
{
	Globals.frettingEngine = value;
};

Content.getComponent("FrettingEngineComboBox").setControlCallback(onFrettingEngineComboBoxControl);


const var StringRRLabel = [Content.getComponent("String1RRLabel"),
                           Content.getComponent("String2RRLabel"),
                           Content.getComponent("String3RRLabel"),
                           Content.getComponent("String4RRLabel"),
                           Content.getComponent("String5RRLabel"),
                           Content.getComponent("String6RRLabel")];


const var DebugPanel = Content.getComponent("DebugPanel");

const var PlayingModeBG = Content.getComponent("PlayingModeBG");

const var ShowArticulationsButton = Content.getComponent("ShowArticulationsButton");

// setting up the buttons that show the GUI

inline function onShowDebugPanelButtonControl(component, value)
{

	if(value){
		DebugPanel.set("visible", true);
		ShowPlayingModeButton.setValue(1);
		ShowArticulationsButton.setValue(0);
		PlayingModeBG.set("visible", 1);
		ArticulationBG.set("visible", false);
		}
	else
		DebugPanel.set("visible", false);
	
	
};

Content.getComponent("ShowDebugPanelButton").setControlCallback(onShowDebugPanelButtonControl);



const var ShowPlayingModeButton = Content.getComponent("ShowPlayingModeButton");

ShowPlayingModeButton.setValue(0);
PlayingModeBG.set("visible", true);

inline function onShowPlayingModeButtonControl(component, value)
{
	
	if(ShowPlayingModeButton.getValue() == 0){
		PlayingModeBG.set("visible", false);
		DebugPanel.set("visible", false);
	}else{
		PlayingModeBG.set("visible", true);
		ArticulationBG.set("visible", false);
		ShowArticulationsButton.setValue(0);
	}

};

Content.getComponent("ShowPlayingModeButton").setControlCallback(onShowPlayingModeButtonControl);

const var ArticulationBG = Content.getComponent("ArticulationBG");

ArticulationBG.set("visible", false);

inline function onShowArticulationsButtonControl(component, value)
{
	if(value == 0){
		ArticulationBG.set("visible", false);
		ShowPlayingModeButton.setValue(1);
		DebugPanel.set("visible", false);
		PlayingModeBG.set("visible", false);
	}else{
		ShowPlayingModeButton.setValue(0);
		PlayingModeBG.set("visible", false);
		ArticulationBG.set("visible", true);
	}
};

Content.getComponent("ShowArticulationsButton").setControlCallback(onShowArticulationsButtonControl);

//setting up fretMarkers

var fretImages = [];
for (var str = 0; str < Globals.NUMOFSTRINGS; str++){
	
	var row = [];
	
	for (var j = 0; j < NOTESPERSTRING; j++){
		row.push(Content.getComponent("String" + (str + 1) + "Fret" + j + "Marker"));
	}
	fretImages.push(row);
}


for (var i = 0; i < Globals.NUMOFSTRINGS; i++){
	for (var j = 0; j < NOTESPERSTRING; j++){
		fretImages[i][j].set("fileName", "{PROJECT_FOLDER}PlayingMode_FretIndicator.png");
		fretImages[i][j].set("visible", false);
	}
}


inline function updateStringRRLabels()
{
	//looks like there's a way do global arrays. Look into later

	StringRRLabel[0].set("text", Globals.string1ActiveRR);
	StringRRLabel[1].set("text", Globals.string2ActiveRR);
	StringRRLabel[2].set("text", Globals.string3ActiveRR);
	StringRRLabel[3].set("text", Globals.string4ActiveRR);
	StringRRLabel[4].set("text", Globals.string5ActiveRR);
	StringRRLabel[5].set("text", Globals.string6ActiveRR);
	

}




inline function hideAll()
{
    for (var i = 0; i < Globals.NUMOFSTRINGS; i++)
        for (var j = 0; j < NOTESPERSTRING; j++)
            fretImages[i][j].set("visible", false);
}

inline function hideString(stringNum){
	for(var j = 0; j < NOTESPERSTRING; j++){
		fretImages[stringNum][j].set("visible", false);
	}
}

inline function cap(num, limit)
{
	 if(num > limit)
	 {
		 return limit;
	 }else{
		 return num;
	 }
}

inline function keyswitchForceFret(notePlayed, velocity)
{
	local newFretPosition;

	
	//note to self: figure out how to get knobs to change text when given a keyswitch

	if(notePlayed == FORCEFRETMODEKEYSWITCH)
	{
	Console.print("keyswitch for fret change is hit");
	newFretPosition = velocity % 18;

		HandPositionFretForceKnob.setValue(newFretPosition);
		Globals.forcedHandPositionFret = newFretPosition;
		Globals.handPositionFret = newFretPosition;
		
		
	}else if(notePlayed == AUTOFRETMODEKEYSWITCH)
	{
	 Console.print("keyswitch for auto fret change is hit");

		HandPositionFretForceKnob.setValue(-1);
		Globals.forcedHandPositionFret = -1;
		
	}
}

const var FretBorderLow = Content.getComponent("FretBorderLow");

const var FretBorderLowForced = Content.getComponent("FretBorderLowForced");

FretBorderLowForced.set("visible", false);

const var FretBorderHigh = Content.getComponent("FretBorderHigh");

const var FretBorderHighForced = Content.getComponent("FretBorderHighForced");


const var fretBorderCenterHW = 15;
const var fretBorderCenterY = 23;

const var FretBorderCenter = Content.getComponent("FretBorderCenter");

const var FretBorderCenterForced = Content.getComponent("FretBorderCenterForced");

FretBorderCenterForced.set("visible", false);

FretBorderCenter.set("width", fretBorderCenterHW);
FretBorderCenter.set("height", fretBorderCenterHW);
FretBorderCenter.set("y", fretBorderCenterY);

FretBorderCenterForced.set("width", fretBorderCenterHW);
FretBorderCenterForced.set("height", fretBorderCenterHW);
FretBorderCenterForced.set("y", fretBorderCenterY);




const var StringForcePanel = Content.getComponent("StringForcePanel");

const var ForceStringImages = [Content.getComponent("StringForceString6"),
                               Content.getComponent("StringForceString5"),
                               Content.getComponent("StringForceString4"),
                               Content.getComponent("StringForceString3"),
                               Content.getComponent("StringForceString2"),
                               Content.getComponent("StringForceString1")];
// doing this so that string1 starts on index 0 and I'm too lazy to change the declaration statement
ForceStringImages.reverse();
                               
for( i in ForceStringImages){
	i.set("visible", false);
}


const var ArticulationPlayingLabel = Content.getComponent("ArticulationPlayingLabel");




inline function capLow(lowLim, num){
	if(num < lowLim){
		return lowLim;
		}
	else{
		return num;
		}
}



inline function moveFretBorder(fretPos){
	//implement the different positions for when you go to melody fretting mode so like for melody mode make sure you the span of the lowBorder and the highBorder is greater to a higher fret
	local lowFret;
	local highFret;
	local distBetweenFrets;
	local posOfCenter;
	
	if(fretPos == 1)
	{
		lowFret = cap(0, 2);
	}
	else
	{
		lowFret = capLow(0, fretPos);
	}
		
	highFret = lowFret + 5;
	
	distBetweenFrets = xPosOfFretBorder[highFret] - xPosOfFretBorder[lowFret];
	
	posOfCenter = xPosOfFretBorder[lowFret] + (distBetweenFrets/2);

	if(Globals.forcedHandPositionFret != -1)
	{
		FretBorderLowForced.set("visible", true);
		FretBorderHighForced.set("visible", true);
		FretBorderCenterForced.set("visible", true);
	}
	else
	{
		FretBorderLowForced.set("visible", false);
		FretBorderHighForced.set("visible", false);
		FretBorderCenterForced.set("visible", false);
	}


	FretBorderLow.set("x", xPosOfFretBorder[lowFret]);
	FretBorderLowForced.set("x", xPosOfFretBorder[lowFret]);
	FretBorderHigh.set("x", xPosOfFretBorder[highFret]);
	FretBorderHighForced.set("x", xPosOfFretBorder[highFret]);
	FretBorderCenter.set("x", posOfCenter);
	FretBorderCenterForced.set("x", posOfCenter);
	
	
	
	
		
}


inline function moveForceString(stringToForce){
	local whatToForce;

	for(image in ForceStringImages){
		image.set("visible", false);
	}

	if(stringToForce != -1){
		whatToForce = ForceStringImages[stringToForce];
	
		whatToForce.set("visible", true);
	}
}



// initializing DSP FX GUI

const var ConvolutionReverb1 = Synth.getEffect("ConvolutionReverb1");
const var ConvolutionReverb1Sample = Synth.getAudioSampleProcessor("ConvolutionReverb1");

const var cmbIr = Content.getComponent("cmbIr");
const irs = Engine.loadAudioFilesIntoPool();
cmbIr.set("items", "");


inline function oncmbIrControl(component, value)
{
	if(value > 0)
		ConvolutionReverb1Sample.setFile(irs[value - 1]);
};

Content.getComponent("cmbIr").setControlCallback(oncmbIrControl);


for (var i = 0; i < irs.length; i++){
	if(!irs[i].contains("xfade")){
		cmbIr.addItem(irs[i].replace("{PROJECT_FOLDER}").replace(".wav"));
	}


}




const var IRMixKnob = Content.getComponent("IRMixKnob");

inline function onIRMixKnobControl(component, value)
{
	local dryLinear = Math.cos(Math.PI * value / 2);
	local wetLinear = Math.sin(Math.PI * value / 2);
	
		// noticing a boost in the middle position. This'll hopefully reduce that
		local centerComp = 1.0 - 0.2 * Math.sin(Math.PI * value);
		dryLinear *= centerComp;
		wetLinear *= centerComp;
		
		 
	
	local dryGain = 20 * Math.log10(dryLinear);
	local wetGain = 20 * Math.log10(wetLinear);
	
	  
	
		dryGain = dryGain - 6;
	ConvolutionReverb1.setAttribute(ConvolutionReverb1.DryGain, dryGain);
	ConvolutionReverb1.setAttribute(ConvolutionReverb1.WetGain, wetGain);
};

Content.getComponent("IRMixKnob").setControlCallback(onIRMixKnobControl);



// setting up articulations page


inline function onTremoloTimestretchKnobControl(component, value)
{

	Globals.timeStretchRatio = value;
};


Content.getComponent("TremoloTimestretchKnob").setControlCallback(onTremoloTimestretchKnobControl);

const var TremoloTimestretchKnob = Content.getComponent("TremoloTimestretchKnob");


const var EnableTremStretchButton = Content.getComponent("EnableTremStretchButton");




/*

I keep crashing with this. Figure out if you want implementations of this another time

inline function onEnableTremStretchButtonControl(component, value)
{
	if(value){
		Globals.timeStretchRatio = timeStretchRatioBeforeDisabling;
	}else{
		
		timeStretchRatioBeforeDisabling = Globals.timeStretchRatio;
		Globals.timeStretchRatio = -1;
	}
};

Content.getComponent("EnableTremStretchButton").setControlCallback(onEnableTremStretchButtonControl);


*/
 
 
// Coloring up the keyboard
for(var i = LOWESTNOTE; i < HIGHESTNOTE + 1; i++){
	Engine.setKeyColour(i, KeyboardColors.NOTES);
}

for(var i = FIRSTKEYSWITCH; i < LASTKEYSWITCH + 1; i++){
	Engine.setKeyColour(i, KeyboardColors.KEYSWITCHES);
}

for(var i = FIRSTPERCUSSION; i < LASTPERCUSSION + 1; i++){
	Engine.setKeyColour(i, KeyboardColors.PERCUSSION);
}

Engine.setKeyColour(legatoKeySwitchNote, KeyboardColors.LEGATO);

Engine.setKeyColour(FORCEFRETMODEKEYSWITCH, KeyboardColors.FORCEFRETHAND);
Engine.setKeyColour(AUTOFRETMODEKEYSWITCH, KeyboardColors.FORCEFRETHAND);








function onNoteOn()
{
	

	local notePlayed = Message.getNoteNumber();
	local velocityPlayed = Message.getVelocity();
	
	
	keyswitchForceFret(notePlayed, velocityPlayed);
	
	moveForceString(Globals.forcedString);
	
	Synth.startTimer(0.05);
	

}
      function onNoteOff()
{
	Synth.startTimer(0.05);
}
 //const var MAX_BEND_PIXELS = 15;

function onController()
{
	
	//script to move fret markers. Implement later if needed

	/*

	var normalized = 0;
	var raw = 0;
	
	if (Message.getControllerNumber() == 128)
	    {
	        raw = Message.getControllerValue();  // 0 to 16383, center = 8192
	
	        // Normalize to -1.0 to +1.0
	        normalized = (raw - 8192) / 8192.0;
	
	        // Convert to pixel offset
	        Globals.pitchBendOffset = normalized * MAX_BEND_PIXELS;
			Console.print(Globals.pitchBendOffset);

	    }
	    
	    */
	    

	    
	
}
 function onTimer()
{
	local fretImgToControl = fretImages[StringType.STRING6][0];

	
	hideAll();

	if(Globals.stringNote6 != NONOTE){
		fretImgToControl = fretImages[StringType.STRING6][Globals.stringNote6 - 52];
		displayFret(fretImgToControl, StringType.STRING6);
		
	}
	
	if(Globals.stringNote5 != NONOTE){
		fretImgToControl = fretImages[StringType.STRING5][Globals.stringNote5 - 57];
		displayFret(fretImgToControl, StringType.STRING5);
	}
	
	if(Globals.stringNote4 != NONOTE){
		fretImgToControl = fretImages[StringType.STRING4][Globals.stringNote4 - 62];
		displayFret(fretImgToControl, StringType.STRING4);
	}
	
	if(Globals.stringNote3 != NONOTE){
		fretImgToControl = fretImages[StringType.STRING3][Globals.stringNote3 - 67];
		displayFret(fretImgToControl, StringType.STRING3);
	}
	
	if(Globals.stringNote2 != NONOTE){
		fretImgToControl = fretImages[StringType.STRING2][Globals.stringNote2 - 71];
		displayFret(fretImgToControl, StringType.STRING2);
	}
	
	if(Globals.stringNote1 != NONOTE){
		fretImgToControl = fretImages[StringType.STRING1][Globals.stringNote1 - 75];
		displayFret(fretImgToControl, StringType.STRING1);
	}
	
	
	
	handPositionFretLabel.set("text", Globals.handPositionFret != -1 ? Globals.handPositionFret : "");
	
	
	if(Globals.forcedHandPositionFret != -1)
	{
		moveFretBorder(Globals.forcedHandPositionFret);
	
	}else
	{
		moveFretBorder(Globals.handPositionFret);
	}
	
	updateStringRRLabels();
	
	TremoloTimestretchKnob.setValue(Globals.timeStretchRatio);
	
	
	
	
	
	
}
 function onControl(number, value)
{
	
}
 