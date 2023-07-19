import { Email } from "@/entities/email";

describe('Email validation', () => {
  it('should not accept null strings', () => {
    const email = null;

    expect(Email.validate(email)).toBeFalsy();
  })

  it('should not accept empty strings', () => {
    const email: string = '';

    expect(Email.validate(email)).toBeFalsy();
  })

  it('should accept valid email', () => {
    const email: string = 'any@email.com';

    expect(Email.validate(email)).toBeTruthy();
  })

  it('should not accept local part larger than 64 chars', () => {
    const email: string = `${'l'.repeat(65)}@email.com`;

    expect(Email.validate(email)).toBeFalsy();
  })

  it('should not accept strings larger than 320 chars', () => {
    const email: string = `${'l'.repeat(64)}@${'d'.repeat(128)}.${'d'.repeat(127)}`;

    expect(Email.validate(email)).toBeFalsy();
  })

  it('should not accept domain part larger than 255 chars', () => {
    const email: string = `${'local@'}${'d'.repeat(128)}.${'d'.repeat(127)}`;

    expect(Email.validate(email)).toBeFalsy();
  })

  it('should not accept empty local part', () => {
    const email: string = `@email.com`;

    expect(Email.validate(email)).toBeFalsy();
  })

  it('should not accept empty domain part', () => {
    const email: string = `any@`;

    expect(Email.validate(email)).toBeFalsy();
  })

  it('should not accept domain with a part larger than 63 chars', () => {
    const email: string = `${'any@'}${'d'.repeat(64)}.com`;

    expect(Email.validate(email)).toBeFalsy();
  })

  it('should not accept local part with invalid char', () => {
    const email: string = 'any email@email.com';

    expect(Email.validate(email)).toBeFalsy();
  })

  it('should not accept local part with two dots', () => {
    const email: string = 'any..email@email.com';

    expect(Email.validate(email)).toBeFalsy();
  })

  it('should not accept local part with ending dot', () => {
    const email: string = 'any_email.@email.com';

    expect(Email.validate(email)).toBeFalsy();
  })

  it('should not accept email without an at-sign', () => {
    const email: string = 'anyemail.com';

    expect(Email.validate(email)).toBeFalsy();
  })
})