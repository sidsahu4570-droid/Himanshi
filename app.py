import os
from flask import Flask, render_template

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"Starting A Letter for Himanshi server on http://localhost:{port}")
    try:
        app.run(host='0.0.0.0', port=port, debug=True)
    except OSError:
        port = 5002
        print(f"Port 5001 occupied, switching to http://localhost:{port}")
        app.run(host='0.0.0.0', port=port, debug=True)

