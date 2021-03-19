'use strict'
import svgMap from 'svgmap';
// import 'svgmap/dist/svgMap.min.css';

function initMap(){
    var script = document.createElement('script');
    // script.onload = function () {
    //     createMap();
    // };
    document.head.appendChild(script);
    // script.src = 'https://cdn.jsdelivr.net/gh/StephanWagner/svgMap@v1.6.0/dist/svgMap.min.js';
}

const FOLLOWERS = 'followers';

export class ViewMap{
    constructor(){
        console.log("ViewMap CONSTRUCTOR");
        initMap();
        this.map = new svgMap({
            targetElementID: 'svgMap',
            colorMax: '#CC0033',
            colorMin: '#FFE5D9',
            colorNoData: "#E2E2E2",
            data: {
                data: {
                    followers: {
                        name: 'followers',
                        format: '{0} person',
                    }
                },
                applyData: 'followers',
                values: testList,
            },

        });
    }
    
    
    setDataIntoMap(data){
        console.log('setDataIntoMap-> data', data);
        console.log('this in view', this);
        let list = {};
        Object.keys(data).forEach(function(country){
            console.log('handeling ', country);
            list[country] = { 'followers': data[country]};
        });

        console.log('list', list);
        let newData = {
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
            values: list
        };
        
        this['map'].applyData(newData);
        // console.log('setDataIntoMap-> map.values', map.data.values);
        
    }
}

var shortTestList ={
    RU: {followers: 6},
    AL: {followers: 4}
};

var testList ={
    AD: {followers:6},
    AL: {followers:4},
    AM: {followers:1},
    AR: {followers:2},
    AS: {followers:1},
    AU: {followers:4},
    AZ: {followers:5},
    BA: {followers:3},
    BC: {followers:11},
    BE: {followers:1},
    BR: {followers:5},
    BS: {followers:1},
    CA: {followers:38},
    CE: {followers:3},
    CN: {followers:2},
    CO: {followers:4},
    CT: {followers:4},
    DA: {followers:1},
    DC: {followers:7},
    DE: {followers:7},
    DO: {followers:2},
    EL: {followers:2},
    ES: {followers:8},
    FL: {followers:21},
    FR: {followers:1},
    GA: {followers:11},
    GH: {followers:2},
    "H.": {followers:1},
    HA: {followers:3},
    HO: {followers:7},
    "HÀ": {followers:1},
    IL: {followers:10},
    IN: {followers:3},
    IT: {followers:2},
    KE: {followers:1},
    KY: {followers:4},
    LA: {followers:3},
    MA: {followers:5},
    MD: {followers:2},
    MG: {followers:1},
    MH: {followers:2},
    MI: {followers:6},
    MN: {followers:4},
    MO: {followers:7},
    MS: {followers:3},
    MX: {followers:4},
    MY: {followers:3},
    NA: {followers:7},
    NC: {followers:4},
    NH: {followers:2},
    NJ: {followers:5},
    NM: {followers:2},
    NV: {followers:6},
    NY: {followers:24},
    OF: {followers:4},
    OH: {followers:4},
    OK: {followers:2},
    ON: {followers:17},
    OR: {followers:10},
    PA: {followers:12},
    PB: {followers:2},
    PG: {followers:1},
    PH: {followers:1},
    PJ: {followers:2},
    PL: {followers:2},
    PR: {followers:2},
    QC: {followers:3},
    RI: {followers:4},
    RJ: {followers:3},
    RR: {followers:1},
    RS: {followers:2},
    SA: {followers:3},
    SC: {followers:1},
    SD: {followers:2},
    SN: {followers:1},
    SP: {followers:8},
    ST: {followers:4},
    TN: {followers:8},
    TO: {followers:3},
    TW: {followers:2},
    TX: {followers:33},
    UK: {followers:54},
    US: {followers:41},
    UT: {followers:6},
    VA: {followers:9},
    WA: {followers:19},
    WB: {followers:2},
    XF: {followers:1},
    "||": {followers:1},
    "日本": {followers:1},
    "日本": {followers:4}    
};
