// import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
// import { ZoomService } from './zoom.service';

// /**
//  * GET /api/zoom/signature?meetingNumber=123…&role=0|1
//  * Returns: { signature: string }
//  */
// @Controller('/api/zoom')
// export class ZoomController {
//   constructor(private readonly zoom: ZoomService) {}

//   @Get('signature')
//   sign(
//     @Query('meetingNumber') meetingNumber: string,
//     @Query('role')          role: '0' | '1',
//   ) {
//     if (!meetingNumber || !role) {
//       throw new BadRequestException('meetingNumber & role are required');
//     }

//     return {
//       signature: this.zoom.generateSignature(meetingNumber, +role as 0 | 1),
//       sdkKey:    process.env.ZOOM_SDK_KEY,   // the Web-SDK also needs this
//     };
//   }
// }




import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ZoomService } from './zoom.service';

/**
 * GET /api/zoom/signature?meetingNumber=123…&role=0|1
 * Returns: { signature: string, sdkKey: string }
 */
@Controller('/api/zoom')
export class ZoomController {
  constructor(private readonly zoom: ZoomService) {}

  @Get('signature')
  sign(
    @Query('meetingNumber') meetingNumber: string,
    @Query('role')          role: '0' | '1',
  ) {
    if (!meetingNumber || !role) {
      throw new BadRequestException('meetingNumber & role are required');
    }

    return {
      signature: this.zoom.generateSignature(meetingNumber, +role as 0 | 1),
      sdkKey:    process.env.ZOOM_CLIENT_ID, // Use ZOOM_CLIENT_ID here
    };
  }
}