from repository.orderRepository import *
from repository.matchRepository import *
from repository.userRepository import *
from repository.notificationRepository import *
from services.orderService import *
from services.models import *


class MatchService:
    def __init__(self):
        self.user_repository = UserRepository()
        self.order_repository = OrderRepository()
        self.match_repository = MatchRepository()
        self.notification_repository = NotificationRepository()

    async def send_invitation(self, token, driver_order_id, passenger_order_id):
        '''
        return "Invalid token",
               "user not found",
               "user incorrect",
               "driver order not found",
               "driver order is finished",
               "passenger order not found",
               "passenger order is finished",
               "already matched",
               "already invited"

        return None on success
        '''
        driver_id = self.user_repository.get_user_id(token)
        if driver_id is None:
            return "Invalid token"
        
        if self.user_repository.get_user(driver_id) is None:
            return "user not found"

        driver_order = self.order_repository.get_driver_order(driver_order_id)
        if driver_order is None:
            return "driver order not found"
        if driver_order.finished:
            return "driver order is finished"

        passenger_order = self.order_repository.get_passenger_order(passenger_order_id)
        if passenger_order is None:
            return "passenger order not found"
        if passenger_order.finished:
            return "passenger order is finished"

        if driver_id != driver_order.user_id:
            return "user incorrect"

        if passenger_order_id in [order.order_id for order in\
            self.order_repository.get_driver_related_orders(driver_order_id)]:
            return "already matched"
        if passenger_order_id in [order.order_id for order in\
            self.order_repository.get_invited_orders(driver_order_id)]:
            return "already invited"

        await self.notification_repository.notify_send_invitation(driver_order_id, passenger_order.user_id)

        self.match_repository.send_invitation(driver_order.order_id, passenger_order.order_id)

    def get_driver_invitations(self, order_id):
        '''
        return "order not found"

        return list of invitations
        '''
        order = self.order_repository.get_driver_order(order_id)
        if order is None:
            return "order not found"

        return [InvitationDto(invitation) for invitation in
            self.match_repository.get_driver_invitations(order_id)]

    def get_passenger_invitation_orders(self, order_id):
        '''
        return "order not found"

        return list of driver orders
        '''
        order = self.order_repository.get_passenger_order(order_id)
        if order is None:
            return "order not found"

        driver_orders = self.order_repository.get_passenger_invitation_orders(order_id)

        return [DriverOrderDto(order) for order in driver_orders]

    def get_passenger_accepted_order(self, order_id):
        '''
        return "order not found"

        return None if no driver order is accepted
        '''
        order = self.order_repository.get_passenger_order(order_id)
        if order is None:
            return "order not found"

        driver_order = self.order_repository.get_passenger_related_order(order_id)

        if driver_order is None:
            return None

        return DriverOrderDto(driver_order)

    async def accept_invitation(self, token, driver_order_id, passenger_order_id):
        '''
        return "invalid token",
               "user not found",
               "user incorrect",
               "driver order not found",
               "driver order is finished",
               "passenger order not found",
               "passenger order is finished",
               "not invited",
               "already matched"

        return None on success
        '''
        passenger_id = self.user_repository.get_user_id(token)
        if passenger_id is None:
            return "invalid token"

        if self.user_repository.get_user(passenger_id) is None:
            return "user not found"

        driver_order = self.order_repository.get_driver_order(driver_order_id)
        if driver_order is None:
            return "driver order not found"
        if driver_order.finished:
            return "driver order is finished"

        passenger_order = self.order_repository.get_passenger_order(passenger_order_id)
        if passenger_order is None:
            return "passenger order not found"
        if passenger_order.finished:
            return "passenger order is finished"

        if passenger_id != passenger_order.user_id:
            return "user incorrect"

        if passenger_order_id in [order.order_id for order in\
            self.order_repository.get_driver_related_orders(driver_order_id)]:
            return "already matched"
        if passenger_order_id not in [order.order_id for order in\
            self.order_repository.get_invited_orders(driver_order_id)]:
            return "not invited"

        # must send notification first because need to get passenger-related drivers
        # accepted driver
        await self.notification_repository.notify_accept_invitation(
            passenger_order_id,
            driver_order.user_id,
            True)
        # rejected driver
        for related_order in self.order_repository.get_passenger_invitation_orders(passenger_order_id):
            if related_order.order_id == driver_order_id:
                # this is the accepted driver
                continue

            await self.notification_repository.notify_accept_invitation(
                passenger_order_id,
                related_order.user_id,
                False)

        # TODO: 目前沒有考慮因其他乘客造成繞路，使得抵達時間延後
        self.match_repository.accept_invitation(driver_order_id, passenger_order_id)
        self.match_repository.delete_other_invitations(driver_order_id, passenger_order_id)

    def delete_driver_invitation(self, token, driverOrderId, passengerOrderId):
        '''
        return "Invalid token",
               "Not the driver's own order",
               "Order not found",
               "Invitation not sent or passenger already accept"
        
        return {"total_order_count":total_order_count,
                "abandon_order_count":abandon_order_count}
                on success
        '''
        user_id = self.user_repository.get_user_id(token)
        if user_id is None:
            return "Invalid token"
        
        driver_order = self.order_repository.get_driver_order(driverOrderId)
        if driver_order is None:
            return "Order not found"

        passenger_order = self.order_repository.get_passenger_order(passengerOrderId)
        if passenger_order is None:
            return "Order not found"
        
        if driver_order.user_id != user_id:
            return "Not the driver's own order"
        
        if driver_order.finished is True or passenger_order.finished is True:
            return "Invitation not sent or order completed"
        ret = self.match_repository.delete_one_invitation(driverOrderId,passengerOrderId)
        if ret == "Invitation not sent":
            return "Invitation not sent or passenger already accept"
        if ret == "Passenger already accept":
            return "Invitation not sent or passenger already accept"
        # if ret == "Abandon an order":
        #     self.user_repository.add_abandon_order_count(user_id,1)
        user = self.user_repository.get_user(user_id)
        return {"total_order_count":user.total_order_count,
                "abandon_order_count":user.abandon_order_count}
