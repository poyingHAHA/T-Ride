from quart import Blueprint, request, make_response
from services.userService import *
from utils import utils


user = Blueprint('user_page', __name__)

user_service = UserService()

@user.route('/register', methods=['POST'])
async def register():
    payload = await request.get_data()
    return "NOT IMPLEMENTED"


@user.route('/login', methods=['POST'])
async def user_login():
    body = await request.json
    if not utils.is_keys_in_body(body, [
        "username",
        "password"]):
        return await make_response("Unauthorized", 401)
    
    login_dto = user_service.login(body["username"],body["password"])

    if login_dto is None:
        return await make_response("Unauthorized", 401)
    else:
        return utils.to_json(LoginVo(login_dto))


@user.route('/<int:userId>', methods=['GET'])
async def get_driver_data(userId):
    user_dto = user_service.get_user(userId)

    if user_dto is None:
        return await make_response("User not found", 404)
    else:
        return utils.to_json(UserVo(user_dto))


@user.route('/driver_data', methods=['POST'])
async def post_driver_data():
    body = await request.json
    if not utils.is_keys_in_body(body, [
        "token",
        "vehicle_name",
        "vehicle_plate",
        "passenger_count"]):
        return await make_response("Incorrect parameter format", 400)
    
    user_id = user_service.get_user_id(body["token"])
    if user_id is None:
        return await make_response("Invalid token", 401)
    
    driver_dto = user_service.set_driver_data(user_id, body["vehicle_name"], body["vehicle_plate"], body["passenger_count"])

    if driver_dto is None:
        return await make_response("Incorrect parameter format", 400)
    else:
        return utils.to_json(DriverDataVo(driver_dto))

class LoginVo:
    def __init__(self, login_dto):
        self.token = login_dto.token
        self.userId = login_dto.userId

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
