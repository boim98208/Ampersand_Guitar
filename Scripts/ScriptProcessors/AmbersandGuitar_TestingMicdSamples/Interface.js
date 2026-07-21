Globals.forcedHandPositionFret = -1;
Globals.forcedString = -1;
Globals.handPositionFret = 0;
Globals.stringNote1 = -1;
Globals.stringNote2 = -1;
Globals.stringNote3 = -1;
Globals.stringNote4 = -1;
Globals.stringNote5 = -1;
Globals.stringNote6 = -1; 
Globals.frettingEngine = 1;



Globals.string6ActiveRR = "not playing";
Globals.string5ActiveRR = "not playing";
Globals.string4ActiveRR = "not playing";
Globals.string3ActiveRR = "not playing";
Globals.string2ActiveRR = "not playing";
Globals.string1ActiveRR = "not playing";




const var NUMOFSTRINGS = 6;


 Content.makeFrontInterface(1200, 600);
 
//connecting with fret markers on the UI

const var NOTESPERSTRING = 22;
Globals.NUMOFSTRINGS = 6;
Globals.pitchBendOffset = 0;



const var handPositionFretLabel = Content.getComponent("handPositionFretLabel");




const var HandPositionFretForceKnob = Content.getComponent("HandPositionFretForceKnob");

inline function onHandPositionFretForceKnobControl(component, value)
{
	if(value == -1)
	{
		HandPositionFretForceKnob.set("text", "Fret: Auto");
	}	else
	{

		HandPositionFretForceKnob.set("text", "Fret: " + value);
	}
};

Content.getComponent("HandPositionFretForceKnob").setControlCallback(onHandPositionFretForceKnobControl);



const var StringForceKnob = Content.getComponent("StringForceKnob");


inline function onStringForceKnobControl(component, value)
{
	local text = "Auto";

	if(value == -1)
	{
		StringForceKnob.set("text", "String: " + text);
	}else
	{
		StringForceKnob.set("text", "string: " + (6 - value));
	}
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



inline function onShowDebugPanelButtonControl(component, value)
{
	if(value)
		DebugPanel.set("visible", true);
	else
		DebugPanel.set("visible", false);
	
	
};

Content.getComponent("ShowDebugPanelButton").setControlCallback(onShowDebugPanelButtonControl);


	

namespace stringType
{

    const var STRING1 = 0;
    const var STRING2 = 1;
    const var STRING3 = 2;
    const var STRING4 = 3;
    const var STRING5 = 4;
    const var STRING6 = 5;

}

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










function onNoteOn()
{
	Globals.forcedHandPositionFret = HandPositionFretForceKnob.getValue();
	
	Globals.forcedString = StringForceKnob.getValue();
	
	
	
	switch (Globals.forcedString)
	{
		case -1:
			break;
		default:
			Globals.forcedString = NUMOFSTRINGS - Globals.forcedString - 1;
	}
	
	
	
	
	Synth.startTimer(0.05);
	
	handPositionFretLabel.set("text", Globals.handPositionFret);
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
	
	hideAll();
	
	if(Globals.stringNote6 >= 52 && Globals.stringNote6 <= 73){
		fretImages[stringType.STRING6][Globals.stringNote6 - 52].set("visible", true);
	}
	
	if(Globals.stringNote5 >= 57 && Globals.stringNote5 <= 78){
		fretImages[stringType.STRING5][Globals.stringNote5 - 57].set("visible", true);
	}
	
	if(Globals.stringNote4 >= 62 && Globals.stringNote4 <= 83){
		fretImages[stringType.STRING4][Globals.stringNote4 - 62].set("visible", true);
	}
	
	if(Globals.stringNote3 >= 67 && Globals.stringNote3 <= 88){
		fretImages[stringType.STRING3][Globals.stringNote3 - 67].set("visible", true);
	}
	
	if(Globals.stringNote2 >= 71 && Globals.stringNote2 <= 92){
		fretImages[stringType.STRING2][Globals.stringNote2 - 71].set("visible", true);
	}
	
	if(Globals.stringNote1 >= 76 && Globals.stringNote1 <= 97){
		fretImages[stringType.STRING1][Globals.stringNote1 - 76].set("visible", true);
	}
	
	updateStringRRLabels();
	
	
	
	
	
	
}
 function onControl(number, value)
{
	
}
 