import userService from "../service/user.service.js"

class UserController {
    async updateById(req, res, next) {
        try {
            const { user_id } = req.params
            const { name } = req.body
            const user_updated = await userService.updateById(user_id, name)
            return res.status(200).json({
                status: 200,
                message: 'Usuario actualizado correctamente',
                data: user_updated
            })
        } catch (error) {
            next(error)
        }
    }
}

const userController = new UserController()

export default userController