const fs = require('fs');
const ytdl = require('ytdl-core');
const extractAudio = require('ffmpeg-extract-audio')
const readline = require('readline');

filename = process.argv[2];
downloadMp3FromFile(filename);


function downloadMp3FromFile(file = 'links.txt'){
	readFile(lineRead, file);
}

function lineRead(url){
	ytdl.getInfo(url)
		.then(identifyName)
		.then(sanitizedName)
		.then(downloadVideo)
		.then(convertMp4ToMp3);
}

function sanitizedName(infos){
	infos.sanitizedTitle = infos.sanitizedTitle.replace(/[^\w\s]/gi, '');
	return infos;
}

function identifyName(infos){
	return { youtubeInfos: infos, sanitizedTitle: infos.player_response.videoDetails.title };
}

function downloadVideo(infos){
	return new Promise( function(resolve , reject ){
		var videoDownload = ytdl.downloadFromInfo(infos.youtubeInfos);
		videoDownload.pipe(fs.createWriteStream('temp/' + infos.sanitizedTitle + ".mp4"));
		videoDownload.on('end', ()=>{
			resolve(infos)
		});
	});
}

function readFile(callback, file){
	let lineReader = readline.createInterface({
	  input: require('fs').createReadStream(file)
	});

	return new Promise( function(resolve , reject ){
	    lineReader.on('line', function (line){
		   	callback(line);
	    });
	});
}

function convertMp4ToMp3(infos){
	return extractAudio({
		  input: "temp/" + infos.sanitizedTitle + ".mp4",
		  output: "downloads/" + infos.sanitizedTitle + ".mp3"
  	}).then(() => {
  		fs.unlink("temp/" + infos.sanitizedTitle + '.mp4', () => {});
  	});
}