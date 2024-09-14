export const MAX_UPLOAD_SIZE = 4194304;
export const COOKIE_KEY = "AUTH-JWT";
export function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT Secret key is not set");
  }

  const enc: Uint8Array = new TextEncoder().encode(secret);
  return enc;
}

export const ONE_DAY = 86400000;

// export const SECRET = createSecretKey(process.env.JWT_SECRET!, "utf-8");
