import { Map, View } from 'ol';
import { HEREMAP_LAYER_SAT, HEREMAP_LAYER_ROAD, ChangeLayerControl } from './heremap'
import { defaults as defaultControls } from 'ol/control'

import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import { transformExtent } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import osmtogeojson from 'osmtogeojson'
import { getNuclearFeature } from './overpassapi'

import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';

var styleFunction = function (feature) {
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

var map = new Map({
    target: 'map',
    controls: defaultControls().extend([
        new ChangeLayerControl()
    ]),
    layers: [
        HEREMAP_LAYER_SAT,
        HEREMAP_LAYER_ROAD

    ],
    view: new View({
        center: [0, 0],
        zoom: 2
    })
});

setTimeout(async () => {
    var vectorSource = new VectorSource({
        features: (new GeoJSON()).readFeatures(await getNuclearFeature(), {
            featureProjection: map.getView().getProjection()
        })
    });

    var vector = new VectorLayer({
        source: vectorSource,
        style: styleFunction

    });
    map.addLayer(vector);

}, 1000);