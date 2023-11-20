from repository.orderRepository import *
from repository.userRepository import *
from repository.gmapsRepository import *


class OrderService:
    def __init__(self):
        self.order_repository = OrderRepository()
        self.user_repository = UserRepository()
        self.gmaps_repository = GmapsRepository()

    def get_unfinished_driver_orders(self, user_id):
        '''
        return None if user doesn't exist
        '''
        if self.user_repository.get_user(user_id) is None:
            return None

        return [DriverOrderDto(entity) for entity in self.order_repository.get_unfinished_driver_orders(user_id)]

    def get_unfinished_passenger_orders(self, user_id):
        '''
        return None if user doesn't exist
        '''
        if self.user_repository.get_user(user_id) is None:
            return None

        return [PassengerOrderDto(entity) for entity in self.order_repository.get_unfinished_passenger_orders(user_id)]

    def create_driver_order(self, user_id, create_driver_order_dto):
        '''
        return "user not found" if user doesn't exist
        return "invalid order" if order is invalid
        return order_id
        '''
        if self.user_repository.get_user(user_id) is None:
            return "user not found"
        if not self.is_valid_point(create_driver_order_dto.start_point) or\
            not self.is_valid_point(create_driver_order_dto.end_point) or\
            create_driver_order_dto.passenger_count < 1:
            return "invalid order"

        return self.order_repository.create_driver_order(DriverOrderEntity(
            None,
            user_id,
            create_driver_order_dto.departure_time,
            create_driver_order_dto.start_point,
            create_driver_order_dto.start_name,
            create_driver_order_dto.end_point,
            create_driver_order_dto.end_name,
            create_driver_order_dto.passenger_count,
            False))

    def create_passenger_order(self, user_id, create_passenger_order_dto):
        '''
        return "user not found",
               "invalid order",
               "no spots in database"

        return order_id
        '''
        if self.user_repository.get_user(user_id) is None:
            return "user not found"
        if not self.is_valid_point(create_passenger_order_dto.start_point) or\
            not self.is_valid_point(create_passenger_order_dto.end_point) or\
            create_passenger_order_dto.departure_time1 > create_passenger_order_dto.departure_time2 or\
            create_passenger_order_dto.passenger_count < 1:
            return "invalid order"

        nearest_spot = self.__get_nearest_spot(create_passenger_order_dto.start_point)
        if nearest_spot is None:
            return "no spots in database"

        return self.order_repository.create_passenger_order(PassengerOrderEntity(
            None,
            user_id,
            create_passenger_order_dto.departure_time1,
            create_passenger_order_dto.departure_time2,
            create_passenger_order_dto.passenger_count,
            create_passenger_order_dto.start_point,
            create_passenger_order_dto.start_name,
            create_passenger_order_dto.end_point,
            create_passenger_order_dto.end_name,
            self.get_fee(create_passenger_order_dto.start_point, nearest_spot.point, create_passenger_order_dto.passenger_count),
            nearest_spot.spot_id,
            False))

    def get_driver_order(self, order_id):
        '''
        return None if order doesn't exist
        '''
        order_entity = self.order_repository.get_driver_order(order_id)
        if order_entity is None:
            return None

        return DriverOrderDto(order_entity)

    def get_passenger_order(self, order_id):
        '''
        return None if order doesn't exist
        '''
        order_entity = self.order_repository.get_passenger_order(order_id)
        if order_entity is None:
            return None

        return PassengerOrderDto(order_entity)

    def get_passenger_order(self, order_id):
        '''
        return None if order doesn't exist
        '''
        order_entity = self.order_repository.get_passenger_order(order_id)
        if order_entity is None:
            return None

        return PassengerOrderDto(order_entity)

    def finish_driver_order(self, user_id, order_id):
        '''
        return "user not found",
               "user incorrect",
               "order not found",
               "order is finished",
               "related passenger order isn't finished"

        return None on success
        '''
        user = self.user_repository.get_user(user_id)
        if user is None:
            return "user not found"
        user_id = user.user_id

        order = self.order_repository.get_driver_order(order_id)
        if order is None:
            return "order not found"

        if user_id != order.user_id:
            return "user incorrect"
        if order.finished:
            return "order is finished"

        ret = self.order_repository.finish_driver_order(order_id)

        if ret == "related passenger order isn't finished":
            return "related passenger order isn't finished"

    def finish_passenger_order(self, user_id, order_id):
        '''
        return "user not found",
               "user incorrect",
               "order not found",
               "order is finished"

        return None on success
        '''
        user = self.user_repository.get_user(user_id)
        if user is None:
            return "user not found"
        user_id = user.user_id

        order = self.order_repository.get_passenger_order(order_id)
        if order is None:
            return "order not found"

        if user_id != order.user_id:
            return "user incorrect"
        if order.finished:
            return "order is finished"

        ret = self.order_repository.finish_passenger_order(order_id)

    def get_fee(self, point1, point2, passenger_count):
        # TODO: this is sooooooooooo expensive
        if not self.is_valid_point(point1) or not self.is_valid_point(point2) or passenger_count < 1:
            return None

        return min(self.gmaps_repository.get_distance(point1, point2) // 1000 * passenger_count, 10000000)

    def is_valid_point(self, point):
        try:
            longitude, latitude = map(float, point.split(','))
        except:
            return False
        return True

    def __get_nearest_spot(self, point):
        '''
        point is valid
        return None if no spots at all
        '''
        spots = self.order_repository.get_all_spots()

        if len(spots) == 0:
            return None

        nearest_spot = SpotDto(spots[0])
        nearest_distance = self.gmaps_repository.get_distance(point, spots[0].point)
        for spot in spots[1:]:
            candidate = self.gmaps_repository.get_distance(point, spot.point)
            if candidate < nearest_distance:
                nearest_spot = SpotDto(spot)
                nearest_distance = candidate

        return nearest_spot


class CreateDriverOrderDto:
    def __init__(self, departure_time, start_point, start_name, end_point, end_name, passenger_count):
        self.departure_time = departure_time
        self.start_point = start_point
        self.start_name = start_name
        self.end_point = end_point
        self.end_name = end_name
        self.passenger_count = passenger_count


class CreatePassengerOrderDto:
    def __init__(self, departure_time1, departure_time2, start_point, start_name, end_point, end_name, passenger_count):
        self.departure_time1 = departure_time1
        self.departure_time2 = departure_time2
        self.start_point = start_point
        self.start_name = start_name
        self.end_point = end_point
        self.end_name = end_name
        self.passenger_count = passenger_count


class DriverOrderDto:
    def __init__(self, driver_order_entity):
        self.order_id = driver_order_entity.order_id
        self.departure_time = driver_order_entity.departure_time
        self.start_point = driver_order_entity.start_point
        self.start_name = driver_order_entity.start_name
        self.end_point = driver_order_entity.end_point
        self.end_name = driver_order_entity.end_name
        self.passenger_count = driver_order_entity.passenger_count


class PassengerOrderDto:
    def __init__(self, passenger_order_entity):
        self.order_id = passenger_order_entity.order_id
        self.departure_time1 = passenger_order_entity.departure_time1
        self.departure_time2 = passenger_order_entity.departure_time2
        self.passenger_count = passenger_order_entity.passenger_count
        self.start_point = passenger_order_entity.start_point
        self.start_name = passenger_order_entity.start_name
        self.end_point = passenger_order_entity.end_point
        self.end_name = passenger_order_entity.end_name
        self.fee = passenger_order_entity.fee


class SpotDto:
    def __init__(self, spot_entity):
        self.spot_id = spot_entity.spot_id
        self.point = spot_entity.point
        self.name = spot_entity.name
