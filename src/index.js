import { Map, View } from 'ol';
import { defaults as defaultControls } from 'ol/control';
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorLayer } from 'ol/layer';
import { Cluster, Vector as VectorSource } from 'ol/source';
import { NUCLEAR_EXCLUSION_AREA } from './cartodb';
import { ChangeLayerControl, HEREMAP_LAYER_ROAD, HEREMAP_LAYER_SAT } from './heremap';
import { addMapInteraction, OVERLAY } from './interaction';
import { getNuclearAccidentsGEOJSON, getNuclearCentralGEOJSON, INES_LEVEL_COLOR, nuclearAccidentsStyle, nuclearCentralClusterStyle } from './nuclearData';

/**
 * Automatic Legend generation
 */
const TMP_LEGENDS = $('.TMP-LEGENDS').clone()
$('.TMP-LEGENDS').remove()
TMP_LEGENDS.removeClass('TMP-LEGENDS')

for (let [level, color] of INES_LEVEL_COLOR.entries()) {
    let inesLegend = TMP_LEGENDS.clone()
    $('circle', inesLegend).attr('fill', color)
    $('.tile-title', inesLegend).text('Accident de niveau : ' + level)
    $('.tile-subtitle', inesLegend).html('Accident de niveau ' + level + " sur l'échelle de <a href='https://en.wikipedia.org/wiki/International_Nuclear_Event_Scale'>l'INES</a>")
    $('#LegendOfTheMap').append(inesLegend)
}


/**
 * Create the new Map
 */
let map = new Map({
    target: 'map',
    controls: defaultControls().extend([
        new ChangeLayerControl()
    ]),
    layers: [
        HEREMAP_LAYER_SAT,
        HEREMAP_LAYER_ROAD,
        NUCLEAR_EXCLUSION_AREA

    ],
    view: new View({
        center: [0, 0],
        zoom: 2
    }),
    overlays: [OVERLAY],
});

addMapInteraction(map)

/**
 * Load Nuclear Central
 */
setTimeout(async () => {
    let vectorSource = new VectorSource({
        features: (new GeoJSON()).readFeatures(await getNuclearCentralGEOJSON(), {
            featureProjection: map.getView().getProjection()
        })
    });

    //Clusterisation
    let clusterSource = new Cluster({
        distance: parseInt(20, 10),
        source: vectorSource
    });

    let vector = new VectorLayer({
        source: clusterSource,
        style: (feature, resolution) => { return nuclearCentralClusterStyle(feature, resolution, vector) }

    });

    map.addLayer(vector);

}, 100);

/**
 * Load Nuclear Accidents
 */
setTimeout(async () => {
    let vectorSource = new VectorSource({
        features: (new GeoJSON()).readFeatures(await getNuclearAccidentsGEOJSON(), {
            featureProjection: map.getView().getProjection()
        })
    });

    let vector = new VectorLayer({
        source: vectorSource,
        style: nuclearAccidentsStyle

    });
    map.addLayer(vector);

}, 1000);