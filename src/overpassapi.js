import { transformExtent } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import osmtogeojson from 'osmtogeojson'


export const getNuclearFeature = async () =>{
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
