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

// use the latest csvtojson converter (v2)
const csvConverterV2 = require('csvtojson')();
const fs = require('fs');

async function parseCSV(csvFilePath) {
	// parses the csv file unde the csv FilePath
	// as soon as the file gets parsed saves the JSON-String to the file and returns the JSON-Object
	let resultJsonObj;
	await csvConverterV2.fromFile(csvFilePath).then((jsonObj) => {
		resultJsonObj =  jsonObj
	}) 
	// create a json string and write it to a file
	fs.writeFile('./world_data.json', JSON.stringify(resultJsonObj), 'utf8', (err) => {
		if (err) {
			console.log(err)
		}
	});
	return resultJsonObj
}


let table; // declare table, it will be inited when the promise parseCSV gets resolved
parseCSV('./world_data.csv').then((jsonObj) => {
	table = jsonObj
})


/**************************************************************************
*************************** handle HTTP METHODS ***************************
**************************************************************************/

// GET endpoints

app.get('/items', (req, resp) => {
	// returns the whole table
	resp.send(table)
})

app.get('/items/:id', (req, resp) => {
	// returns one table row = country by id if exists
	const id = Number(req.params['id'])
	const tableRow = table.find((country) => Number(country.id) == id)
	if (tableRow == undefined) {
		return resp.status(500).send(`No such id ${id} in database`)
	}
	return resp.send(tableRow)
})

app.get('/items/:id1/:id2', (req, resp) => {
	// returns all countries with id in range between id1 and id2 if the range is valid (not negative numbers)
	let id1 = Number(req.params['id1'])
	let id2 = Number(req.params['id2'])
	if (id1 < 0 || id2 < 0) {
		return resp.status(400).send('Range not possible')
	}
	if (id1 > id2) {
		[id1, id2] = [id2, id1]
	}
	// assert id1 < id2
	const tableRows = table.filter((country) => (id1 <= Number(country.id) && Number(country.id) <= id2))
	return resp.send(tableRows)
})

app.get('/properties', (req, resp) => {
	// returns all table headers if table is not empty
	properties = []
	if (table.length > 0)
		properties = Object.getOwnPropertyNames(table[0])
	return resp.send(properties)
})

app.get('/properties/:num', (req, resp) => {
	// returns a concreate table header if table is not empty and num is a valid headers index
	const num = req.params['num']
	if (table.length > 0)
		properties = Object.getOwnPropertyNames(table[0])
	if (num < 0 || properties.length <= num)
		return resp.status(400).send("No such property available")
	return resp.send(properties[num])
})

// POST endpoints

app.post('/items', (req, resp) => {
	// posts a country with name and 2 other properties to the table 
	// todo: implement 
	console.log(req.body)
	resp.status(200).send(`Added country ${name} to list!`)
})

// DELETE endpoints

app.delete('/items', (req, resp) => {
	// deletes the last country from the table
	const lastCountry = table[table.length - 1]
	table.pop()
	resp.status(200).send(`Deleted last country: ${lastCountry.name}!`)
})

app.delete('/items/:id', (req, resp) => {
	// deletes a country = table row by id if id exists in table
	const id = Number(req.params['id'])
	const tableRow = table.find((country) => Number(country.id) == id)
	if (tableRow == undefined) {
		return resp.status(500).send(`No such id ${id} in database`)
	}
	const deleteIndex = table.indexOf(tableRow)
	table.splice(deleteIndex, deleteIndex)
	return resp.status(200).send(`Item ${tableRow.id} deleted successfully.`)
})



// DO NOT CHANGE!
// bind server localhost to port 3000
const port = 3000;
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
