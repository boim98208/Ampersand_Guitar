const var releaseAddition = [10, 11, 10];
const var releaseAdditionWhenHigh = [-3, -4, -5];
const var OPENSTRINGNOTE = 52;
const var NOTEPERSTRING = 22;
const var POINTTOCHANGERELEASE = OPENSTRINGNOTE + (NOTEPERSTRING/2);
const var LEGATOCHNLOFFSET = 6;
Globals.string6Id = -99;


reg releaseNoteNum = 0;
reg isReleased = 0;
reg releaseAdditionIndex = 0;
reg id = -99;
reg noteReleased;
reg noteVelocity = 60;



Synth.stopTimer();

//const var releaseAddition = [-2, -3, -4, -5, -6];

const var startReleaseVolume = 10;
var releaseVolumeOverTime = startReleaseVolume;
//note to self, figure out if you can fade between your pseudo releases
const var releaseTimeSeconds = .03;
function onNoteOn()
{
	
	Message.makeArtificial();
	Console.print(Message.getChannel());
	
	if(Message.getChannel() == 6){
		//is now playing the note and updates
		Console.print("Yes I'm still going here");
		Globals.string6ActiveRR = Sampler.getActiveRRGroup();
		noteVelocity = Message.getVelocity();
		Globals.string6Id = Message.getEventId();
	}/*else if(Message.getChannel() == 6 + LEGATOCHNLOFFSET){
		Console.print("my id is " + id);
		Console.print("this message's id is " + Message.getEventId());
		Synth.noteOffByEventId(id);
		Message.ignoreEvent(true);
	}*/
	else{
		Message.ignoreEvent(true);
	}
	
}
 function onNoteOff()
{
	Synth.stopTimer();
	if(Message.getChannel() != 6){
		Message.ignoreEvent(true);
	}else{
		isReleased = true;
		Synth.startTimer(0.02);
		Globals.string6ActiveRR = "not playing";
	}
}
  function onController()
{
	
}
 function onTimer()
{


local releaseNote;
local numOfReleases;

 if(!Globals.emulatedReleasesOn){
	 return;
 
	}
	
	if(id != -99)
		Synth.noteOffByEventId(id);
	
	if(isReleased){
		

		if(noteReleased < POINTTOCHANGERELEASE)
			{		
			releaseNote = noteReleased + releaseAddition[releaseAdditionIndex];
			numOfReleases = releaseAddition.length;
			}
		else
			{
			releaseNote = noteReleased + releaseAdditionWhenHigh[releaseAdditionIndex];
			numOfReleases = releaseAdditionWhenHigh.length;

			}
		
		
		if(noteVelocity == 0)
			id = Synth.playNote(releaseNote, 1);
		else
		{
			//Console.print("you work just fine before");
			id = Synth.playNote(releaseNote, noteVelocity);

		}
		
		
		Synth.addVolumeFade(id, 0, releaseVolumeOverTime);
		
		releaseVolumeOverTime = releaseVolumeOverTime - .02;
		
		releaseAdditionIndex++;
		Synth.startTimer(releaseTimeSeconds);
		
		if(releaseAdditionIndex == numOfReleases - 1){ 

			isReleased = false;
			releaseAdditionIndex = 0;
		}
		
		
	}
	

	
}
 function onControl(number, value)
{
	
}
 