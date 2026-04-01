 function onNoteOn()
{
	
	Console.print(Message.getChannel());

	if(Message.getChannel() != 3){
		
		Message.ignoreEvent(true);
		Globals.string3ActiveRR = "not playing";
	}else{
		
	
		//is now playing the note and updates	
		Globals.string3ActiveRR = Sampler.getActiveRRGroup();
	}
}
 function onNoteOff()
{
	if(Message.getChannel() != 3){
		Message.ignoreEvent(true);
	}else{
	
		Globals.string3ActiveRR = "not playing";
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
 