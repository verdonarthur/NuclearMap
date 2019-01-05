import { click } from 'ol/events/condition.js';
import Select from 'ol/interaction/Select';
import Overlay from 'ol/Overlay';

/**
* Elements that make up the popup.
*/
let container = document.getElementById('popup');
let content = document.getElementById('popup-content');

/**
 * Clone template
 */
const TMP_NUCLEAR_CENTRAL = $('.tmp-nuclearcentral-popup').clone()
$('.tmp-nuclearcentral-popup').remove()
TMP_NUCLEAR_CENTRAL.removeClass('tmp-nuclearcentral-popup')

const TMP_NUCLEAR_ACCIDENTS = $('.tmp-nuclearaccidents-popup').clone()
$('.tmp-nuclearaccidents-popup').remove()
TMP_NUCLEAR_CENTRAL.removeClass('.tmp-nuclearaccidents-popup')

/**
* Create an overlay to anchor the popup to the map.
*/
export const OVERLAY = new Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});

let selectClick = new Select({
    condition: click
})

selectClick.on('select', function (e) {
    if (!e.selected[0]){        
        OVERLAY.setPosition(undefined);
        return
    }

    let features = e.selected.map((feature) => {
        return feature;
    });

    // for simplification we get only the first element
    let slctFeature = features[0]
    console.log(slctFeature)

    // is a nuclear central
    if (slctFeature.get('generator:source') && slctFeature.get('generator:source') === 'nuclear') {
        let nuclearCentralDiv = TMP_NUCLEAR_CENTRAL.clone()

        $('h3', nuclearCentralDiv).text(slctFeature.get('name') ? slctFeature.get('name') : 'Anonyme')
        $('.electricity', nuclearCentralDiv).text(slctFeature.get('generator:output:electricity') ? slctFeature.get('generator:output:electricity') : '? MWh')
        $('.type', nuclearCentralDiv).text(slctFeature.get('generator:type') ? slctFeature.get('generator:type') : 'type inconnu')
        $('.operator', nuclearCentralDiv).text(slctFeature.get('operator') ? slctFeature.get('operator') : 'exploitant inconnu')
        $('.startDate', nuclearCentralDiv).text(slctFeature.get('start_date') ? slctFeature.get('start_date') : '?')
        $('.endDate', nuclearCentralDiv).text(slctFeature.get('end_date') ? slctFeature.get('end_date') : 'aujourd\'hui')

        content.innerHTML = ''
        nuclearCentralDiv.appendTo(content)
    }

    // is a nuclear accidents
    if (slctFeature.get('iaea_description')) {
        let nuclearaccidentsDiv = TMP_NUCLEAR_ACCIDENTS.clone()
        
        $('h3', nuclearaccidentsDiv).text(slctFeature.get('incident') ? slctFeature.get('incident') : 'Anonyme')
        $('.lvlInea', nuclearaccidentsDiv).text(slctFeature.get('ines_level') ? slctFeature.get('ines_level')+' sur 7' : '- sur 7')
        $('.year', nuclearaccidentsDiv).text(slctFeature.get('year') ? slctFeature.get('year') : 'Date inconnue')
        $('.ineaDescription', nuclearaccidentsDiv).text(slctFeature.get('iaea_description') ? slctFeature.get('iaea_description') : '-')
        
        content.innerHTML = ''
        nuclearaccidentsDiv.appendTo(content)
    }


    OVERLAY.setPosition(e.selected[0].getGeometry().getCoordinates());
});


export const addMapInteraction = (map) => {
    map.addInteraction(selectClick);
}