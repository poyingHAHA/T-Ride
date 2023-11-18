from quart import Blueprint, request, make_response
from services.orderService import *
from services.userService import *
from utils import utils


order = Blueprint('order_page', __name__)

order_service = OrderService()
user_service = UserService()


@order.route('/driver', methods=['POST'])
async def post_driver_order():
    body = await request.json
    if not utils.is_keys_in_body(body, [
        "token",
        "startPoint",
        "startName",
        "endPoint",
        "endName",
        "departureTime",
        "passengerCount"]):
        return await make_reponse("Incorrect parameter format", 400)

    user_id = user_service.get_user_id(body["token"])
    if user_id is None:
        return await make_response("Invalid token", 401)

    ret = order_service.create_driver_order(user_id, CreateDriverOrderDto(
        body["departureTime"],
        body["startPoint"],
        body["startName"],
        body["endPoint"],
        body["endName"],
        body["passengerCount"]))

    if ret == "user not found":
        # should not happen, unless user is deleted but token still exists
        return await make_response("Invalid token", 401)
    if ret == "invalid order":
        return await make_response("Incorrect parameter format", 400)

    return utils.to_json({"orderId": ret})


@order.route('/driver', methods=['DELETE'])
async def delete_driver_order():
    return "not implemented"


@order.route('/driver/unfinished/<int:userId>', methods=['GET'])
async def get_driver_order_unfinished(userId):
    orders = order_service.get_unfinished_driver_orders(userId)

    if orders is None:
        return await make_response("User not found", 404)
    return utils.to_json([DriverOrderVo(order) for order in orders])


@order.route('/driver/<int:orderId>', methods=['GET'])
async def get_driver_order_details():
    return "not implemented"


@order.route('/driver/finish', methods=['POST'])
async def post_driver_order_finished():
    return "not implemented"


@order.route('/passenger', methods=['POST'])
async def post_passenger_order():
    return "not implemented"


@order.route('/passenger', methods=['DELETE'])
async def delete_passenger_order():
    return "not implemented"


@order.route('/passenger/<int:orderId>', methods=['GET'])
async def get_passenger_order_details():
    return "not implemented"


@order.route('/passenger/finish', methods=['POST'])
async def post_passenger_order_finished():
    return "not implemented"


@order.route('/passenger/unfinished/<int:userId>', methods=['GET'])
async def get_passenger_order_unfinished(userId):
    orders = order_service.get_unfinished_passenger_orders(userId)

    if orders is None:
        return await make_response("User not found", 404)
    return utils.to_json([PassengerOrderVo(order) for order in orders])


@order.route('/passenger/spot/all/<int:departureTime>', methods=['GET'])
async def get_spots(departureTime):
    return "not implemented"


@order.route('/passenger/spot/<int:spotId>', methods=['GET'])
async def get_passenger_orders_from_spot(spotId):
    return "not implemented"


@order.route('/fee/<startPoint>/<endPoint>/<int:passengerCount>', methods=['GET'])
async def get_order_fee(startPoint, endPoint, passengerCount):
    return "not implemented"


class DriverOrderVo:
    def __init__(self, driver_order_dto):
        self.order_id = driver_order_dto.order_id
        self.departure_time = driver_order_dto.departure_time
        self.start_point = driver_order_dto.start_point
        self.start_name = driver_order_dto.start_name
        self.end_point = driver_order_dto.end_point
        self.end_name = driver_order_dto.end_name
        self.passenger_count = driver_order_dto.passenger_count


class PassengerOrderVo:
    def __init__(self, passenger_order_dto):
        self.order_id = passenger_order_dto.order_id
        self.departure_time1 = passenger_order_dto.departure_time1
        self.departure_time2 = passenger_order_dto.departure_time2
        self.passenger_count = passenger_order_dto.passenger_count
        self.start_point = passenger_order_dto.start_point
        self.start_name = passenger_order_dto.start_name
        self.end_point = passenger_order_dto.end_point
        self.end_name = passenger_order_dto.end_name
        self.fee = passenger_order_dto.fee
