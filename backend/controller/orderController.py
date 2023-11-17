from quart import Blueprint
from services.matchService import *

order = Blueprint('order_page', __name__)

@order.route('/driver', methods=['POST'])
async def post_driver_order():
  """
    司機發邀請給乘客
    ---
    parameters:
    - name: token
      in: requestBody
      type: string
      required: true
      description: 認證司機身分所使用
    - name: startName
      in: requestBody 
      type: string
      required: true
      description: 上車地點名稱
    - name: startPoint
      in: requestBody
      type: string
      required: true
      description: 上車點的經緯度座標(format:"經度,緯度")
    - name: endName
      in: requestBody 
      type: string
      required: true
      description: 下車地點名稱
    - name: endPoint
      in: requestBody
      type: string
      required: true
      description: 下車點的經緯度座標(format:"經度,緯度")
    - name: departureTi,e
      in: requestBody
      type: integer
      required: true
      description: 下單時間(unix time seconds)
    - name: passengerCount
      in: requestBody
      type: string
      required: true
      description: 司機可載的人數
    definitions:
      BookOrderResponse:
        type: object
        properties:
          orderId:
            type: integer
    responses:
      200:
        description: 成功刪除司機給乘客的邀請
        schema:
          $ref: '#/definitions/BookOrderResponse' 
      401:
        description: token 無效 
      403:
        description: 不是自己的駕駛訂單 
      404:
        description: 不存在的訂單
      409:
        description: 已發過邀請、已接受、已完成的訂單
  """
  return "not implemented"
