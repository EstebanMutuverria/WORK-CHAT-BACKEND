import ServerError from "../helper/serverError.helper.js"
import userRepository from "../repository/user.repository.js"

class UserService {
    async updateById(id, name) {
        if (!name) {
            throw new ServerError('El nombre es requerido', 400)
        }
        const user_updated = await userRepository.updateById(id, name)
        return user_updated
    }
}

const userService = new UserService()

export default userService