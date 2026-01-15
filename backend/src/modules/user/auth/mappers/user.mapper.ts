import { User } from 'src/schemas/user.schema';

export class UserMapper {
    static toDto(user: User): any {
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
        };
    }
}
