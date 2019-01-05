import { Map, View } from 'ol';
import { defaults as defaultControls } from 'ol/control';
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { ChangeLayerControl, HEREMAP_LAYER_ROAD, HEREMAP_LAYER_SAT } from './heremap';
import { addMapInteraction, OVERLAY } from './interaction';
import { getNuclearAccidentsGEOJSON, getNuclearCentralGEOJSON, nuclearAccidentsStyle, nuclearCentralStyle } from './nuclearData';

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
        //accidentsHeatmap

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

    let vector = new VectorLayer({
        source: vectorSource,
        style: nuclearCentralStyle

    });
    map.addLayer(vector);

}, 250);

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