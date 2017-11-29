require('dotenv').config();

const Nightmare = require('nightmare'),
    vo = require('vo'),
    nightmare = Nightmare({
        show: true,
        typeInterval: 25
});
const Promise = require('bluebird');

const user = process.env.AC_USER;
const pword = process.env.AC_PASS;

const affiliateId = process.argv[2];

function logIntoAdCenter(){
    return nightmare
        .goto("http://adcenter.lijit.com/")
        .type("input[name=username]", user)
        .type("#passwordInput", pword)
        .click("button[type=submit]")
        .wait(3000)
}

function makeTheTag(tagName){

    const pFloor = 1.2;
    const size = getSizeId("300x250");
    console.log(tagName)
    return nightmare
        .goto("http://adcenter.lijit.com/adminpublisher/search/zone/new/" + affiliateId)
        .refresh()
        .type("#userzonename", tagName)
        .evaluate(function() {
            document.querySelector('#cpmfloor').value = ''
        })
        .type("#cpmfloor", pFloor)
        .click("input[id=using_efp]")
        .click("input[id=international]")
        .select("#ad_type", size)
        .wait(1000);
}

function getSizeId(size){
	const standardizedSize = size.toLowerCase();
	const sizeIdKey = {
		"120x600": 42,
		"160x90": 45,
		"768x640": 44,
		"468x60": 38,
		"970x250": 33,
		"300x600": 22,
		"338x280": 40,
		"728x90": 20,
		"300x250": 9,
		"300x1050": 39,
		"250x250": 37,
		"970x90": 34,
		"160x600": 8,
		"320x100": 35,
		"320x50": 25,
		"300x50": 36,
		"320x480": 43
	};
	return sizeIdKey[standardizedSize];
}

function fillOutForm(tagName, pFloor, size){
    return nightmare
        .refresh()
        .type("#userzonename", tagName)
        .evaluate(function() {
            document.querySelector('#cpmfloor').value = ''
        })
        .type("#cpmfloor", pFloor)
        .click("input[id=using_efp]")
        .click("input[id=international]")
        .select("#ad_type", size)
        .wait(2000);
}


const tag_names = ["testing_taginator_1", "testing_taginator_2", "testing_taginator_3"]

logIntoAdCenter()
    .then((()=> {
        return Promise.mapSeries(tag_names, makeTheTag)
            .catch(e => console.log(e))
    }))