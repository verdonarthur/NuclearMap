import TileLayer from 'ol/layer/Tile';
import { CartoDB } from 'ol/source.js';

var mapConfig = {
    'layers': [{
        'type': 'cartodb',
        'options': {
            'cartocss_version': '2.1.1',
            'cartocss': `
                #layer {
                    polygon-fill: #0000ff;
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
    title: 'Nuclear Exclusion Area',
    source: cartoDBSource
})

/**
 * Class use to do some simple sql request to carto
 */
export class CartoSimpleRequest{
    static createSqlRequestWithCarto(query){
        const URL = 'https://verdonarthur.carto.com/api/v2/sql?q='
        return URL+query
    }

    /**
     * return all central in activity
     */
    static async getNbrCentralInActivity(){
        let query = 'SELECT COUNT(*) FROM nuclearcentral as n WHERE n.end_date IS NULL'
        let response = await $.getJSON(this.createSqlRequestWithCarto(query))
        return response.rows[0].count
    }

    /**
     * Return the total exclusion area in meter square
     */
    static async getTotalAreaExclusionZone(){
        let query = 'SELECT SUM(st_area(st_buffer(st_centroid(the_geom_webmercator),30000))) FROM nuclearcentral as n WHERE n.end_date IS NULL'
        let response = await $.getJSON(this.createSqlRequestWithCarto(query))
        return response.rows[0].sum
    }

}