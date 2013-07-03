using System;

namespace PolyMorphism.Classes2
{
    public class HumanResources
    {
        public enum EmployeeType
        {
            Developer,
            Architect,
            Intern,
            Consultant
        }

        public interface IContribute
        {
            EmployeeType Code();
        }

        public class Architect : IContribute
        {
            public EmployeeType Code()
            {
                throw new NotImplementedException();
            }

            public static decimal PayAmount(decimal salary)
            {
                return salary * 2;
            }
        }

        public class Developer : IContribute
        {
            public EmployeeType Code()
            {
                throw new NotImplementedException();
            }
        }

        public class Intern : IContribute
        {
            public EmployeeType Code()
            {
                throw new NotImplementedException();
            }

            public static decimal PayAmount(decimal salary)
            {
                return salary / 2;
            }
        }

        public class Consultant : IContribute
        {
            public EmployeeType Code()
            {
                throw new NotImplementedException();
            }

            public static decimal PayAmount(decimal salary)
            {
                const int freeLanceRisk = 1000;
                return salary * 4 + freeLanceRisk;
            }
        } 


        public decimal PayAmount(IContribute employee, decimal salary)
        {
            switch (employee.Code())
            {
                case EmployeeType.Intern:
                    return Intern.PayAmount(salary);

                case EmployeeType.Architect:
                    return Architect.PayAmount(salary);

                case EmployeeType.Consultant:
                    // Death Or Glory
                    return Consultant.PayAmount(salary);

                case EmployeeType.Developer:
                    return salary;
                default:
                    throw new WrongEmployeeComplaint();
            }
        }
    }

    public class WrongEmployeeComplaint : Exception { }

}