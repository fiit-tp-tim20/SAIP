# SAIP-BE

## Environment

Please install your own venv. You can use the following command to create a venv:

```python3 -m venv venv```

Packages can be found in requirements.txt (remove this from PROD).
Install them using the following command:

```pip install -r requirements.txt```

## Django

To set up, use following commands:

```python .\manage.py makemigrations``` to create models' migrations.

```python .\manage.py migrate``` to create the database and apply the migrations.

```python .\manage.py createsuperuser``` to create a superuser (needed for admin login).

Start the server with:

```python .\manage.py runserver```

After you modify the models, please re-run the makemigrations and migrate commands.

Admin interface can be found at http://127.0.0.1:8000/admin/

## Commits

Use ```[FE] - {commit name}``` if committing for Frontend, ```[BE] - {commit name}``` if committing for Backend and ```[GEN] - {commit name}``` for general commits

## API

Documentation can be found on [SwaggerHub](https://app.swaggerhub.com/apis-docs/y3man/SAIP/1.0.0)
