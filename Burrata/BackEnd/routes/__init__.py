from routes.auth_admin_route import login_router
from routes.health import health_router
from routes.verif_user_route import verification_router
from routes.save_claims_route import claims_router
from routes.get_all_users_route import getuser_router
from routes.get_all_claims_route import getclaims_router
from routes.get_dates_route import getdates_router
from routes.get_schedule_route import getschedule_router
from routes.save_all_claims_route import all_claims_router
from routes.save_new_worker_route import save_new_worker
from routes.delete_user_route import deleteuser_router
from routes.fillup_schedule_route import fillup_schedule_router
from routes.get_messages_route import get_messages_router
from routes.check_message_route import check_message_router
from routes.save_vacation_route import save_vacation_router
from routes.get_vacations_route import get_vacations_router
from routes.delete_vacation_route import delete_vacation_route

all_routers = [
    login_router,
    health_router,
    verification_router,
    claims_router,
    getuser_router,
    getclaims_router,
    getdates_router,
    getschedule_router,
    all_claims_router,
    save_new_worker,
    deleteuser_router,
    fillup_schedule_router,
    get_messages_router,
    check_message_router,
    save_vacation_router,
    get_vacations_router,
    delete_vacation_route
]