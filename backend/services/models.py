from repository.models import *


class LoginDto:
    def __init__(self, login_entity):
        self.token = login_entity.token
        self.user_id = login_entity.user_id

class UserDto:
    def __init__(self, user_entity, driver_data_dto):
        self.user_name = user_entity.user_name
        self.total_order_count = user_entity.total_order_count
        self.abandon_order_count = user_entity.abandon_order_count
        self.driver_data = driver_data_dto


class DriverDataDto:
    def __init__(self, driver_data_entity):
        self.vehicle_name = driver_data_entity.vehicle_name
        self.vehicle_plate = driver_data_entity.vehicle_plate
        self.passenger_count = driver_data_entity.passenger_count


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


class InvitationDto():
    def __init__(self, invited_order_entity):
        self.order = PassengerOrderDto(invited_order_entity.order)
        self.departure_time = invited_order_entity.departure_time
        self.accepted = invited_order_entity.accepted
