# SAIP-BE

## Environment

Use ```python``` on Windows and ```python3``` on Unix/Linux.

Please install your own venv. You can use the following command to create a venv:

```python -m venv venv```

To activate the environment use:

```source /venv/bin/activate``` on Unix/Linux

or

```\venv\bin\Activate.ps1``` on Windows.

Packages can be found in requirements.txt (remove this from PROD).
Install them using the following command:

```pip install -r requirements.txt```

## Django

To set up, use following commands:

```python manage.py makemigrations``` to create django migrations.

```python manage.py makemigrations saip_api``` to create models' migrations (if the above command does not detect changes in models).

```python manage.py migrate``` to create the database and apply the migrations.

```python manage.py createsuperuser``` to create a superuser (needed for admin login).

Start the server with:

```python manage.py runserver```

After you modify the models, please re-run the makemigrations and migrate commands.

Admin interface can be found at http://127.0.0.1:8000/api/admin/

## Commits

Use ```[FE] - {commit name}``` if committing for Frontend, ```[BE] - {commit name}``` if committing for Backend and ```[GEN] - {commit name}``` for general commits

## API

Documentation can be found on [SwaggerHub](https://app.swaggerhub.com/apis-docs/y3man/SAIP/1.0.0)

## Useful links

CORS implementation - https://www.stackhawk.com/blog/django-cors-guide/

DJANGO REST FRAMEWORK - https://www.django-rest-framework.org/

KNOX - https://james1345.github.io/django-rest-knox/

