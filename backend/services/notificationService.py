from repository.notificationRepository import *
from repository.userRepository import *
import re


class NotificationService:
    def __init__(self):
        self.user_repository = UserRepository()
        self.notification_repository = NotificationRepository()

    def register_host_port(self, user_id, host_port):
        '''
        return "user not found",
               "invalid format"

        return None on success
        '''
        if self.user_repository.get_user(user_id) is None:
            return "user not found"

        pattern = re.compile(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+$')
        if not bool(pattern.match(host_port)):
            return "invalid format"

        self.notification_repository.register_host_port(user_id, host_port)

    def delete_host_port(self, user_id):
        '''
        return "user not found"

        return None on success
        '''
        if self.user_repository.get_user(user_id) is None:
            return "user not found"

        self.notification_repository.delete_host_port(user_id)
