import TileLayer from 'ol/layer/Tile';
import { CartoDB } from 'ol/source.js';

var mapConfig = {
    'layers': [{
        'type': 'cartodb',
        'options': {
            'cartocss_version': '2.1.1',
            'cartocss': `
                #layer {
                    polygon-fill: #00ff00;
                    polygon-opacity: 0.1;
                }
                #layer::outline {
                    line-width: 0.5;
                    line-color: #ffffff;
                    line-opacity: 1;
                }
            `,
            'sql': `SELECT 
                        cartodb_id, 
                        name,
                        st_buffer(st_centroid(the_geom_webmercator),30000) AS the_geom_webmercator,
                        generator_type,
                        generator_output_electricity 
            
                    FROM nuclearcentral`
        }
    }]
};

var cartoDBSource = new CartoDB({
    account: 'verdonarthur',
    config: mapConfig
});


export let NUCLEAR_EXCLUSION_AREA = new TileLayer({
    source: cartoDBSource
})