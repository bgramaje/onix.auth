import jwt, { JwtPayload } from 'jsonwebtoken';

export const verifyToken = async (token: string, key: string): Promise<string | JwtPayload> => {
  if (!token) return {};
  return new Promise((resolve, reject) => {
    jwt.verify(token, key, (err, decoded) => (err || !decoded ? reject() : resolve(decoded)));
  },
  );
};
