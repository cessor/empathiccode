function calcFormulas(g_var, g_oldvar, g_current_round, g_addConstant) {
        
        var x;
        var y;
        var x1;

        //====================================
        // Änderungen - Kosten Updaten
        //====================================
        
        //Rohstoff auf Lager kann nicht reduziert werden
        g_var['MaterialStock'] = g_var['MaterialStock'] + g_var['MaterialOrdered'];
        g_var['Account'] = g_var['Account'] - (g_var['MaterialPrice'] * (g_var['MaterialOrdered']));
        
        //50er Maschinen
        if (g_var['Machines50'] > g_oldvar['Machines50']) {  //Maschinen kaufen
                g_var['Account'] = g_var['Account'] - (10000 * (g_var['Machines50'] - g_oldvar['Machines50']));
        }
        else if (g_var['Machines50'] < g_oldvar['Machines50']) {  //Maschinen verkaufen
                x = g_var['CurrentMachineCapacity'] / g_var['MaximalMachineCapacity'];
                g_var['Account'] = g_var['Account'] + (x * 8000 * (g_oldvar['Machines50'] - g_var['Machines50']));
        }

        //100er Maschinen
        if (g_var['Machines100'] > g_oldvar['Machines100']) {  //Maschinen kaufen
                g_var['Account'] = g_var['Account'] - (20000 * (g_var['Machines100'] - g_oldvar['Machines100']));
        }
        else if (g_var['Machines100'] < g_oldvar['Machines100']) {  //Maschinen verkaufen
                x = g_var['CurrentMachineCapacity'] / g_var['MaximalMachineCapacity'];
                g_var['Account'] = g_var['Account'] + (x * 16000 * (g_oldvar['Machines100'] - g_var['Machines100']));
        }
        
        //Lieferwagen
        if (g_var['Distributors'] > g_oldvar['Distributors']) {  //Lieferwagen kaufen
                g_var['Account'] = g_var['Account'] - (10000 * (g_var['Distributors'] - g_oldvar['Distributors']));
        }
        else if (g_var['Distributors'] < g_oldvar['Distributors']) {  //Lieferwagen verkaufen
                g_var['Account'] = g_var['Account'] + ((8000 - (g_current_round * 100)) * (g_oldvar['Machines100'] - g_var['Machines100']));
        }
                
        //====================================
        // Neue Werte berechnen
        //====================================
        
        // Arbeitszufriedenheit
        // 'Satisfaction'
        g_var['Satisfaction'] = Math.min(g_var['MaximalSatisfaction'], 0.5 + ((g_var['Salary'] - 850) / 550) + (g_var['Social'] / 800));
        
        //Intern: Sozialkosten
        // TotalSocialCosts
        g_var['TotalSocialCosts'] = g_var['Social'] * (g_var['Workers50'] + g_var['Workers100']);
        
        //Flüssigkapital Update 1
        // Account
        g_var['Account'] = g_var['Account'] - g_var['TotalSocialCosts'];
        
        //Intern: Mögliches Produkt
        // PossibleProduction
        g_var.PossibleProduction = calculatePossibleProductionSprout(g_var, g_current_round);
        
        //Produkt auf Lager
        // 'ProductStock'
        g_var['ProductStock'] = Math.min(g_var['PossibleProduction'], g_var['MaterialStock']);
        
        // Hemden im Lager
        // 'ShirtStock'
        g_var['ShirtStock'] = g_var['ShirtStock'] + g_var['ProductStock'];
        
        // Rohmaterial im Lager
        // 'MaterialStock'
        g_var['MaterialStock'] = g_var['MaterialStock'] - g_var['ProductStock'];

        //Flüssigkapital Update 2 - Lagerungskosten
        // Account
        g_var['Account'] = g_var['Account'] - (g_var['ProductStock']*1) - (g_var['MaterialStock']*0.5);
        
        // Nachfrage
        // 'Demand'     
        g_var['Demand'] = ((g_var['Demand']/2) + 280) * 1.25 *  Math.pow(2.7181, (-1 * (Math.pow(g_var['ShirtPrice'],2)) / 4250) );
        
        //Flüssigkapital Update 3 - Lagerungskosten
        // Account
        g_var['Account'] = g_var['Account'] - g_var['ShirtStock'];

        // Verkauf
        // 'Sales'
        g_var['Sales'] = Math.min(g_var['ShirtStock'], g_var['Demand']);
        g_var['ShirtStock'] = g_var['ShirtStock'] - g_var['Sales'];

        //Flüssigkapital Update 4
        // Account
        g_var['Account'] = g_var['Account'] + (g_var['Sales'] * g_var['ShirtPrice']);
        
        //Flüssigkapital Update 5
        // Account
        g_var['Account'] = g_var['Account'] - g_var['Advertising'];
        
        //Flüssigkapital Update 6
        // Account
        g_var['Account'] = g_var['Account'] - (g_var['Distributors'] * 500);
        


        //Flüssigkapital Update 7 - Geschäftslage
        // Account
        if (g_var['Location'] == 0.25) {                // Vorstadt
                g_var['Account'] = g_var['Account'] - (0.25 * 2000);
                x = 0;
        }
        else if (g_var['Location'] == 0.5) {  //Stadtrand
                g_var['Account'] = g_var['Account'] - (0.5 * 2000);
                x = 0.1;
        }
        else if (g_var['Location'] == 1) {  //City
                g_var['Account'] = g_var['Account'] - (1 * 2000);
                x = 0.2;
        }

        x1 = Math.min((g_var['Advertising']/5), g_var['NM']);
        x1 = x1 + (g_var['Distributors'] * 100);
        x1 = x1 + (x1 * x);
        
        // Nachfrage
        // 'Demand'     
        g_var['Demand'] = x1 + (randomNumber(g_current_round,3) * 100) - 50;

        // Preis Rohmaterial
        // 'MaterialPrice'      
        g_var['MaterialPrice'] = 2 + (randomNumber(g_current_round,4) * 6.5);
        
        //Maschinenkapazität
        // 'CurrentMachineCapacity'
        g_var['CurrentMachineCapacity'] = (0.9 * g_var['CurrentMachineCapacity']) + ((g_var['Service'] / (g_var['Machines50'] + (g_var['Machines100'] * 0.00000001))) * 0.017);
        if (isNaN(g_var['CurrentMachineCapacity'])) { g_var['CurrentMachineCapacity'] = 0; } // wenn NaN dann auf 0 setzen      
        g_var['CurrentMachineCapacity'] = Math.min(g_var['CurrentMachineCapacity'], g_var['MaximalMachineCapacity']);
        
        
        //Flüssigkapital Update 8
        // Account
        g_var['Account'] = g_var['Account'] - g_var['Service'];
        g_var['Account'] = g_var['Account'] - ((g_var['Workers50'] + g_var['Workers100']) * g_var['Salary']);
        
        if (g_var['Account'] > 0) {
                g_var['Account'] = g_var['Account'] + (g_var['Account'] * g_var['CreditInterest']);
        }
        else {
                g_var['Account'] = g_var['Account'] + (g_var['Account'] * g_var['DebitInterest']);
        }
        
        //add constant factor as loaded from xml
        g_var['Account'] = g_var['Account'] + g_addConstant;
        
        //Gesamtkapital updaten
        // 'CompanyValue'
        x = g_var['CurrentMachineCapacity'] / g_var['MaximalMachineCapacity'];
        g_var['CompanyValue'] = g_var['Account'] + (g_var['Machines50'] * (x * 8000)) + (g_var['Machines100'] * (x * 16000)) + (g_var['Distributors'] * (8000 - (g_current_round * 100))) + (g_var['MaterialStock'] * 2) + (g_var['ShirtStock'] * 20);

        //Maschinenschäden
        // 'MachineDamage'
        g_var['MachineDamage'] = 1 - (g_var['CurrentMachineCapacity'] / g_var['MaximalMachineCapacity']);
                
        //Produktionsausfall
        // 'ProductionLoss'
        g_var['ProductionLoss'] = 1 - (g_var['ProductStock'] / g_var['PossibleProduction']);
        if (isNaN(g_var['ProductionLoss'])) { g_var['ProductionLoss'] = 1; } // wenn NaN dann auf 1 setzen      
        
        return g_var;
}