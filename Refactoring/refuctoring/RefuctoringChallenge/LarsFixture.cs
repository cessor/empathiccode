using System;
using DateApi;
using NUnit.Framework;
using Should.Fluent;

namespace RefuctoringChallenge
{
    [TestFixture]
    public class LarsFixture
    {
        [Test]
        public void ShouldConvertAnEvenNumberOfDigitsToATimespan()
        {
            // Arrange
            var bytes =    new byte[] { 0, 0, 1,5, 0,5 };
            var expected = new TimeSpan(0, 0, 15, 5, 0);
            
            // Act
            var actual = SystemUnderTest.Transform(bytes);

            // Assert
            actual.Should().Equal(expected);
        }

        [Test]
        public void ShouldConvertAnOddNumberOfDigitsToATimespan()
        {
            // Arrange
            var expected = 1.Minutes().And(30.Seconds());

            // Act
            var actual = SystemUnderTest.Transform(new byte[] { 1, 3, 0 });
            
            // Assert
            expected.Should().Equal(actual);
        }

        [Test]
        public void ShouldConvertASmallerListWithAnEvenCountOfDigits()
        { 
            When.IType(1, 5, 0, 5).And().TransformTheDigits().Then().TheResult().Should().Equal(15.Minutes().And(5.Seconds()));

            Console.WriteLine(15.Minutes().And(5.Seconds()));
        }
    }
}