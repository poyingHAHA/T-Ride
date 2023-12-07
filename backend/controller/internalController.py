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

    passenger_order = order_service.get_passenger_order(passenger_order_id)
    data = {'accepted': accepted,
            'passenger_order': passenger_order}

    await MessageQueue.send(driver_id, utils.to_json(data))

    return 'success'
