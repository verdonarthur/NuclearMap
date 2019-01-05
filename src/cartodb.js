import TileLayer from 'ol/layer/Tile';
import { CartoDB } from 'ol/source.js';

var mapConfig = {
    'layers': [{
        'type': 'cartodb',
        'options': {
            'cartocss_version': '2.1.1',
            'cartocss': `
                #layer {
                    marker-width: ramp([ines_level], range(5, 40), quantiles(5));
                    marker-fill: ramp([ines_level], (#f6d2a9, #f3aa84, #ea8171, #d55d6a, #b13f64), quantiles);
                    marker-fill-opacity: 1;
                    marker-allow-overlap: true;
                    marker-line-width: 1;
                    marker-line-color: #FFFFFF;
                    marker-line-opacity: 1;
                }
            
            `,
            'sql': 'SELECT * FROM datanuclearaccidentswithranked'
        }
    }]
};

var cartoDBSource = new CartoDB({
    account: 'verdonarthur',
    config: mapConfig
});


export let accidentsHeatmap = new TileLayer({
    source: cartoDBSource
})