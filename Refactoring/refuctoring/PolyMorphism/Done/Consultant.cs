namespace PolyMorphism.Done
{
    public class Consultant : IGetPaid
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
}