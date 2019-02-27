const fs = require('fs');
const ytdl = require('ytdl-core');
const extractAudio = require('ffmpeg-extract-audio')
const readline = require('readline');

var filename = "links.txt";
downloadMp3FromFile(filename);


function downloadMp3FromFile(file = 'links.txt'){
	readFile(lineRead);
}

function finishedDownload(sanitizedTitle){
	convertMp4ToMp3(sanitizedTitle);
}

function lineRead(url){
	ytdl.getInfo(url)
		.then(identifyName)
		.then(sanitizedName)
		.then(downloadVideo.bind(null, finishedDownload));
}

function sanitizedName(infos){
	return new Promise( function(resolve , reject ){
		infos.sanitizedTitle = infos.sanitizedTitle.replace(/[^\w\s]/gi, '');
		resolve(infos);
	}); 
}

function identifyName(infos){
	return new Promise( function(resolve , reject ){
		resolve({ youtubeInfos: infos, sanitizedTitle: infos.player_response.videoDetails.title });
	}); 
}

function downloadVideo(callback, infos){
	var videoDownload = ytdl.downloadFromInfo(infos.youtubeInfos);
	videoDownload.pipe(fs.createWriteStream('temp/' + infos.sanitizedTitle + ".mp4"));

	videoDownload.on('end', ()=>{
		callback(infos.sanitizedTitle);
	});
}

function readFile(callback){
	let lineReader = readline.createInterface({
	  input: require('fs').createReadStream('links.txt')
	});

	return new Promise( function(resolve , reject ){
	    lineReader.on('line', function (line){
		   	callback(line);
	    });
	});
}

function convertMp4ToMp3(sanitizedTitle){
	extractAudio({
		  input: sanitizedTitle + '.mp4',
		  output: "downloads/" + sanitizedTitle + ".mp3"
  	}).then(() => {
  		fs.unlink(sanitizedTitle + '.mp4', () => {});
  	});
}