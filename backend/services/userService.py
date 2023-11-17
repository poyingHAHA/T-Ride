from repository.userRepository import *


class UserService:
    def __init__(self):
        self.userRepository = UserRepository()

    def get_user(self, user_id):
        user_entity = self.userRepository.get_user(user_id)

        return UserDto(user_entity)


class UserDto:
    def __init__(self, user_entity):
        self.user_id = user_entity.user_id
        self.user_name = user_entity.user_name
        self.total_order_count = user_entity.total_order_count
        self.abandon_order_count = user_entity.abandon_order_count
        self.driver_data = user_entity.driver_data


class DriverDataDto:
    def __init__(self, driver_data_entity):
        self.vehicle_name = driver_data_entity.vehicle_name
        self.vehicle_plate = driver_data_entity.vehicle_plate
        self.passenger_count = driver_data_entity.passenger_count
