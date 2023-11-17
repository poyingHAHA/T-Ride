from quart import Blueprint, request
from services.matchService import *

order = Blueprint('order_page', __name__)

@order.route('/driver', methods=['POST'])
async def post_driver_order():
  return "not implemented"

@order.route('/driver', methods=['DELETE'])
async def delete_driver_order():
  return "not implemented"

@order.route('/driver/unfinished/<int:userId>', methods=['GET'])
async def get_driver_order_unfinished(userId):
  return "not implemented"

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
async def delete_driver_order():
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

@order.route('/fee/<str:startPoint>/<str:endPoint>/<int:passengerCount>', methods=['GET'])
async def get_order_fee(startPoint, endPoint, passengerCount):
  return "not implemented"