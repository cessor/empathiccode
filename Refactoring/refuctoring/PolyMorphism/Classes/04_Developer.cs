using System;

namespace PolyMorphism.Classes3
{
    public class HumanResources
    {
        public decimal PayAmount(IGetPaid employee, decimal salary)
        {
            return employee.PayAmount(salary);
        }
    }

    public class Consultant
    {
        /// <summary>
        /// Death or glory
        /// </summary>
        /// <param name="salary"></param>
        /// <returns></returns>
        public decimal PayAmount(decimal salary)
        {
            const int freeLanceRisk = 1000;
            return salary*4 + freeLanceRisk;
        }
    }

    public class Intern : IGetPaid
    {
        public decimal PayAmount(decimal salary)
        {
            return salary/2;
        }
    }

    public class Developer : IGetPaid
    {
        public decimal PayAmount(decimal salary)
        {
            return salary;
        }
    }

    public class Architect : IGetPaid
    {
        public decimal PayAmount(decimal salary)
        {
            return salary*2;
        }
    }

    public interface IGetPaid
    {
        decimal PayAmount(decimal salary);
    }
    public class WrongEmployeeComplaint : Exception
{
}
}

