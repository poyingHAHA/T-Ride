# TODO: token validation should be in service
from quart import Blueprint, request, make_response
from services.userService import *
from utils import utils


user = Blueprint('user_page', __name__)

user_service = UserService()

@user.route('/register', methods=['POST'])
async def register():
    body = await request.json
    if not utils.is_keys_in_dict(body, [
        "username",
        "password"]):
        return await make_response("Incorrect parameter format", 400)
    
    ret = user_service.register(body["username"],body["password"])

    if ret == "user exist":
        return await make_response("user exist", 401)
    else:
        return await make_response("註冊成功", 200)


@user.route('/login', methods=['POST'])
async def user_login():
    body = await request.json
    if not utils.is_keys_in_dict(body, [
        "username",
        "password"]):
        return await make_response("Invalid parameter format", 400)
    
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
    if not utils.is_keys_in_dict(body, [
        "token",
        "vehicleName",
        "vehiclePlate",
        "passengerCount"]):
        return await make_response("Incorrect parameter format", 400)
    
    user_id = user_service.get_user_id(body["token"])
    if user_id is None:
        return await make_response("無效token", 401)
    
    ret = user_service.set_driver_data(user_id, body["vehicleName"], body["vehiclePlate"], body["passengerCount"])

    if ret == "Invalid passenger count":
        return await make_response("乘客數為無效參數", 404)
    if ret == "data already exist":
        return await make_response("資料已上傳過", 409)
    else:
        return await make_response("註冊成功", 200)


class LoginVo:
    def __init__(self, login_dto):
        self.token = login_dto.token
        self.userId = login_dto.user_id


class UserVo:
    def __init__(self, user_dto):
        self.userName = user_dto.user_name
        self.totalOrderCount = user_dto.total_order_count
        self.abandonOrderCount = user_dto.abandon_order_count
        self.driverData = DriverDataVo(user_dto.driver_data) if user_dto.driver_data is not None else None


class DriverDataVo:
    def __init__(self, driver_data_dto):
        self.vehicleName = driver_data_dto.vehicle_name
        self.vehiclePlate = driver_data_dto.vehicle_plate
        self.passengerCount = driver_data_dto.passenger_count
