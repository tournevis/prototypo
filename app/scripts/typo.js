/* Declaration des coordonnées des Lettre et du centre de la fenetre
	L'idée de base était de déclarer toutes ces variables dans un fichier JSON afin d'avoir un alphabet complet,
	avec les coordoonées de chaque Lettres et chiffres. 
*/

var cX = view.center.x;
var cY = view.center.y;

	
var mX = [cX-70, cX-50,cX,cX+50,cX+70];
var mY = [cY+60,cY-60,cY+60,cY-60,cY+60];


var zX = [cX-60, cX+20,cX-60,cX+20];
var zY = [cY-60,cY-60,cY+60,cY+60];


var oX = [cX , cX-60 ,cX ,cX+60, cX];
var oY = [cY+60,cY,cY-60,cY,cY+60];

var aX = [cX-50 , cX ,cX+50];
var aY = [cY+60,cY-60,cY+60];


var rX = [cX-50, cX-50 ,cX,cX-50,cX+60];
var rY = [cY+60,cY-60,cY-30,cY,cY+60];

var drag = false ; 
var mouse = new Point(0,0);

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext("2d");

var randColor = Math.floor(Math.random() * 3);

// Declaration des couleurs

var myColor = [ '#F49716' ,'#C23C2A', '#83253F', '#4A2336', '#BF565D' ];
var myColor1 = [ '#0e5654','#195c77','#dad6b0','#89bcab','#1f2f2f' ];
var myColor2 = [ '#204B4A ' ,'#C7D49B', '#1E4D33', '#84B79F', '#BF565D' ];

// Le tempo est la ligne sur laquel je vais tester mes points afin de jouer ou non le son selectionner
var tempo = new Path.Line(new Point(0,0),new Point(0,cY*2));
var tempoCircle = new Path.Circle({
	center: [0,cY*2-20],
			radius: 5,
			fillColor: 'white',
			opacity: 0.8

});
tempo.strokeColor= 'white';
tempo.strokeColor.alpha = 0.2;
tempo.strokeWidth = 3 ;
tempo.blendMode = 'hard-light';

var ct = new Path.Circle({
			center: [-10,0],
			radius: 5,
			fillColor: 'white',
			opacity: 0.8
		});
var ct2 = new Path.Circle({
			center: [-10,0],
			radius: 5,
			fillColor: 'white',
			opacity: 0.8
		});
var ct3 = new Path.Circle({
			center: [-10,0],
			radius: 5,
			fillColor: 'white',
			opacity: 0.8
		});




	/*	 My CLASS SOUND 	*/

function Sound(url){
   	window.AudioContext = window.AudioContext || window.webkitAudioContext;

    this.context = new AudioContext();
	this.gainNode = this.context.createGain();
 	this.soundParam = {
   		url : "",
  		 buffer : null
 	};
 	if(url){
   		this.load(url);
 	}	
}

Sound.prototype.play = function(url, playback){
 var that = this;
 //S'il y a une url et pas de son chargé
 if(url != "" && this.soundParam.url != url){
   this.load(url,function(err){
     if(err != ""){
       that.play();
     }
   });
 } else if(this.soundParam.buffer != null){
   var bufferSource = this.context.createBufferSource();
   bufferSource.buffer = this.soundParam.buffer;
   bufferSource.connect(this.context.destination);
   bufferSource.playbackRate.value = playback ; 
   bufferSource.start(0);  
 } else {
   console.log("No sound Loaded");
 }
};

Sound.prototype.load = function(url, callback) {
 var that = this;
 if(url != ""){
   this.soundParam.url = url
   this.bufferLoader(url,function(err){
     if(callback){
       callback(err);
     }
   });
 } else {
   console.log("No url");
 }
};

Sound.prototype.getSoundUrl = function(){
 return this.soundParam.url;
};

Sound.prototype.bufferLoader = function(url,callback){

 var request = new XMLHttpRequest();
 var that = this;

 if(callback){
   request.open("GET", url, true);
   request.responseType = "arraybuffer";
   request.send();

   request.onload = function() {
     that.context.decodeAudioData(request.response, function(bfr){
       var err = "";
       if(!bfr) {
         err = 'error decoding file data :'+url;
       } else {
         that.soundParam.buffer = bfr;
       }
       callback(err);
     }, function(error){
       callback('decodeAudiData erre : '+error);
     });
   };

   request.onerror = function(){
     callback('BufferLoader : XHR error');
   };
 }
};	
	/* -- MY CLASS LETTER -- */

function Letter(letter,x,y, offset){
	this.x = x ;
	this.y = y;
	this.letter = letter;
	this.Points = [];
	this.offset = offset;
	this.mySke; 
	this.Son = new Sound();
	this.Son.play('../sound/violon.mp3');
	this.noteCircles = [];
	this.ctArray = [];
	this.myLayer = [];
}

Letter.prototype.createPoints = function createPoints(){
	/* Dans cette fonction je rentre tout mes points dans le tableau Points et j'ajoute chaque point à un calque
	afin de pouvoir les déplacer */
	if( this.letter ===  'm'){
		for(var i = mX.length-1 ; i >= 0 ; i-- ){
			this.Points[i] = new Point(mX[i]+this.offset, mY[i]);
			this.myLayer[i] = new Layer();
			//console.log('point : ' +i + 'crée ');

		}
	}
	if(this.letter ===  'z'){
		for(var i = zX.length-1 ; i >= 0 ; i-- ){
			this.Points[i] = new Point(zX[i] +this.offset,zY[i]);
			//console.log('point : ' +i + 'crée ');
				this.myLayer[i] = new Layer();
		}
	}
	if(this.letter ===  'o'){
		for(var i = oX.length-1 ; i >= 0 ; i-- ){
			this.Points[i] = new Point(oX[i] +this.offset,oY[i]);
				this.myLayer[i] = new Layer();
			//console.log('point : ' +i + 'crée ');
		}
	}
	if(this.letter ===  'a'){
		for(var i = aX.length-1 ; i >= 0 ; i-- ){
			this.Points[i] = new Point(aX[i] +this.offset,aY[i]);
			//console.log('point : ' +i + 'crée ');
				this.myLayer[i] = new Layer();
		}
	}
	if(this.letter ===  'r'){
		for(var i = rX.length-1 ; i >= 0 ; i-- ){
			
			this.Points[i] = new Point(rX[i]+this.offset,rY[i]);
			//console.log('point : ' +i + 'crée ');
				this.myLayer[i] = new Layer();
			
		}
	}
	/* ici je crée ce que j'appel Mon Squelette, c'est en réalité la Ligne blanche au centre de ma lettre */
	this.mySke = new Path({
	 	strokeWidth : 4,
		strokeCap : 'round' ,
		strokeColor : 'white',
		opacity : 0.5
	});
	for (var i =0 ; i <= this.Points.length -1; i++) {
		this.mySke.add(this.Points[i]);
	};
}
Letter.prototype.createLetter = function createLetter(){
	/* Ici je crée ma lettre, c'est le rendu avec les couleur et les différentes superpostions */
	for(var i = 1 ; i<this.Points.length ;i++){
		var myPath = new Path({
		strokeWidth : 30,
		strokeCap : 'round' ,
		blendMode : 'hard-light'
		});
		if(randColor === 1 ){
			myPath.strokeColor = myColor[i-1];	
		}else if(randColor ===  2 ){
			myPath.strokeColor = myColor2[i-1];	
		}else{
			myPath.strokeColor = myColor1[i-1];
			document.body.style.background = '#1f2f2f' ;
		}
		myPath.add(this.Points[i-1]);
		myPath.add(this.Points[i]);
	}
}

Letter.prototype.createNotes = function createNotes(){
	/* CreateNote est une fonction qui crée les cercle blanche dans les jointures qui représente les notes*/
	myCir = new Path.Circle({
		center : [-50,0],
		radius : 6,
		fillColor : 'white',
		//blendMode : 'add',
		opacity : 0.500
	});
	 
	var note = new Symbol(myCir);
	for (var i = this.Points.length - 1; i >= 0; i--) {
		note.place(this.Points[i]);
	}
}
Letter.prototype.updateLetter = function updateLetter(){
}
	

Letter.prototype.inter = function inter() {
	/* fonction qui détecte les intersections entre mes lettres et le tempo. */
	var path1 = this.mySke ; 
	var path2 = tempo ; 
	var intersections = path2.getIntersections(path1);
	for (var i = 0  ; i <intersections.length; i++) {
		ct.position = intersections[i].point ; 
		if(intersections.length >=1){
			ct2.position = intersections[0].point ; 
		}else if(intersections.length >=2){
			ct2.position = intersections[0].point ;
			ct3.position = intersections[2].point ;
		}else{
			/* La je 'triche' en plaçant mes cercle hors de l'écran au lieu de les supprimer pour les recré */
			ct3.position = new Point(-30,-30);
			ct2.position = new Point(-30,-30);
		}
	};
	for (var i = this.Points.length - 1; i >= 0; i--) {

		if(this.Points[i].x < tempo.position.x + 3 && this.Points[i].x > tempo.position.x - 1 ){
			this.noteCircles.push(new PlayNote(this.Points[i]));
			this.Son.play('../sound/violon.mp3', (this.Points[i].y)/(cY*1.5));
		}

	}
}

/* cette fonction anime les notes, elle crée un cercle qui s'etend et part en fondu  */
function PlayNote(Cpoint){
	this.Cpoint = Cpoint;
	this.path = new Path.Circle({
				center : Cpoint,
				radius : 1,
				strokeWidth : 4,
				strokeColor : 'white',
				//blendMode: 'multiply',
				opacity: 0.8
			});
}
	/* 		END OF CLASS		*/
	/* LET S CREATE SOME OBJECT */

var O = new Letter('o',cX,cY,-360);
var Z = new Letter('z',cX,cY,-180);
var M = new Letter('m',cX,cY,-20);
var A = new Letter('a',cX,cY,160);
var R = new Letter('r',cX,cY,340);

var myLetter = [Z,M,O,A,R];
myLetter.forEach(function(let){
	let.createPoints();
	let.createLetter();
	let.createNotes();
});
/*Delta me sert à stocké la position de la souris au moment de mouseDown*/
var delta;
	/*	ON EVENT FUNCTION 	*/
function onMouseDown(event){
	drag = true ; 
	delta = event.point;
}
function onMouseMove(event){
	/* Cette monstruosité ( la fonction suivante ) est une solution de dernière minute
	 pour tenter déseperément de bouger les points des lettres. Au final cette fonction permet de bouger les lettres,
	 dans leur integralité */
	if(drag){
		myLetter.forEach(function(let){
			let.myLayer.forEach(function(lay){
				if(lay.hitTest(event.point)){
					lay.translate((delta-event.point)*-1);
					for (var i = let.Points.length - 1; i >= 0; i--) {
						//lay.children[i] cible les points du tableaux Points[i];
						let.Points[i] = lay.children[i];
					}	
				}
			});
		});
	}
	
}

function onMouseUp(event){
	drag = false;
	myLetter[0].noteCircles.push(new PlayNote(event.point)); 
}
function onFrame(event){
	myLetter.forEach(function(let){
		let.inter();
		let.updateLetter();
		let.noteCircles.forEach(function (circle) {
		circle.path.scale(1.15);
		circle.path.opacity -= 0.03;
		if(circle.path.opacity < 0.02){
			circle.path.remove();
			let.noteCircles.slice(this,1);
		}
		});
	});
	
	tempo.translate(3,0);
	tempoCircle.translate(3,0);
	if(tempo.position.x > cX*2){tempo.position.x =0; tempoCircle.position.x=0}	
	
}
function onResize(event) {
	cX = view.center.x;
	cY = view.center.y;
}

