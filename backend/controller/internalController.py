from quart import Blueprint, request, make_response


internal = Blueprint('internal', __name__)

@internal.route('/notification/invitation/accept/<int:driverOrderId>/<int:passengerOrderId>', methods=['POST'])
async def notify_accept_invitation(driverOrderId, passengerOrderId):
    # TODO
    pass
