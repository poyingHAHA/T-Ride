from repository.orderRepository import *
from repository.matchRepository import *
from repository.userRepository import *


class MatchService:
    def __init__(self):
        self.user_repository = UserRepository()
        self.order_repository = OrderRepository()
        self.match_repository = MatchRepository()

    def send_invitation(self, driver_id, driver_order_id, passenger_order_id):
        '''
        return "user not found",
               "user incorrect",
               "driver order not found",
               "driver order is finished",
               "passenger order not found",
               "passenger order is finished",
               "already matched",
               "already invited"

        return None on success
        '''
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

        self.match_repository.send_invitation(driver_order.order_id, passenger_order.order_id)
