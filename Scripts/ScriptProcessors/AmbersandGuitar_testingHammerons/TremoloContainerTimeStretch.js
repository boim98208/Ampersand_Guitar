 const var NUMOFSTRINGS = 6;
 const var TremoloSamplers = [];
 TremoloSamplers.reserve(NUMOFSTRINGS);
Synth.deferCallbacks(true);
 
 
 for(var i = 0; i < NUMOFSTRINGS; i++){
	 TremoloSamplers.push(Synth.getChildSynth("String" + (i + 1) + "TremoloSampler"));
 }
 
 var stretchRatio;
 
const var stretchSettings = TremoloSamplers[5].asSampler().getTimestretchOptions();
stretchSettings.Mode = "TimeVariant";

for(var i = 0; i < NUMOFSTRINGS; i++){
	TremoloSamplers[i].asSampler().setTimestretchOptions(stretchSettings);
	TremoloSamplers[i].asSampler().setTimestretchRatio(1);
}


inline function changeTimestretchRatio(newTimestretchRatio){
	for(var i = 0; i < NUMOFSTRINGS; i++){
	TremoloSamplers[i].asSampler().setTimestretchRatio(newTimestretchRatio);
}
}


inline function onKnob1Control(component, value)
{
	changeTimestretchRatio(value);
};

Content.getComponent("Knob1").setControlCallback(onKnob1Control);




function onNoteOn()
{
	
}
 function onNoteOff()
{
	
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
 