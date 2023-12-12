from quart import Blueprint, request, make_response, websocket
from services.matchService import *
from services.userService import *
from services.orderService import *
from services.notificationService import *
from utils import utils
from utils.messageQueue import MessageQueue
from utils.config import ConfigUtil
from controller.models import *
import asyncio


match = Blueprint('match_page', __name__)

match_service = MatchService()
user_service = UserService()
order_service = OrderService()
notification_service = NotificationService()


@match.route('/driver/invitation', methods=['POST'])
async def match_driver_invitation():
    body = await request.json
    if not utils.is_keys_in_dict(body, [
        "token",
        "driverOrderId",
        "passengerOrderId"]):
        return await make_response("Incorrect parameter format", 400)

    ret = await match_service.send_invitation(
        body["token"],
        body["driverOrderId"],
        body["passengerOrderId"])

    if ret == "Invalid token":
        return await make_response("Invalid token", 401)
    if ret == "user not found":
        return await make_response("Invalid token", 401)
    if ret == "user incorrect":
        return await make_response("Not the driver's own order", 403)
    if ret == "driver order not found" or ret == "passenger order not found":
        return await make_response("Order not found", 404)
    if ret == "driver order is finished" or\
        ret == "passenger order is finished" or\
        ret == "already matched" or\
        ret == "already invited":
        return await make_response("Invitation already sent, accepted, or order completed", 409)

    return await make_response("Invitation sent successfully", 200)


@match.route('/driver/invitation/<int:driverOrderId>/<int:passengerOrderId>', methods=['DELETE'])
async def delete_driver_invitation(driverOrderId, passengerOrderId):
    query = request.args
    if not utils.is_keys_in_dict(query, ["token"]):
        return await make_response("Incorrect parameter format", 400)

    ret = match_service.delete_driver_invitation(query["token"], driverOrderId, passengerOrderId)
    if ret == "Invalid token":
        return await make_response("Invalid token",401)
    if ret == "Not the driver's own order":
        return await make_response("Not the driver's own order",403)
    if ret == "Order not found":
        return await make_response("Order not found",404)
    if ret == "Invitation not sent or order completed":
        return await make_response("Invitation not sent or order completed",409)
    else:
        return utils.to_json({
        "totalOrderCount": ret["total_order_count"],
        "abandonCount": ret["abandon_order_count"]})
    

@match.route('/driver/invitation/total/<int:driverOrderId>', methods=['GET'])
async def get_driver_total_invitations(driverOrderId):
    ret = match_service.get_driver_invitations(driverOrderId)

    if ret == 'order not found':
        return await make_response('Order not found', 404)

    return utils.to_json({'invitations': [InvitationVo(invitation) for invitation in ret]})


@match.route('/passenger/invitation/total/<int:passengerOrderId>', methods=['GET'])
async def get_passenger_total_invitations(passengerOrderId):
    ret = match_service.get_passenger_invitation_orders(passengerOrderId)

    if ret == 'order not found':
        return await make_response('Order not found', 404)

    return utils.to_json({'driverOrders': [DriverOrderVo(order) for order in ret]})


@match.route('/passenger/accepted/<int:passengerOrderId>', methods=['GET'])
async def get_passenger_accepted(passengerOrderId):
    ret = match_service.get_passenger_accepted_order(passengerOrderId)

    if ret == 'order not found':
        return await make_response('Order not found', 404)

    return utils.to_json({"driverOrder": ret})


@match.route('/passenger/invitation/accept', methods=['POST'])
async def accept_invitation():
    body = await request.json
    if not utils.is_keys_in_dict(body, [
        "token",
        "driverOrderId",
        "passengerOrderId"]):
        return await make_response("Incorrect parameter format", 400)

    ret = await match_service.accept_invitation(
        body['token'],
        body['driverOrderId'],
        body['passengerOrderId'])

    if ret == "invalid token":
        return await make_response("Invalid token", 401)
    if ret == "user not found":
        return await make_response("Invalid token", 401)
    if ret == "user incorrect":
        return await make_response("Not the passenger's own order", 403)
    if ret == "driver order not found" or ret == "passenger order not found":
        return await make_response("Order not found", 404)
    if ret == "driver order is finished" or\
        ret == "passenger order is finished" or\
        ret == "already matched" or\
        ret == "not invited":
        return await make_response("Invitation not received or order already accepted/completed", 409)

    return await make_response("Successfully accepted invitation", 200)


@match.websocket('/invitation/accept/<int:driverId>')
async def accept_invitation_websocket(driverId):
    await websocket.accept()

    driverId = int(driverId)
    key = f'match-driver{driverId}'

    ip = ConfigUtil.get('server').get('ip')
    port = ConfigUtil.get('server').get('port')
    ret = notification_service.register_host_port(driverId, f'{ip}:{port}')
    if ret != None:
        raise Exception(f'websocket: {ret}')

    MessageQueue.register(key)
    try:
        while True:
            await websocket.send(await MessageQueue.receive(key))
    except asyncio.CancelledError:
        MessageQueue.delete(key)

    print(f'accept invitation websocket with {driverId} is closed')


@match.websocket('/invitation/send/<int:passengerId>')
async def send_invitation_websocket(passengerId):
    await websocket.accept()

    passengerId = int(passengerId)
    key = f'match-passenger{passengerId}'

    ip = ConfigUtil.get('server').get('ip')
    port = ConfigUtil.get('server').get('port')
    ret = notification_service.register_host_port(passengerId, f'{ip}:{port}')
    if ret != None:
        raise Exception(f'websocket: {ret}')

    MessageQueue.register(key)
    try:
        while True:
            await websocket.send(await MessageQueue.receive(key))
    except asyncio.CancelledError:
        MessageQueue.delete(key)

    print(f'send invitation websocket with {passengerId} is closed')

@match.websocket('/position/driver/get/<int:passengerOrderId>')
async def get_driver_position_websocket(passengerOrderId):
    await websocket.accept()

    passengerOrderId = int(passengerOrderId)

    key = f'passengerOrder{passengerOrderId}-driver-position'

    passenger_order = order_service.get_passenger_order(passengerOrderId)
    if passenger_order is None:
        raise Exception(f'get driver position websocket: order not found')

    ip = ConfigUtil.get('server').get('ip')
    port = ConfigUtil.get('server').get('port')
    ret = notification_service.register_host_port(passenger_order.user_id, f'{ip}:{port}')
    if ret != None:
        raise Exception(f'websocket: {ret}')

    MessageQueue.register(key)
    try:
        while True:
            await websocket.send(await MessageQueue.receive(key))
    except asyncio.CancelledError:
        MessageQueue.delete(key)

    print(f'get driver position of passenger order{passengerOrderId} websocket is closed')

@match.websocket('/position/driver/send/<int:driverOrderId>')
async def send_driver_position_websocket(driverOrderId):
    await websocket.accept()

    driverOrderId = int(driverOrderId)

    try:
        while True:
            position = await websocket.receive()
            await notification_service.send_driver_position(driverOrderId, position)
    except asyncio.CancelledError:
        pass

    print(f'send driver position of driver order {driverOrderId} websocket is closed')
