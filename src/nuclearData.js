import osmtogeojson from 'osmtogeojson'
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import { createEmpty, getWidth, getHeight, extend } from 'ol/extent.js';

export const INES_LEVEL_COLOR = new Map([
    [0, '#eaecf0'],
    [1, 'green'],
    [2, '#808000'],
    [3, 'yellow'],
    [4, 'gold'],
    [5, 'orange'],
    [6, 'red'],
    [7, 'magenta']
])



/**
 * Give a geojson with nuclear central by fetching the overpass api
 */
export const getNuclearCentralGEOJSON = async () => {
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
    } catch (err) {
        console.log(err)
        return null
    }
}

/**
 * give a geojson of nuclear accident by fetching a file
 */
export const getNuclearAccidentsGEOJSON = async () => {
    try {
        let response = await fetch(window.location.origin + "/nuclearaccidents", {
            method: "GET"
        })
        //console.log(response)
        let json = await response.json()
        //console.log(json)
        return json

    } catch (err) {
        console.log(err)
        return null
    }

}

/**
 * Use to get the total number of feature present on the actual map resolution
 */
let calculateClusterInfo = (resolution, vector) => {

    let maxFeatureCount = 0;
    let features = vector.getSource().getFeatures();
    let feature, radius;
    for (let i = features.length - 1; i >= 0; --i) {
        feature = features[i];
        let originalFeatures = feature.get('features');
        let extent = createEmpty();
        let j = (void 0), jj = (void 0);
        for (j = 0, jj = originalFeatures.length; j < jj; ++j) {
            extend(extent, originalFeatures[j].getGeometry().getExtent());
        }
        maxFeatureCount = Math.max(maxFeatureCount, jj);
        radius = 0.25 * (getWidth(extent) + getHeight(extent)) /
            resolution;
        feature.set('radius', radius);
    }

    return maxFeatureCount
};

/**
 * style of cluster for the nuclear central
 * @param {*} feature 
 * @param {*} resolution 
 */
export const nuclearCentralClusterStyle = (feature, resolution, vector) => {

    let currentResolution
    let maxFeatureCount = 0
    if (resolution != currentResolution) {
        maxFeatureCount = calculateClusterInfo(resolution, vector);
        currentResolution = resolution;
    }

    let size = feature.get('features').length;
    if (size > 1) {

        return new Style({
            image: new CircleStyle({
                radius: 10+feature.get('radius'),
                fill: new Fill({
                    color: [255, 0, 0, Math.min(0.8, 0.4 + (size / maxFeatureCount))]
                })
            }),
            text: new Text({
                text: size.toString(),
                fill: new Fill({
                    color: '#fff'
                })
            })
        });
    } else {
        let originalFeature = feature.get('features')[0];
        return nuclearCentralStyle(originalFeature);
    }
}

/**
 * style for nuclear central
 * @param {*} feature 
 */
export const nuclearCentralStyle = (feature) => {
    return new Style({
        image: new CircleStyle({
            radius: 7,
            fill: new Fill({
                color: 'red'
            }),
            stroke: new Stroke({ color: 'white', width: 0.5 })
        })
    })
}

/**
 * Style for nuclear accident
 * @param {*} feature 
 */
export const nuclearAccidentsStyle = (feature) => {
    let radius = 5
    let color = INES_LEVEL_COLOR.get(0)

    if (feature.get('ines_level') && feature.get('ines_level') != null) {
        let inesLevel = feature.get('ines_level')
        radius = 5 + inesLevel
        color = INES_LEVEL_COLOR.get(inesLevel)
    }


    return new Style({
        image: new CircleStyle({
            radius: radius,
            fill: new Fill({
                color: color
            }),
            stroke: new Stroke({ color: 'white', width: 0.5 })
        })
    })
}