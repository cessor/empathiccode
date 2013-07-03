namespace PolyMorphism.Done
{
    public class Intern : IGetPaid
    {
        public decimal PayAmount(decimal salary)
        {
            return salary/2;
        }
    }
}