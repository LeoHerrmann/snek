# Snek
Another variant of the classic arcade game featuring an online leaderboard as well as offline functionality

Click [here](https://rahm.pythonanywhere.com/snek/) to try it out.


## Screenshots
<img src="https://user-images.githubusercontent.com/53840228/68999948-49a12380-08c8-11ea-906a-ac69863bad17.png" alt="Start Screen" width="200"/> <img src="https://user-images.githubusercontent.com/53840228/68999798-1eb5d000-08c6-11ea-9bf0-846b35ddc434.png" alt="Game Screen" width="200"/> <img src="https://user-images.githubusercontent.com/53840228/68999949-49a12380-08c8-11ea-97e3-df8b5a7d5935.png" alt="Leaderboard Screen" width="200"/>


## Getting Started
Requirements: Python 3, pip, virtualenv 

To get this project running on your local machine, the following steps need to be performed:

Clone this repository and navigate into the project:
```
git clone https://github.com/Rahmsauce/Snek.git
cd Snek
```

Create a virtual environment and activate it:
```
python3 -m venv env
source env/bin/activate
```

Install Flask:
```
pip install flask
```

Export and run application.py:
```
export FLASK_APP=application.py
export FLASK_ENV=development
flask run
```

Open http://localhost:5000 using a web browser.
