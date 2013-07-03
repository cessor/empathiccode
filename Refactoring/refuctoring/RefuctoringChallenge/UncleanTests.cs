using System;
using System.Linq;
using DateApi;
using NUnit.Framework;
using Should.Fluent;

namespace RefuctoringChallenge
{
    public class UncleanTests
    {
        [Test]
        public void BecauseICan()
        {
            SystemUnderTest.Transform(new[] { 0, 0, 1, 5, 0, 5 }.ToArray().ToList()).Should().Equal(new TimeSpan(0, 15, 5));
        }

        [Test]
        public void BecauseIStillCan()
        {
            1.Minutes().And(30.Seconds()).Should().Equal(SystemUnderTest.Transform(new[] { 1, 3, 0 }.ToList()));
        }

        [Test]
        public void IDoNotLikeYou()
        {
            SystemUnderTest.Transform(new[] { 1, 5, 0, 5 }.ToList()).Should().Equal(new TimeSpan(0, 15, 5));
        } 
    }

}
