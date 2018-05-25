'use strict';

const moment = require('moment');

const data = {
    "Store_Details": [{
        "Store_no": 263,
        "Address": "1101 HILLVIEW LN",
        "City": "Franklin",
        "State": "TN",
        "Zipcode": 37064,
        "Manager": "Mark King",
        "Phone": "615-791-0791",
        "OpenedOn": "1/11/1982",
        "Products": [{
                "Name": "Dog Bed",
                "Brand": "Stark Industries",
                "NoOfUnits": 5
            },
            {
                "Name": "Plants",
                "Brand": "GrreenLantern",
                "NoOfUnits": 50
            }
        ]
    }, {
        "Store_no": 191,
        "Address": "2310 MERCURY BLVD",
        "City": "Murfreesboro",
        "State": "TN",
        "Zipcode": 37130,
        "Manager": "Mathew Fowler Sr",
        "Phone": "615-849-1974",
        "OpenedOn": "8/1/2006",
        "Products": [{
                "Name": "Dog Crate",
                "Brand": "Wakandian",
                "NoOfUnits": 5
            },
            {
                "Name": "Plants",
                "Brand": "GrreenLantern",
                "NoOfUnits": 50
            }
        ]
    }, {
        "Store_no": 225,
        "Address": "135 JOHN R RICE BLVD",
        "City": "Murfreesboro",
        "State": "TN",
        "Zipcode": 37129,
        "Manager": "Malcolm Hill",
        "Phone": "615-896-1561",
        "OpenedOn": "8/14/1973",
        "Products": [{
                "Name": "Dog Crate",
                "Brand": "Wakandian",
                "NoOfUnits": 5
            },
            {
                "Name": "Plants",
                "Brand": "GrreenLantern",
                "NoOfUnits": 50
            }
        ]
    }]
}

exports.Team1 = function Team1(request, response) {
    let reqDateAsString = request.body.queryResult.parameters.date;
    let reqTimeAsString = request.body.queryResult.parameters.date;
    let caseObj = {};
    let reqDateAsDate = new Date(reqDateAsString);
    let caseOption = (reqDateAsDate || reqTimeAsString) ? "Time" : "";
    caseObj.reqDateAsDate = reqDateAsDate;
    caseObj.reqDateAsDate = (!reqDateAsDate && reqTimeAsString) ? new Date() : "";
    var options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    let zipcode = parseInt(request.body.queryResult.parameters.zipcode);
    caseOption = (zipcode) ? "Zipcode" : "";
    caseObj.zipcode = zipcode;
    console.log("zipcode" + zipcode);
    let products = parseInt(request.body.queryResult.parameters.products);
    console.log("products" + products);

    if (products) {
        caseOption = (products) ? "Products" : "";
        caseObj.products = products;
    }
    response.json({
        fulfillmentText: executeCase(caseOption, caseObj, response)
    });
};

function executeCase(caseOption, caseObj, response) {
    let caseResult = "Why do you ask so many questions? Give me a break!!!";
    console.log("caseOption"+caseOption);
    switch (caseOption) {
        case "Zipcode":
            caseResult = zipCodeCase(caseObj.zipcode, response);
            break;
        case "Time":
            caseResult = timeCase(caseObj.reqDateAsDate, response);
            break;
        case "Products":
            caseResult = productCase(caseObj.products, caseObj.zipcode, response);
            break;
    }
    console.log(caseResult);
    return caseResult;
}

function productCase(product, zipcode, response) {
    let result = "uh oh!!! I am sorry I couldn't find this product currently. Can you please visit www.tractorsupply.com";
    let productsOfCurrentStore = data.Store_Details.find(s => s.Zipcode === zipcode).Products;
    let index = productsOfCurrentStore.findIndex(p => p.Name == product);
    if (index > -1) {
        result = "Great!!! I found the item you asked for in the name " + productsOfCurrentStore[index].Brand + " " +
            productsOfCurrentStore[index].Name + ".";
        if (productsOfCurrentStore[index].NoOfUnits <= 10) {
            result = result + " We have less units and its selling fast. You need to hurry up!!";
        } else {
            result = result + " We have plenty of them for you."
        }
    } else {
        let prodAvailableStores = data.Store_Details.find(s => {
            s.Products.findIndex(p => p.Name == product)
        });

        console.log(prodAvailableStores);
    }

}

function timeCase(reqDateTimeAsDate, response) {
    console.log(reqDateTimeAsDate);
    if (reqDateTimeAsDate.toLocaleString().substr(0, 9) == new Date().toLocaleString().substr(0, 9)) {
        hours(response);
    } else {
        return 'We are open everyday from 8am - 9pm.';
    }
}

function zipCodeCase(zipcode, response) {
    var storeObj = data.Store_Details.find(s => s.Zipcode === zipcode);
    if (storeObj) {
        return 'The address of the requested store is ' + storeObj.Address + "," + storeObj.City + "," + storeObj.State +
            ". Hey, also do you know this store was opnened on " + storeObj.OpenedOn;
    } else {
        return "I couldn't find a store in " + zipcode + ". Would you like to search for any other location?";
    }
}

function hours(response) {
    let d = new Date();
    var options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    d.toLocaleDateString('en-US', options)
    console.log(d.getHours);
    if (d.getHours() >= 8 && d.getHours() <= 21) {
        return 'We are open now';
    } else {
        return 'We are closed now';
    }
}