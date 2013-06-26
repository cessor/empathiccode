var deepCopy = require('./deepcopy');
var Month = require('./month')

var DefaultValues = {
	'Account': 165774.66,				// 		Displayed, JH, 08.03.2013
	'Sales': 407.2157,					// 		Displayed, JH, 08.03.2013
	'MaterialPrice': 3.9936,			// 		Displayed, JH, 08.03.2013 -- Jitter
	'ShirtStock': 80.7164,				// 		Displayed, JH, 08.03.2013
	'Workers50': 8,						// Changeable, JH, 08.03.2013
	'Workers100': 0,					// Changeable, JH, 08.03.2013
	'Salary': 1080,						// Changeable, JH, 08.03.2013
	'ShirtPrice': 52,					// Changeable, JH, 08.03.2013
	'Distributors': 1,					// Changeable, JH, 08.03.2013
	'Satisfaction': 0.9806818181818182,					// 		Displayed, JH, 08.03.2013	
	'ProductionLoss': 0.0,				// 		Displayed, JH, 08.03.2013

	'CompanyValue': 250685.12374,				// 		Displayed, JH, 08.03.2013 
	'Demand': 766.636,					// 		Displayed, JH, 08.03.2013 -- Jitter
	'MaterialStock': 16.06787,			// 		Displayed, JH, 08.03.2013
	'MaterialOrdered': 250,				// Changeable, JH, 08.03.2013
	'Machines50': 10,					// Changeable, JH, 08.03.2013
	'Machines100': 0,					// Changeable, JH, 08.03.2013
	'Service': 1200,					// Changeable, JH, 08.03.2013
	'Social': 50,						// Changeable, JH, 08.03.2013
	'Advertising': 2800,				// Changeable, JH, 08.03.2013
	'Location': 0.5,					// Changeable, JH, 08.03.2013
	'MachineDamage': 0.0592,			// 		Displayed, JH, 08.03.2013
	'CurrentMachineCapacity': 47.04
};

var Constants = {
	  'CreditInterest': 0.0025 			
	, 'DebitInterest': 0.0066 			
	, 'MaximumMachineCapacity': 50		
	, 'MaximumDemand': 900				
	, 'MaximumSatisfaction': 1.7		
	, 'Dividend' : 0
}

var Shop = function()  {
	this.values = deepCopy(DefaultValues);
	this.constants = deepCopy(Constants);
	this.month = new Month();
};

Shop.prototype.setCashInjection = function (cashInjection) {
	this.constants.Dividend = cashInjection;
};

Shop.prototype.nextMonth = function(changes) {
	var nextRound = copyAndOverride(this.values, changes);
	var lastRound = deepCopy(this.values);
	this.values = calculateFormulas(nextRound, lastRound, this.month, this.constants);
	this.month.next();
};

var copyAndOverride = function(original, override) {
	var original = deepCopy(original);
	for(var property in override){
		if(override.hasOwnProperty(property) && original.hasOwnProperty(property)) {
			original[property] = override[property];
		}
	}
	return original;
};











Lieber Johannes. Ich weiss du wirst es bis morgen vergessen haben. 
Wenn du mit erklären fertig bist, musst du wieder zu den Slides zurück und erklären,
wie Extract Method nach dem Buch funktioniert!
		- Lg, Ich von vor knapp 13 Stunden.







var calculateFormulas = function(inputVariables, lastRound, month, constants) {
	var shop = deepCopy(inputVariables);
	Procurement(shop, lastRound, month.month, constants.MaximumMachineCapacity);
	Purchasing(shop);
	Manufacturing(shop, constants, month);
	Expenses(shop);
	Retail(shop);
	Advertising(shop, constants, month.Demand());
	Banking(shop, constants);
	Reporting(shop, month.month, constants, month.MaterialPrice());
	return shop;
}










var Procurement = function (shop, lastRound, round, maximumCapacity) {
	var quality = machineQuality(shop, maximumCapacity) || 1;
	var balance =
		  tradeDistributors((shop.Distributors - lastRound.Distributors) || 0, round)
		+ trade50erMachines((shop.Machines50 - lastRound.Machines50) || 0, quality)
		+ trade100erMachines((shop.Machines100 - lastRound.Machines100) || 0, quality);
	creditAccount(shop, balance);
};

var Purchasing = function (shop) {
	debitAccount(shop, (shop.MaterialPrice * shop.MaterialOrdered));
	shop.MaterialStock += shop.MaterialOrdered;
};

var Manufacturing = function (shop, constants, month) {
	var halftimeJitter = month.ProductivityMachines50er();
	var fulltimeJitter = month.ProductivityMachines100er();
	shop.Satisfaction = satisfaction(shop, constants.MaximumSatisfaction);
	manufactureShirts(shop, halftimeJitter, fulltimeJitter);
};

var Expenses = function (shop) {
	shop.TotalSocialCosts = totalSocialCosts(shop);
	var balance = 
		  shop.TotalSocialCosts
		+ shop.Advertising 
		+ (shop.Distributors * 500) 
		+ rent(shop.Location) 
		+ shop.Service 
		+ salaries(shop) 
		+ storage(shop);
	debitAccount(shop,balance);	
};

var Retail = function (shop) {
	var demand = demand1(shop.Demand, shop.ShirtPrice);
	shop.Sales = Math.min(shop.ShirtStock, demand);
	shop.ShirtStock -= shop.Sales;
	var revenue = (shop.Sales * shop.ShirtPrice);
	creditAccount(shop, revenue);
};

var Advertising = function (shop, constants, jitter) {
	var lagefaktor = LageFaktor(shop.Location);
	shop.Demand = demand2(shop, lagefaktor, constants.MaximumDemand, jitter);	
};

var Banking = function (shop, constants) {
	var interestBalance = interest(shop.Account, constants.CreditInterest, constants.DebitInterest);
	creditAccount(shop, interestBalance);
	creditAccount(shop, constants.Dividend);
};

var Reporting = function (shop, round, constants, jitter) {
	shop.MaterialPrice = materialPrice(jitter); 	
	shop.CurrentMachineCapacity = machineCapacity(shop, constants.MaximumMachineCapacity);	
	shop.MachineDamage = machineDamage(shop, constants.MaximumMachineCapacity);  					
	shop.ProductionLoss = productionLoss(shop);														
	shop.CompanyValue = companyValue(shop, round, constants.MaximumMachineCapacity);
};

var tradeDistributors = function(distributorsToTrade, round) {
	var buying = -10000; 
	var selling = 8000 - (round * 100);
	return trade(distributorsToTrade, buying, selling);
};

var trade50erMachines = function (machinesToTrade, quality) {
	var buying = -10000;
	var selling = +8000 * quality;
	return trade(machinesToTrade, buying, selling);
};

var trade100erMachines = function (machinesToTrade, quality) {
	var buying = -20000;
	var selling = +16000 * quality;
	return trade(machinesToTrade, buying, selling);
};

var trade = function (amount, buying, selling) {
	if (amount < 0) {
		return selling * amount * -1;		
	}
	return buying * amount;
};

var manufactureShirts = function (shop, halftimeJitter, fulltimeJitter) {
	shop.PossibleProduction = productivity(shop, halftimeJitter, fulltimeJitter);
	shop.ProductStock = Math.min(shop.PossibleProduction, shop.MaterialStock);
	shop.ShirtStock += shop.ProductStock;
	shop.MaterialStock -= shop.ProductStock;
};

var demand1 = function (demand, price) {
	var irgendN_krummerWert =  1.25 * Math.pow(2.7181, (-1 * (Math.pow(price, 2)) / 4250));
	return ((demand / 2) + 280) * irgendN_krummerWert;
};

var demand2 = function (shop, lagefaktor, maximumDemand, demandJitter) {
	var advertising = Math.min((shop.Advertising / 5), maximumDemand);
	var visibility = (shop.Distributors * 100);
	var baseDemand = advertising + visibility
	var demand = baseDemand * lagefaktor;
	var jitter = (demandJitter * 100) - 50;
	return baseDemand + demand + jitter;
};

var satisfaction = function (shop, maximumSatisfaction) {
	var satisfaction = (0.5 + ((shop.Salary - 850) / 550) + (shop.Social / 800));
	return Math.min(satisfaction, maximumSatisfaction);
};

var totalSocialCosts = function (shop) {
	return shop.Social * (shop.Workers50 + shop.Workers100);
}

var productivity = function(shop, halftimeJitter, fulltimeJitter) {
	var halftime = productivity50er(shop, halftimeJitter);
	var fulltime = productivity100er(shop, fulltimeJitter);
	return (halftime + fulltime);
};

var productivity50er = function(shop, jitter) {
	var productivity = (shop.CurrentMachineCapacity + 4 * jitter - 2);		
	return calcualateProductivity(productivity, shop.Workers50, shop.Machines50) * Math.sqrt(Math.abs(shop.Satisfaction));
};

var productivity100er = function(shop, jitter) {
	var productivity = (2 * shop.CurrentMachineCapacity + 6 * jitter - 3);
	return calcualateProductivity(productivity, shop.Workers100, shop.Machines100) * Math.sqrt(Math.abs(shop.Satisfaction));
};

var calcualateProductivity = function (productivity, workers, machines) {
	var limit = Math.min(workers, machines);	
	return limit * productivity;
}

var machineCapacity = function (shop, maximumCapacity) {
	var capacity = (0.9 * shop.CurrentMachineCapacity) + ((shop.Service / (shop.Machines50 + (shop.Machines100 * 0.00000001))) * 0.017) || 0;
	return Math.min(capacity , maximumCapacity);
};

var productionLoss = function (shop) {
	var loss  = 1 - (shop.ProductStock / shop.PossibleProduction);
	if (isFinite(loss)) {
	 	return loss;
	}
	return 1;
};

var rent = function(location) {
	var baseRent = 2000.0;
	return (location * baseRent);
};

var LageFaktor = function(location) {
	// TODO: This needs to be factored out and centralized somewhere else. ATM it is scattered all over the solution. JH,25.04.2013
	var locationValues = {
		  VORSTADT : 0.25
		, STADTRAND : 0.5
		, CITY : 1.0
	};	  

	var locationFactors = {
		  0.25 : 0.0
		, 0.5  : 0.1
		, 1.0  : 0.2
	};

	var lagefaktor = locationFactors[location];
	return lagefaktor;
};

var materialPrice = function (jitter)  {
	return 2 + (jitter * 6.5); 
};

var storage = function(shop) {
	var balance =  
	    shop.ProductStock 
	  + shop.MaterialStock * 0.5
	  + shop.ShirtStock;
	return balance;
};

var salaries = function (shop)  {
	return (shop.Workers50 + shop.Workers100) * shop.Salary;
};

var machineQuality = function(shop, maximumCapacity) {
	return shop.CurrentMachineCapacity / maximumCapacity;
};

var machineDamage = function (shop, maximumCapacity) {
	return 1 - machineQuality(shop, maximumCapacity); 
};

var interest = function (balance, creditInterest, debitInterest) {
	if (balance > 0) {
		return (balance * creditInterest);
	}
	return (balance * debitInterest);
};

var companyValue = function(shop, round, maximumCapacity) {
	var quality = machineQuality(shop, maximumCapacity);
	var value = 
	 	   shop.Account 
		+ (shop.Machines50 * (quality  * 8000)) 
		+ (shop.Machines100 * (quality * 16000)) 
		+ (shop.Distributors * (8000 - (round * 100))) 
		+ (shop.MaterialStock * 2)  
		+ (shop.ShirtStock   * 20);

	return value;
};

var creditAccount = function (shop, balance) {
	shop.Account += balance;
};

var debitAccount = function (shop, balance) {
	shop.Account -= balance;
};

module.exports = {
	 'override' : copyAndOverride
	, 'Shop' : Shop
	, 'calcFormulas' : calculateFormulas
	, 'LageFaktor' : LageFaktor
	, 'Rent' : rent
	, 'trade50erMachines' : trade50erMachines
	, 'trade100erMachines' : trade100erMachines
	, 'tradeDistributors' : tradeDistributors
	, 'Satisfaction' : satisfaction
	, 'interest' : interest
	, 'MachineCapacity' : machineCapacity
	, 'Productivity50er' : productivity50er
	, 'Productivity100er' : productivity100er
	, 'PossibleProduction' : productivity
	, 'ProductionLoss' : productionLoss
	, 'storage' : storage
	, 'Salaries' : salaries
	, 'MachineDamage' : machineDamage
	, 'Demand_1' : demand1
	, 'Demand_2' : demand2
	, 'Default' : DefaultValues
	, 'Constants' : Constants
};