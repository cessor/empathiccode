using System;

namespace RefuctoringChallenge
{
    public static class When
    {
        public static byte[] IType(params byte[] numbers)
        {
            Console.Write("When I type: ");
            foreach (var number in numbers)
            {
                Console.Write(number + ", ");
            }
            return numbers;
        }
    }
}