from quart import Blueprint, request
from services.orderService import *
from utils.json import *


order = Blueprint('order_page', __name__)

orderService = OrderService()


@order.route('/driver', methods=['POST'])
async def post_driver_order():
    return "not implemented"


@order.route('/driver', methods=['DELETE'])
async def delete_driver_order():
    return "not implemented"


@order.route('/driver/unfinished/<int:userId>', methods=['GET'])
async def get_driver_order_unfinished(userId):
    orders = orderService.get_unfinished_driver_orders(userId)

    if orders is None:
        return await make_response("user doesn't exist", 404)
    return to_json([DriverOrderVo(order) for order in orders])


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
    return "not implemented"


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
