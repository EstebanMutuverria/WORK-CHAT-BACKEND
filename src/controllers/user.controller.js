import userService from "../service/user.service.js"

class UserController {
    async updateById(req, res, next) {
        try {
            const { user_id } = req.params
            const { name, github, linkedin, twitter, instagram } = req.body
            const user_updated = await userService.updateById(user_id, name, github, linkedin, twitter, instagram)
            return res.status(200).json({
                status: 200,
                ok: true,
                message: 'Usuario actualizado correctamente',
                data: user_updated
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteById(req, res, next) {
        try {
            const { user_id } = req.params
            const user_deleted = await userService.deleteById(user_id)
            return res.status(200).json({
                status: 200,
                ok: true,
                message: 'Usuario eliminado correctamente',
                data: user_deleted
            })
        } catch (error) {
            next(error)
        }
    }
}

const userController = new UserController()

export default userController