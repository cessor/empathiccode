using System;

namespace PolyMorphism.Classes
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
        }

        public class Consultant : IContribute
        {
            public EmployeeType Code()
            {
                return EmployeeType.Consultant;
            }
        } 


        public decimal PayAmount(IContribute employee, decimal salary)
        {
            const int freeLanceRisk = 1000;
            switch (employee.Code())
            {
                case EmployeeType.Intern:
                    return salary / 2;

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
    }

    public class WrongEmployeeComplaint : Exception { }

}