namespace PolyMorphism.Done
{
    public class HumanResources
    {
        public decimal PayAmount(IGetPaid employee, decimal salary)
        {
            return employee.PayAmount(salary);
        }
    }
}