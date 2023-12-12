// DO NOT CHANGE!
//init app with express, util, body-parser, csv2json
const express = require('express');
const app = express();
const sys = require('util');
const path = require('path');
const bodyParser = require('body-parser');
const csvConverter = require('csvtojson/v1').Converter;

//register body-parser to handle json from res / req
app.use( bodyParser.json() );

//register public dir to serve static files (html, css, js)
app.use( express.static( path.join(__dirname, "public") ) );

// END DO NOT CHANGE!


/**************************************************************************
****************************** handle CSV  ********************************
**************************************************************************/

const csvConverterV2 = require('csvtojson')();
const fs = require('fs');
const { error } = require('console');

main()

async function main() {
	async function parseCSV(csvFilePath) {
		let resultJsonObj;
		await csvConverterV2.fromFile(csvFilePath).then((jsonObj) => {
			resultJsonObj =  jsonObj
		}) 
		// create a json string and write it to a file
		fs.writeFile('./world_data.json', JSON.stringify(resultJsonObj), 'utf8', (err) => {
			if (err) {
				console.log(error)
			}
		});
		return resultJsonObj
	}
	
	let jsonObj = await parseCSV('./world_data.csv')
	
}




/**************************************************************************
*************************** handle HTTP METHODS ***************************
**************************************************************************/

// your code


// DO NOT CHANGE!
// bind server localhost to port 3000
const port = 3000;
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
