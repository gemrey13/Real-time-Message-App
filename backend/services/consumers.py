from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json
from channels.db import database_sync_to_async
from .models import Chat
from django.contrib.auth import get_user_model

User = get_user_model()

class PersonalChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        request_user = self.scope["user"]
        current_user_id = self.scope["user"].id
        other_user_id = self.scope["url_route"]["kwargs"]["id"]

        if request_user.is_authenticated:
            chat_with_user = self.scope["url_route"]["kwargs"]["id"]

            if int(current_user_id) > int(other_user_id):
                self.room_name = f"{current_user_id}-{other_user_id}"
            else:
                self.room_name = f"{other_user_id}-{current_user_id}"

            self.room_group_name = "chat_%s" % self.room_name

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

    
    async def receive(self, text_data=None, bytes_data=None):
        try:
            data = json.loads(text_data)  

            message = data.get("message")
            user_data = data.get("user", {})
            user_email = user_data.get("email")
            user_full_name = user_data.get("fullName")

            recipient_id = self.scope["url_route"]["kwargs"]["id"]

            if not user_email or not message:
                raise ValueError("Invalid data received")

            await self.save_message(user_email, recipient_id, self.room_group_name, message)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "username": user_full_name,
                }
            )

        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                "error": "Invalid JSON data received"
            }))


    async def chat_message(self, event):
        message = event["message"]
        username = event["username"]

        await self.send(text_data=json.dumps({
            "message": message,
            "username": username
        }))

        
    async def disconnect(self, code):
        self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def chat_message(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({
            "message": message
        }))

    @database_sync_to_async
    def save_message(self, sender_email, recipient_id, thread_name, message):
        try:
            sender = User.objects.get(email=sender_email)
            
            recipient = User.objects.get(id=recipient_id)

            Chat.objects.create(sender=sender, recipient=recipient, message=message, thread_name=thread_name)
        
        except User.DoesNotExist:
            print(f"User does not exist")