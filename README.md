**Changes Alert:**

Old repo frontend: `https://bitbucket.org/pythonconfused/cargobids_frontend/src/master/`

Old repo backend: `https://bitbucket.org/pythonconfused/cargobids_backend/src/master/`

We have merged two repo in one and running both backend and frontend together. **we didn't change any backend and frontend label business logic** for more details or business logic, please check old repo if you have time.

# Getting Started

_to run in development, local server, and production modes instructions are given bellow_

#### Please satisfy following stacks first to run it smoothly

> We are using Postgresql database in both development and production mode, so before you go, please make sure you have ready postgresql database

> Also make sure you have python3.6+ installed and python virtualenv module ready or you have activated your virtual enviroment

> For frontend, make sure you have nodejs -v 9 or its above any of the version (LTS)

# Setup and run in local Machine/Server

clone repo: `git clone https://MySecondLanguage@bitbucket.org/pythonconfused/cargobids_official.git`

`cd cargobids_official`

## Backend Setup

Install backend dependency by `pipenv` globally or you can install backend dependency with `pip3`

to install it by pip3, please run `pip3 install -r cargobids/requirements.txt`

before run backend server, place an `.env` file in `cargobids` directory where your manage.py is located and update `.env` fie for backend.
for backend `.env`, we have used python-decouple (file not included in this repo for security purposes)
for frontend '.env' files we used library `https://github.com/theskumar/python-dotenv`

_( Sample .env file for backend can be added here in future for a better reference )_

**For mail or other credentials or 2FA code, please ask Mr. `Luca`**

## Frontend Setup

_There is two different react app in forntend, one is `admin` and another is `frontuser`, hope you already noticed these_

Go to `admin` or `frontuser` directory and place an `.env` file in both react app directory and update `.env` file following resepected app requirements.

> Example `env` file is given in the end of this documentation.

### Install dependency

`npm install` or `yarn` run in both react app

and build it `npm run build` for both react app

### Run the server

As we are using react and django but our all static files is being served following django style including react build file.

so run `python manage.py migrate` and run the server `python manage.py runserver`
(before migrate, pleae create migrations file by `python manage.py makemigrations`
for now as this is still under construction) and we will keep track of each migrations later

and hit the url: `http://127.0.0.1:8000/`

### Create Admin user

Before creating any user, run the following fixtures.

`python manage.py loaddata groups.json`
(this will add user groups/roles into database)

`python manage.py loaddata plans.json`
(not related to user creation but this will add plan types into database )

To get admin user account, run below fixture
`python manage.py loaddata users.json`

Now access admin with following credentials

`email: admin@gmail.com`

`password: admin123`

Currently there is no direct way to create more super users but you need to do some manual steps from the database manager like pgadmin i.e
After running command createsuperuser

Go to pgadmin and assign group Admin to new created user

Also set is_active = 1 in the users table for that new created user

We will look single command for creating more admin users in future

## During Development

> keep running your django server

and the run `npm start` in the react app that you are working on.

hit the url `http://127.0.0.1:8000/` of django port, your any frontend label changes will automatically be reflected in django port,so you don't need to check react dev server port. always check port of django instead of react port whenever you change anything.

# Production

We have primarilly deployed the app on aws. backend running on `gunicorn` and staticile is serving `nginx`, we have passed `gunicorn` sock in `nginx` reverse proxy.

We are using postgresql of AWS RDS.

No static files is being served by react or nodejs. everything is served like as how normally django developer serve static files in production

> Run all the dependency same as your local machine style with env and relvant configuration

> Build the static with `npm run build` in both react app

> then run `python manage.py collectstatic` after your every `npm run build` command run.

> Your all the static files is copied to `staticfiles` directory, now configure your web server following this directory

### Security warning

Currently the application is deployed where all the security related issues not solved including aws security group as this is still under construction.

Also, we didn't pass django production guide line by `python manage.py check`

# Sample .env file

Backend: `cargobids/.env`

```
#  DA INSERIRE NELLA ROOT FOLDER CARGOBIDS

DEBUG=True
TEMPLATE_DEBUG=True

SECRET_KEY =yi4%=-u*84_^ct41zf++oz0n+2#n5$g$#w!8ay-&5pl29522(-

#Database

DB_NAME=<Your database Name>
DB_USER=<Your database username >
DB_PASSWORD=<Your database password>
DB_HOST=<Your database host name>

DEBUG=True
TEMPLATE_DEBUG=True


SITE_URL=http://localhost:3000


#For MailSettings
EMAIL_HOST_USER=2b58b1aaae8be5
EMAIL_HOST_PASSWORD=23040a23417680
#End of MailSettings




#For MailSettings
EMAIL_HOST_USER=<Your email host user>
EMAIL_HOST_PASSWORD=<Your email host password>
#End of MailSettings


#stripe settings
STRIPE_API_KEY =<Your strip API key>


```

FrontUser: `frontenduser/.env`

```
REACT_APP_API_URL=http://localhost:8000 # change in production
REACT_APP_URL_USER=http://localhost:8000  # change in production
REACT_APP_URL_ADMIN=http://localhost:8000 # change in production
PUBLIC_URL=/


### COMMON
REACT_APP_AUTH_TOKEN=cargobid-auth
REACT_APP_AUTH_COOKIE=cargobid

###stripe key
REACT_APP_STRIPE_KEY=pk_test_rgzCCbIXvAPT1xcwtYiKNRiI00C2jfk4D9


```

Admin `admin/.env`

```
REACT_APP_API_URL=http://localhost:8000 # change in production
REACT_APP_URL_USER=http://localhost:8000 # change in production
REACT_APP_URL_ADMIN=http://localhost:8000 # change in production
PUBLIC_URL=/


### COMMON
REACT_APP_AUTH_TOKEN=cargobid-auth
REACT_APP_AUTH_COOKIE=cargobid

###stripe key
REACT_APP_STRIPE_KEY=<Your strip key should be there>


```
