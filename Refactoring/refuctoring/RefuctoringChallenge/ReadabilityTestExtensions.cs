using System;
using System.Collections.Generic;
using System.Linq;

namespace RefuctoringChallenge
{
    public static class ReadabilityTestExtensions
    {
        public static byte[] And(this byte[] numbers)
        {
            Console.Write("and ");
            return numbers;
        }

        public static TimeSpan TransformTheDigits(this byte[] digits)
        {
            return TransformTheDigits(digits.Select(x => (int)x));
        }

        public static TimeSpan TransformTheDigits(this IEnumerable<int> digits)
        {
            Console.WriteLine("transform the digits");
            return SystemUnderTest.Transform(digits);
        }

        public static TimeSpan Then(this TimeSpan time)
        {
            Console.Write("Then ");
            return time;
        }

        public static TimeSpan TheResult(this TimeSpan time)
        {
            Console.Write("the result should be ");
            return time;
        }
    }
}