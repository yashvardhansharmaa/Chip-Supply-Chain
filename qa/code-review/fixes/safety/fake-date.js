// node -r ./fake-date.js build/build.js, with FAKE_NOW=2026-11-09T12:00:00: the build believes it is that moment
const RealDate = Date;
const fixed = new RealDate(process.env.FAKE_NOW || '2026-11-09T12:00:00').getTime();
class FakeDate extends RealDate {
  constructor(...a) { if (a.length) super(...a); else super(fixed); }
  static now() { return fixed; }
}
global.Date = FakeDate;
