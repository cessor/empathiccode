namespace PolyMorphism.Done
{
    public class Developer : IGetPaid
    {
        public decimal PayAmount(decimal salary)
        {
            return salary;
        }
    }
}