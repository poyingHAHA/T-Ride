from repository.userRepository import *


class UserService:
    def __init__(self):
        self.user_repository = UserRepository()
    
    def login(self, user_name, password):
        '''
        return None if authentication fails
        '''
        login_entity = self.user_repository.login(user_name, password)
        if login_entity is None:
            return None
        else:
            return LoginDto(login_entity)
    
    def set_driver_data(self, user_id, vehicle_name, vehicle_plate, passenger_count):
        '''
        return None if set data fail

        '''
        user_entity = self.user_repository.get_user(user_id)
        data_id = user_entity.driver_data_id
        if data_id is None:
            driver_data_entity = self.user_repository.create_driver(user_id, vehicle_name, vehicle_plate, passenger_count)
        else:
            driver_data_entity = self.user_repository.edit_driver(data_id, vehicle_name, vehicle_plate, passenger_count)
        return DriverDataDto(driver_data_entity)

    def get_user(self, user_id):
        '''
        return None if user doesn't exist
        driver_data = None if not found
        '''
        user_entity = self.user_repository.get_user(user_id)
        
        if user_entity is None:
            return None

        if user_entity.driver_data_id is None:
            driver_data_dto = None
        else:
            driver_data_entity = self.user_repository.get_driver_data(user_entity.driver_data_id)
            driver_data_dto = DriverDataDto(driver_data_entity)

        return UserDto(user_entity, driver_data_dto)

    def get_user_id(self, token):
        '''
        return None if token is invalid
        '''
        return self.user_repository.get_user_id(token)

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
