namespace PolyMorphism.Done
{
    public class Architect : IGetPaid
    {
        public decimal PayAmount(decimal salary)
        {
            return salary*2;
        }
    }
}