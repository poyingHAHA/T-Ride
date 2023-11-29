# TODO: token validation should be in service
from quart import Blueprint, request, make_response
from services.orderService import *
from services.userService import *
from utils import utils
from controller.models import *


order = Blueprint('order_page', __name__)

order_service = OrderService()
user_service = UserService()


@order.route('/driver', methods=['POST'])
async def post_driver_order():
    body = await request.json
    if not utils.is_keys_in_dict(body, [
        "token",
        "startPoint",
        "startName",
        "endPoint",
        "endName",
        "departureTime",
        "passengerCount"]):
        return await make_response("Incorrect parameter format", 400)
    if not utils.is_keys_in_dict(body["startPoint"], [
        "lat",
        "lng"]):
        return await make_response("Incorrect parameter format", 400)
    if not utils.is_keys_in_dict(body["endPoint"], [
        "lat",
        "lng"]):
        return await make_response("Incorrect parameter format", 400)


    user_id = user_service.get_user_id(body["token"])
    if user_id is None:
        return await make_response("Invalid token", 401)

    ret = order_service.create_driver_order(user_id, CreateDriverOrderDto(
        body["departureTime"],
        f'{body["startPoint"]["lat"]},{body["startPoint"]["lng"]}',
        body["startName"],
        f'{body["endPoint"]["lat"]},{body["endPoint"]["lng"]}',
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
    if not utils.is_keys_in_dict(body, [
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
    if not utils.is_keys_in_dict(body, [
        "token",
        "startPoint",
        "startName",
        "endPoint",
        "endName",
        "departureTime1",
        "departureTime2",
        "passengerCount"]):
        return await make_response("Incorrect parameter format", 400)
    if not utils.is_keys_in_dict(body["startPoint"], [
        "lat",
        "lng"]):
        return await make_response("Incorrect parameter format", 400)
    if not utils.is_keys_in_dict(body["endPoint"], [
        "lat",
        "lng"]):
        return await make_response("Incorrect parameter format", 400)

    user_id = user_service.get_user_id(body["token"])
    if user_id is None:
        return await make_response("Invalid token", 401)

    ret = order_service.create_passenger_order(user_id, CreatePassengerOrderDto(
        body["departureTime1"],
        body["departureTime2"],
        f'{body["startPoint"]["lat"]},{body["startPoint"]["lng"]}',
        body["startName"],
        f'{body["endPoint"]["lat"]},{body["endPoint"]["lng"]}',
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
    query = request.args
    if not utils.is_keys_in_dict(query, ["token"]):
        return await make_response("Incorrect parameter format", 400)

    user_id = user_service.get_user_id(query["token"])
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

    return utils.to_json(PassengerOrderVo(order))


@order.route('/passenger/finish', methods=['POST'])
async def post_passenger_order_finished():
    body = await request.json
    if not utils.is_keys_in_dict(body, [
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

    return utils.to_json([PassengerOrderVo(order) for order in orders])


@order.route('/passenger/spot/all', methods=['GET'])
async def get_spots():
    query = request.args
    if not utils.is_keys_in_dict(query, ["departureTime"]):
        return await make_response("Incorrect parameter format", 400)

    departure_time = int(query["departureTime"])

    with_passenger = True
    if 'withPassenger' in query:
        with_passenger = bool(int(query['withPassenger']))

    return utils.to_json([SpotWithCountVo(spot)
        for spot in order_service.get_all_spots(departure_time, with_passenger)])

@order.route('/passenger/spot/<int:spotId>', methods=['GET'])
async def get_passenger_orders_from_spot(spotId):
    query = request.args
    if not utils.is_keys_in_dict(query, ["departureTime"]):
        return await make_response("Incorrect parameter format", 400)
    departure_time = int(query["departureTime"])

    ret = order_service.get_spot_passenger_orders(spotId, departure_time)
    if ret == "spot not found":
        return await make_response("Spot not found", 404)

    return utils.to_json([PassengerOrderVo(order) for order in ret])


@order.route('/fee', methods=['GET'])
async def get_order_fee():
    query = request.args
    if not utils.is_keys_in_dict(query, [
        "startLat",
        "startLng",
        "endLat",
        "endLng",
        "passengerCount", 
        "departureTime"]):
        return await make_response("Incorrect parameter format", 400)
    start_point = f'{query["startLat"]},{query["startLng"]}'
    end_point = f'{query["endLat"]},{query["endLng"]}'
    passenger_count = query["passengerCount"]
    departure_time = query["departureTime"]

    fee = order_service.get_fee(start_point, end_point, passenger_count, departure_time)

    if fee is None:
        return await make_response("Incorrect parameter format", 400)

    return utils.to_json({"fee": fee})
