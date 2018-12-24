const chakram = require('chakram');
const expect = chakram.expect;

describe('The groupkt states API service for endpoint : /state/get/{countryCode}/all', function() {
    
    const invalidCountryCode  = 'aju';
    const countryCode = 'USA';
    //This schema is shared between results found or not found
    const expectedSchema = {
        type: 'object',
        properties: {
            RestResponse : {
                properties: {
                    messages: {type: 'array'},
                    result: {type: 'array'},
                },
                required: ['messages', 'result']
            },
        },
        required: ['RestResponse']
        
    }

    describe(`given an invalid country code, ${invalidCountryCode}` ,function(){
        
        var apiResponse;
        const serviceUrl = `http://services.groupkt.com/state/get/${invalidCountryCode}/all`
        const INVALID_STATES_RETURNED = 0;
        const NO_STATES_FOUND_MESSAGE = `Total [${INVALID_STATES_RETURNED}] records found.`
        
        before(function(){
            return chakram.get(serviceUrl)
            .then(function (result) {
                apiResponse = result
            })
        });

        it('should return 200 status code when no records are found', function () {
            expect(apiResponse).to.have.status(200);
        });

        it(`should return ${INVALID_STATES_RETURNED} results`, function () {
            expect(apiResponse).to.have.json('RestResponse.result', function (result) {
                expect(result).to.have.length(INVALID_STATES_RETURNED);
            });
        });

        it(`should display the message \"${NO_STATES_FOUND_MESSAGE}\"`, function () {
            expect(apiResponse).to.have.json('RestResponse.messages[0]', function (message) {
                expect(message).to.equal(NO_STATES_FOUND_MESSAGE);
            });
        });

        it(`should return a result in the proper schema`, function () {
            expect(apiResponse).to.have.schema(expectedSchema);
        });
    });

    describe(`given a valid country code, ${countryCode}`, function(){
        var apiResponse;

        const serviceUrl = `http://services.groupkt.com/state/get/${countryCode}/all`
        const CURRENT_STATES = 55;
        const ALPHABETICAL_FIRST_STATE = 'Alabama'
        const stateRecord ={
            id: 1,
            country: 'USA',
            name: 'Alabama',
            abbr: 'AL',
            area: '135767SKM',
            largest_city: 'Birmingham',
            capital: 'Montgomery'
            }

        before(function(){
            
            return chakram.get(serviceUrl)
            .then(function (result) {
                apiResponse = result
            })
            
        });
    
        it('should return 200 on success', function () {
            expect(apiResponse).to.have.status(200);
        });

        it(`should return an alphabetical first result of ${ALPHABETICAL_FIRST_STATE}`, function () {
             expect(apiResponse).to.have.json('RestResponse.result[0].name', ALPHABETICAL_FIRST_STATE);
        });

        it(`should return ${CURRENT_STATES} results`, function () {
            expect(apiResponse).to.have.json('RestResponse.result', function (result) {
                expect(result).to.have.length(CURRENT_STATES);
            });
        });

        it(`should return the following record for  ${stateRecord.name} :  ${JSON.stringify(stateRecord)}`, function () {
            var firstRecord = apiResponse.body.RestResponse.result[0]

            expect(firstRecord.name).to.be.equal(stateRecord.name);
            expect(firstRecord.id).to.be.equal(stateRecord.id);
            expect(firstRecord.capital).to.be.equal(stateRecord.capital);
            expect(firstRecord.abbr).to.be.equal(stateRecord.abbr);
            expect(firstRecord.largest_city).to.be.equal(stateRecord.largest_city)
            expect(firstRecord.area).to.be.equal(stateRecord.area)
            expect(firstRecord.country).to.be.equal(stateRecord.country)
        });

        it(`should return a result in the proper schema`, function () {
            expect(apiResponse).to.have.schema(expectedSchema);
        });
        
    })
    
});