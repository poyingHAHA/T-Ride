from flask import Blueprint

match = Blueprint('match_page', __name__)

# - DELETE /match/driver/invitation
#     ```
#     {
#       token: str
#       driverOrderId: int
#       passengerOrderId: int
#     }
#     ```
#     - 成功刪邀請 200
#         ```
#         {
#           totalOrderCount: int // 總單數
#           abandonCount: int // 棄單數
#         }
#         ```
#     - token 無效 401
#     - 不是自己的駕駛訂單 403
#     - 不存在的訂單 404
#     - 未發邀請、已完成的訂單 409
# - GET /match/driver/invitation/total/{driverOrderId}
#     - 正常回傳
#         200
#         ```
#         {
#           orders: [
#             {
#               passengerOrder: {
#                 乘客訂單，跟 GET /order/passnger/{orderId} 回傳的一樣
#               }
#               time: int // 實際的乘客上車時間
#               accepted: bool
#             }
#           ]
#         }
#         ```
#     - 不存在的訂單 404
#     - 已完成的訂單 409
# - GET /match/passenger/invitation/{passengerOrderId}
#     - 正常回傳
#         ```
#           {
#             orders: [
#               司機訂單，跟 GET /order/driver/{orderId} 回傳的一樣
#             ]
#           }
#         ```
# - POST /match/passenger/invitation/accept
#     ```
#     {
#       token: str
#       driverOrderId: int
#       passengerOrderId: int
#     }
#     ```
#     - 成功接受 200
#     - token 無效 401
#     - 不是自己的乘客訂單 403
#     - 不存在的訂單 404
#     - 未被邀請、已接受、已完成的訂單 409


#     ``` 
#     {
#       token: str
#       driverOrderId: int
#       passengerOrderId: int
#     }
#     ```
#     - 成功發邀請 200
#     - 401
#     - 不是自己的駕駛訂單 403
#     - 不存在的訂單 404
#     - 已發過邀請、已接受、已完成的訂單 409
@match.route('/driver/invitation', methods=['POST'])
def node_topo():
  """
    發送邀請
    ---
    tags:
      - Match
    produces: application/json,
    parameters:
    - name: token
      in: requestBody
      type: string
      required: true
      description: 認證使用
    - name: driverOrderId
      in: requestBody
      type: int
      required: true
      description: driver訂單ID
    - name: PassengerOrderId
      in: requestBody 
      type: int
      required: true
      description: 乘客訂單號
    responses:
      200:
        description: 成功送出邀請
        examples:
          node-list: [{"id":26},{"id":44}]
      401:
        description: token 無效 
      403:
        description: 不是自己的駕駛訂單 
      404:
        description: 不存在的訂單
      409:
        description: 已發過邀請、已接受、已完成的訂單
      
      
  """
  ret = jsonify(ret_list)
  return ret