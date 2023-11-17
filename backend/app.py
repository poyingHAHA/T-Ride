from quart import Quart
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

if __name__ == '__main__':
    app.register_blueprint(match, url_prefix='/match')
    app.register_blueprint(order, url_prefix='/order')
    app.register_blueprint(user, url_prefix='/user')
    app.run(host='0.0.0.0', port=5239, debug=True)