require('dotenv').config();

const Nightmare = require('nightmare');
const nightmare = Nightmare({
    show: true,
    typeInterval: 50
});

const user = process.env.AC_USER;
const pword = process.env.AC_PASS;

const affiliateId = process.argv[2];

function logIntoAdCenter(){
    return nightmare
        .goto("http://adcenter.lijit.com/")
        .type("input[name=username]", user)
        .type("#passwordInput", pword)
        .click("button[type=submit]")
        .wait(5000)
}

function goToCreateZonePage(){
    return nightmare
        .goto("http://adcenter.lijit.com/adminpublisher/search/zone/new/" + affiliateId)
        .wait(3000);
}

function getSizeId(size){
	var standardizedSize = size.toLowerCase();
	var sizeIdKey = {
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

function fillOutForm(){
    const tagName = "Testing_Nightmare_Taginator";
    const pFloor = 1.2;
    const size = getSizeId("300x250");
    return nightmare
        .type("#userzonename", tagName)
        .evaluate(function() {
            document.querySelector('#cpmfloor').value = ''
        })
        .type("#cpmfloor", pFloor)
        .select("#ad_type", size);

}


function runTaginator(){
    logIntoAdCenter()
    .then(goToCreateZonePage()
    .then(fillOutForm()));
}

runTaginator();