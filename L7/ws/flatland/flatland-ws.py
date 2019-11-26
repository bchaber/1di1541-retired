import logging
import tornado.escape
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket
import os.path
import uuid

from tornado.options import define, options

define("port", default=7070, help="run on the given port", type=int)


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/ws", GameSocketHandler),
        ]
        settings = dict(
            cookie_secret="32439mgr9wehjg-439wmfjklw349t",
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            xsrf_cookies=True,
        )
        super(Application, self).__init__(handlers, **settings)

class GameSocketHandler(tornado.websocket.WebSocketHandler):
    waiters = set()
    cache = []
    cache_size = 200
    uid = None
    is_stage = False

    def get_compression_options(self):
        # Non-None enables compression with default options.
        return {}

    def open(self):
        self.uid = str(uuid.uuid4())
        GameSocketHandler.waiters.add(self)

    def on_close(self):
        GameSocketHandler.waiters.remove(self)

    @classmethod
    def update_cache(cls, chat):
        cls.cache.append(chat)
        if len(cls.cache) > cls.cache_size:
            cls.cache = cls.cache[-cls.cache_size:]

    @classmethod
    def send_updates(cls, msg):
        logging.info("sending message to %d waiters", len(cls.waiters))
        for uid, waiter in enumerate(cls.waiters):
            try:
                waiter.write_message(msg)
            except:
                logging.error("Error sending message", exc_info=True)

    def on_message(self, message):
        logging.info("[%s] got message %r", self.uid, message)
        try:
            parsed = tornado.escape.json_decode(message)
            msg = None

            if parsed['type'] == 'register-stage':
                msg = None # Don't send any broadcast message
                stages.is_stage = True

            if parsed['type'] == 'login':
                msg = {'type':'spawn'}
                self.write_message({'type':'new-uid','uid':self.uid})
            if parsed['type'] == 'logout':
                msg = {'type':'logout'}
            if parsed['type'] == 'start-jump':
                msg = {'type':'start-jump'}
            if parsed['type'] == 'end-jump':
                msg = {'type':'end-jump'}
            if parsed['type'] == 'move-left':
                msg = {'type':'move-left'}
            if parsed['type'] == 'move-right':
                msg = {'type':'move-right'}
            if parsed['type'] == 'stop-left':
                msg = {'type':'stop-left'}
            if parsed['type'] == 'stop-right':
                msg = {'type':'stop-right'}
            if parsed['type'] == 'killed':
                msg = parsed
            if parsed['type'] == 'collected':
                msg = parsed
            if msg is not None:
                if 'uid' not in msg:
                  msg['uid'] = self.uid
                GameSocketHandler.send_updates(msg)
        except Exception as e:
            self.write_message("Error: " + str(e))

    def check_origin(self, origin):
        return True

def main():
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.port)
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    main()
