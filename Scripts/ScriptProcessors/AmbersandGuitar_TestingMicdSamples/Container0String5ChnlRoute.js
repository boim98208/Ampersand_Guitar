 function onNoteOn()
{
	if(Message.getChannel() != 5){
		
		Message.ignoreEvent(true);
	}else{
		//is now playing the note and updates	
		Globals.string5ActiveRR = Sampler.getActiveRRGroup();
	}
}
 function onNoteOff()
{
	if(Message.getChannel() != 5){
		Message.ignoreEvent(true);
	}else{
		Globals.string5ActiveRR = "not playing";
	}
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
 