from quart import Blueprint, request, make_response
from services.userService import *
from utils.json import *


user = Blueprint('user_page', __name__)

userService = UserService()


@user.route('/login', methods=['POST'])
async def user_login():
    payload = await request.get_data()
    return "NOT IMPLEMENTED"


@user.route('/<int:userId>', methods=['GET'])
async def get_driver_data(userId):
    user_dto = userService.get_user(userId)

    if user_dto is None:
        return await make_response("user doesn't exist", 404)
    else:
        return to_json(UserVo(user_dto))


@user.route('/driver_data', methods=['POST'])
async def post_driver_data():
    payload = await request.get_data()
    return "NOT IMPLEMENTED"


class UserVo:
    def __init__(self, user_dto):
        self.user_name = user_dto.user_name
        self.total_order_count = user_dto.total_order_count
        self.abandon_order_count = user_dto.abandon_order_count
        self.driver_data = user_dto.driver_data
