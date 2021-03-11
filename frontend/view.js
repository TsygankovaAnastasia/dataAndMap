'use strict'

function initMap(){
    var script = document.createElement('script');
    // script.onload = function () {
    //     createMap();
    // };
    document.head.appendChild(script);
    script.src = 'https://cdn.jsdelivr.net/gh/StephanWagner/svgMap@v1.6.0/dist/svgMap.min.js';
}


module.exports = class ViewMap{
    constructor(){
        console.log("ViewMap CONSTRUCTOR");
        initMap();
        var map = new svgMap({
            targetElementID: 'svgMap',
            colorMax: '#000000',
            colorMin: '#111111',
            colorNoData: "#132468",

            data: {
                data: {
                    folowers: {
                        name: 'folowers',
                        format: '{0} person',
                        thousandSeparator: ',',
                        thresholdMax: 50000,
                        thresholdMin: 1000
                    }
                },
                applyData: 'folowers',
                values: {}
                //     AF: {folowers: 587},
                //     AL: {folowers: 4583},
                //     DZ: {folowers: 4293}
                
                // }
            }
        });
    }

    setDataIntoMap(data){
        console.log('setDataIntoMap-> data', data);
        map.values = data.map();
        console.log('setDataIntoMap-> map.values', map.values);
        
    }
}

