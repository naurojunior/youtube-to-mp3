# youtube-to-mp3
Download de videos e conversão para mp3 em nodeJs.

Utiliza da biblioteca ffmpeg-extract-audio e baixa diversos vídeos (com os links lidos de um arquivo), porque o parâmetro "mp3" do ytdl-core é muito lento.

Baixa e converte os vídeos/áudios em paralelo.

Parâmetros:
```
--file 
  O nome do arquivo contendo os links do youtube. Um link por linha. Por padrão utiliza o "links.txt"
  
--temp-folder 
  O diretório temporário onde os vídeos são armazenados. Por padrão utiliza o diretório "temp"
  
--downloads-folder
  O diretório destino com os mp3. Por padrão utiliza o diretório "downloads"
```

Como utilizar:

  Crie um arquivo chamado "links.txt" e insira um link do youtube por linha
  
  Execute:
```
  node app.js
```
