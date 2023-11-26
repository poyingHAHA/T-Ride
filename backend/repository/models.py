class LoginEntity:
    def __init__(self, token, user_id):
        self.token = token
        self.user_id = user_id

class UserEntity:
    def __init__(self, user_id, user_name, password_salt, password_hash, driver_data_id, total_order_count, abandon_order_count):
        self.user_id = user_id
        self.user_name = user_name
        self.password_salt = password_salt
        self.password_hash = password_hash
        self.driver_data_id = driver_data_id
        self.total_order_count = total_order_count
        self.abandon_order_count = abandon_order_count


class DriverDataEntity:
    def __init__(self, data_id, vehicle_name, vehicle_plate, passenger_count):
        self.data_id = data_id
        self.vehicle_name = vehicle_name
        self.vehicle_plate = vehicle_plate
        self.passenger_count = passenger_count


class DriverOrderEntity:
    def __init__(self, order_id, user_id, departure_time, start_point, start_name, end_point, end_name, passenger_count, finished):
        self.order_id = order_id
        self.user_id = user_id
        self.departure_time = departure_time
        self.start_point = start_point
        self.start_name = start_name
        self.end_point = end_point
        self.end_name = end_name
        self.passenger_count = passenger_count
        self.finished = finished


class PassengerOrderEntity:
    def __init__(self, order_id, user_id, departure_time1, departure_time2, passenger_count, start_point, start_name, end_point, end_name, fee, spot_id, finished):
        self.order_id = order_id
        self.user_id = user_id
        self.departure_time1 = departure_time1
        self.departure_time2 = departure_time2
        self.passenger_count = passenger_count
        self.start_point = start_point
        self.start_name = start_name
        self.end_point = end_point
        self.end_name = end_name
        self.fee = fee
        self.spot_id = spot_id
        self.finished = finished


class SpotEntity:
    def __init__(self, spot_id, point, name):
        self.spot_id = spot_id
        self.point = point
        self.name = name


class SpotWithCountEntity:
    def __init__(self, spot_id, point, name, order_count):
        self.spot_id = spot_id
        self.point = point
        self.name = name
        self.order_count = order_count


class MatchEntity():
    def __init__(self, match_id, driver_order_id, passenger_order_id, departure_time):
        self.match_id = match_id
        self.driver_order_id = driver_order_id
        self.passenger_order_id = passenger_order_id
        self.departure_time = departure_time


class InvitationEntity():
    def __init__(self, order_entity, departure_time, accepted):
        self.order = order_entity
        self.departure_time = departure_time
        self.accepted = accepted
