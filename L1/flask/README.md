# Autoreloading Flask application in Docker

You can run a container with a Flask application and make it reload it's code without restarting the container.

In order to do this, you have to:
- mount the application data so that it is modifiable from the host,
- pass an environmental variable to set the Flask application in debug mode.

In short you have to run:

`docker run -p 5000:5000 -v $PWD/app:/var/www/app -e FLASK_ENV=development chaberb/flask`

After that, changing application code in ./app on the host will trigger code reloading in the container.
