from repository.notificationRepository import *
from repository.userRepository import *
from repository.orderRepository import *
from repository.matchRepository import *
from utils.config import Config


class NotificationService:
    def __init__(self):
        self.user_repository = UserRepository()
        self.notification_repository = NotificationRepository()
        self.order_repository = OrderRepository()
        self.match_repository = MatchRepository()

    def register_host_port(self, user_id, host_port):
        '''
        return "user not found"

        return None on success
        '''
        if self.user_repository.get_user(user_id) is None:
            return "user not found"

        if not bool(int(Config.get('service').get('websocket_register_port'))):
            host_port = host_port.split(':')[0]

        self.notification_repository.register_host_port(user_id, host_port)

    async def send_driver_position(self, driver_order_id, position):
        '''
        return "order not found"

        return None on success
        '''
        if self.order_repository.get_driver_order(driver_order_id) is None:
            return "order not found"

        invitations = self.match_repository.get_driver_invitations(driver_order_id)

        for invitation in invitations:
            if not invitation.accepted:
                continue

            await self.notification_repository.send_driver_position(
                invitation.order.user_id,
                invitation.order.order_id,
                position)
