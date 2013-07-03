using System;

namespace PolyMorphism
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

        public decimal PayAmount(EmployeeType type, decimal salary)
        {
            const int freeLanceRisk = 1000;
            switch (type)
            {
                case EmployeeType.Intern:
                    return PayAmount(salary);

                case EmployeeType.Architect:
                    return salary * 2;

                case EmployeeType.Consultant:
                    // Death Or Glory
                    return salary * 4 + freeLanceRisk;

                case EmployeeType.Developer:
                    return salary;
                default:
                    throw new WrongEmployeeComplaint();
            }
        }

        public static decimal PayAmount(decimal salary)
        {
            return salary / 2;
        }
    }

    public class WrongEmployeeComplaint : Exception { }

}