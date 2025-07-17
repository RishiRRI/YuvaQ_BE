// import { Injectable } from '@nestjs/common';
// import * as crypto from 'crypto';

// @Injectable()
// export class ZoomService {
//   private readonly SDK_KEY = process.env.ZOOM_SDK_KEY!;
//   private readonly SDK_SECRET = process.env.ZOOM_SDK_SECRET!;

//   /**
//    * Create a signed JWT (“signature”) for the Web SDK.
//    * @param meetingNumber  the 10–11-digit ID
//    * @param role           0 = attendee, 1 = host
//    */
//   generateSignature(meetingNumber: string | number, role: 0 | 1) {
//     const ts   = Date.now() - 30_000;      // Zoom recommends a small skew
//     const msg  = Buffer.from(
//       `${this.SDK_KEY}${meetingNumber}${ts}${role}`,
//     ).toString('base64');

//     const hash = crypto
//       .createHmac('sha256', this.SDK_SECRET)
//       .update(msg)
//       .digest('base64');

//     const rawSig = `${this.SDK_KEY}.${meetingNumber}.${ts}.${role}.${hash}`;
//     return Buffer.from(rawSig).toString('base64');
//   }
// }




import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'; // Import jsonwebtoken

@Injectable()
export class ZoomService {
  // Use CLIENT_ID and CLIENT_SECRET from environment variables
  private readonly ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID!;
  private readonly ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET!;

  /**
   * Create a signed JWT (“signature”) for the Web SDK.
   * @param meetingNumber the 10–11-digit ID
   * @param role          0 = attendee, 1 = host
   */
  generateSignature(meetingNumber: string | number, role: 0 | 1): string {
    const iat = Math.floor(Date.now() / 1000); // Issued at time in seconds
    const exp = iat + 60 * 60 * 2; // Expiration time (2 hours from now)

    const payload = {
      sdkKey: this.ZOOM_CLIENT_ID, // Use CLIENT_ID as sdkKey in the payload
      mn: meetingNumber,
      role: role,
      iat: iat,
      exp: exp,
      appKey: this.ZOOM_CLIENT_ID, // Also include appKey as CLIENT_ID for some SDK versions/integrations
      tokenExp: exp, // Also include tokenExp
    };

    // Sign the JWT with your CLIENT_SECRET
    // The algorithm for Zoom Meeting SDK JWTs is typically HS256
    const token = jwt.sign(payload, this.ZOOM_CLIENT_SECRET, { algorithm: 'HS256' });

    return token;
  }
}