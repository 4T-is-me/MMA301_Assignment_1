// Author: trangtttce191027
import { ProfileSchema } from '../src/storage/ProfileSchema';

const valid = {
  name: 'Test User', email: 'test@example.com', phone: '0912345678',
  location: 'Da Nang', bio: 'Developer', avatar: 'file:///avatar.jpg',
};

describe('Profile Validation', () => {
  test('accepts a complete profile and trims text', async () => {
    const result = await ProfileSchema.validate({ ...valid, name: '  Test User  ' });
    expect(result.name).toBe('Test User');
  });

  test.each([
    ['name', '', 'Name is required!'],
    ['name', '   ', 'Name is required!'],
    ['name', 'A', 'Name must be at least 2 characters!'],
    ['name', 'A'.repeat(51), 'Name must be less than 50 Characters!'],
    ['email', '', 'Email is required!'],
    ['email', 'invalid-email', 'Email is invalid!'],
    ['phone', '1234567', 'Invalid phone format (8-15 digits)!'],
    ['phone', '1'.repeat(16), 'Invalid phone format (8-15 digits)!'],
    ['phone', 'abcdefgh', 'Invalid phone format (8-15 digits)!'],
    ['location', 'A'.repeat(101), 'Location must be less than 100 characters!'],
    ['bio', 'A'.repeat(151), 'Bio must be less than 150 Characters!'],
    ['avatar', '', 'Avatar URL is required'],
  ])('rejects invalid %s: %s', async (field, value, message) => {
    await expect(ProfileSchema.validateAt(field, { ...valid, [field]: value }, { abortEarly: false }))
      .rejects.toMatchObject({ errors: expect.arrayContaining([message]) });
  });

  test('accepts the maximum lengths and minimum name/phone lengths', async () => {
    await expect(ProfileSchema.validate({
      ...valid, name: 'A'.repeat(50), phone: '1'.repeat(15),
      location: 'A'.repeat(100), bio: 'A'.repeat(150),
    })).resolves.toBeDefined();
    await expect(ProfileSchema.validate({ ...valid, name: 'AB', phone: '12345678' }))
      .resolves.toBeDefined();
  });
});
