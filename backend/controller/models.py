from services.models import *


class LoginVo:
    def __init__(self, login_dto):
        self.token = login_dto.token
        self.userId = login_dto.user_id


class UserVo:
    def __init__(self, user_dto):
        self.userName = user_dto.user_name
        self.totalOrderCount = user_dto.total_order_count
        self.abandonOrderCount = user_dto.abandon_order_count
        self.driverData = DriverDataVo(user_dto.driver_data) if user_dto.driver_data is not None else None


class DriverDataVo:
    def __init__(self, driver_data_dto):
        self.vehicleName = driver_data_dto.vehicle_name
        self.vehiclePlate = driver_data_dto.vehicle_plate
        self.passengerCount = driver_data_dto.passenger_count


class PointVo:
    def __init__(self, point):
        self.lat, self.lng = map(float, point.split(','))


class DriverOrderVo:
    def __init__(self, driver_order_dto):
        self.orderId = driver_order_dto.order_id
        self.userId = driver_order_dto.user_id
        self.departureTime = driver_order_dto.departure_time
        self.startPoint = PointVo(driver_order_dto.start_point)
        self.startName = driver_order_dto.start_name
        self.endPoint = PointVo(driver_order_dto.end_point)
        self.endName = driver_order_dto.end_name
        self.passengerCount = driver_order_dto.passenger_count


class PassengerOrderVo:
    def __init__(self, passenger_order_dto):
        self.orderId = passenger_order_dto.order_id
        self.userId = passenger_order_dto.user_id
        self.departureTime1 = passenger_order_dto.departure_time1
        self.departureTime2 = passenger_order_dto.departure_time2
        self.passengerCount = passenger_order_dto.passenger_count
        self.startPoint = PointVo(passenger_order_dto.start_point)
        self.startName = passenger_order_dto.start_name
        self.endPoint = PointVo(passenger_order_dto.end_point)
        self.endName = passenger_order_dto.end_name
        self.fee = passenger_order_dto.fee
        self.arrivalTime = passenger_order_dto.arrival_time


class SpotWithCountVo:
    def __init__(self, spot_with_count_dto):
        self.spot_id = spot_with_count_dto.spot_id
        self.point = PointVo(spot_with_count_dto.point)
        self.name = spot_with_count_dto.name
        self.order_count = spot_with_count_dto.order_count


class InvitationVo:
    def __init__(self, invitation_dto, arrival_time):
        self.passengerOrder = PassengerOrderVo(invitation_dto.order, arrival_time)
        self.accepted = invitation_dto.accepted
