from repository.orderRepository import *
from repository.userRepository import *
from repository.gmapsRepository import *
from repository.matchRepository import *


class OrderService:
    def __init__(self):
        self.order_repository = OrderRepository()
        self.user_repository = UserRepository()
        self.gmaps_repository = GmapsRepository()
        self.match_repository = MatchRepository()

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
            self.get_fee(create_passenger_order_dto.start_point, nearest_spot.point, create_passenger_order_dto.passenger_count, create_passenger_order_dto.departure_time1),
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

    def finish_driver_order(self, user_id, order_id):
        '''
        return "user not found",
               "user incorrect",
               "order not found",
               "order is finished",
               "related passenger order isn't finished"

        return None on success
        '''
        if self.user_repository.get_user(user_id) is None:
            return "user not found"

        order = self.order_repository.get_driver_order(order_id)
        if order is None:
            return "order not found"

        if user_id != order.user_id:
            return "user incorrect"
        if order.finished:
            return "order is finished"

        related_orders = self.order_repository.get_driver_related_orders(order_id)
        for order in related_orders:
            if not order.finished:
                return "related passenger order isn't finished"

        self.user_repository.add_total_order_count(
            user_id,
            len(related_orders))

        self.order_repository.finish_driver_order(order_id)

    def finish_passenger_order(self, user_id, order_id):
        '''
        return "user not found",
               "user incorrect",
               "order not found",
               "order is finished"

        return None on success
        '''
        if self.user_repository.get_user(user_id) is None:
            return "user not found"

        order = self.order_repository.get_passenger_order(order_id)
        if order is None:
            return "order not found"

        if user_id != order.user_id:
            return "user incorrect"
        if order.finished:
            return "order is finished"

        if self.order_repository.get_passenger_related_order(order_id) is not None:
            self.user_repository.add_total_order_count(user_id, 1)

        self.order_repository.finish_passenger_order(order_id)

    def delete_passenger_order(self, user_id, order_id):
        '''
        return "user not found",
               "user incorrect",
               "order not found",
               "order is finished"

        return None on success
        '''
        if self.user_repository.get_user(user_id) is None:
            return "user not found"

        order = self.order_repository.get_passenger_order(order_id)
        if order is None:
            return "order not found"

        if user_id != order.user_id:
            return "user incorrect"
        if order.finished:
            return "order is finished"

        if self.order_repository.get_passenger_related_order(order_id) is not None:
            self.user_repository.add_abandon_order_count(user_id, 1)

        self.order_repository.delete_passenger_order(order_id)

    def get_spots_with_passenger(self, departure_time):
        return [SpotWithCountDto(spot)
            for spot in self.order_repository.get_spots_with_passenger(departure_time)]

    def get_spot_passenger_orders(self, spot_id, departure_time):
        '''
        return "spot not found" if spot doens't exist

        return passenger order that departs in [departure_time-T, departure_time+T]
        '''
        if self.order_repository.get_spot(spot_id) is None:
            return "spot not found"

        return [PassengerOrderDto(entity) for entity in self.order_repository.get_spot_passenger_orders(spot_id, departure_time)]

    def get_estimated_arrival_time(self, point1, point2, departure_time):
        if not self.is_valid_point(point1) or not self.is_valid_point(point2):
            return -1
        try:
            departure_time = int(departure_time)
            if departure_time < 0:
                return -1 
        except ValueError:
            return -1 

        time = self.gmaps_repository.get_estimate_time(point1, point2, departure_time)

        if time == None:   
            return   -1 
        
        return departure_time + time 


    def get_fee(self, point1, point2, passenger_count, departure_time):
        if not self.is_valid_point(point1) or not self.is_valid_point(point2):
            return None
    
        try:
            passenger_count = int(passenger_count)
            departure_time = int(departure_time)
            if departure_time < 0 or passenger_count < 1:
                return None
        except ValueError:
            return None
        
        distance = self.gmaps_repository.get_distance(point1, point2, departure_time)

        if distance == None: 
            return None 

        fee = distance / 1000 * passenger_count * 9
        return min(int(fee), 500) 

    def is_valid_point(self, point):
        try:
            latitude, longitude = map(float, point.split(','))
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
        self.user_id = driver_order_entity.user_id
        self.departure_time = driver_order_entity.departure_time
        self.start_point = driver_order_entity.start_point
        self.start_name = driver_order_entity.start_name
        self.end_point = driver_order_entity.end_point
        self.end_name = driver_order_entity.end_name
        self.passenger_count = driver_order_entity.passenger_count


class PassengerOrderDto:
    def __init__(self, passenger_order_entity):
        self.order_id = passenger_order_entity.order_id
        self.user_id = passenger_order_entity.user_id
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


class SpotWithCountDto:
    def __init__(self, spot_with_count_entity):
        self.spot_id = spot_with_count_entity.spot_id
        self.point = spot_with_count_entity.point
        self.name = spot_with_count_entity.name
        self.order_count = spot_with_count_entity.order_count
