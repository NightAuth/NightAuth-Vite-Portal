// Client-side checks matching NightAuth's customer schemas
// (src/lib/customer/validations.ts). The server validates again; these only
// spare a round trip. Each returns a translation key, or null when valid.

const USERNAME = /^[a-zA-Z0-9_.-]+$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Same rule as src/lib/auth/password-policy.ts.
const STRONG_PASSWORD = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

export const isStrongPassword = (value) => STRONG_PASSWORD.test(value) && value.length <= 128;

export function checkSignIn({ loginType, username = "", password = "", license = "" }) {
  if (loginType === "license") return license.trim() ? null : "valLicenseEmpty";
  if (!username.trim()) return "valUsernameEmpty";
  if (!password) return "valPasswordEmpty";
  return null;
}

export function checkSignUp({ licenseKey, username, email, password }) {
  if (!licenseKey.trim()) return "valLicenseEmpty";
  if (username.trim().length < 3) return "valUsernameMin";
  if (!USERNAME.test(username.trim())) return "valUsernameChars";
  if (email.trim() && !EMAIL.test(email.trim())) return "valEmailInvalid";
  if (!isStrongPassword(password)) return "valPasswordPolicy";
  return null;
}

export const checkEmail = (email) => (EMAIL.test(email.trim()) ? null : "valEmailInvalid");

export function checkReset(newPassword, confirmPassword) {
  if (!isStrongPassword(newPassword)) return "valPasswordPolicy";
  if (newPassword !== confirmPassword) return "passwordsDoNotMatch";
  return null;
}

export const checkCode = (code) => (code.trim().length >= 6 && code.trim().length <= 16 ? null : "valCodeLength");

export function checkAccount({ newUsername, newPassword, avatarUrl }) {
  if (newUsername !== undefined && newUsername !== "") {
    if (newUsername.trim().length < 3) return "valUsernameMin";
    if (!USERNAME.test(newUsername.trim())) return "valUsernameChars";
  }
  if (newPassword && !isStrongPassword(newPassword)) return "valPasswordPolicy";
  if (avatarUrl) {
    try {
      new URL(avatarUrl);
    } catch {
      return "valAvatarInvalid";
    }
  }
  return null;
}
