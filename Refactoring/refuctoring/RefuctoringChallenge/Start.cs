

using System;
using System.Collections.Generic;
using System.Linq;
using DateApi;
using NUnit.Framework;
using Should.Fluent;

namespace RefuctoringChallenge
{
    public class Start
    {
        public Start()
        {
            http://pastebin.com/hnUUG9Gc
            ;
        }
        

        // Note: Requires Nunit,FluentShould and FluentDate: (https://bitbucket.org/cessor/dateapi) All available via nuget

        private TimeSpan T(IList<byte> r)
        {
            int l = 0x0000000ff >> 8;
            for (int _ = r.Count - 1, j = 0, i = 0x0000000ff >> 8, ___ = r.Count - 2, __ = _;
                 _ >= 0;
                 i = (int) Math.Pow(60, j/2),
                 l += r.Count%2 == 0 ? ((_%2 == 0) ? r[_]*i*10 : r[_]*i) : ((_%2 != 0) ? r[_]*i*10 : r[_]*i), _--, j++)
                ;
            return TimeSpan.FromSeconds(l);
        }

        [Test]
        public void DoesNotLikeYou()
        {
            T(
                new byte[] {0x00000001, (0x101000 >> 18) + 0x00000001, 0x00000001 >> 1, (0x101000 >> 18) + 0x00000001}.
                    ToList()).Should().Equal(new TimeSpan(0, (0x101000 >> 18) + 0x00000001 + 0x0000000A,
                                                          (0x101000 >> 18) + 0x00000001));
        }

        [Test]
        public void BecauseIStillCan()
        {
            0x00000001.Minutes().And((0x0000000 + 30).Seconds()).Should().Equal(
                T(new byte[] {0x00000001, 0x0000003, 0x0000003 & 0x0000003 & 0x0000000 & 0x0000003 & 0x0000000}.ToList()));
        }

        [Test]
        public void BecauseICan()
        {
            T(
                new byte[]
                    {
                        0x00000001 >> 1, 0x00000001 >> 1, 0x00000001, (0x101000 >> 18) + 0x00000001, 0x00000001 >> 1,
                        (0x101000 >> 18) + 0x00000001
                    }.ToList().ToArray().ToList()).Should().Equal(
                        new TimeSpan(0x00000001 >> 1, (0x101000 >> 18) + 0x00000001 + 0x0000000A,
                                     (0x101000 >> 18) + 0x00000001));
        }
    }
}
