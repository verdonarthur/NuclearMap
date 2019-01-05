import osmtogeojson from 'osmtogeojson'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';

export const getNuclearCentralGEOJSON = async () =>{
   let query = '[out:json];(node["generator:source"="nuclear"];way["generator:source"="nuclear"];relation["generator:source"="nuclear"];);out center;>;';
    try {
        let response = await fetch('https://overpass-api.de/api/interpreter', {
            method: "POST",
            body: query
        })

        let json = await response.json()

        const geojson = osmtogeojson(json, {
            flatProperties: true
        });

        return geojson
    } catch(err){
        console.log(err)
        return null
    }
}

export const getNuclearAccidentsGEOJSON = async()=>{
    try{
        let response = await fetch(URL_LOCAL_SERVER+"/nuclearaccidents", {
            method:"GET"
        })
        console.log(response)
        let json = await response.json()
        console.log(json)
        return json
        
    }catch(err){
        console.log(err)
        return null
    }

}

export const nuclearCentralStyle = function (feature) {
    return new Style({
        image: new CircleStyle({
            radius: 5,
            fill: new Fill({
                color: 'red'
            }),
            stroke: new Stroke({ color: 'red', width: 2 })
        })
    })
}

export const nuclearAccidentsStyle = function(feature){
    let radius = 5

    if(feature.get('ines_level') && feature.get('ines_level') != null)
        radius = 5*feature.get('ines_level')


    return new Style({
        image: new CircleStyle({
            radius: radius,
            fill: new Fill({
                color: 'blue'
            }),
            stroke: new Stroke({ color: 'blue', width: 2 })
        })
    })
}