from quart import Blueprint
from services.userService import *

user = Blueprint('user_page', __name__)

@user.route('/login', methods=['POST'])
async def user_login():
    payload = await request.get_data()
    return "NOT IMPLEMENTED"

@user.route('/<int:userId>', methods=['GET'])
async def get_driver_data(userId):
    return "NOT IMPLEMENTED"

@user.route('/driver_data', methods=['POST'])
async def post_driver_data():
    payload = await request.get_data()
    return "NOT IMPLEMENTED"