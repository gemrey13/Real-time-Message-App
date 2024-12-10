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
            
            if not message:
                raise ValueError("Invalid message received")

            current_user = self.scope["user"]
            user_email = current_user.email
            user_full_name = current_user.get_full_name()


            recipient_id = self.scope["url_route"]["kwargs"]["id"]
            recipient_instance = await self.get_user_by_id(recipient_id)
            recipient_email = recipient_instance.email
            recipient_full_name = recipient_instance.get_full_name()

            chat_instance = await self.save_message(user_email, recipient_id, self.room_group_name, message)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "current_user_email": user_email,
                    "sender_name": user_full_name,
                    "recipient_email": recipient_email,
                    "recipient_name": recipient_full_name,
                    "timestamp": chat_instance.timestamp.isoformat(), 
                }
            )

        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                "error": "Invalid JSON data received"
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                "error": f"An unexpected error occurred: {str(e)}"
            }))


    @database_sync_to_async
    def get_user_by_id(self, user_id):
        return User.objects.get(id=user_id)

    async def chat_message(self, event):
        message = event["message"]
        current_user_email = event["current_user_email"]
        sender_name = event["sender_name"]
        recipient_email = event["recipient_email"]
        recipient_name = event["recipient_name"]
        timestamp = event["timestamp"]

        await self.send(text_data=json.dumps({
            "message": message,
            "current_user_email": current_user_email,
            "sender_name": sender_name,
            "recipient_email": recipient_email,
            "recipient_name": recipient_name,
            "timestamp": timestamp
        }))

        
    async def disconnect(self, code):
        self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    @database_sync_to_async
    def save_message(self, sender_email, recipient_id, thread_name, message):
        try:
            sender = User.objects.get(email=sender_email)
            recipient = User.objects.get(id=recipient_id)

            chat = Chat.objects.create(sender=sender, recipient=recipient, message=message, thread_name=thread_name)
            return chat
        except User.DoesNotExist:
            print(f"User does not exist")