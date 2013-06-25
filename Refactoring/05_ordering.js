var deepCopy = require('./deepcopy')

var randomNumbers = [
	//							// DEMAND
	// VAL1 		VAL2		VAL3		VAL4
	[0.08013165,	0.3656653,	0.2695015,	0.9641818], // Round 0
	[0.5990738,		0.7250987,	0.692422,	0.4417584], // Round 1
	[0.1773306,		0.2073692,	0.8444874,	0.438931 ], // Round 2
	[0.07570541,	0.09256702, 0.697927, 	0.6015126], // Round 3
	[0.6692592, 	0.3180092, 	0.25329, 	0.4903555], // Round 4
	[0.5879358, 	0.05636412, 0.8050709,	0.7844755]  // Round 5
];

var randomNumber = function(round, index_name) {
	var index = index_name - 1;
	return randomNumbers[round][index];
} 

var calculatePossibleProductionSprout = function(shop, g_current_round) {
	var fifties = Math.min(shop.Workers50, shop.Machines50);
	var hundreds = Math.min(shop.Workers100, shop.Machines100);
	return calculatePossibleProduction(shop, fifties, hundreds, g_current_round)
};

var calculatePossibleProduction = function(shop, fifties, hundreds, g_current_round) {
	var capacity = shop.CurrentMachineCapacity;
	var satisfaction = shop.Satisfaction;
	var fifties_factor = randomNumber(g_current_round, 1);
	var hundreds_factor = randomNumber(g_current_round, 2);

	return ((fifties * (capacity + 4 * fifties_factor - 2)) 
		  + (hundreds * (2 * capacity + 6 * hundreds_factor - 3))) * Math.sqrt(Math.abs(satisfaction));
};

var calculateRent = function(location) {
	var base_rent = 2000.0;
	return (location * base_rent);
};

var calculateLageFaktor = function(location) {

	var location_values = {
		  VORSTADT : 0.25
		, STADTRAND : 0.5
		, CITY : 1.0
	};

	var location_factors = {
		  0.25 : 0.0
		, 0.5 : 0.1
		, 1.0 : 0.2
	};

	var lagefaktor = location_factors[location];
	return lagefaktor;
};

var calculateDemand_1 = function(shop){
	return ((shop.Demand/2) + 280) * 1.25 *  Math.pow(2.7181, (-1 * (Math.pow(shop.ShirtPrice,2)) / 4250) ); // Nachfrage
};

var DEMAND_CONSTANT = 3;
var calculateDemand_2 = function (shop, lagefaktor, g_current_round) {
	var x1;
	x1 = Math.min((shop.Advertising / 5), shop.MaximalDemand);
	x1 = x1 + (shop.Distributors * 100);
	x1 = x1 + (x1 * lagefaktor);
	return x1 + (randomNumber(g_current_round, DEMAND_CONSTANT) * 100) - 50;
};




var priceFor100erMachines = function (new_machine_count, old_machine_count, production_rate_capacity_weasel) {
	var machines_to_trade = old_machine_count - new_machine_count;
	var buying = 20000;
	var selling = 16000 * production_rate_capacity_weasel;
	if (machines_to_trade > 0) {  
		return selling * machines_to_trade;
	}
	return buying * machines_to_trade;
};

var priceFor50erMachines = function (new_machine_count, old_machine_count, production_rate_capacity_weasel) {
	var machines_to_trade = old_machine_count - new_machine_count;
	var buying = 10000;
	var selling = 8000 * production_rate_capacity_weasel;
	if (machines_to_trade > 0) {  
		return selling * machines_to_trade;
	}
	return buying * machines_to_trade;
};

var calculateMachines = function (shop, last_round) {
	// JH, 02.03.2013
	// Be aware that machines can be sold or bought, depending on the differential, so moving them to appropriate cost / revenue functions might require some refactoring
	var production_rate_capacity_weasel = (shop.CurrentMachineCapacity / shop.MaximalMachineCapacity) || 1;
	var balance = 0;
	balance += priceFor50erMachines( shop.Machines50  || 0, last_round.Machines50  || 0, production_rate_capacity_weasel);
	balance += priceFor100erMachines(shop.Machines100 || 0, last_round.Machines100 || 0, production_rate_capacity_weasel);
	return balance;
};

var calculateDistributors = function(shop, last_round, g_current_round) {
	if (shop.Distributors > last_round.Distributors) {  //Lieferwagen kaufen
		shop.Account = shop.Account - (10000 * (shop.Distributors - last_round.Distributors));
	}
	else if (shop.Distributors < last_round.Distributors) {  //Lieferwagen verkaufen
		shop.Account = shop.Account + ((8000 - (g_current_round * 100)) * (last_round.Machines100 - shop.Machines100));
	}
};

var calculateCompanyValue = function(shop, g_current_round) {
	var production_rate_capacity = shop.CurrentMachineCapacity / shop.MaximalMachineCapacity;
	return shop.Account + (shop.Machines50 * (production_rate_capacity * 8000)) + (shop.Machines100 * (production_rate_capacity * 16000)) + (shop.Distributors * (8000 - (g_current_round * 100))) + (shop.MaterialStock * 2) + (shop.ShirtStock * 20);
};

var calculateSatisfaction = function (shop) {
	var satisfaction = (0.5 + ((shop.Salary - 850) / 550) + (shop.Social / 800));
	return Math.min(shop.MaximalSatisfaction, satisfaction);
};

var satisfaction_to_display = function (shop) {
	var satisfaction_in_percent = (shop.Satisfaction * 100) / shop.MaximalSatisfaction;
	satisfaction_in_percent = Math.round(satisfaction_in_percent * 10) / 10;
	return satisfaction_in_percent;
};

var calculateMaterialPrice = function (g_current_round)  {
	return 2 + (randomNumber(g_current_round,4) * 6.5); 
};



Lieber Johannes. Ich weiss du wirst es bis morgen vergessen haben. 
Wenn du mit erklären fertig bist, musst du wieder zu den Slides zurück und erklären,
wie Extract Method nach dem Buch funktioniert!
		- Lg, Ich von vor knapp 13 Stunden.



var calcFormulas = function(input_variables, last_round, g_current_round, g_addConstant) {
	var shop = deepCopy(input_variables);
	
	//====================================
	// Ã„nderungen - Kosten Updaten
	//====================================
	
	//Rohstoff auf Lager kann nicht reduziert werden
	shop.MaterialStock = shop.MaterialStock + shop.MaterialOrdered;
	shop.Account = shop.Account - (shop.MaterialPrice * (shop.MaterialOrdered));
	
	shop.Account += calculateMachines(shop, last_round);
	
	//Lieferwagen

	calculateDistributors(shop, last_round, g_current_round);
		
	//====================================
	// Neue Werte berechnen
	//====================================
	shop.Satisfaction = calculateSatisfaction(shop);									// Arbeitszufriedenheit
	shop.TotalSocialCosts = shop.Social * (shop.Workers50 + shop.Workers100);			// Intern: Sozialkosten
	shop.Account = shop.Account - shop.TotalSocialCosts; 								// FlÃ¼ssigkapital Update 1
	shop.PossibleProduction = calculatePossibleProductionSprout(shop, g_current_round); // Intern: MÃ¶gliches Produkt
	shop.ProductStock = Math.min(shop.PossibleProduction, shop.MaterialStock); 			// Produkt auf Lager
	shop.ShirtStock = shop.ShirtStock + shop.ProductStock; 								// Hemden im Lager
	shop.MaterialStock = shop.MaterialStock - shop.ProductStock; 						// Rohmaterial im Lager
	shop.Account = shop.Account - (shop.ProductStock*1) - (shop.MaterialStock*0.5); 	// FlÃ¼ssigkapital Update 2 - Lagerungskosten
	shop.Demand = calculateDemand_1(shop); 												// Nachfrage 1 	
	shop.Account = shop.Account - shop.ShirtStock;										// FlÃ¼ssigkapital Update 3 - Lagerungskosten
	shop.Sales = Math.min(shop.ShirtStock, shop.Demand);								// Verkauf
	shop.ShirtStock = shop.ShirtStock - shop.Sales;										// Lager
	shop.Account = shop.Account + (shop.Sales * shop.ShirtPrice); 						//FlÃ¼ssigkapital Update 4
	shop.Account = shop.Account - shop.Advertising; 									//FlÃ¼ssigkapital Update 5
	shop.Account = shop.Account - (shop.Distributors * 500);							//FlÃ¼ssigkapital Update 6
	shop.Account = shop.Account -  calculateRent(shop.Location); 						//FlÃ¼ssigkapital Update 7 - GeschÃ¤ftslage 	// Miete (Rent) - JH, 01.03.2013
	var lagefaktor = calculateLageFaktor(shop.Location);
	shop.Demand = calculateDemand_2(shop, lagefaktor, g_current_round);					// Nachfrage 2
	shop.MaterialPrice = calculateMaterialPrice(g_current_round); 						// Preis Rohmaterial
	
	//MaschinenkapazitÃ¤t
	shop.CurrentMachineCapacity = (0.9 * shop.CurrentMachineCapacity) + ((shop.Service / (shop.Machines50 + (shop.Machines100 * 0.00000001))) * 0.017);
	if (isNaN(shop.CurrentMachineCapacity)) { shop.CurrentMachineCapacity = 0; } // wenn NaN dann auf 0 setzen	
	shop.CurrentMachineCapacity = Math.min(shop.CurrentMachineCapacity, shop.MaximalMachineCapacity);
	
	//FlÃ¼ssigkapital Update 8
	shop.Account = shop.Account - shop.Service;
	shop.Account = shop.Account - ((shop.Workers50 + shop.Workers100) * shop.Salary);
	
	if (shop.Account > 0) {
		shop.Account = shop.Account + (shop.Account * shop.CreditInterest);
	}
	else {
		shop.Account = shop.Account + (shop.Account * shop.DebitInterest);
	}
	
	//add constant factor as loaded from xml 
	// JH 01.03.2013 - Treat this as a stock dividend or something like that? 
	shop.Account = shop.Account + g_addConstant;
	
	//Gesamtkapital updaten -- Company Value
	shop.CompanyValue = calculateCompanyValue(shop, g_current_round); 

	//MaschinenschÃ¤den - MachineDamage
	shop.MachineDamage = 1 - (shop.CurrentMachineCapacity / shop.MaximalMachineCapacity);
		
	//Produktionsausfall - ProductionLoss (PA)
	shop.ProductionLoss = 1 - (shop.ProductStock / shop.PossibleProduction);
	if (isNaN(shop.ProductionLoss)) {
		shop.ProductionLoss = 1; 
	}
	return shop;
}


// Arrange
var default_values = {
	'Account': 165774.66,
	'Sales': 407.2157,
	'MaterialPrice': 3.9936,
	'ShirtStock': 80.7164,
	'Workers50': 8,
	'Workers100': 0,
	'Salary': 1080,
	'ShirtPrice': 52,
	'Distributors': 1,
	'Satisfaction': 0,
	'ProductionLoss': 0.0,

	'CompanyValue': 247077,
	'Demand': 766.636,
	'MaterialStock': 16.06787,
	'MaterialOrdered': 250,
	'Machines50': 10,
	'Machines100': 0,
	'Service': 1200,
	'Social': 50,
	'Advertising': 2800,
	'Location': 0.5,
	'MachineDamage': 0,

	'CurrentMachineCapacity': 47.04,
	'MaximalSatisfaction': 1.7,
	'MaximalDemand': 900,
	'MaximalMachineCapacity': 50,
	'CreditInterest': 0.0025,
	'DebitInterest': 0.0066
};

var init = function (shop, g_current_round) {
	shop.Satisfaction = calculateSatisfaction(shop);
	shop.CompanyValue = calculateCompanyValue(shop, g_current_round);
	shop.MachineDamage = 1 - (shop.CurrentMachineCapacity / shop.MaximalMachineCapacity);
	return shop;
};


module.exports = { 
	'init' : init
	, 'calcFormulas' : calcFormulas
	, 'default_values' : default_values
	, 'calculateLageFaktor' : calculateLageFaktor
	, 'calculateRent' : calculateRent
	, 'calculateMachines' : calculateMachines
	, 'calculateDistributors' : calculateDistributors
	, 'calculateSatisfaction' : calculateSatisfaction
	, 'satisfaction_to_display' : satisfaction_to_display
};