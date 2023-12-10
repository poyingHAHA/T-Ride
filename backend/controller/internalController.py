from quart import Blueprint, request, make_response
from services.orderService import *
from utils.messageQueue import MessageQueue
from utils import utils


internal = Blueprint('internal', __name__)

order_service = OrderService()


@internal.route('/notification/invitation/accept', methods=['POST'])
async def notify_accept_invitation():
    query = request.args
    driver_id = int(query['driverId'])
    passenger_order_id = int(query['passengerOrderId'])
    accepted = bool(int(query['accepted']))

    key = f'match-driver{driver_id}'

    passenger_order = order_service.get_passenger_order(passenger_order_id)
    data = {'accepted': accepted,
            'passenger_order': passenger_order}

    await MessageQueue.send(key, utils.to_json(data))

    return 'success'

@internal.route('/notification/invitation/send', methods=['POST'])
async def notify_send_invitation():
    query = request.args
    passenger_id = int(query['passengerId'])
    driver_order_id = int(query['driverOrderId'])

    key = f'match-passenger{passenger_id}'

    driver_order = order_service.get_driver_order(driver_order_id)
    data = {'driver_order': driver_order}

    await MessageQueue.send(key, utils.to_json(data))

    return 'success'

@internal.route('/position/send', methods=['POST'])
async def send_driver_position():
    query = request.args
    passenger_order_id = int(query['passengerOrderId'])
    position = query['position']

    key = f'passengerOrder{passenger_order_id}-driver-position'

    await MessageQueue.send(key, position)

    return 'success'
