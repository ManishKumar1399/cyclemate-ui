import {jwtDecode} from 'jwt-decode';

export function getUserFromToken(token) {
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    // assuming you added userId in the JWT like .claim("userId", user.getId())
    return {
      userId: decoded.userId,
      email: decoded.sub, // if you're using setSubject(email)
      exp: decoded.exp,
    };
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}
