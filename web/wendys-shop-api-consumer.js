const { request } = require('undici');

/**
 * Response
 * 
 * {"data":
 * 	  {	
 * 		"id":"31436",
 * 		"type":"players",
 * 		"attributes":
 * 			{
 * 				"platform":"hwm",
 * 				"platform_player_id":"12345",
 * 				"nickname":"In Game Nickname"
 * 			}
 * 		}
 * }
 **/
const getPlayer = async function (id) { 
	try {
		const { statusCode, body } = await request('https://web-store-backend.hwm.prod.nexters.team/api/v1/hwm/players/by-platform-player-id?filters[locale]=en&filters[platform_player_id]=' + id);
		const { data } = await body.json();
		return { statusCode, data };
	} catch (error) {
		console.error(error);
	}
}

/**
 * Response
 * 
 * {
 *  "data":{
 *     "count_available":0
 *  }
 * }
 **/
const canBuy = async function (id) {
	try {
		const response = await request('https://web-store-backend.hwm.prod.nexters.team/api/v1/hwm/bundles/free_energy/can-buy?filters[locale]=en&data[platform_buyer_id]=' + id);
		const { data } = await response.body.json();
		return data;
	} catch (error) {
		console.error(error);
	}
}


/**
 * Response
 * 
 * {"data":{"platform_buyer_id":"555965346","platform_recipient_id":null}}
 **/
const requestFreeEnergy = async function(id) {
	const { statusCode, headers, body } = await request('https://web-store-backend.hwm.prod.nexters.team/api/v1/hwm/bundles/free_energy/buy?filters[locale]=en', {
		method: "POST",
		headers: { 'Content-Type': 'application/vnd.api+json' },
		body: JSON.stringify(freeEnergyContent(id))
	});
	return statusCode;
}

freeEnergyContent = function (id) {
	return {'data': {
			'platform_buyer_id': id,
			'platform_recipient_id': null
		}
	};
}


module.exports = { getPlayer, canBuy, requestFreeEnergy};