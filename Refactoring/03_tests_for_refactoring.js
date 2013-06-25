
var test_first_round = function () {
        // Arrange
        var round = 0;
        var constant = 0;
        var values = init(round1, 0);

        // Act
        var values = calcFormulas(values, values, round, constant);     

        // Assert
        // Left
        Math.round(values.Account).should.equal(168075);
        Math.round(values.Sales).should.equal(347);
        tolerance(values.MaterialPrice, 8.27, 0.001).should.be.true;
        Math.round(values.ShirtStock).should.equal(0);
        Math.round(values.Workers50).should.equal(8);
        Math.round(values.Workers100).should.equal(0);
        Math.round(values.Salary).should.equal(1080);
        Math.round(values.ShirtPrice).should.equal(52);
        Math.round(values.Distributors).should.equal(1);
        tolerance(values.Satisfaction, 0.98, 0.001).should.be.true;
        Math.round(values.ProductionLoss).should.equal(0.26);

        // Right
        Math.round(values.CompanyValue).should.equal(247077);
        Math.round(values.Demand).should.equal(703);
        Math.round(values.MaterialStock).should.equal(0);
        Math.round(values.MaterialOrdered).should.equal(250);
        Math.round(values.Machines50).should.equal(10);
        Math.round(values.Machines100).should.equal(0);
        Math.round(values.Service).should.equal(1200);
        Math.round(values.Social).should.equal(50);
        Math.round(values.Advertising).should.equal(2800);
        tolerance(values.Location, 0.5, 0.000001).should.be.true;
        tolerance(values.MachineDamage, 0.112, 0.01).should.be.true;
}();