from asyncio import Queue

class MessageQueue:
    pool = {}

    def register(key):
        if key not in MessageQueue.pool:
            MessageQueue.pool[key] = Queue()

    def delete(key):
        try:
            MessageQueue.pool.pop(key)
        except KeyError:
            pass

    async def send(key, message):
        try:
            await MessageQueue.pool[key].put(message)
        except KeyError:
            pass

    async def receive(key):
        try:
            return await MessageQueue.pool[key].get()
        except KeyError:
            pass
