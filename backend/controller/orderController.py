# TODO: token validation should be in service
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
        return await make_response("Incorrect parameter format", 400)

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

@order.route('/driver/unfinished/<int:userId>', methods=['GET'])
async def get_driver_order_unfinished(userId):
    orders = order_service.get_unfinished_driver_orders(userId)
    if orders is None:
        return await make_response("User not found", 404)

    return utils.to_json([DriverOrderVo(order) for order in orders])


@order.route('/driver/<int:orderId>', methods=['GET'])
async def get_driver_order_details(orderId):
    order_dto = order_service.get_driver_order(orderId)
    if order_dto is None:
        return await make_response("Order not found", 404)

    return utils.to_json(DriverOrderVo(order_dto))


@order.route('/driver/finish', methods=['POST'])
async def post_driver_order_finished():
    body = await request.json
    if not utils.is_keys_in_body(body, [
        "token",
        "orderId"]):
        return await make_response("Incorrect parameter format", 400)

    user_id = user_service.get_user_id(body["token"])
    if user_id is None:
        return await make_response("Invalid token", 401)

    ret = order_service.finish_driver_order(user_id, body["orderId"])

    if ret == "user not found":
        # should not happen, unless user is deleted but token still exists
        return await make_response("Invalid token", 401)
    if ret == "user incorrect":
        return await make_response("Not the driver's own order", 403)
    if ret == "order not found":
        return await make_response("Order not found", 404)
    if ret == "order is finished" or ret == "related passenger order isn't finished":
        return await make_response("Order already completed or passenger order not completed", 409)

    return "Order finished successfully"

@order.route('/passenger', methods=['POST'])
async def post_passenger_order():
    body = await request.json
    if not utils.is_keys_in_body(body, [
        "token",
        "startPoint",
        "startName",
        "endPoint",
        "endName",
        "departureTime1",
        "departureTime2",
        "passengerCount"]):
        return await make_response("Incorrect parameter format", 400)

    user_id = user_service.get_user_id(body["token"])
    if user_id is None:
        return await make_response("Invalid token", 401)

    ret = order_service.create_passenger_order(user_id, CreatePassengerOrderDto(
        body["departureTime1"],
        body["departureTime2"],
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
    if ret == "no spots in database":
        return await make_response("no spots in database", 404)

    return utils.to_json({"orderId": ret})


@order.route('/passenger/<int:orderId>', methods=['DELETE'])
async def delete_passenger_order(orderId):
    if not utils.is_keys_in_query(request, ["token"]):
        return await make_response("Incorrect parameter format", 400)

    user_id = user_service.get_user_id(request.args.get("token"))
    if user_id is None:
        return await make_response("Invalid token", 401)

    ret = order_service.delete_passenger_order(user_id, orderId)

    if ret == "user not found":
        # should not happen, unless user is deleted but token still exists
        return await make_response("Invalid token", 401)
    if ret == "user incorrect":
        return await make_response("Not the passenger's own order", 403)
    if ret == "order not found":
        return await make_response("Order not found", 404)
    if ret == "order is finished":
        return await make_response("Order already completed", 409)

    user = user_service.get_user(user_id)

    return utils.to_json({
        "totalOrderCount": user.total_order_count,
        "abandonCount": user.abandon_order_count})

@order.route('/passenger/<int:orderId>', methods=['GET'])
async def get_passenger_order_details(orderId):
    order = order_service.get_passenger_order(orderId)
    if order is None:
        return await make_response("Order not found", 404)

    return utils.to_json(PassengerOrderVo(order, order_service.get_estimated_arrival_time(
        order.start_point, order.end_point, order.departure_time1)))


@order.route('/passenger/finish', methods=['POST'])
async def post_passenger_order_finished():
    body = await request.json
    if not utils.is_keys_in_body(body, [
        "token",
        "orderId"]):
        return await make_response("Incorrect parameter format", 400)

    user_id = user_service.get_user_id(body["token"])
    if user_id is None:
        return await make_response("Invalid token", 401)

    ret = order_service.finish_passenger_order(user_id, body["orderId"])

    if ret == "user not found":
        # should not happen, unless user is deleted but token still exists
        return await make_response("Invalid token", 401)
    if ret == "user incorrect":
        return await make_response("Not the passenger's own order", 403)
    if ret == "order not found":
        return await make_response("Order not found", 404)
    if ret == "order is finished":
        return await make_response("Order already completed", 409)

    return "Order finished successfully"


@order.route('/passenger/unfinished/<int:userId>', methods=['GET'])
async def get_passenger_order_unfinished(userId):
    orders = order_service.get_unfinished_passenger_orders(userId)
    if orders is None:
        return await make_response("User not found", 404)

    return utils.to_json([PassengerOrderVo(order, order_service.get_estimated_arrival_time(
        order.start_point, order.end_point, order.departure_time1)) for order in orders])


@order.route('/passenger/spot/all', methods=['GET'])
async def get_spots():
    if not utils.is_keys_in_query(request, ["departureTime"]):
        return await make_response("Incorrect parameter format", 400)

    departure_time = int(request.args.get("departureTime"))

    return utils.to_json([SpotWithCountVo(spot)
        for spot in order_service.get_spots_with_passenger(departure_time)])

@order.route('/passenger/spot/<int:spotId>', methods=['GET'])
async def get_passenger_orders_from_spot(spotId):
    if not utils.is_keys_in_query(request, ["departureTime"]):
        return await make_response("Incorrect parameter format", 400)
    departure_time = int(request.args.get("departureTime"))

    ret = order_service.get_spot_passenger_orders(spotId, departure_time)
    if ret == "spot not found":
        return await make_response("Spot not found", 404)

    return utils.to_json([PassengerOrderVo(order, order_service.get_estimated_arrival_time(
        order.start_point, order.end_point, order.departure_time1)) for order in ret])


@order.route('/fee', methods=['GET'])
async def get_order_fee():
    if not utils.is_keys_in_query(request, [
        "startPoint",
        "endPoint",
        "passengerCount", 
        "departureTime"]):
        return await make_response("Incorrect parameter format", 400)
    start_point = request.args.get("startPoint")
    end_point = request.args.get("endPoint")
    passenger_count = request.args.get("passengerCount")
    departure_time = request.args.get("departureTime")
    fee = order_service.get_fee(start_point, end_point, passenger_count, departure_time)

    if fee is None:
        return await make_response("Incorrect parameter format", 400)

    return utils.to_json({"fee": fee})


class DriverOrderVo:
    def __init__(self, driver_order_dto):
        self.orderId = driver_order_dto.order_id
        self.userId = driver_order_dto.user_id
        self.departureTime = driver_order_dto.departure_time
        self.startPoint = driver_order_dto.start_point
        self.startName = driver_order_dto.start_name
        self.endPoint = driver_order_dto.end_point
        self.endName = driver_order_dto.end_name
        self.passengerCount = driver_order_dto.passenger_count


class PassengerOrderVo:
    def __init__(self, passenger_order_dto, arrival_time):
        self.orderId = passenger_order_dto.order_id
        self.userId = passenger_order_dto.user_id
        self.departureTime1 = passenger_order_dto.departure_time1
        self.departureTime2 = passenger_order_dto.departure_time2
        self.passengerCount = passenger_order_dto.passenger_count
        self.startPoint = passenger_order_dto.start_point
        self.startName = passenger_order_dto.start_name
        self.endPoint = passenger_order_dto.end_point
        self.endName = passenger_order_dto.end_name
        self.fee = passenger_order_dto.fee
        self.arrivalTime = arrival_time


class SpotWithCountVo:
    def __init__(self, spot_with_count_dto):
        self.spot_id = spot_with_count_dto.spot_id
        self.point = spot_with_count_dto.point
        self.name = spot_with_count_dto.name
        self.order_count = spot_with_count_dto.order_count
