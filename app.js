const fs = require('fs');
const ytdl = require('ytdl-core');
const extractAudio = require('ffmpeg-extract-audio')
const readline = require('readline');

const args = parseArgs();
downloadMp3FromFile(args.file);

function parseArgs(){
	let args = {'file' : 'links.txt', 'tempFolder': 'temp', 'downloadsFolder': 'downloads', 'noDelete' : false};

	process.argv.forEach(function (val, index, array) {
		switch(val){
			case '--file':
				args.file = array[index+1];
			break;
			case '--temp-folder':
				args.tempFolder = array[index+1];
			break;
			case '--downloads-folder':
				args.downloadsFolder = array[index+1];
			break;
			case '--no-delete':
				args.noDelete = true;
			break;

		}
	});

	return args;
}

function downloadMp3FromFile(file){
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
		videoDownload.pipe(fs.createWriteStream(args.tempFolder + "/" + infos.sanitizedTitle + ".mp4"));
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
		  input: args.tempFolder + "/" + infos.sanitizedTitle + ".mp4",
		  output: args.downloadsFolder + "/" + infos.sanitizedTitle + ".mp3"
  	}).then(() => {
  		if(!args.noDelete){
  			fs.unlink(args.tempFolder + "/" + infos.sanitizedTitle + '.mp4', () => {});
  		}
  	});
}