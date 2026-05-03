 const var NUMOFSTRINGS = 6;
 const var TremoloSamplers = [];
 TremoloSamplers.reserve(NUMOFSTRINGS);
 
 
 for(var i = 0; i < NUMOFSTRINGS; i++){
	 TremoloSamplers.push(Synth.getChildSynth("String" + (i + 1) + "TremoloSampler"));
 }
 
 
const var stretchSettings = TremoloSamplers[0].asSampler().getTimestretchOptions();
stretchSettings.Mode = "TimeVariant";

for(var i = 0; i < NUMOFSTRINGS; i++){
	TremoloSamplers[i].asSampler().setTimestretchOptions(stretchSettings);
	TremoloSamplers[i].asSampler().setTimestretchRatio(1);
}function onNoteOn()
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
 