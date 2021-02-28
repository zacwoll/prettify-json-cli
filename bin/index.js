#!/usr/bin/env node

// Include file system module
const fs = require('fs')

// Include process module 
const process = require('process'); 
  
// The 2nd argv is the input file
fs.readFile(process.argv[2], 'utf-8', (err, data) => { 
    if (err) throw err; 

    // Resets any formatting already present in the file (So it can be reformatted exactly)
    const regex_reset = /(\r\n|\n|\r|\t)/g
    data = data.replace(regex_reset, "");
    // Adds to all open brackets with a newline before and after
    const regex_open = /\[/g;
    data = data.replace(regex_open, "\n$&\n");
    // Prepends all closing braces/brackets with a newline only before
    const regex_close = /\}|\]/g;
    data = data.replace(regex_close, "\n$&");
    // Appends to all commas with a newline after
    data = data.replace(/,|\{/g, '$&\n');

    let quote_count = 0;
    let tab_count = 0;
    let new_data = "";
    for (let i = 0; i < data.length; i++) {
        let new_part = "";
        if (data[i] === '{' || data[i] === '[') {
            new_part = '\t'.repeat(tab_count);
            if (data[i - 2] != ',')
                tab_count++;
        }
        else if (data[i] === '}' || data[i] === ']') {
            tab_count--;
            new_part = '\t'.repeat(tab_count);
        }
        else {
            if (data[i] === '\"') {
                quote_count++;
                if (quote_count % 2 === 1 && data[i - 2] != ':') {
                    new_part = '\t'.repeat(tab_count);
                }
            }
        }
        new_data += new_part + data[i];
    }
    fs.writeFile(process.argv[2], new_data, (err) => {
        if (err) throw err;
        console.log("Prettified your JSON!");
    })
})