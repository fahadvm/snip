import { User } from 'src/schemas/user.schema';
import { UserResponseDto } from '../dto/user-response.dto';
import { Types } from 'mongoose';

export class UserMapper {
    static toDto(user: User & { _id: Types.ObjectId }): UserResponseDto {
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
        };
    }
}
