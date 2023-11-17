from repository.userRepository import *


class UserService:
    def __init__(self):
        self.userRepository = UserRepository()

    def get_user(self, user_id):
        '''
        return None if user doesn't exist
        driver_data = None if not found
        '''
        user_entity = self.userRepository.get_user(user_id)
        
        if user_entity is None:
            return None

        if user_entity.driver_data_id is None:
            driver_data_dto = None
        else:
            driver_data_entity = self.userRepository.get_driver_data(user_entity.driver_data_id)
            driver_data_dto = DriverDataDto(driver_data_entity)

        return UserDto(user_entity, driver_data_dto)


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
