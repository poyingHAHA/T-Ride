from services.matchService import *
from quart import Blueprint, request, jsonify  

match = Blueprint('match_page', __name__)


@match.route('/driver/invitation', methods=['POST'])
async def match_driver_invitation():
    data = await request.get_json()
    token = data.get('token')
    driver_order_id = data.get('driverOrderId')
    passenger_order_id = data.get('passengerOrderId')

    # TODO: 實現邏輯，處理發送司機邀請的情況


    return jsonify({'message': 'NOT implemented'}), 200

@match.route('/driver/invitation/<int:driverOrderId>/<int:passengerOrderId>', methods=['DELETE'])
async def delete_driver_invitation(driverOrderId, passengerOrderId):
    token = request.args.get('token')

    # TODO: 實現邏輯，處理取消司機邀請的情況

    return jsonify({'message': 'NOT implemented'}), 200

@match.route('/driver/invitation/total/<int:driverOrderId>', methods=['GET'])
async def get_total_invitations(driverOrderId):
    # TODO: 實現邏輯，獲取司機訂單的總邀請數

    return jsonify({'message': 'NOT implemented'}), 200

@match.route('/passenger/invitation/<int:passengerOrderId>', methods=['GET'])
async def get_driver_orders_invited(passengerOrderId):
    # TODO: 實現邏輯，獲取乘客訂單邀請的司機訂單詳細信息

    return jsonify({'message': 'NOT implemented'}), 200

@match.route('/passenger/invitation/accept', methods=['POST'])
async def accept_invitation():
    data = await request.get_json()
    # TODO: 實現邏輯，處理接受邀請的情況

    return jsonify({'message': 'NOT implemented'}), 200