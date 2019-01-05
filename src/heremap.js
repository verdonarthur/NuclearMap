import { Control } from 'ol/control.js'
import TileLayer from 'ol/layer/Tile';
import * as Source from 'ol/source'

// HERE MAP LOGIN
const HERE_MAP_URL = 'https://{1-4}.{base}.maps.cit.api.here.com' +
    '/{type}/2.1/maptile/newest/{scheme}/{z}/{x}/{y}/256/png' +
    '?app_id={app_id}&app_code={app_code}'

let hereMapRoadLayer = {
    base: 'base',
    type: 'maptile',
    scheme: 'normal.day',
    app_id: '3XTTBDbvTW79Nz2OZ2aP',
    app_code: 'sd77wngwH8nvlHS9vn330w'
}

let hereMapSatLayer = {
    base: 'aerial',
    type: 'maptile',
    scheme: 'satellite.day',
    app_id: '3XTTBDbvTW79Nz2OZ2aP',
    app_code: 'sd77wngwH8nvlHS9vn330w'
}

function createUrl(tpl, layerDesc) {
    return tpl
        .replace('{base}', layerDesc.base)
        .replace('{type}', layerDesc.type)
        .replace('{scheme}', layerDesc.scheme)
        .replace('{app_id}', layerDesc.app_id)
        .replace('{app_code}', layerDesc.app_code)
}

export const HEREMAP_LAYER_SAT = new TileLayer({
    preload: Infinity,
    source: new Source.XYZ({
        url: createUrl(HERE_MAP_URL, hereMapSatLayer)
    })
})

export const HEREMAP_LAYER_ROAD = new TileLayer({
    preload: Infinity,
    visible:false,
    source: new Source.XYZ({
        url: createUrl(HERE_MAP_URL, hereMapRoadLayer) 
    })
})


export class ChangeLayerControl extends Control {
    constructor() {
        super({})
        let options = {}

        let button = document.createElement('button')
        button.innerHTML = 'Change layer'

        let element = document.createElement('div')
        element.className = 'SatteliteViewControl ol-unselectable ol-control'
        element.appendChild(button)

        Control.call(this, {
            element: element,
            target: options.target
        })

        button.addEventListener('click', this.handleChangeLayer.bind(this), false)
    }

    handleChangeLayer() {
        HEREMAP_LAYER_SAT.setVisible(!HEREMAP_LAYER_SAT.getVisible())
        HEREMAP_LAYER_ROAD.setVisible(!HEREMAP_LAYER_ROAD.getVisible())
    }
}
