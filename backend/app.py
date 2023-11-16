from flasgger import Swagger
from flask import *
from controller.matchController import match

app = Flask(__name__)
app.config['SWAGGER'] = {
        "title": "T-RIDE",
        "description": "T-RIDE API Backend",
        "version": "1.0.2",
        "termsOfService": "",
        "hide_top_bar": True
    }
#CORS(app)
Swagger(app)

@app.route('/github-webhook', methods=['POST'])
def github_webhook():
    subprocess.run(['git', 'pull'])
    return 'OK'

if __name__ == '__main__':
    app.register_blueprint(match, url_prefix='/match')
    app.run(host='0.0.0.0', port=5239, debug=True)