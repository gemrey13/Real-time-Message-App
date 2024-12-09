from channels.generic.websocket import AsyncJsonWebsocketConsumer


class PersonalChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        print("TESTING CONNECTION AND REDIS")
        await self.accept()