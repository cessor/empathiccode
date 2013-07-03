using System;
using System.Collections.Generic;
using System.Linq;
using DateApi;

namespace RefuctoringChallenge
{
    public class SystemUnderTest
    {
        public static TimeSpan Transform(IEnumerable<int> digits )
        {
            // Sorry, I am too lazy to make those run automatically. Just deactivate the comments, will ya? - JH, 03.05.2012
            //return Imperative(digits);
            //return ImperativeWithLinq(digits);
            return Declarative(digits);
            
        }

        public static TimeSpan Transform(byte[] digits)
        {
            return Transform(digits.Select(x => (int)x));
        }

        private static TimeSpan Imperative(IEnumerable<int> digits)
        {
            int result = 0;
            var r = digits.ToList();
            for (int j = 0; j < r.Count; j++)
            {
                int i = (int)Math.Pow(60, j / 2);
                int rTimesI = r[r.Count - j - 1] * i;

                result += (j % 2 == 1)
                              ? rTimesI * 10
                              : rTimesI;
            }
            return TimeSpan.FromSeconds(result);
        }

        private static TimeSpan ImperativeWithLinq(IEnumerable<int> digits)
        {
            var r = digits.ToList();
            
            int result = 
                r.Select((t, j) => (int) Math.Pow(60, j/2))
                    .Select((i, j) => r[r.Count - j - 1]*i)
                    .Select((rTimesI, j) => (j%2 == 1) ? rTimesI*10 : rTimesI)
                    .Sum();

            return TimeSpan.FromSeconds(result);
        }

        private static TimeSpan Declarative(IEnumerable<int> digits) 
        {
            var secondsPerUnit = new [] { 1, 10,60,600,3600, 36000 };
            
            return digits
                .Reverse()
                .Zip(secondsPerUnit, (digit, unit) => digit*unit)
                .Sum()
                .Seconds();            
        }
    }
}