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

async function parseCSV(csvFilePath) {
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

let table;
parseCSV('./world_data.csv').then((jsonObj) => {
	table = jsonObj
})


/**************************************************************************
*************************** handle HTTP METHODS ***************************
**************************************************************************/

// GET endpoints

app.get('/items', (req, resp) => {
	resp.send(table)
})

app.get('/items/:id', (req, resp) => {
	const id = Number(req.params['id'])
	const tableRow = table.find((country) => Number(country.id) == id)
	if (tableRow == undefined) {
		return resp.send(`No such id ${id} in database`)
	}
	return resp.send(tableRow)
})

app.get('/items/:id1/:id2', (req, resp) => {
	let id1 = Number(req.params['id1'])
	let id2 = Number(req.params['id2'])
	if (id1 < 0 || id2 < 0) {
		return resp.send('Range not possible')
	}
	if (id1 > id2) {
		[id1, id2] = [id2, id1]
	}
	// assert id1 < id2
	const tableRows = table.filter((country) => (id1 <= Number(country.id) && Number(country.id) <= id2))
	return resp.send(tableRows)
})

app.get('/properties', (req, resp) => {
	properties = []
	if (table.length > 0)
		properties = Object.getOwnPropertyNames(table[0])
	return resp.send(properties)
})

app.get('/properties/:num', (req, resp) => {
	const num = req.params['num']
	if (table.length > 0)
		properties = Object.getOwnPropertyNames(table[0])
	if (num < 0 || properties.length <= num)
		return resp.send("No such property available")
	return resp.send(properties[num])
})

// POST endpoints

app.post('/items', (req, resp) => {
	// todo: implement
	console.log(req.body)
	resp.send(`Added country ${name} to list!`)
})

// DELETE endpoints

app.delete('/items', (req, resp) => {
	const lastCountry = table[table.length - 1]
	table.pop()
	resp.send(`Deleted last country: ${lastCountry.name}!`)
})

app.delete('/items/:id', (req, resp) => {
	const id = Number(req.params['id'])
	const tableRow = table.find((country) => Number(country.id) == id)
	if (tableRow == undefined) {
		return resp.send(`No such id ${id} in database`)
	}
	const deleteIndex = table.indexOf(tableRow)
	table.splice(deleteIndex, deleteIndex)
	return resp.send(`Item ${tableRow.id} deleted successfully.`)
})



// DO NOT CHANGE!
// bind server localhost to port 3000
const port = 3000;
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
