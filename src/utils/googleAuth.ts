import {jwtDecode} from 'jwt-decode';

class JWTHelper {
  constructor() {}

  decodeGoogleIdToken(idToken:string) {
    try {
      const decodedToken = jwtDecode(idToken);
      return decodedToken;
    } catch (error) {
      console.error("Error decoding Google ID token:", error);
      return null;
    }
  }

}

export default JWTHelper;