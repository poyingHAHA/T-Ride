from repository.orderRepository import *
from repository.userRepository import *


class OrderService:
    def __init__(self):
        self.orderRepository = OrderRepository()
        self.userRepository = UserRepository()

    def get_unfinished_driver_orders(self, user_id):
        '''
        return None if user doesn't exist
        '''
        if self.userRepository.get_user(user_id) is None:
            return None

        return [DriverOrderDto(entity) for entity in self.orderRepository.get_unfinished_driver_orders(user_id)]


class DriverOrderDto:
    def __init__(self, driver_order_entity):
        self.order_id = driver_order_entity.order_id
        self.departure_time = driver_order_entity.departure_time
        self.start_point = driver_order_entity.start_point
        self.start_name = driver_order_entity.start_name
        self.end_point = driver_order_entity.end_point
        self.end_name = driver_order_entity.end_name
        self.passenger_count = driver_order_entity.passenger_count
        self.finished = driver_order_entity.finished
