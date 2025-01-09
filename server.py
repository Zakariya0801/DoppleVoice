import os
from flask import Flask, render_template, request, flash, redirect, send_from_directory, url_for
from functionality import create_audio
from waitress import serve
from werkzeug.utils import secure_filename
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive

UPLOAD_FOLDER = f'{os.getcwd()}/resources'
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'ogg'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
@app.route('/index')
def index():
    return render_template("home.html")

@app.route('/mainPage')
def mainPage():
    return render_template("main.html")

@app.route('/FileReady')
def ready():
    return render_template("ready.html")

@app.route('/recordAudio')
def record_audio():
    return render_template('index.html')

@app.route('/download')
def download_file():
    path = "path/to/your/local/file.txt"  # Update this with the correct file path
    return send_from_directory("static/audio","result.wav", as_attachment=True)

@app.route("/results")
def give_result():
    return render_template("result.html")

@app.route('/audioresult', methods=['POST'])
def get_audio():
    if 'audio-file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['audio-file']
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        # return redirect(url_for('download_file', name=filename))
        text = request.form.get("input-text")    
        # Pass the form data to the loading page
        # return render_template('loading.html', filename=filename, text=text)
        file_loc = create_audio(filename,text)
        # gauth = GoogleAuth()
        # gauth.LocalWebserverAuth()  # This will open a browser to authenticate

        # # Step 2: Create Google Drive instance
        # drive = GoogleDrive(gauth)

        # # Step 3: Upload a file
        # gdrive_file = drive.CreateFile({'title': 'result.wav'})
        # gdrive_file.SetContentFile(file_loc)
        # gdrive_file.Upload()

        # print('File uploaded successfully!')

        return redirect(url_for('ready'))

if __name__ == "__main__":
    serve(app,host="0.0.0.0", port=3000)