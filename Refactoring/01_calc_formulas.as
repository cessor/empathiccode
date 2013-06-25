function calcFormulas():Boolean {
	
	var returnValue:Boolean = false;
	
	var x:Number;
	var y:Number;
	var x1:Number;
	
	//====================================
	// Änderungen - Kosten Updaten
	//====================================
	
	//Rohstoff auf Lager
	//kann nicht reduziert werden
	//g_var['RL'] = Math.max(g_var['RL'], g_oldvar['RL']); 
	//g_var['KA'] = g_var['KA'] - (g_var['RP'] * (g_var['RL'] - g_oldvar['RL']));
	g_var['RL'] = g_var['RL'] + g_var['RB'];
	g_var['KA'] = g_var['KA'] - (g_var['RP'] * (g_var['RB']));
	
	//50er Maschinen
	if (g_var['M1'] > g_oldvar['M1']) {  //Maschinen kaufen
		g_var['KA'] = g_var['KA'] - (10000 * (g_var['M1'] - g_oldvar['M1']));
	}
	else if (g_var['M1'] < g_oldvar['M1']) {  //Maschinen verkaufen
		x = g_var['MA'] / g_var['MM'];
		g_var['KA'] = g_var['KA'] + (x * 8000 * (g_oldvar['M1'] - g_var['M1']));
	}
	
	//100er Maschinen
	if (g_var['M2'] > g_oldvar['M2']) {  //Maschinen kaufen
		g_var['KA'] = g_var['KA'] - (20000 * (g_var['M2'] - g_oldvar['M2']));
	}
	else if (g_var['M2'] < g_oldvar['M2']) { 
		x = g_var['MA'] / g_var['MM'];
		g_var['KA'] = g_var['KA'] + (x * 16000 * (g_oldvar['M2'] - g_var['M2']));
	}
	
	
	if (g_var['LW'] > g_oldvar['LW']) {  
		g_var['KA'] = g_var['KA'] - (10000 * (g_var['LW'] - g_oldvar['LW']));
	}
	else if (g_var['LW'] < g_oldvar['LW']) {  //Lieferwagen verkaufen
		g_var['KA'] = g_var['KA'] + ((8000 - (g_current_round * 100)) * (g_oldvar['M2'] - g_var['M2']));
	}
		
	g_var['ZA'] = Math.min(g_var['ZM'], 0.5 + ((g_var['LO'] - 850) / 550) + (g_var['SM'] / 800));
	g_var['SK'] = g_var['SM'] * (g_var['A1'] + g_var['A2']);
	//Flüssigkapital Update 1
	// KA
	g_var['KA'] = g_var['KA'] - g_var['SK'];
	
	//Intern: Mögliches Produkt
	// PM
	x = Math.min(g_var['A1'], g_var['M1']);
	y = Math.min(g_var['A2'], g_var['M2']);
	g_var['PM'] = ((x * (g_var['MA'] + 4 * randomNumber(g_current_round,1) - 2)) + (y * (2 * g_var['MA'] + 6 * randomNumber(g_current_round,2) - 3))) * Math.sqrt(Math.abs(g_var['ZA']));
	
	//Produkt auf Lager
	// 'PL'
	g_var['PL'] = Math.min(g_var['PM'], g_var['RL']);
	
	// Hemden im Lager
	// 'HL'
	g_var['HL'] = g_var['HL'] + g_var['PL'];
	
	// Rohmaterial im Lager
	// 'RL'
	g_var['RL'] = g_var['RL'] - g_var['PL'];

	//Flüssigkapital Update 2 - Lagerungskosten
	// KA
	g_var['KA'] = g_var['KA'] - (g_var['PL']*1) - (g_var['RL']*0.5);
	
	// Nachfrage
	// 'NA' 	
	g_var['NA'] = ((g_var['NA']/2) + 280) * 1.25 *  Math.pow(2.7181, (-1 * (Math.pow(g_var['PH'],2)) / 4250) );
	
	//Flüssigkapital Update 3 - Lagerungskosten
	// KA
	g_var['KA'] = g_var['KA'] - g_var['HL'];
	
	// Verkauf
	// 'VH'
	g_var['VH'] = Math.min(g_var['HL'], g_var['NA']);
	g_var['HL'] = g_var['HL'] - g_var['VH'];

	//Flüssigkapital Update 4
	// KA
	g_var['KA'] = g_var['KA'] + (g_var['VH'] * g_var['PH']);
	
	//Flüssigkapital Update 5
	// KA
	g_var['KA'] = g_var['KA'] - g_var['WE'];
	
	//Flüssigkapital Update 6
	// KA
	g_var['KA'] = g_var['KA'] - (g_var['LW'] * 500);
	
	//Flüssigkapital Update 7 - Geschäftslage
	// KA
	if (g_var['GL'] == 0.25) {		// Vorstadt
		g_var['KA'] = g_var['KA'] - (0.25 * 2000);
		x = 0;
	}
	else if (g_var['GL'] == 0.5) {  //Stadtrand
		g_var['KA'] = g_var['KA'] - (0.5 * 2000);
		x = 0.1;
	}
	else if (g_var['GL'] == 1) {  //City
		g_var['KA'] = g_var['KA'] - (1 * 2000);
		x = 0.2;
	}

	x1 = Math.min((g_var['WE']/5), g_var['NM']);
	x1 = x1 + (g_var['LW'] * 100);
	x1 = x1 + (x1 * x);
	
	// Nachfrage
	// 'NA' 	
	g_var['NA'] = x1 + (randomNumber(g_current_round,3) * 100) - 50;

	// Preis Rohmaterial
	// 'RP' 	
	g_var['RP'] = 2 + (randomNumber(g_current_round,4) * 6.5);
	
	//Maschinenkapazität
	// 'MA'
	g_var['MA'] = (0.9 * g_var['MA']) + ((g_var['RS'] / (g_var['M1'] + (g_var['M2'] * 0.00000001))) * 0.017);
	if (isNaN(g_var['MA'])) { g_var['MA'] = 0; } // wenn NaN dann auf 0 setzen	
	g_var['MA'] = Math.min(g_var['MA'], g_var['MM']);
	
	
	//Flüssigkapital Update 8
	// KA
	g_var['KA'] = g_var['KA'] - g_var['RS'];

	// Lohn für 50er und 100er Arbeiter
	g_var['KA'] = g_var['KA'] - ((g_var['A1'] + g_var['A2']) * g_var['LO']);
	
	if (g_var['KA'] > 0) {
		// Guthabenzins
		g_var['KA'] = g_var['KA'] + (g_var['KA'] * g_var['GZ']);
	}
	else {
		// Sollzins
		g_var['KA'] = g_var['KA'] + (g_var['KA'] * g_var['SZ']);
	}
	
	//add constant factor as loaded from xml
	g_var['KA'] = g_var['KA'] + g_addConstant;
	
	//Gesamtkapital updaten
	// 'GK'
	x = g_var['MA'] / g_var['MM'];
	g_var['GK'] = g_var['KA'] + (g_var['M1'] * (x * 8000)) + (g_var['M2'] * (x * 16000)) + (g_var['LW'] * (8000 - (g_current_round * 100))) + (g_var['RL'] * 2) + (g_var['HL'] * 20);
	
	//Maschinenschäden
	// 'MS'
	g_var['MS'] = 1 - (g_var['MA'] / g_var['MM']);
		
	//Produktionsausfall
	// 'PA'
	g_var['PA'] = 1 - (g_var['PL'] / g_var['PM']);
	if (isNaN(g_var['PA'])) { g_var['PA'] = 1; } // wenn NaN dann auf 1 setzen	
	
	
	returnValue = true;
	return returnValue;
	
}