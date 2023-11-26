# TODO: 資料庫回傳中文變成unicode的情況是否可處理
from quart import Quart, send_from_directory
import subprocess
from controller.matchController import match
from controller.orderController import order
from controller.userController import user

app = Quart(__name__)

@app.route('/github-webhook', methods=['POST'])
async def github_webhook():
    """
        自動更新程式碼
        ---
        tags:
        - Match
        produces: application/json,   
    """
    subprocess.run(['git', 'pull'])
    return 'OK'

@app.route('/Swagger/')
@app.route('/Swagger/<path:path>')
async def swagger(path=None):
    folder_path = 'Swagger'
    file_name = 'index.html'

    if path is None:
        response = await send_from_directory(folder_path, file_name)
    else:
        response = await send_from_directory(folder_path, path)

    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response
    

if __name__ == '__main__':
    app.register_blueprint(match, url_prefix='/match')
    app.register_blueprint(order, url_prefix='/order')
    app.register_blueprint(user, url_prefix='/user')
    app.run(host='0.0.0.0', port=5239, debug=True)
