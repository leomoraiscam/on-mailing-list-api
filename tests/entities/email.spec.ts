import { Email } from '@/entities/email';

describe('User email value object', () => {
  it('should accept valid email', () => {
    const email = 'local@domain.com';

    expect(Email.validate(email)).toBeTruthy();
  });

  it('should not accept null strings', () => {
    const email = null;

    expect(Email.validate(email)).toBeFalsy();
  });

  it('should not accept empty strings', () => {
    const email = '';

    expect(Email.validate(email)).toBeFalsy();
  });

  it('should not accept local part larger than 64 chars', () => {
    const email = `${'l'.repeat(65)}@email.com`;

    expect(Email.validate(email)).toBeFalsy();
  });

  it('should not accept strings larger than 320 chars', () => {
    const email = `${'l'.repeat(64)}@${'d'.repeat(128)}.${'d'.repeat(127)}`;

    expect(Email.validate(email)).toBeFalsy();
  });

  it('should not accept domain part larger than 255 chars', () => {
    const email = `${'local@'}${'d'.repeat(128)}.${'d'.repeat(127)}`;

    expect(Email.validate(email)).toBeFalsy();
  });

  it('should not accept empty local part', () => {
    const email = `@email.com`;

    expect(Email.validate(email)).toBeFalsy();
  });

  it('should not accept empty domain part', () => {
    const email = `@`;

    expect(Email.validate(email)).toBeFalsy();
  });

  it('should not accept domain with a part larger than 63 chars', () => {
    const email = `${'local@'}${'d'.repeat(64)}.com`;

    expect(Email.validate(email)).toBeFalsy();
  });

  it('should not accept local part with invalid char', () => {
    const email = 'local part@email.com';

    expect(Email.validate(email)).toBeFalsy();
  });

  it('should not accept local part with two dots', () => {
    const email = 'local..email@domain.com';

    expect(Email.validate(email)).toBeFalsy();
  });

  it('should not accept local part with ending dot', () => {
    const email = 'local_dot.@email.com';

    expect(Email.validate(email)).toBeFalsy();
  });

  it('should not accept email without an at-sign', () => {
    const email = 'localDomain.com';

    expect(Email.validate(email)).toBeFalsy();
  });
});
