 function onNoteOn()
{
	if(Message.getChannel() != 2){
		
		Message.ignoreEvent(true);
	}else{
		//is now playing the note and updates	
	//	Globals.string2ActiveRR = Sampler.getActiveRRGroup();
	}
}
 function onNoteOff()
{
	if(Message.getChannel() != 2){
		Message.ignoreEvent(true);
	}else{
		Globals.string2ActiveRR = "not playing";
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
 