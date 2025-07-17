import { IsMongoId, IsNotEmpty, Length } from "class-validator";

export class UpdateFcmTokenDto {
    @IsNotEmpty()
    @IsMongoId()
    uid: string;

    @IsNotEmpty()
    fcmToken: string;
}
