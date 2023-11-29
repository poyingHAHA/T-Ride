from repository.userRepository import *
from services.models import *


class UserService:
    def __init__(self):
        self.user_repository = UserRepository()
    
    def register(self, user_name, password):
        '''
        return "user exist"
        return None on success
        '''
        return self.user_repository.register(user_name, password)

    def login(self, user_name, password):
        '''
        return None if authentication fails
        '''
        login_entity = self.user_repository.login(user_name, password)
        if login_entity is None:
            return None
        else:
            return LoginDto(login_entity)
    
    def set_driver_data(self, token, vehicle_name, vehicle_plate, passenger_count):
        '''
        return "無效token"
               "Invalid passenger count"
               "data already exist"
        return None on success
        '''
        user_id = self.user_repository.get_user_id(token)
        if user_id is None:
            return "無效token"
        
        user_entity = self.user_repository.get_user(user_id)
        data_id = user_entity.driver_data_id
        if data_id is None:
            ret = self.user_repository.create_driver(user_id, vehicle_name, vehicle_plate, passenger_count)
            return ret
        else:
            return "data already exist"

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
