const Papa = require('papaparse');
const fs = require('fs');

const marijuana  = Papa.parse(fs.readFileSync('./data.csv', 'utf8'), {
    header: true,
   dynamicTyping: true
}).data;
const states = require('./gz_2010_us_040_00_20m.json');

states.features.forEach((feature, index) => {
   const { properties } = feature;

   //Marijuana data set doesn't have information on Puerto Rico, so remove it.
   if (properties.NAME === 'Puerto Rico') {
      states.features.splice(index, 1);
   } else {
      properties.STATUS = marijuana.find(m => m.state === properties.NAME).status;
      delete properties.GEO_ID;
      delete properties.LSAD;
      delete properties.CENSUSAREA;
      delete properties.STATE;
   }
});

fs.writeFileSync('./output.geojson', JSON.stringify(states));