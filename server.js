const express = require('express')
const path = require('path')
const fs = require('fs')
const request = require('request')
const osmtogeojson = require('osmtogeojson')

const port = process.env.PORT || 8080;
const app = express();

/**
 * Useful function to create folder if nonexistent
 * @param {} filePath 
 */
function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/dist'));

/**
 * Give the all the nuclear central in geojson
 */
app.get('/nuclearcentral', (req, res) => {

  let filepath = __dirname + '/data/nuclearcentralmap.geojson';

  if (fs.existsSync(filepath)) {
    fs.readFile(filepath, (err, data) => {
      if (err)
        res.send(err)
        
      res.send(JSON.parse(data))
    })

  } else {
    let query = '[out:json];(way["generator:source"="nuclear"];);out;>;out skel qt;';

    request.post('https://overpass-api.de/api/interpreter', { body: query }, (err, response, body) => {

    const geojson = osmtogeojson(JSON.parse(body), {
        flatProperties: true
      });

      ensureDirectoryExistence(filepath)

      fs.writeFile(filepath, JSON.stringify(geojson), (err) => {
        if (err)
          res.send(err)

        res.send(geojson)
      })

    })
  }
});

/**
 * Give all the nuclear accidents in geojson
 */
app.get('/nuclearaccidents', (req, res) => {

  let filepath = __dirname + '/data/DataNuclearAccidents.geojson';

  if (fs.existsSync(filepath)) {
    fs.readFile(filepath, (err, data) => {
      if (err)
        res.send(err)
        
      res.send(JSON.parse(data))
    })

  } else {
    res.send(JSON.parse("{}"))
  }
});


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(port);