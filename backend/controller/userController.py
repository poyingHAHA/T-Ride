from quart import Blueprint, request, make_response
from services.userService import *
import utils.utils


user = Blueprint('user_page', __name__)

userService = UserService()

@user.route('/register', methods=['POST'])
async def register():
    payload = await request.get_data()
    return "NOT IMPLEMENTED"


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
        return utils.to_json(UserVo(user_dto))


@user.route('/driver_data', methods=['POST'])
async def post_driver_data():
    payload = await request.get_data()
    return "NOT IMPLEMENTED"


class UserVo:
    def __init__(self, user_dto):
        self.user_name = user_dto.user_name
        self.total_order_count = user_dto.total_order_count
        self.abandon_order_count = user_dto.abandon_order_count
        self.driver_data = DriverDataVo(user_dto.driver_data) if user_dto.driver_data is not None else None


class DriverDataVo:
    def __init__(self, driver_data_dto):
        self.vehicle_name = driver_data_dto.vehicle_name
        self.vehicle_plate = driver_data_dto.vehicle_plate
        self.passenger_count = driver_data_dto.passenger_count
