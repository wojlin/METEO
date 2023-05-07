from flask import Flask, Response, render_template

from utils import read_config


class EndpointAction(object):

    def __init__(self, action):
        self.action = action
        self.response = Response(status=200, headers={})

    def __call__(self, *args):
        output = self.action()
        return output


class Meteo:

    def __init__(self):
        self.__config = read_config("settings.json")
        self.__app = Flask(__name__)

        self.__add_endpoints()
        self.__run()

    def __add_endpoints(self):
        self.__add_endpoint(endpoint='/', endpoint_name='index', handler=self.__index)

    def __run(self):
        self.__app.run(host=self.__config["host"], port=self.__config["port"], debug=self.__config["debug"])

    def __add_endpoint(self, endpoint=None, endpoint_name=None, handler=None):
        self.__app.add_url_rule(endpoint, endpoint_name, EndpointAction(handler))

    @staticmethod
    def __index():
        return render_template("index.html")


def main():
    meteo = Meteo()


if __name__ == "__main__":
    main()
